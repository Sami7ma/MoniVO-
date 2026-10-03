e# MoniVo — React Concepts Explained

> A learning reference for the team. Each concept is explained with examples from the MoniVo codebase.

---

## 1. `useState` — Component-Level State

`useState` creates a value and a function to update it.  
Every time the updater is called, the component **re-renders** with the new value.

```tsx
const [amount, setAmount] = useState('');
// amount = current value (starts as '')
// setAmount = function to update it
// Call setAmount('500') → component re-renders → amount is now '500'
```

**Used for:** form inputs, modal visibility, toggles, selected items.

**Where you'll see it:**
- `AddTransactionModal.tsx` — `amount`, `note`, `selectedCategoryId`
- `AddBudgetModal.tsx` — `limitAmount`, `period`, `startDate`, `endDate`
- `LoginScreen.tsx` — `email`, `password`, `showPassword`

**Rule:** Only use `useState` for **local UI state** (things only one component cares about).  
For data that multiple screens need → use Zustand.

---

## 2. `useEffect` — Side Effects

`useEffect` runs code **after** the component renders, or **when specific values change**.

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

**Three modes:**

```tsx
// 1. Run ONCE when component mounts (empty dependency array)
useEffect(() => { console.log('mounted!') }, []);

// 2. Run when specific values change
useEffect(() => { resetForm() }, [visible]);

// 3. Run on EVERY render (no dependency array) — usually a bad idea
useEffect(() => { console.log('rendered!') });
```

**Used for:** resetting forms when modals open, initializing data.

---

## 3. `useMemo` — Expensive Calculations

`useMemo` caches a calculated value and only recalculates it when dependencies change.  
Without it, expensive calculations would run on **every single render**.

```tsx
const totalSpent = useMemo(() => {
    return transactions
        .filter(tx => tx.type === 'DEBIT')
        .reduce((sum, tx) => sum + tx.amount, 0);
}, [transactions]);
// Only recalculates when transactions array changes
// NOT on every single re-render (e.g. when a modal opens)
```

**When to use it:**
- Filtering large arrays
- Computing totals from transactions
- Any calculation that takes > 1ms

**When NOT to use it:**
- Simple values like `const name = 'hello'`
- Values that change every render anyway

---

## 4. `useRef` — References Without Re-renders

`useRef` stores a value that **persists across renders** but **doesn't cause re-renders** when changed.

```tsx
const flatListRef = useRef<FlatList>(null);
// flatListRef.current gives us the actual FlatList element
// We can call .scrollToIndex() on it
// Changing .current does NOT trigger a re-render
```

**vs useState:**
```tsx
// useState: changing it triggers re-render
const [count, setCount] = useState(0);
setCount(1); // → re-render!

// useRef: changing it does NOT trigger re-render
const countRef = useRef(0);
countRef.current = 1; // → NO re-render!
```

**Used for:**
- `OnboardinScree.tsx` — `flatListRef` to scroll programmatically
- `PeriodSelector.tsx` — `listRef` for the period wheel scroll

---

## 5. Zustand Selectors — Efficient Store Reads

When reading from Zustand, **always use a selector function**:

```tsx
// ✅ GOOD — only re-renders when budgets change
const budgets = useMoniVoStore((state) => state.budgets);

// ❌ BAD — re-renders when ANY store value changes
const store = useMoniVoStore();
```

The `(state) => state.budgets` function is called a **selector**. It tells Zustand:  
"Only wake me up when `budgets` changes, ignore everything else."

**Why it matters:**
If you use the bad pattern, your component re-renders when someone toggles the theme,  
adds a transaction, or changes anything at all. With a selector, it only re-renders  
when the specific data you care about changes.

---

## 6. `createStyles` Pattern — Dynamic Styling

In MoniVo, styles are created as a **function** so they can use theme colors:

```tsx
// Styles are created as a FUNCTION that takes colors:
const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,  // ← changes with theme!
    },
});
```

**Inside the component:**
```tsx
const colors = useTheme();
const styles = createStyles(colors);  // fresh styles every render
```

**Why not a static StyleSheet?** Because colors change when the theme toggles.  
A static stylesheet would be stuck with one theme forever.

---

## 7. TypeScript `interface` — Shape Definitions

An `interface` defines **what shape** an object must have:

```tsx
interface Transaction {
    id: string;           // required — must be a string
    amount: number;       // required — must be a number
    note?: string;        // optional — the ? means it can be missing
}
```

**Why use interfaces?**
- TypeScript catches errors at **compile time**, not runtime
- Your editor shows **autocomplete** for all fields
- If you forget a required field → red squiggly line

---

## 8. `Omit<>` — Removing Fields from a Type

When adding a new transaction, the caller doesn't provide `id` or `createdAt` — those are auto-generated.

```tsx
addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
// This means: "Accept a Transaction, but WITHOUT the id and createdAt fields"
// The store will add those automatically
```

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

*These concepts are the building blocks of everything in MoniVo.  
If you understand these 8 patterns, you can build anything in this app.* 💪
