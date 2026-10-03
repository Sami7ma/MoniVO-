# 🎓 MoniVo Expense Tracker — Complete Learning Guide

> **Your project at a glance:** A React Native (Expo) mobile app with a Node.js/Express backend, MongoDB Atlas database, JWT authentication, and Zustand state management.

---

## Table of Contents
1. [🗺️ The Big Picture — How Everything Connects](#-the-big-picture--how-everything-connects)
2. [📦 What is npm, npx, node_modules?](#-what-is-npm-npx-node_modules)
3. [🚀 Step-by-Step: How to Start the Project](#-step-by-step-how-to-start-the-project)
4. [🍃 MongoDB Atlas — Your Database in the Cloud](#-mongodb-atlas--your-database-in-the-cloud)
5. [🔧 Backend Deep Dive — Every File Explained](#-backend-deep-dive--every-file-explained)
6. [🔐 Authentication Flow — Login/Register Explained](#-authentication-flow--loginregister-explained)
7. [📱 Frontend Deep Dive — Every Part Explained](#-frontend-deep-dive--every-part-explained)
8. [🌐 ngrok — Connecting Phone to Your Computer](#-ngrok--connecting-phone-to-your-computer)
9. [⚡ The Complete Request Journey](#-the-complete-request-journey)
10. [🐛 Common Issues & Fixes](#-common-issues--fixes)

---

## 🗺️ The Big Picture — How Everything Connects

```mermaid
graph TD
    A["📱 Phone / Emulator<br/>React Native + Expo"] -->|"HTTP requests via axios"| B["🌐 ngrok Tunnel<br/>https://xxxx.ngrok-free.dev"]
    B -->|"Forwards to"| C["🖥️ Backend Server<br/>Node.js + Express<br/>localhost:5000"]
    C -->|"Mongoose queries"| D["🍃 MongoDB Atlas<br/>Cloud Database<br/>Stores users, data"]
    D -->|"Returns data"| C
    C -->|"JSON response"| B
    B -->|"JSON response"| A

    style A fill:#4A90D9,color:#fff
    style B fill:#E67E22,color:#fff
    style C fill:#2ECC71,color:#fff
    style D fill:#27AE60,color:#fff
```

**In plain English:**
1. Your **phone app** (React Native) needs data — so it sends a request
2. That request goes through **ngrok** (a tunnel that makes your local computer accessible from the internet)
3. ngrok forwards it to your **backend** (Express server running on your laptop)
4. The backend talks to **MongoDB Atlas** (cloud database) to get/save data
5. The response travels back: MongoDB → Backend → ngrok → Phone

---

## 📦 What is npm, npx, node_modules?

### npm (Node Package Manager)
Think of **npm** as an **app store for code libraries**. Instead of writing everything from scratch, you install packages that other developers made.

```bash
# "Install all the packages listed in package.json"
npm install

# "Install a specific new package and save it to package.json"
npm install express

# "Run a script defined in package.json"
npm run dev
```

### package.json — The Recipe Book
This file lists everything your project needs. Here's your [backend/package.json](file:///home/Sami/Documents/expense-tracker/backend/package.json) explained:

```json
{
  "name": "backend",            // Project name
  "type": "module",             // Allows using 'import' instead of 'require'
  "main": "src/server.js",      // Entry point — the first file that runs
  "scripts": {
    "start": "node src/server.js",    // For production: runs normally
    "dev": "nodemon src/server.js"    // For development: auto-restarts on file changes!
  },
  "dependencies": {             // Packages your app NEEDS to run
    "express": "^5.2.1",        // Web server framework
    "mongoose": "^9.9.4",       // MongoDB helper library
    "bcryptjs": "^3.0.3",       // Password hashing
    "jsonwebtoken": "^9.0.3",   // JWT tokens for login
    "cors": "^2.8.6",           // Allows frontend to talk to backend
    "dotenv": "^17.4.2"         // Reads .env files
  },
  "devDependencies": {          // Packages only needed during development
    "nodemon": "^3.1.14"        // Auto-restarts server when you save a file
  }
}
```

### node_modules — The Warehouse
When you run `npm install`, npm downloads all the packages into a `node_modules/` folder. This folder is HUGE (thousands of files) — that's why it's in `.gitignore` and never uploaded to GitHub.

### npx — Run Without Installing
`npx` lets you run a package without permanently installing it:
```bash
npx expo start    # Runs Expo without installing it globally
```

### package-lock.json — The Exact Recipe
While `package.json` says "I need express version 5 or higher", `package-lock.json` says "I need express version 5.2.1 exactly, and all its sub-dependencies at exact versions". This ensures everyone on the team gets identical packages.

---

## 🚀 Step-by-Step: How to Start the Project

### Prerequisites
Make sure you have installed:
- **Node.js** (comes with npm) — [nodejs.org](https://nodejs.org)
- **Expo Go app** on your phone — from App Store / Play Store
- **ngrok** — `npm install -g ngrok` (and sign up at [ngrok.com](https://ngrok.com))

### Step 1: Set Up the Backend

```bash
# Navigate to the backend folder
cd ~/Documents/expense-tracker/backend

# Install all backend dependencies (reads package.json, fills node_modules)
npm install

# Create your .env file from the example
cp .env.example .env

# Edit .env if needed (your MongoDB URI, JWT secret, etc.)
# The .env.example already has values — for learning, they work as-is

# Start the backend server in development mode
npm run dev
```

> [!IMPORTANT]
> You should see:
> ```
> ✅ MongoDB Connected Successfully
> 🚀 Server running on port 5000
> ```
> If you see a MongoDB error, check your internet connection (MongoDB Atlas is in the cloud).

### Step 2: Start ngrok (in a NEW terminal)

```bash
# Open a SECOND terminal window (don't close the backend!)
# This creates a public tunnel to your local port 5000
ngrok http 5000
```

You'll see output like:
```
Forwarding    https://a1b2c3d4.ngrok-free.dev -> http://localhost:5000
```

> [!WARNING]
> **Copy that `https://...ngrok-free.dev` URL!** You need it for the next step.
> This URL changes EVERY TIME you restart ngrok.

### Step 3: Update the Frontend API URL

Open [frontend/utils/api.ts](file:///home/Sami/Documents/expense-tracker/frontend/utils/api.ts) and paste your ngrok URL:

```typescript
const API_BASE_URL = 'https://YOUR-NEW-NGROK-URL.ngrok-free.dev/api';
//                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                    Replace this with YOUR ngrok URL + /api at the end
```

### Step 4: Start the Frontend

```bash
# Open a THIRD terminal window
cd ~/Documents/expense-tracker/frontend

# Install dependencies (first time only, or after adding new packages)
npm install

# Start the Expo development server
npx expo start
```

You'll see a QR code in the terminal.

### Step 5: Open on Your Phone

- **Android**: Open the **Expo Go** app → Scan the QR code
- **iPhone**: Open the **Camera** app → Scan the QR code → Tap the Expo link

### Visual Summary of Terminals

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   TERMINAL 1        │  │   TERMINAL 2        │  │   TERMINAL 3        │
│                     │  │                     │  │                     │
│  cd backend         │  │  ngrok http 5000    │  │  cd frontend        │
│  npm run dev        │  │                     │  │  npx expo start     │
│                     │  │  Shows the public   │  │                     │
│  ✅ MongoDB         │  │  URL to copy        │  │  Shows QR code      │
│  🚀 Port 5000      │  │                     │  │  to scan            │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## 🍃 MongoDB Atlas — Your Database in the Cloud

### What is MongoDB?
MongoDB is a **NoSQL database** — instead of tables with rows and columns (like Excel/SQL), it stores data as **documents** (like JSON objects).

```
SQL Database (table):          MongoDB (document):
┌────┬───────┬──────────┐      {
│ id │ name  │ email    │        "_id": "abc123",
├────┼───────┼──────────┤        "name": "Sami",
│ 1  │ Sami  │ s@e.com  │        "email": "s@e.com",
│ 2  │ Abdi  │ a@e.com  │        "password": "$2b$10$hashed..."
└────┴───────┴──────────┘      }
```

### MongoDB Atlas = MongoDB in the Cloud
Instead of running MongoDB on your laptop, **Atlas** hosts it on remote servers. Your connection string in [.env.example](file:///home/Sami/Documents/expense-tracker/backend/.env.example) connects to it:

```
mongodb+srv://samuelmifta_db_user:PASSWORD@expense-tracker-cluster.sjahwyy.mongodb.net/
         ↑                         ↑                    ↑
     username                  password            cluster name
```

### How to See Your Data in MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign in with the account that created the cluster
3. Click **"Browse Collections"**
4. You'll see your database with a `users` collection
5. Each document is a user with `name`, `email`, `password` (hashed!), and timestamps

### Mongoose — The Translator

Your backend doesn't talk to MongoDB directly. It uses **Mongoose**, a library that:
- Defines **schemas** (what shape the data should be)
- Provides **methods** (`.find()`, `.create()`, `.findOne()`)
- Adds **validation** (required fields, unique emails)

---

## 🔧 Backend Deep Dive — Every File Explained

### Architecture Overview

```mermaid
graph LR
    A["🌐 Incoming Request<br/>POST /api/auth/login"] --> B["server.js<br/>Entry point"]
    B --> C["app.js<br/>Express config"]
    C --> D["authRoutes.js<br/>URL matching"]
    D --> E["authController.js<br/>Business logic"]
    E --> F["User.js Model<br/>Database operations"]
    F --> G["🍃 MongoDB"]

    H["authMiddleware.js<br/>Token verification"] -.->|"Protects routes"| D

    style A fill:#3498DB,color:#fff
    style B fill:#9B59B6,color:#fff
    style C fill:#E74C3C,color:#fff
    style D fill:#F39C12,color:#fff
    style E fill:#2ECC71,color:#fff
    style F fill:#1ABC9C,color:#fff
    style G fill:#27AE60,color:#fff
    style H fill:#E67E22,color:#fff
```

### File 1: [server.js](file:///home/Sami/Documents/expense-tracker/backend/src/server.js) — The Ignition Key

This is the **very first file** that runs. It does two things: connects to MongoDB, then starts the server.

```javascript
import mongoose from "mongoose";    // Library to talk to MongoDB
import dotenv from "dotenv";        // Reads the .env file
import app from "./app.js";         // Our Express app

dotenv.config();                    // Load environment variables from .env

const PORT = process.env.PORT || 5000;  // Use port from .env, or default to 5000

// Connect to MongoDB FIRST, then start the server
mongoose
  .connect(process.env.MONGO_URI)   // Connect using the URI from .env
  .then(() => {                     // If connection succeeds...
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => {        // ...start listening for requests
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {                 // If connection fails...
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);                // Kill the process (no point running without DB)
  });
```

> [!NOTE]
> **Why connect FIRST?** If MongoDB is down, there's no point accepting requests — every database query would fail. So we connect first, and only start the server after confirming the connection works.

### File 2: [app.js](file:///home/Sami/Documents/expense-tracker/backend/src/app.js) — The Express Configuration

This sets up the Express "app" — the thing that handles HTTP requests.

```javascript
import express from "express";              // The web framework
import cors from "cors";                    // Cross-Origin Resource Sharing
import authRoutes from "./routes/authRoutes.js";

const app = express();                      // Create the Express app

// MIDDLEWARE — code that runs on EVERY request before reaching routes
app.use(cors());           // Allows requests from different origins (your phone)
app.use(express.json());   // Parses JSON request bodies (turns raw text into objects)

// ROUTES — URL patterns and what to do for each
app.use("/api/auth", authRoutes);  // Any URL starting with /api/auth → authRoutes

// TEST ROUTE — visit http://localhost:5000/ to confirm the server is alive
app.get("/", (req, res) => {
  res.json({ message: "MoniVo API is running..." });
});

export default app;
```

**What is Middleware?**
Middleware is code that sits "in the middle" — between the raw request arriving and your route handler running:

```
Request arrives → cors() → express.json() → your route handler → Response sent
                   ↑           ↑
              "Allow this   "Parse the
               request"      JSON body"
```

**What is CORS?**
By default, browsers/apps block requests to a different domain. Your phone app is at one address, your server at another. `cors()` says "I allow requests from anyone."

### File 3: [authRoutes.js](file:///home/Sami/Documents/expense-tracker/backend/src/routes/authRoutes.js) — The URL Map

This maps URLs to functions. Think of it like a restaurant menu — each URL is a menu item, each controller function is the kitchen making that dish.

```javascript
import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);   // POST /api/auth/register → registerUser()
router.post("/login", loginUser);         // POST /api/auth/login    → loginUser()
router.get("/me", protect, getMe);        // GET  /api/auth/me       → protect(), then getMe()
//                 ↑ This middleware runs FIRST — checks if user is logged in

export default router;
```

> [!TIP]
> **POST** = "I'm sending data to you" (register, login send name/email/password)
>
> **GET** = "Give me data" (/me asks "who am I?")

### File 4: [authController.js](file:///home/Sami/Documents/expense-tracker/backend/src/controllers/authController.js) — The Brain

This is where the actual logic lives. Let's break down each function:

**`generateToken(id)`** — Creates a JWT token:
```javascript
const generateToken = (id) => {
  return jwt.sign(          // Create a signed token
    { id },                 // Payload: the user's ID
    process.env.JWT_SECRET, // Secret key to sign with (from .env)
    { expiresIn: "30d" }   // Token expires in 30 days
  );
};
```

**`registerUser`** — Creates a new account:
```javascript
export const registerUser = async (req, res) => {
  // 1. Pull name, email, password from the request body
  const { name, email, password } = req.body;
  
  try {
    // 2. Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Create user in MongoDB (password gets hashed automatically by the model!)
    const user = await User.create({ name, email, password });

    // 4. Send back user data + a fresh JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),  // This token proves they're logged in
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};
```

**`loginUser`** — Verifies credentials:
```javascript
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      // Password correct! Send user data + new token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // Wrong email or password
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};
```

### File 5: [User.js](file:///home/Sami/Documents/expense-tracker/backend/src/models/User.js) — The Database Blueprint

This defines **what a User looks like** in MongoDB.

```javascript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// SCHEMA = the blueprint/template for a User document
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },             // Must have a name
    email:    { type: String, required: true, unique: true }, // Must be unique
    password: { type: String, required: true },             // Must have a password
  },
  { timestamps: true },  // Automatically adds createdAt and updatedAt fields
);

// PRE-SAVE HOOK: Runs automatically BEFORE saving to database
// This is like a guard at the door — it hashes the password before storing it
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;  // Skip if password didn't change
  
  const salt = await bcrypt.genSalt(10);     // Generate random salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  // "myPassword123" becomes "$2b$10$xK8f..." — impossible to reverse!
});

// CUSTOM METHOD: Compare a plain password with the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
  // bcrypt.compare("myPassword123", "$2b$10$xK8f...") → true or false
};

export default mongoose.model("User", userSchema);
// This creates a "users" collection in MongoDB (Mongoose auto-pluralizes)
```

> [!CAUTION]
> **NEVER store passwords in plain text!** Always hash them. If your database gets hacked, the attackers can't reverse the hashes to get real passwords. bcrypt is specifically designed to be slow and expensive to crack.

### File 6: [authMiddleware.js](file:///home/Sami/Documents/expense-tracker/backend/src/middleware/authMiddleware.js) — The Bouncer

This checks if a request has a valid JWT token before allowing access.

```javascript
export const protect = async (req, res, next) => {
  let token;

  // Check if the request has an Authorization header with "Bearer <token>"
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      // Extract the token (split "Bearer abc123" → ["Bearer", "abc123"])
      token = req.headers.authorization.split(" ")[1];
      
      // Verify the token — if invalid/expired, this throws an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find the user by the ID stored in the token
      // .select("-password") means "give me everything EXCEPT the password"
      req.user = await User.findById(decoded.id).select("-password");
      
      // Token is valid! Continue to the next function (the route handler)
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
```

---

## 🔐 Authentication Flow — Login/Register Explained

### Registration Flow (Creating an Account)

```mermaid
sequenceDiagram
    participant Phone as 📱 Phone App
    participant API as 🖥️ Backend
    participant DB as 🍃 MongoDB
    participant Store as 📦 SecureStore

    Phone->>API: POST /api/auth/register<br/>{"name":"Sami","email":"s@e.com","password":"123456"}
    API->>DB: User.findOne({email: "s@e.com"})
    DB-->>API: null (doesn't exist ✅)
    API->>DB: User.create({name, email, password})
    Note over DB: Pre-save hook:<br/>bcrypt hashes "123456" →<br/>"$2b$10$xK8f..."
    DB-->>API: New user document
    API->>API: generateToken(user._id)
    API-->>Phone: {_id, name, email, token: "eyJhbG..."}
    Phone->>Store: SecureStore.setItemAsync("userToken", token)
    Note over Phone: App shows HomeScreen!
```

### Login Flow

```mermaid
sequenceDiagram
    participant Phone as 📱 Phone App
    participant API as 🖥️ Backend
    participant DB as 🍃 MongoDB
    participant Store as 📦 SecureStore

    Phone->>API: POST /api/auth/login<br/>{"email":"s@e.com","password":"123456"}
    API->>DB: User.findOne({email: "s@e.com"})
    DB-->>API: User document with hashed password
    API->>API: bcrypt.compare("123456", "$2b$10$xK8f...")
    Note over API: Returns true ✅
    API->>API: generateToken(user._id)
    API-->>Phone: {_id, name, email, token: "eyJhbG..."}
    Phone->>Store: SecureStore.setItemAsync("userToken", token)
    Note over Phone: App shows HomeScreen!
```

### Auto-Login on App Restart (checkAuth)

```mermaid
sequenceDiagram
    participant Phone as 📱 Phone App
    participant Store as 📦 SecureStore
    participant API as 🖥️ Backend

    Note over Phone: App opens...
    Phone->>Store: SecureStore.getItemAsync("userToken")
    Store-->>Phone: "eyJhbG..." (token found!)
    Phone->>API: GET /api/auth/me<br/>Authorization: Bearer eyJhbG...
    Note over API: protect() middleware<br/>verifies the token
    API-->>Phone: {_id, name, email}
    Note over Phone: Token valid!<br/>Skip login → HomeScreen
```

### What is JWT (JSON Web Token)?

A JWT is like a **wristband at a concert**. When you buy a ticket (login), you get a wristband (token). For the rest of the event, you just show your wristband instead of buying a new ticket.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.     ← Header (algorithm)
eyJpZCI6IjY1YTEyMzQ1Njc4OTAiLCJpYXQiOj.     ← Payload (user ID, timestamps)
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c ← Signature (proves it's real)
```

The token contains the user's ID. The signature proves it wasn't tampered with (only your server can create valid signatures using `JWT_SECRET`).

---

## 📱 Frontend Deep Dive — Every Part Explained

### Project Structure

```
frontend/
├── App.tsx                    ← 🚪 Entry point — the root of everything
├── index.ts                   ← Expo entry file (registers App.tsx)
├── app/
│   ├── (auth)/                ← 🔑 Screens shown when NOT logged in
│   │   ├── OnboardinScree.tsx ← Welcome/intro screen
│   │   ├── LoginScreen.tsx    ← Email + password login
│   │   └── RegisterScreen.tsx ← Create account form
│   ├── (app)/                 ← 🏠 Screens shown AFTER logging in
│   │   ├── HomeScreen.tsx     ← Dashboard with balance, recent transactions
│   │   ├── TransactionScreen  ← Add/view all transactions
│   │   ├── BudgetsScreen.tsx  ← Set spending limits
│   │   └── AnalyticsScreen    ← Charts and graphs
│   └── navigation/
│       └── AppNavigator.tsx   ← 🚦 Traffic controller — decides which screens to show
├── store/
│   └── useMoniVoStore.ts      ← 🧠 The app's brain — all state lives here
├── utils/
│   ├── api.ts                 ← 🌐 Axios config + ngrok URL
│   └── dummyData.ts           ← 📋 Fake data for development
├── types/                     ← 📐 TypeScript type definitions
│   ├── User.ts
│   ├── Transaction.ts
│   ├── Category.ts
│   ├── Budget.ts
│   └── Wallet.ts
├── constants/                 ← 🎨 Colors, themes, default categories
│   ├── colors.ts
│   ├── theme.ts
│   └── defaultCategories.ts
├── hooks/
│   └── useTheme.ts            ← 🌗 Light/dark theme hook
└── components/                ← 🧩 Reusable UI pieces
```

### [App.tsx](file:///home/Sami/Documents/expense-tracker/frontend/App.tsx) — The Root

```typescript
import './global.css';              // Global styles (NativeWind/Tailwind CSS)
import AppNavigator from './app/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>   {/* Handles notch/status bar safe areas */}
      <AppNavigator />   {/* The navigation system — decides what to show */}
    </SafeAreaProvider>
  );
}
```

### [AppNavigator.tsx](file:///home/Sami/Documents/expense-tracker/frontend/app/navigation/AppNavigator.tsx) — The Traffic Controller

This is the most important architectural piece. It decides the **entire flow** of your app:

```mermaid
graph TD
    A["App Opens"] --> B{"isLoadingAuth?"}
    B -->|"Yes"| C["⏳ Show Loading Spinner"]
    B -->|"No"| D{"user exists?"}
    D -->|"Yes (logged in)"| E["🏠 AppTabNavigator<br/>Home | Transactions | Budgets | Analytics"]
    D -->|"No (not logged in)"| F["🔑 AuthNavigator<br/>Onboarding → Login → Register"]

    style C fill:#F39C12,color:#fff
    style E fill:#2ECC71,color:#fff
    style F fill:#3498DB,color:#fff
```

**Key concept:** The navigator reads `user` from the Zustand store. When `user` is `null` (not logged in), it shows auth screens. When `user` has data (logged in), it shows the main app tabs. When the user logs out, `user` becomes `null` again, and it **automatically** switches back to auth screens.

### [useMoniVoStore.ts](file:///home/Sami/Documents/expense-tracker/frontend/store/useMoniVoStore.ts) — The Brain (Zustand)

**What is Zustand?** It's a state management library — a single place where ALL your app's data lives. Any screen can read from it or write to it, and ALL screens update automatically.

```
┌─────────────────────────────────────────┐
│           Zustand Store                 │
│                                         │
│  STATE (data):                          │
│  ├── user: { name, email, token }       │
│  ├── transactions: [...]                │
│  ├── categories: [...]                  │
│  ├── budgets: [...]                     │
│  ├── wallets: [...]                     │
│  └── theme: 'light' | 'dark'           │
│                                         │
│  ACTIONS (functions that change data):  │
│  ├── login(email, password)             │
│  ├── register(name, email, password)    │
│  ├── logOut()                           │
│  ├── addTransaction(tx)                 │
│  ├── deleteTransaction(id)              │
│  └── ...etc                             │
│                                         │
│  GETTERS (computed from state):         │
│  ├── totalBalance()                     │
│  ├── totalIncome()                      │
│  └── totalExpenses()                    │
└─────────────────────────────────────────┘
     ↑         ↑         ↑         ↑
  HomeScreen  TxScreen  Budget  Analytics
  (reads &    (reads &  Screen  Screen
   writes)     writes)
```

**How screens use the store:**
```typescript
// In any screen component:
import useMoniVoStore from '../../store/useMoniVoStore';

function HomeScreen() {
  // Read data (automatically re-renders when these change!)
  const user = useMoniVoStore(state => state.user);
  const totalBalance = useMoniVoStore(state => state.totalBalance);
  
  // Call actions
  const logOut = useMoniVoStore(state => state.logOut);
  
  return <Text>Welcome, {user?.name}! Balance: {totalBalance()}</Text>;
}
```

### [api.ts](file:///home/Sami/Documents/expense-tracker/frontend/utils/api.ts) — The HTTP Client

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// The base URL pointing to your backend through ngrok
const API_BASE_URL = 'https://xxxx.ngrok-free.dev/api';

// Create an axios instance with default settings
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,  // Fail after 10 seconds of no response
});

// INTERCEPTOR: Runs before EVERY request automatically
// It grabs the JWT token from SecureStore and attaches it to the request
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Every request now includes: "Authorization: Bearer eyJhbG..."
        }
        return config;
    }
);
```

> [!TIP]
> **SecureStore** is like a safe on your phone. It encrypts the token so other apps can't steal it. Unlike regular storage (`AsyncStorage`), SecureStore uses the phone's built-in encryption hardware.

---

## 🌐 ngrok — Connecting Phone to Your Computer

### The Problem
Your backend runs on `localhost:5000`. But `localhost` means "this device." When your phone tries `localhost`, it's talking to **itself**, not your computer!

### The Solution: ngrok

ngrok creates a **tunnel** — a public URL that forwards requests to your computer:

```
📱 Phone                    ☁️ Internet                   💻 Your Computer
"hit this URL" ──→  https://abc.ngrok-free.dev  ──→   localhost:5000
                    (public, accessible             (private, only your
                     from anywhere)                  computer knows about)
```

### Using ngrok

```bash
# 1. Sign up at ngrok.com and get your auth token
# 2. Set up your token (one-time only):
ngrok config add-authtoken YOUR_TOKEN_HERE

# 3. Every time you develop, start the tunnel:
ngrok http 5000

# 4. Copy the https URL and paste it in api.ts
```

---

## ⚡ The Complete Request Journey

Let's trace what happens when you tap "Login" on your phone:

```
STEP 1: 📱 User taps "Login" button
         └── LoginScreen calls: store.login("sami@email.com", "123456")

STEP 2: 🧠 Zustand store's login() runs
         └── Calls: api.post('/auth/login', { email, password })

STEP 3: 🌐 Axios interceptor adds token header (if any exists)
         └── Sends: POST https://abc.ngrok-free.dev/api/auth/login

STEP 4: 🔗 ngrok receives the request from the internet
         └── Forwards to: POST http://localhost:5000/api/auth/login

STEP 5: 🖥️ Express (app.js) receives the request
         └── cors() ✓ → express.json() parses body → matches /api/auth → authRoutes

STEP 6: 🗺️ authRoutes.js matches POST /login
         └── Calls: loginUser(req, res)

STEP 7: 🧮 authController.js loginUser() runs
         ├── User.findOne({ email: "sami@email.com" })
         ├── MongoDB returns the user document
         ├── bcrypt.compare("123456", "$2b$10$hash...") → true ✅
         └── Returns: { _id, name, email, token: "eyJhbG..." }

STEP 8: Response travels back:
         MongoDB → Controller → Express → ngrok → Phone

STEP 9: 📱 Back on the phone
         ├── SecureStore saves the token
         ├── Zustand sets user = { _id, name, email, token }
         └── AppNavigator sees user !== null → shows HomeScreen! 🎉
```

---

## 🐛 Common Issues & Fixes

### ❌ "Network Error" on the phone
| Cause | Fix |
|-------|-----|
| ngrok not running | Open a terminal, run `ngrok http 5000` |
| ngrok URL changed | Copy the new URL → paste in `api.ts` |
| Backend not running | Open a terminal, `cd backend`, `npm run dev` |
| Old ngrok URL in api.ts | Every ngrok restart = new URL! |

### ❌ "MongoDB Connection Error"
| Cause | Fix |
|-------|-----|
| No internet | Connect to WiFi |
| Wrong URI | Check `.env` has the correct MongoDB connection string |
| IP not whitelisted | In Atlas → Network Access → Add `0.0.0.0/0` (allows all IPs) |

### ❌ "Cannot find module"
```bash
# Forgot to install? Run this in the problem directory:
npm install
```

### ❌ `.env` not working
| Cause | Fix |
|-------|-----|
| File named `.env.example` | Copy it: `cp .env.example .env` |
| Wrong variable name | Your `server.js` uses `MONGO_URI` but `.env.example` has `MONGODB_URI` — they must match! |

> [!WARNING]
> **Your `.env.example` has `MONGODB_URI` but `server.js` uses `process.env.MONGO_URI`!** This is a bug — they don't match. You need to either:
> - Change `.env` to use `MONGO_URI=mongodb+srv://...`, OR
> - Change `server.js` line 10 to `process.env.MONGODB_URI`
>
> Your [config/db.js](file:///home/Sami/Documents/expense-tracker/backend/src/config/db.js) correctly uses `MONGODB_URI`, but it's not being used by `server.js` — another inconsistency to fix.

---

## 🔑 Key Concepts Cheat Sheet

| Term | What It Is | Analogy |
|------|-----------|---------|
| **npm** | Package manager | App Store for code |
| **npx** | Run a package once | "Try before you buy" |
| **Express** | Web server framework | A waiter taking orders |
| **Mongoose** | MongoDB helper | A translator between JS and MongoDB |
| **JWT** | Login token | Concert wristband |
| **bcrypt** | Password hasher | A shredder — can't un-shred |
| **CORS** | Cross-origin permission | "I accept foreign visitors" |
| **Middleware** | Code that runs before routes | Security guard at the door |
| **Zustand** | State management | The app's shared brain |
| **SecureStore** | Encrypted phone storage | A safe on your phone |
| **ngrok** | Local tunnel to internet | A secret passage from inside to outside |
| **Axios** | HTTP client | A messenger who carries requests |
| **dotenv** | Reads .env files | Reading the recipe's secret ingredients |
| **nodemon** | Auto-restart on save | A watchful assistant |

---

> [!TIP]
> **Next steps to continue learning:**
> 1. Fix the `MONGO_URI` vs `MONGODB_URI` bug (great first task!)
> 2. Try registering a user, then check MongoDB Atlas to see the document
> 3. Add an `Expense` model to the backend (similar to `User.js`)
> 4. Create expense CRUD routes (Create, Read, Update, Delete)
> 5. Connect the frontend transaction screen to the real backend (replace dummy data)
