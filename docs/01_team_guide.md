# MoniVo — Team Guide

> **Start here if you're new to the project.**  
> This doc tells you what MoniVo is, where to work, and what to build.

---

## 👥 Who Are We?

We are a team of **5 UI developers** building MoniVo as a learning project.

---

## 🎯 What Is MoniVo Supposed to Be?

MoniVo is a **complete personal finance app** for Ethiopians. When finished, a user should be able to:

1. **Track every birr** — log income and expenses with categories and notes
2. **Set budgets** — spending limits per category with progress tracking
3. **See analytics** — visual charts showing where money goes
4. **Manage their profile** — settings, preferences, account info
5. **Switch themes** — full dark/light mode support

Think of it like a local version of **Mint** or **YNAB**, tailored for Ethiopian users.

---

## 📍 Where Will You Be Working?

| Task | Where to Work | Key Files |
|---|---|---|
| **Building new screens** | `app/(app)/` | Create new `.tsx` files here |
| **Building new modals** | `components/modals/` | Forms that float over screens |
| **Creating UI pieces** | `components/common/` | Buttons, inputs, pickers |
| **Screen-specific components** | `components/home/` or `components/charts/` | Cards, rows, chart widgets |
| **Adding new data types** | `types/` | TypeScript interfaces |
| **Adding store actions** | `store/useMoniVoStore.ts` | New actions like `updateTransaction()` |
| **Adding theme colors** | `constants/theme.ts` | Both `lightTheme` and `darkTheme` |
| **Adding categories** | `constants/defaultCategories.ts` | Built-in expense/income categories |
| **Wiring up navigation** | `app/navigation/AppNavigator.tsx` | Adding new tabs or screens |

---

## 🧑‍💻 Task Assignments (5 Members)

Each person owns a **feature area** — from UI to store logic.

---

### 👤 Member 1 — Analytics Screen
**Build the entire Analytics tab** — the 4th tab in the bottom nav.

- Create `app/(app)/AnalyticsScreen.tsx`
- Build chart components in `components/charts/`
- Use `useMoniVoStore` to read `transactions` and compute:
  - Spending by category (pie/donut chart)
  - Spending over time (line chart or bar chart)
  - Monthly income vs expenses comparison
- Library suggestion: `react-native-chart-kit` or `victory-native`
- Register the screen in `AppNavigator.tsx` (the Analytics tab already exists, it just needs a real component)

**Files to touch:**
- `app/(app)/AnalyticsScreen.tsx` ← NEW
- `components/charts/*.tsx` ← NEW
- `app/navigation/AppNavigator.tsx` ← add import

---

### 👤 Member 2 — Profile & Settings Screen
**Build the Profile/Settings tab** — could replace or sit alongside Analytics.

- Create `app/(app)/ProfileScreen.tsx`
- Show user info (name, email from `useMoniVoStore.user`)
- Theme toggle (light/dark) — already works, just add the switch UI
- Logout button → calls `logOut()` from the store
- Future: change password, notification preferences

**Files to touch:**
- `app/(app)/ProfileScreen.tsx` ← NEW
- `app/navigation/AppNavigator.tsx` ← add tab
- `store/useMoniVoStore.ts` ← may need `updateUser()` action

---

### 👤 Member 3 — Transaction Improvements
**Make transactions fully editable and deletable.**

- Add **swipe-to-delete** on `TransactionRow` (using `react-native-gesture-handler` or `Swipeable`)
- Add **edit transaction** — tapping a TransactionRow opens `AddTransactionModal` pre-filled with existing data
- Add `updateTransaction(id, changes)` action to `useMoniVoStore.ts`
- The `deleteTransaction(id)` action already exists in the store — just need the UI gesture

**Files to touch:**
- `components/home/TransactionRow.tsx` ← add swipe + tap-to-edit
- `components/modals/AddTransactionModal.tsx` ← accept optional `editingTransaction` prop
- `store/useMoniVoStore.ts` ← add `updateTransaction()` action

---

### 👤 Member 4 — Category Management
**Let users create, edit, and delete custom categories.**

- Create `components/modals/CategoryModal.tsx` — form to add new categories
- Show a "Manage Categories" option somewhere (Settings or a dedicated screen)
- Users should pick: name, flow (expense/income), essential vs want, icon
- The `addCategory()` and `deleteCategory()` store actions already exist
- Built-in categories (`isBuiltIn: true`) cannot be deleted

**Files to touch:**
- `components/modals/CategoryModal.tsx` ← NEW
- `app/(app)/ProfileScreen.tsx` or new `CategoriesScreen.tsx`
- `store/useMoniVoStore.ts` ← may need `updateCategory()` action

---

### 👤 Member 5 — Budget Improvements & Wallet Management
**Make budgets editable + build wallet management.**

- Add **edit budget** — tapping a BudgetCard opens `AddBudgetModal` pre-filled
- Add `updateBudget(id, changes)` action to the store
- Build **wallet management** — add/remove wallets (Cash, Bank, Telebirr)
- Show per-wallet balances on HomeScreen
- The `addWallet()` and `deleteWallet()` store actions already exist

**Files to touch:**
- `components/home/BudgetCard.tsx` ← add tap-to-edit
- `components/modals/AddBudgetModal.tsx` ← accept optional `editingBudget` prop
- `store/useMoniVoStore.ts` ← add `updateBudget()` action
- `app/(app)/WalletsScreen.tsx` or section in ProfileScreen ← NEW

---

## 🔑 Rules for Everyone

1. **Always use `useTheme()`** — never import `Colors` directly
2. **Always use `createStyles(colors)`** — never use inline styles for layout
3. **Always read from Zustand** — never store app data in local `useState` (local state is only for form inputs and UI toggles)
4. **Use existing components** — check `components/common/` before building a new button, input, or picker
5. **Follow the naming pattern** — `SomethingScreen.tsx` for screens, `SomethingModal.tsx` for modals, `SomethingCard.tsx` or `SomethingRow.tsx` for list items

---

## ✅ Current Status & What's Left

### Built & Working

| Feature | Status |
|---|---|
| Onboarding flow (3 slides) | ✅ Done |
| Login + Register screens | ✅ Done |
| Home dashboard (balance cards + transactions) | ✅ Done |
| Add income / expense modal | ✅ Done |
| Transaction history (filters + tabs) | ✅ Done |
| Budget list (progress bars) | ✅ Done |
| Add / delete budget | ✅ Done |
| Light ↔ Dark theme | ✅ Done |
| 7 reusable components | ✅ Done |

### What Each Member Needs to Build

| Feature | Who | Priority |
|---|---|---|
| Analytics Screen (charts) | **Member 1** | 🔴 High |
| Profile / Settings | **Member 2** | 🔴 High |
| Swipe-to-delete + edit transactions | **Member 3** | 🔴 High |
| Category management modal | **Member 4** | 🟡 Medium |
| Edit budgets + wallet management | **Member 5** | 🟡 Medium |
| Transaction search | *Anyone* | 🟢 Low |
| Data export (CSV/PDF) | *Anyone* | 🟢 Low |
| Push notifications | *Anyone* | 🟢 Low |

---

*For technical details, see the other docs:*
- [`02_architecture.md`](./02_architecture.md) — How the app is built (structure, navigation, Zustand, theming)
- [`03_screens_and_components.md`](./03_screens_and_components.md) — Every screen and reusable component
- [`04_react_concepts.md`](./04_react_concepts.md) — React concepts explained + data flow diagrams
