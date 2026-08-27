# MoniVo — Project Documentation

> **MoniVo** is a personal finance tracker built with React Native + Expo.  
> It helps Ethiopian users track income, expenses, budgets, and spending habits.  
> Currency: **ETB (Ethiopian Birr)**

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [How the App Starts](#how-the-app-starts)
3. [Navigation Flow](#navigation-flow)
4. [State Management — Zustand](#state-management--zustand)
5. [Theming System](#theming-system)
6. [Data Types](#data-types)
7. [Screen Inventory](#screen-inventory)
8. [Reusable Components](#reusable-components)
9. [Key React Concepts Used](#key-react-concepts-used)
10. [Data Flow Diagrams](#data-flow-diagrams)
11. [Feature Status & Roadmap](#feature-status--roadmap)
12. [How to Run](#how-to-run)

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

## Screen Inventory

### Auth Screens (logged out)

| Screen | File | What It Does |
|---|---|---|
| **Onboarding** | `OnboardinScree.tsx` | 3-slide horizontal swiper introducing MoniVo |
| **Login** | `LoginScreen.tsx` | Email + password form, calls `setUser()` |
| **Register** | `RegisterScreen.tsx` | Name + email + password + confirm form |

### App Screens (logged in)

| Screen | File | What It Does |
|---|---|---|
| **Home** | `HomeScreen.tsx` | Balance cards, income/expense totals, recent transactions |
| **Transactions** | `TransactionScreen.tsx` | Full history with date filter, tabs (All/Income/Expense) |
| **Budgets** | `BudgetsScreen.tsx` | Budget list with progress bars, add/delete budgets |
| **Analytics** | *Not built yet* | Will show charts and spending breakdowns |

---

## Reusable Components

### `components/common/` — Shared UI Pieces

| Component | Props | Used In |
|---|---|---|
| **PrimaryButton** | `label`, `onPress`, `color?`, `style?` | Login, Register, Onboarding, both modals |
| **CloseButton** | `onPress` | AddTransactionModal, AddBudgetModal |
| **FloatingActionButton** | `onPress`, `icon?`, `style?` | BudgetsScreen |
| **AmountInput** | `value`, `onChangeText`, `variant?`, `autoFocus?` | Both modals |
| **CategoryPicker** | `categories`, `selectedId`, `onSelect`, `placeholder?`, `label?` | Both modals |
| **NoteInput** | `value`, `onChangeText`, `placeholder?`, `label?` | AddTransactionModal |
| **PeriodSelector** | `startDate`, `endDate`, `period`, `onStartDateChange`, `onEndDateChange`, `onPeriodChange` | AddBudgetModal |

### `components/home/` — Dashboard Pieces

| Component | What It Does |
|---|---|
| **BalanceCards** | Horizontal swipeable cards showing balance, income, expenses (uses LinearGradient) |
| **TransactionRow** | Single row showing: category icon, name, amount, date |
| **BudgetCard** | Card with progress bar, color-coded: green (safe), yellow (warning), red (over budget) |

---

## Key React Concepts Used

### 1. `useState` — Component-Level State

```tsx
const [amount, setAmount] = useState('');
// amount = current value (starts as '')
// setAmount = function to update it
// Every time setAmount is called → component re-renders
```

**Used for:** form inputs, modal visibility, toggles, selected items.

### 2. `useEffect` — Side Effects

```tsx
useEffect(() => {
    // This code runs when `visible` or `defaultType` changes
    if (visible) {
        setType(defaultType);
        setAmount('');
    }
}, [defaultType, visible]);
//  ↑ dependency array — only re-run when these values change
```

**Used for:** resetting forms when modals open, initializing data.

### 3. `useMemo` — Expensive Calculations

```tsx
const totalSpent = useMemo(() => {
    return transactions
        .filter(tx => tx.type === 'DEBIT')
        .reduce((sum, tx) => sum + tx.amount, 0);
}, [transactions]);
// Only recalculates when transactions array changes
// NOT on every single re-render
```

**Used for:** computing totals, filtering lists, expensive operations.

### 4. `useRef` — References That Don't Cause Re-renders

```tsx
const flatListRef = useRef<FlatList>(null);
// flatListRef.current gives us the actual FlatList element
// We can call .scrollToIndex() on it
// Changing .current does NOT trigger a re-render
```

**Used for:** FlatList scroll control, storing values that shouldn't trigger renders.

### 5. Zustand Selectors — Efficient Store Reads

```tsx
// ✅ GOOD — only re-renders when budgets change
const budgets = useMoniVoStore((state) => state.budgets);

// ❌ BAD — re-renders when ANY store value changes
const store = useMoniVoStore();
```

The `(state) => state.budgets` function is called a **selector**. It tells Zustand:  
"Only wake me up when `budgets` changes, ignore everything else."

### 6. `createStyles` Pattern — Dynamic Styling

```tsx
// Styles are created as a FUNCTION that takes colors:
const createStyles = (colors: ThemeColors) => StyleSheet.create({...});

// Inside the component:
const colors = useTheme();
const styles = createStyles(colors);  // fresh styles every render
```

**Why not a static StyleSheet?** Because colors change when theme toggles.  
A static stylesheet would be stuck with one theme forever.

---

## Data Flow Diagrams

### Adding a Transaction

```
User taps "Add Expense" on HomeScreen
        │
        ▼
AddTransactionModal opens (visible = true)
        │
        ▼
User fills: amount, category, note
        │
        ▼
User taps "Add Expense" (PrimaryButton)
        │
        ▼
handleSubmit() validates inputs
        │
        ▼
addTransaction(newTx) called on Zustand store
        │
        ▼
Zustand updates transactions array:
  [newTransaction, ...oldTransactions]
        │
        ▼
ALL components reading transactions re-render:
  ├── HomeScreen (updates recent list + totals)
  ├── TransactionScreen (new row appears)
  └── BudgetsScreen (spent amount updates)
        │
        ▼
Modal closes (onClose())
```

### Budget Spent Calculation

```
BudgetsScreen renders a BudgetCard
        │
        ▼
getSpentForBudget(budget) is called:
  1. Filter transactions where:
     - type === 'DEBIT' (only expenses)
     - categoryId === budget.categoryId (matching category)
     - date is between budget.startDate and budget.endDate
  2. Sum up all matching amounts
        │
        ▼
BudgetCard receives: budget + spent + category
        │
        ▼
Progress bar width = (spent / limitAmount) × 100%
        │
        ▼
Color logic:
  spent < 60%  → green (safe)
  spent < 90%  → yellow (warning)
  spent >= 90% → red (over/near budget)
```

### Theme Toggle

```
User taps theme toggle (sun/moon icon)
        │
        ▼
toggleTheme() called on Zustand:
  theme: 'light' → 'dark' (or vice versa)
        │
        ▼
Every component using useTheme() re-renders:
  useTheme() reads new theme value
  returns darkTheme or lightTheme colors
        │
        ▼
createStyles(colors) creates new stylesheet
        │
        ▼
ALL colors update simultaneously — backgrounds,
text, borders, icons, status bar — everything
```

---

## Feature Status & Roadmap

### ✅ Built & Working

| Feature | Status | Notes |
|---|---|---|
| Onboarding flow | ✅ Done | 3-slide swiper with dots |
| Login screen | ✅ Done | Email + password, fake auth |
| Register screen | ✅ Done | With validation |
| Home dashboard | ✅ Done | Balance cards + recent transactions |
| Add transaction | ✅ Done | Income/expense with category + note |
| Transaction history | ✅ Done | With filters, date picker, tabs |
| Budget list | ✅ Done | Progress bars, color-coded status |
| Add budget | ✅ Done | Period wheel + custom calendar |
| Delete budget | ✅ Done | Swipe or tap with confirmation |
| Theme toggle | ✅ Done | Light ↔ Dark mode |
| Reusable components | ✅ Done | 7 shared components extracted |

### 🔧 Needs Work

| Feature | Status | What's Missing |
|---|---|---|
| Delete transaction | 🔧 Partial | Store action exists, UI needs swipe-to-delete on TransactionRow |
| Edit transaction | ❌ Not started | Open filled modal, update instead of create |
| Edit budget | ❌ Not started | Open filled AddBudgetModal, update existing |
| Category management | ❌ Not started | Add/edit/delete custom categories modal |
| Real authentication | ❌ Not started | Currently uses fake `setUser()` — needs Firebase/API |

### 🚀 Upcoming Features

| Feature | Priority | Description |
|---|---|---|
| **Analytics Screen** | 🔴 High | Pie chart (spending by category), line chart (spending over time), monthly comparisons |
| **Profile / Settings** | 🟡 Medium | User info, change password, app preferences |
| **Wallet management** | 🟡 Medium | Add/remove wallets, per-wallet balances |
| **Transaction search** | 🟢 Low | Search by note text or amount |
| **Export data** | 🟢 Low | CSV/PDF export of transactions |
| **Notifications** | 🟢 Low | Alert when budget threshold reached |
| **Multi-currency** | 🟢 Low | Support USD, EUR alongside ETB |

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

---

*Last updated: August 27, 2026*
