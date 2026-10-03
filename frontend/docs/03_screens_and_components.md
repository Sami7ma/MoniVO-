# MoniVo — Screens & Components

> Every screen and reusable component in the app, with what it does and how it's used.

---

## Screen Inventory

### Auth Screens (logged out)

| Screen | File | What It Does |
|---|---|---|
| **Onboarding** | `app/(auth)/OnboardinScree.tsx` | 3-slide horizontal swiper introducing MoniVo |
| **Login** | `app/(auth)/LoginScreen.tsx` | Email + password form, calls `setUser()` |
| **Register** | `app/(auth)/RegisterScreen.tsx` | Name + email + password + confirm form |

### App Screens (logged in)

| Screen | File | What It Does |
|---|---|---|
| **Home** | `app/(app)/HomeScreen.tsx` | Balance cards, income/expense totals, recent transactions |
| **Transactions** | `app/(app)/TransactionScreen.tsx` | Full history with date filter, tabs (All/Income/Expense) |
| **Budgets** | `app/(app)/BudgetsScreen.tsx` | Budget list with progress bars, add/delete budgets |
| **Analytics** | *Not built yet* | Will show charts and spending breakdowns |
| **Profile** | *Not built yet* | Will show user info, settings, logout |

---

## Reusable Components

### `components/common/` — Shared UI Pieces

These are used across **multiple screens**. Before building something new, check if one of these already does what you need!

| Component | File | Props | Used In |
|---|---|---|---|
| **PrimaryButton** | `PrimaryButton.tsx` | `label`, `onPress`, `color?`, `style?` | Login, Register, Onboarding, both modals |
| **CloseButton** | `CloseButton.tsx` | `onPress` | AddTransactionModal, AddBudgetModal |
| **FloatingActionButton** | `FloatingActionButton.tsx` | `onPress`, `icon?`, `style?` | BudgetsScreen |
| **AmountInput** | `AmountInput.tsx` | `value`, `onChangeText`, `variant?` (`'large'` or `'compact'`), `autoFocus?` | Both modals |
| **CategoryPicker** | `CategoryPicker.tsx` | `categories`, `selectedId`, `onSelect`, `placeholder?`, `label?` | Both modals |
| **NoteInput** | `NoteInput.tsx` | `value`, `onChangeText`, `placeholder?`, `label?` | AddTransactionModal |
| **PeriodSelector** | `PeriodSelector.tsx` | `startDate`, `endDate`, `period`, `onStartDateChange`, `onEndDateChange`, `onPeriodChange` | AddBudgetModal |

### How to Use a Common Component

```tsx
// 1. Import it
import PrimaryButton from '../../components/common/PrimaryButton';

// 2. Use it in JSX — pass the props it needs
<PrimaryButton
    label="Add Expense"
    onPress={handleSubmit}
    color={colors.danger}     // optional — defaults to gold
    style={{ marginTop: 8 }}  // optional — extra styling
/>
```

---

### `components/home/` — Dashboard Pieces

| Component | File | What It Does |
|---|---|---|
| **BalanceCards** | `BalanceCards.tsx` | Horizontal swipeable cards showing balance, income, expenses. Uses `LinearGradient` for premium backgrounds. |
| **TransactionRow** | `TransactionRow.tsx` | Single row showing: category icon, name, amount, date. Used in HomeScreen's "recent" list and TransactionScreen's full list. |
| **BudgetCard** | `BudgetCard.tsx` | Budget progress card with color-coded status: green (< 60% spent), yellow (60-90%), red (> 90%). Shows category name, spent/limit amounts, and a progress bar. |

---

### `components/modals/` — Full-Screen Modal Forms

| Modal | File | What It Does | Uses These Common Components |
|---|---|---|---|
| **AddTransactionModal** | `AddTransactionModal.tsx` | Add income or expense. Has type toggle (Expense/Income), amount input, category picker, note, and submit. | CloseButton, AmountInput (large), CategoryPicker, NoteInput, PrimaryButton |
| **AddBudgetModal** | `AddBudgetModal.tsx` | Create a new budget. Pick category, set limit amount, choose period (with scroll wheel), and optionally custom date range. | CloseButton, AmountInput (compact), CategoryPicker, PeriodSelector, PrimaryButton |

---

### `components/charts/` — Analytics Charts

*Not built yet.* This is where **Member 1** will create chart components like:
- `SpendingPieChart.tsx` — donut/pie chart of spending by category
- `MonthlyBarChart.tsx` — bar chart comparing income vs expenses by month
- `TrendLineChart.tsx` — line chart showing spending over time

---

## How Components Connect

```
HomeScreen
├── BalanceCards (swipeable cards)
├── TransactionRow × N (recent transactions)
├── FloatingActionButton (+)
└── AddTransactionModal
    ├── CloseButton (X)
    ├── AmountInput (large)
    ├── CategoryPicker (dropdown)
    ├── NoteInput (optional text)
    └── PrimaryButton ("Add Expense")

BudgetsScreen
├── BudgetCard × N (progress bars)
├── FloatingActionButton (+)
└── AddBudgetModal
    ├── CloseButton (X)
    ├── CategoryPicker (dropdown)
    ├── AmountInput (compact)
    ├── PeriodSelector (wheel + calendar)
    └── PrimaryButton ("Create Budget")

TransactionScreen
└── TransactionRow × N (full history with filters)

LoginScreen / RegisterScreen / OnboardingScreen
└── PrimaryButton ("Sign In" / "Create Account" / "Get Started")
```
