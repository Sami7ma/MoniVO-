import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


// ngrok setup:
// 1. Ensure your backend is running first: `npm run dev` (must be on port 5000)
// 2. Open a NEW, separate terminal window and run: `ngrok http 5000`
// 3. Copy the "Forwarding" URL that starts with "https://" (e.g., https://xxxx.ngrok-free.dev)
// 4. Paste it below, making sure to keep "/api" at the very end.
// Note: The ngrok URL changes EVERY TIME you restart it. You can also configure
// EXPO_PUBLIC_API_URL in a .env file.
// Do NOT use 'localhost' because the phone emulator treats that as itself.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://economic-bankable-imperial.ngrok-free.dev/api";


const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// This automatically attaches the JWT token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;