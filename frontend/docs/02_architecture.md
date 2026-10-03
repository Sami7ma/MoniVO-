# MoniVo — Architecture & How It Works

> This doc explains how the app is built — project structure, navigation, state management, and theming.

---

## Project Structure

```
Monivo-mobile/
├── App.tsx                    ← Entry point — renders AppNavigator
├── index.ts                   ← Expo entry — registers App.tsx
│
├── app/                       ← Screens (what the user sees)
│   ├── (auth)/                ← Screens for logged-out users
│   │   ├── OnboardinScree.tsx ← 3-slide intro swiper
│   │   ├── LoginScreen.tsx    ← Email + password sign-in
│   │   └── RegisterScreen.tsx ← Create new account form
│   │
│   ├── (app)/                 ← Screens for logged-in users
│   │   ├── HomeScreen.tsx     ← Dashboard: balance cards + recent transactions
│   │   ├── TransactionScreen.tsx ← Full transaction history with filters
│   │   └── BudgetsScreen.tsx  ← Budget list with progress bars
│   │
│   └── navigation/
│       └── AppNavigator.tsx   ← Traffic controller — decides auth vs app screens
│
├── components/                ← Reusable UI pieces
│   ├── common/                ← Shared across many screens
│   │   ├── PrimaryButton.tsx  ← Full-width gold/colored button
│   │   ├── CloseButton.tsx    ← Circular X button for modals
│   │   ├── FloatingActionButton.tsx ← Circular + button
│   │   ├── AmountInput.tsx    ← ETB money input (large + compact)
│   │   ├── CategoryPicker.tsx ← Dropdown category selector
│   │   ├── NoteInput.tsx      ← Multiline text input with label
│   │   └── PeriodSelector.tsx ← Date range + period wheel picker
│   │
│   ├── home/                  ← Components used on HomeScreen
│   │   ├── BalanceCards.tsx    ← Horizontal swipeable balance cards
│   │   ├── TransactionRow.tsx ← Single transaction list item
│   │   └── BudgetCard.tsx     ← Budget progress card
│   │
│   └── modals/                ← Full-screen modal forms
│       ├── AddTransactionModal.tsx ← Add income/expense form
│       └── AddBudgetModal.tsx     ← Create budget form
│
├── store/
│   └── useMoniVoStore.ts      ← Zustand store — global app brain
│
├── types/                     ← TypeScript interfaces
│   ├── Transaction.ts         ← Transaction shape
│   ├── Category.ts            ← Category shape
│   ├── Budget.ts              ← Budget shape
│   ├── Wallet.ts              ← Wallet shape
│   └── User.ts                ← User shape
│
├── constants/
│   ├── theme.ts               ← Light/dark theme color tokens
│   ├── colors.ts              ← Raw color hex values
│   └── defaultCategories.ts   ← Built-in expense/income categories
│
├── hooks/
│   └── useTheme.ts            ← Custom hook → returns current theme colors
│
└── utils/
    └── dummyData.ts           ← Fake transactions + wallet for development
```

---

## How the App Starts

```
index.ts
  └── registers App.tsx with Expo
        └── App.tsx renders <AppNavigator />
              └── AppNavigator checks: is user logged in?
                    ├── NO  → show AuthStack (Onboarding → Login → Register)
                    └── YES → show AppTabs (Home | Transactions | Budgets | Analytics)
```

**The key logic** lives in `AppNavigator.tsx`:

```tsx
const user = useMoniVoStore((state) => state.user);

// If user is null → show auth screens
// If user exists → show main app tabs
return user ? <AppTabNavigator /> : <AuthNavigator />;
```

---

## Navigation Flow

```
┌─────────────────────────────────────────────────────┐
│                    AUTH STACK                        │
│                                                     │
│   Onboarding ──→ Login ──→ Register                 │
│   (3 slides)     (email +   (name + email +         │
│                   password)  password + confirm)     │
│                     │                                │
│                     │ setUser() ← triggers switch    │
└─────────────┬───────┘                                │
              │                                        │
              ▼                                        │
┌─────────────────────────────────────────────────────┐
│                    APP TABS                          │
│                                                     │
│  ┌──────┐  ┌──────────────┐  ┌─────────┐  ┌──────┐ │
│  │ Home │  │ Transactions │  │ Budgets │  │ (TBD)│ │
│  └──┬───┘  └──────────────┘  └────┬────┘  │      │ │
│     │                              │       │ Ana- │ │
│     │ (+) button opens             │ (+)   │lytics│ │
│     │ AddTransactionModal          │ opens │      │ │
│     │                              │ Add-  └──────┘ │
│     │ "See All" links to           │ Budget         │
│     │ TransactionScreen            │ Modal          │
└─────────────────────────────────────────────────────┘
```

---

## State Management — Zustand

### What is Zustand?

Zustand (German for "state") is a tiny, fast state management library.  
Think of it as a **global brain** that any screen can read from or write to.

### Why not useState?

`useState` only works **inside one component**. If you add a transaction in a modal,  
HomeScreen wouldn't know about it. You'd have to pass data through 5+ layers of props.

Zustand solves this: **any component can read and update the same data**.

### How the Store Works

```
useMoniVoStore.ts
│
├── STATE (the data)
│   ├── user: User | null          ← who's logged in?
│   ├── transactions: Transaction[] ← all income/expense entries
│   ├── categories: Category[]      ← built-in + custom categories
│   ├── budgets: Budget[]           ← spending limits per category
│   ├── wallets: Wallet[]           ← cash, bank, telebirr
│   └── theme: 'light' | 'dark'    ← current color mode
│
├── ACTIONS (functions that change data)
│   ├── setUser(user)              ← log in / log out
│   ├── addTransaction(tx)         ← add new income/expense
│   ├── deleteTransaction(id)      ← remove a transaction
│   ├── addCategory(cat)           ← create custom category
│   ├── deleteCategory(id)         ← remove custom category
│   ├── addBudget(budget)          ← create spending limit
│   ├── deleteBudget(id)           ← remove budget
│   ├── addWallet(wallet)          ← add new wallet
│   ├── deleteWallet(id)           ← remove wallet
│   ├── toggleTheme()              ← switch light ↔ dark
│   └── logOut()                   ← clear user, reset data
│
└── GETTERS (computed values — read-only)
    ├── totalIncome()              ← sum of all CREDIT transactions
    ├── totalExpenses()            ← sum of all DEBIT transactions
    ├── totalBalance()             ← income - expenses
    └── transactionByCategory()    ← spending grouped by category
```

### Reading Data from the Store

```tsx
// In ANY component — just call the hook:
const budgets = useMoniVoStore((state) => state.budgets);
const addBudget = useMoniVoStore((state) => state.addBudget);

// budgets automatically updates when data changes!
// No manual refresh needed.
```

### Writing Data to the Store

```tsx
// Inside an action:
addTransaction: (tx) => set((state) => ({
    transactions: [
        {
            ...tx,
            id: `tx-${Date.now()}`,            // auto-generate ID
            createdAt: new Date().toISOString(), // auto-timestamp
        },
        ...state.transactions,                  // keep old ones
    ],
})),
```

**Rule: NEVER modify state directly.** Always use `set()`.

```tsx
// ❌ WRONG — mutating state directly
state.transactions.push(newTx);

// ✅ RIGHT — creating a new array via set()
set((state) => ({ transactions: [newTx, ...state.transactions] }));
```

---

## Theming System

### The Chain

```
constants/colors.ts     ← raw hex values (#1A1A2E, #C9A84C, etc.)
        ↓
constants/theme.ts      ← two theme objects: lightTheme + darkTheme
        ↓                  each maps semantic names to colors
hooks/useTheme.ts       ← custom hook: reads theme from Zustand,
        ↓                  returns the right theme object
every component         ← const colors = useTheme();
                           const styles = createStyles(colors);
```

### How Colors Work

```tsx
// constants/theme.ts defines semantic color names:
export const darkTheme: ThemeColors = {
    background: '#0D0D1A',      // page background
    surface: '#1A1A2E',         // card background
    surfaceAlt: '#22223A',      // input/secondary surfaces
    textPrimary: '#F0ECE3',     // main text
    textSecondary: '#8B8B9E',   // muted text
    textMuted: '#52526B',       // very subtle text
    champagne: '#C9A84C',       // MoniVo brand gold ✨
    danger: '#E74C3C',          // expense red
    success: '#2ECC71',         // income green
    border: '#2A2A42',          // subtle borders
    overlay: 'rgba(0,0,0,0.6)', // modal backdrop
    statusBar: 'light',         // status bar text color
};
```

### The Pattern Every Screen Follows

```tsx
export default function AnyScreen() {
    const colors = useTheme();               // 1. Get colors
    const styles = createStyles(colors);     // 2. Create styles with colors

    return <View style={styles.container}>   // 3. Use styles
        ...
    </View>;
}

// 4. Styles defined as a function that takes colors:
const createStyles = (colors: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.background,  // ← dynamic!
        },
    });
```

**Why this pattern?** When `toggleTheme()` is called:
1. Zustand's `theme` value flips `'light'` ↔ `'dark'`
2. `useTheme()` returns the new color set
3. Every component re-renders with new colors
4. **Zero extra code per screen** — it just works!

---

## Data Types

### Transaction
```
┌─────────────────────────────────────────────┐
│ Transaction                                 │
├─────────────────────────────────────────────┤
│ id: string              "txn-1723456789"    │
│ amount: number           250.00              │
│ type: 'CREDIT' | 'DEBIT' income or expense  │
│ categoryId: string       "cat-food"          │
│ note?: string            "Coffee at Tomoca"  │
│ date: string             ISO date string     │
│ status: 'PENDING'|'CLEARED'                 │
│ walletId: string         "wallet-1"          │
│ createdAt: string        auto-set            │
└─────────────────────────────────────────────┘
```

### Category
```
┌─────────────────────────────────────────────┐
│ Category                                    │
├─────────────────────────────────────────────┤
│ id: string               "cat-food"         │
│ name: string             "Groceries"        │
│ iconKey: string          "shopping_cart"     │
│ flow: 'EXPENSE' | 'INCOME'                 │
│ essential: boolean        needs vs wants    │
│ recurring: boolean        regular payments  │
│ isBuiltIn: boolean        can't delete      │
│ isCustom: boolean         user created      │
└─────────────────────────────────────────────┘
```

### Budget
```
┌─────────────────────────────────────────────┐
│ Budget                                      │
├─────────────────────────────────────────────┤
│ id: string               "budget-17234..."  │
│ categoryId: string       links to Category  │
│ limitAmount: number      500.00             │
│ startDate: string        "2026-08-01"       │
│ endDate: string          "2026-08-31"       │
│ recurring?: 'none'|'daily'|'weekly'|        │
│             'biweekly'|'monthly'|'yearly'   │
│ alertThreshold?: number  0.8 = warn at 80%  │
└─────────────────────────────────────────────┘
```

---

## How to Run

### Prerequisites
- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (iOS or Android)

### Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Start with clear cache (if things look wrong)
npx expo start -c

# Scan the QR code with Expo Go on your phone
```

### Key Dependencies

| Package | What It Does |
|---|---|
| `expo` | Framework for building React Native apps |
| `zustand` | Global state management |
| `@react-navigation/native` | Screen navigation |
| `@react-navigation/stack` | Auth screen stack (push/pop) |
| `@react-navigation/bottom-tabs` | Bottom tab bar |
| `lucide-react-native` | Beautiful icon library |
| `react-native-calendars` | Calendar date picker |
| `react-native-safe-area-context` | Handles notch/status bar areas |
| `expo-linear-gradient` | Gradient backgrounds on cards |
| `expo-status-bar` | Control status bar appearance |
