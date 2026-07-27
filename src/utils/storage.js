// LocalStorage Keys
const KEYS = {
  USER: 'finan_user_data',
  AUTH_STATE: 'finan_is_authenticated',
  INCOMES: 'finan_incomes',
  EXPENSES: 'finan_expenses',
  CATEGORIES: 'finan_categories',
  BUDGETS: 'finan_budgets',
  SETTINGS: 'finan_settings',
  INITIAL_BALANCE: 'finan_initial_balance',
  SAVINGS_GOALS: 'finan_savings_goals',
  MONTHLY_SAVINGS: 'finan_monthly_savings',
  RESET_CODE: 'finan_reset_code',
  RESET_IDENTIFIER: 'finan_reset_identifier'
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
  if (!localStorage.getItem(KEYS.USER)) {
    // No default user - user must register
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

// User data structure: { email, phone, password, name, createdAt }
export const getStoredUser = () => {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setStoredUser = (userData) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(userData));
};

// Check if email or phone already exists
export const userExists = (identifier) => {
  const user = getStoredUser();
  if (!user) return false;
  
  const normalizedInput = identifier.toLowerCase().trim();
  const normalizedEmail = user.email ? user.email.toLowerCase().trim() : '';
  const normalizedPhone = user.phone ? user.phone.trim() : '';
  
  return normalizedInput === normalizedEmail || normalizedInput === normalizedPhone;
};

// Generate 6-digit verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store reset code with expiration (5 minutes)
export const storeResetCode = (identifier, code) => {
  const resetData = {
    code: code,
    identifier: identifier,
    createdAt: Date.now(),
    expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
  };
  localStorage.setItem(KEYS.RESET_CODE, JSON.stringify(resetData));
  localStorage.setItem(KEYS.RESET_IDENTIFIER, identifier);
};

// Verify reset code
export const verifyResetCode = (identifier, code) => {
  const resetData = JSON.parse(localStorage.getItem(KEYS.RESET_CODE));
  
  if (!resetData) {
    return { success: false, message: 'No hay código de verificación activo. Solicita uno nuevo.' };
  }
  
  if (Date.now() > resetData.expiresAt) {
    localStorage.removeItem(KEYS.RESET_CODE);
    localStorage.removeItem(KEYS.RESET_IDENTIFIER);
    return { success: false, message: 'El código ha expirado. Solicita uno nuevo.' };
  }
  
  const normalizedInput = identifier.toLowerCase().trim();
  const normalizedStored = resetData.identifier.toLowerCase().trim();
  
  if (normalizedInput !== normalizedStored) {
    return { success: false, message: 'El correo/celular no coincide con el código.' };
  }
  
  if (code !== resetData.code) {
    return { success: false, message: 'Código incorrecto. Intenta de nuevo.' };
  }
  
  return { success: true, message: 'Código verificado correctamente.' };
};

// Clear reset code
export const clearResetCode = () => {
  localStorage.removeItem(KEYS.RESET_CODE);
  localStorage.removeItem(KEYS.RESET_IDENTIFIER);
};

// Check if user exists for password reset
export const userExistsForReset = (identifier) => {
  const user = getStoredUser();
  if (!user) return false;
  
  const normalizedInput = identifier.toLowerCase().trim();
  const normalizedEmail = user.email ? user.email.toLowerCase().trim() : '';
  const normalizedPhone = user.phone ? user.phone.trim() : '';
  
  return normalizedInput === normalizedEmail || normalizedInput === normalizedPhone;
};

// Register new user
export const registerUser = (identifier, password, name) => {
  const existingUser = getStoredUser();
  if (existingUser) {
    return { success: false, message: 'Ya existe una cuenta registrada. Elimina la cuenta actual para crear una nueva.' };
  }

  // Validate identifier (email or phone)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
  
  const isEmail = emailRegex.test(identifier);
  const isPhone = phoneRegex.test(identifier);
  
  if (!isEmail && !isPhone) {
    return { success: false, message: 'Ingresa un correo electrónico o número de celular válido.' };
  }

  if (password.length < 4) {
    return { success: false, message: 'La contraseña debe tener al menos 4 caracteres.' };
  }

  if (name && name.length < 2) {
    return { success: false, message: 'El nombre debe tener al menos 2 caracteres.' };
  }

  const userData = {
    email: isEmail ? identifier : '',
    phone: isPhone ? identifier : '',
    password: password,
    name: name || '',
    createdAt: new Date().toISOString()
  };

  setStoredUser(userData);
  return { success: true, message: 'Cuenta creada correctamente.' };
};

// Login with identifier and password
export const loginUser = (identifier, password) => {
  const user = getStoredUser();
  if (!user) {
    return { success: false, message: 'No hay cuenta registrada. Crea una cuenta nueva.' };
  }

  const normalizedInput = identifier.toLowerCase().trim();
  const normalizedEmail = user.email ? user.email.toLowerCase().trim() : '';
  const normalizedPhone = user.phone ? user.phone.trim() : '';
  
  const identifierMatch = normalizedInput === normalizedEmail || normalizedInput === normalizedPhone;
  
  if (!identifierMatch || password !== user.password) {
    return { success: false, message: 'Correo/celular o contraseña incorrectos.' };
  }

  return { success: true, message: 'Inicio de sesión exitoso.' };
};

// Reset password with verification code
export const resetPasswordWithCode = (identifier, code, newPassword) => {
  const user = getStoredUser();
  if (!user) {
    return { success: false, message: 'No hay cuenta registrada.' };
  }

  const normalizedInput = identifier.toLowerCase().trim();
  const normalizedEmail = user.email ? user.email.toLowerCase().trim() : '';
  const normalizedPhone = user.phone ? user.phone.trim() : '';
  
  const identifierMatch = normalizedInput === normalizedEmail || normalizedInput === normalizedPhone;
  
  if (!identifierMatch) {
    return { success: false, message: 'Correo/celular no encontrado.' };
  }

  // Verify the code first
  const codeVerification = verifyResetCode(identifier, code);
  if (!codeVerification.success) {
    return codeVerification;
  }

  if (!newPassword || newPassword.length < 4) {
    return { success: false, message: 'La nueva contraseña debe tener al menos 4 caracteres.' };
  }

  const updatedUser = {
    ...user,
    password: newPassword
  };

  setStoredUser(updatedUser);
  clearResetCode();
  return { success: true, message: 'Contraseña restablecida correctamente. Ya puedes iniciar sesión.' };
};

// Update user credentials
export const updateUserCredentials = (identifier, newPassword) => {
  const user = getStoredUser();
  if (!user) {
    return { success: false, message: 'No hay cuenta registrada.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
  
  const isEmail = emailRegex.test(identifier);
  const isPhone = phoneRegex.test(identifier);
  
  if (!isEmail && !isPhone) {
    return { success: false, message: 'Ingresa un correo electrónico o número de celular válido.' };
  }

  if (newPassword && newPassword.length < 4) {
    return { success: false, message: 'La contraseña debe tener al menos 4 caracteres.' };
  }

  const updatedUser = {
    ...user,
    email: isEmail ? identifier : user.email,
    phone: isPhone ? identifier : user.phone,
    password: newPassword || user.password
  };

  setStoredUser(updatedUser);
  return { success: true, message: 'Credenciales actualizadas correctamente.' };
};

// Delete user account
export const deleteUser = () => {
  localStorage.removeItem(KEYS.USER);
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
  localStorage.removeItem(KEYS.USER);
  localStorage.removeItem(KEYS.SAVINGS_GOALS);
  localStorage.removeItem(KEYS.MONTHLY_SAVINGS);
  localStorage.removeItem(KEYS.RESET_CODE);
  localStorage.removeItem(KEYS.RESET_IDENTIFIER);
  seedInitialData();
};

export { KEYS };
