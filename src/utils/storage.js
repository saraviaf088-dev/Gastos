// LocalStorage Keys
const KEYS = {
  PIN: 'finan_auth_pin',
  AUTH_STATE: 'finan_is_authenticated',
  INCOMES: 'finan_incomes',
  EXPENSES: 'finan_expenses',
  CATEGORIES: 'finan_categories',
  BUDGETS: 'finan_budgets',
  SETTINGS: 'finan_settings',
  INITIAL_BALANCE: 'finan_initial_balance'
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

// Helper to seed demo data if empty
export const seedInitialData = () => {
  const existingExpenses = localStorage.getItem(KEYS.EXPENSES);
  const existingIncomes = localStorage.getItem(KEYS.INCOMES);
  
  if (!localStorage.getItem(KEYS.PIN)) {
    localStorage.setItem(KEYS.PIN, '1234'); // Default PIN 1234
  }

  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');

  if (!existingIncomes) {
    const sampleIncomes = [
      {
        id: 'inc-1',
        title: 'Sueldo Mensual Empresa',
        amount: 4500,
        date: `${year}-${month}-01`,
        category: 'Salario Principal',
        paymentMethod: 'Transferencia Bancaria',
        notes: 'Pago de nómina ordinaria',
        hasAttachment: true,
        attachmentName: 'boleta_pago_mes.pdf',
        attachmentType: 'application/pdf',
        attachmentData: null,
        reconciliationStatus: 'RECONCILED'
      },
      {
        id: 'inc-2',
        title: 'Proyecto Freelance Web',
        amount: 850,
        date: `${year}-${month}-12`,
        category: 'Trabajo Freelance / Extra',
        paymentMethod: 'PayPal / Stripe',
        notes: 'Rediseño de landing page cliente',
        hasAttachment: false,
        attachmentName: null,
        attachmentType: null,
        attachmentData: null,
        reconciliationStatus: 'MANUAL'
      }
    ];
    localStorage.setItem(KEYS.INCOMES, JSON.stringify(sampleIncomes));
  }

  if (!existingExpenses) {
    const sampleExpenses = [
      {
        id: 'exp-1',
        title: 'Supermercado Mensual',
        amount: 980,
        date: `${year}-${month}-04`,
        category: 'Alimentación y Mercadería',
        paymentMethod: 'Tarjeta de Débito',
        notes: 'Compras de despensa para el hogar',
        isAntExpense: false,
        hasAttachment: true,
        attachmentName: 'factura_supermercado.jpg',
        attachmentType: 'image/jpeg',
        attachmentData: null,
        reconciliationStatus: 'RECONCILED'
      },
      {
        id: 'exp-2',
        title: 'Alquiler del Depa',
        amount: 1500,
        date: `${year}-${month}-02`,
        category: 'Vivienda y Alquiler',
        paymentMethod: 'Transferencia',
        notes: 'Cuota mensual de arrendamiento',
        isAntExpense: false,
        hasAttachment: true,
        attachmentName: 'recibo_alquiler.pdf',
        attachmentType: 'application/pdf',
        attachmentData: null,
        reconciliationStatus: 'RECONCILED'
      },
      {
        id: 'exp-3',
        title: 'Cafés diarios en la calle',
        amount: 135,
        date: `${year}-${month}-15`,
        category: 'Gastos Hormiga / Caprichos',
        paymentMethod: 'Efectivo',
        notes: 'Acumulado de cafés de especialidad',
        isAntExpense: true,
        hasAttachment: false,
        attachmentName: null,
        attachmentType: null,
        attachmentData: null,
        reconciliationStatus: 'MANUAL'
      },
      {
        id: 'exp-4',
        title: 'Membresías Netflix & Spotify',
        amount: 95,
        date: `${year}-${month}-10`,
        category: 'Suscripciones y Servicios Digitales',
        paymentMethod: 'Tarjeta de Crédito',
        notes: 'Suscripción HD y plan familiar',
        isAntExpense: true,
        hasAttachment: true,
        attachmentName: 'comprobante_netflix.png',
        attachmentType: 'image/png',
        attachmentData: null,
        reconciliationStatus: 'RECONCILED'
      },
      {
        id: 'exp-5',
        title: 'Cena de Fin de Semana en Restaurante',
        amount: 280,
        date: `${year}-${month}-18`,
        category: 'Entretenimiento y Salidas',
        paymentMethod: 'Tarjeta de Crédito',
        notes: 'Salida con amigos',
        isAntExpense: false,
        hasAttachment: false,
        attachmentName: null,
        attachmentType: null,
        attachmentData: null,
        reconciliationStatus: 'PENDING'
      }
    ];
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(sampleExpenses));
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

export const getStoredPin = () => localStorage.getItem(KEYS.PIN) || '1234';
export const setStoredPin = (newPin) => localStorage.setItem(KEYS.PIN, newPin);

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
  seedInitialData();
};

export { KEYS };
