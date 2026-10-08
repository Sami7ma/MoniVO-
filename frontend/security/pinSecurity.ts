import * as Crypto from 'expo-crypto';
import { scryptAsync } from '@noble/hashes/scrypt.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

const VERSION = 'scrypt-v1';

const SCRYPT_N = 2 ** 15;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

const SALT_LENGTH = 16;
const DERIVED_KEY_LENGTH = 32;

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

function hexToBytes(hex: string): Uint8Array {
    if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) {
        throw new Error('Invalid hexadecimal value.');
    }

    const bytes = new Uint8Array(hex.length / 2);

    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }

    return bytes;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) {
        return false;
    }

    let difference = 0;

    for (let i = 0; i < a.length; i++) {
        difference |= a[i] ^ b[i];
    }

    return difference === 0;
}

export function isHashedPin(value: string): boolean {
    return value.startsWith(`${VERSION}$`);
}

export async function hashPin(pin: string): Promise<string> {
    const salt = await Crypto.getRandomBytesAsync(SALT_LENGTH);

    const derivedKey = await scryptAsync(
        utf8ToBytes(pin),
        salt,
        {
            N: SCRYPT_N,
            r: SCRYPT_R,
            p: SCRYPT_P,
            dkLen: DERIVED_KEY_LENGTH,
        }
    );

    return [
        VERSION,
        SCRYPT_N,
        SCRYPT_R,
        SCRYPT_P,
        bytesToHex(salt),
        bytesToHex(derivedKey),
    ].join('$');
}

export async function verifyPin(
    pin: string,
    storedValue: string
): Promise<boolean> {
    /*
     * Legacy support:
     *
     * Old BanKoni databases currently contain the plaintext PIN.
     * We temporarily support that format so an existing user
     * can log in once and have their PIN upgraded.
     */
    if (!isHashedPin(storedValue)) {
        return storedValue === pin;
    }

    const parts = storedValue.split('$');

    if (parts.length !== 6) {
        return false;
    }

    const [
        version,
        nValue,
        rValue,
        pValue,
        saltHex,
        storedHashHex,
    ] = parts;

    if (version !== VERSION) {
        return false;
    }

    const N = Number(nValue);
    const r = Number(rValue);
    const p = Number(pValue);

    if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) {
        return false;
    }

    try {
        const salt = hexToBytes(saltHex);
        const storedHash = hexToBytes(storedHashHex);

        const derivedKey = await scryptAsync(
            utf8ToBytes(pin),
            salt,
            {
                N,
                r,
                p,
                dkLen: storedHash.length,
            }
        );

        return constantTimeEqual(derivedKey, storedHash);
    } catch {
        return false;
    }
}