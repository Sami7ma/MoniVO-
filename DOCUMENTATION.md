# MoniVo — Personal Finance Tracker

> **MoniVo** is a personal finance tracker built with React Native + Expo.  
> Currency: **ETB (Ethiopian Birr)**

---

## 📁 Repository Structure

```
MoniVO-/
├── frontend/                     # React Native (Expo) Mobile Application
│   ├── app/                      # Screens & App Navigation
│   │   ├── (app)/                # Authenticated Screens (HomeScreen, TransactionScreen, BudgetsScreen, AnalyticsScreen)
│   │   ├── (auth)/               # Auth Screens (LoginScreen, RegisterScreen, OnboardingScreen)
│   │   └── navigation/           # AppNavigator (Tabs + Auth stack)
│   ├── components/               # Reusable UI components & modals
│   │   ├── common/               # Buttons (PrimaryButton, LogoutButton, FAB), Selectors, Pickers
│   │   ├── home/                 # BalanceCards, BudgetCard, TransactionRow, Home charts & action buttons
│   │   └── modals/               # Add/Edit Transaction & Budget modals
│   ├── constants/                # Theme colors (dark/light) & default categories
│   ├── docs/                     # Detailed architecture, screen specs, and team guides
│   ├── hooks/                    # Custom React hooks (useTheme)
│   ├── store/                    # Zustand global store (useMoniVoStore) with auth, API sync, & calculations
│   ├── types/                    # TypeScript interfaces (Transaction, Budget, Category, Wallet, User)
│   ├── utils/                    # API client (Axios + SecureStore interceptor) & dummy datasets
│   └── assets/                   # App icons, splash screens, and image assets
├── backend/                      # Node.js / Express API Server (future addition)
├── DOCUMENTATION.md              # Repository overview & setup
└── AGENTS.md                     # Agent instructions
```

---

## 📚 Documentation

Detailed documentation lives in [`frontend/docs/`](./frontend/docs/):

| Doc | What's Inside |
|---|---|
| [**monivo_complete_guide.md**](./frontend/docs/monivo_complete_guide.md) | 📘 Comprehensive guide covering backend integration, architecture, flows, and step-by-step setup |
| [**01_team_guide.md**](./frontend/docs/01_team_guide.md) | 🎯 Project vision, task assignments, team rules, and status |
| [**02_architecture.md**](./frontend/docs/02_architecture.md) | 🏗️ Architecture, navigation flow, Zustand state management, theming system, data types |
| [**03_screens_and_components.md**](./frontend/docs/03_screens_and_components.md) | 📱 Screen breakdown, component hierarchy, props, and connections |
| [**04_react_concepts.md**](./frontend/docs/04_react_concepts.md) | 📖 React concepts explained with MoniVo examples |

---

## 🚀 Getting Started

### Running the Frontend

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (if needed)
npm install

# 3. Configure API URL (optional)
cp .env.example .env

# 4. Start Expo development server
npm start
# or
npx expo start
```
