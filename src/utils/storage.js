// LocalStorage Keys
const KEYS = {
  USERNAME: 'finan_auth_username',
  PASSWORD: 'finan_auth_password',
  AUTH_STATE: 'finan_is_authenticated',
  INCOMES: 'finan_incomes',
  EXPENSES: 'finan_expenses',
  CATEGORIES: 'finan_categories',
  BUDGETS: 'finan_budgets',
  SETTINGS: 'finan_settings',
  INITIAL_BALANCE: 'finan_initial_balance',
  SAVINGS_GOALS: 'finan_savings_goals',
  MONTHLY_SAVINGS: 'finan_monthly_savings'
};

// Default initial categories
const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Alimentación y Mercadería', type: 'expense', color: '#10b981', icon: 'Utensils', isSystem: true, budgetLimit: 1200 },
  { id: 'cat-2', name: 'Vivienda y Alquiler', type: 'expense', color: '#3b82f6', icon: 'Home', isSystem: true, budgetLimit: 1500 },
  { id: 'cat-3', name: 'Servicios Básicos (Luz, Agua, Net)', type: 'expense', color: '#8b5cf6', icon: 'Zap', isSystem: true, budgetLimit: 400 },
  { id: 'cat-4', name: 'Transporte y Combustible', type: 'expense', color: '#f59e0b', icon: 'Car', isSystem: true, budgetLimit: 500 },
  { id: 'cat-5', name: 'Entretenimiento y Salidas', type: 'expense', color: '#ec4899', icon: 'Film', isSystem: true, budgetLimit: 300 },
  { id: 'cat-6', name: 'Salud y Medicinas', type: 'expense', color: '#ef4444', icon: 'HeartPulse', isSystem: true, budgetLimit: 250 },
  { id: 'cat-7', name: 'Suscripciones y Servicios Digitales', type: 'expense', color: '#06b6d4', icon: 'Tv', isSystem: true, budgetLimit: 150 },
  { id: 'cat-8', name: 'Gastos Hormiga / Caprichos', type: 'expense', color: '#f97316', icon: 'Coffee', isSystem: true, budgetLimit: 100 },
  { id: 'cat-9', name: 'Educación y Cursos', type: 'expense', color: '#6366f1', icon: 'BookOpen', isSystem: true, budgetLimit: 200 },
  { id: 'cat-10', name: 'Salario Principal', type: 'income', color: '#10b981', icon: 'Briefcase', isSystem: true, budgetLimit: 0 },
  { id: 'cat-11', name: 'Trabajo Freelance / Extra', type: 'income', color: '#14b8a6', icon: 'DollarSign', isSystem: true, budgetLimit: 0 },
  { id: 'cat-12', name: 'Inversiones y Dividendos', type: 'income', color: '#8b5cf6', icon: 'TrendingUp', isSystem: true, budgetLimit: 0 }
];

// Helper to seed initial data if empty
export const seedInitialData = () => {
  if (!localStorage.getItem(KEYS.USERNAME)) {
    localStorage.setItem(KEYS.USERNAME, 'admin');
    localStorage.setItem(KEYS.PASSWORD, '1234');
  }

  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }

  if (!localStorage.getItem(KEYS.INCOMES)) {
    localStorage.setItem(KEYS.INCOMES, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.EXPENSES)) {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.SAVINGS_GOALS)) {
    localStorage.setItem(KEYS.SAVINGS_GOALS, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.MONTHLY_SAVINGS)) {
    localStorage.setItem(KEYS.MONTHLY_SAVINGS, JSON.stringify([]));
  }
};

// Storage getters & setters
export const getStoredData = (key, fallback = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
};

export const saveStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
};

export const getStoredCredentials = () => ({
  username: localStorage.getItem(KEYS.USERNAME) || 'admin',
  password: localStorage.getItem(KEYS.PASSWORD) || '1234'
});

export const setStoredCredentials = (newUsername, newPassword) => {
  localStorage.setItem(KEYS.USERNAME, newUsername);
  localStorage.setItem(KEYS.PASSWORD, newPassword);
};

export const getStoredInitialBalance = () => {
  const val = localStorage.getItem(KEYS.INITIAL_BALANCE);
  return val !== null ? parseFloat(val) || 0 : 0;
};

export const setStoredInitialBalance = (amount) => {
  localStorage.setItem(KEYS.INITIAL_BALANCE, parseFloat(amount) || 0);
};

export const clearAllData = () => {
  localStorage.removeItem(KEYS.INCOMES);
  localStorage.removeItem(KEYS.EXPENSES);
  localStorage.removeItem(KEYS.CATEGORIES);
  localStorage.removeItem(KEYS.INITIAL_BALANCE);
  localStorage.removeItem(KEYS.USERNAME);
  localStorage.removeItem(KEYS.PASSWORD);
  localStorage.removeItem(KEYS.SAVINGS_GOALS);
  localStorage.removeItem(KEYS.MONTHLY_SAVINGS);
  seedInitialData();
};

export { KEYS };
