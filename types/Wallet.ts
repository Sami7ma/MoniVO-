// types/Wallet.ts
// A wallet represents a money account — cash, bank, credit card, etc.
// Users can have multiple wallets to track where their money actually is
// Like Cbe or telebirr or cash

export interface Wallet {
    id: string;
    name: string;             // Display name like "Cash", "CBE Bank"
    icon: string;             // Icon identifier
    balance: number;          // Current balance in this wallet
    currency: string;         // Currency code like "ETB" (Ethiopian Birr)
    isDefault: boolean;       // Is this the pre-selected wallet when adding transactions?
    createdAt: string;
}
