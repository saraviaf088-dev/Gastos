import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getStoredData, saveStoredData, seedInitialData, KEYS, getStoredInitialBalance, setStoredInitialBalance } from '../utils/storage';
import { calculateFinancials } from '../utils/calculations';
import { 
  getSyncCode, 
  setSyncCode, 
  subscribeToCloudSync, 
  pushToCloudSync, 
  setupLocalTabSync 
} from '../utils/cloudSync';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [initialBalance, setInitialBalanceState] = useState(0);
  
  // Real-time Sync State
  const [syncCodeState, setSyncCodeState] = useState(getSyncCode());
  const [syncStatus, setSyncStatus] = useState('connected'); // 'connected' | 'syncing' | 'offline'
  const [lastSyncedAt, setLastSyncedAt] = useState(new Date());

  // Modals state
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState('expense');
  const [viewAttachmentModal, setViewAttachmentModal] = useState(null); // { name, type, data, title }

  // Ref to prevent circular loops during remote sync application
  const isApplyingRemoteRef = useRef(false);

  // Load initial local data
  useEffect(() => {
    seedInitialData();
    const loadedIncomes = getStoredData(KEYS.INCOMES, []);
    const loadedExpenses = getStoredData(KEYS.EXPENSES, []);
    const loadedCategories = getStoredData(KEYS.CATEGORIES, []);
    const loadedBalance = getStoredInitialBalance();

    setIncomes(loadedIncomes);
    setExpenses(loadedExpenses);
    setCategories(loadedCategories);
    setInitialBalanceState(loadedBalance);
  }, []);

  // Sync to local storage & trigger push to Cloud / TabSync
  const syncAndPersist = (updatedIncomes, updatedExpenses, updatedCategories, updatedBalance) => {
    const inc = updatedIncomes !== undefined ? updatedIncomes : incomes;
    const exp = updatedExpenses !== undefined ? updatedExpenses : expenses;
    const cat = updatedCategories !== undefined ? updatedCategories : categories;
    const bal = updatedBalance !== undefined ? updatedBalance : initialBalance;

    saveStoredData(KEYS.INCOMES, inc);
    saveStoredData(KEYS.EXPENSES, exp);
    saveStoredData(KEYS.CATEGORIES, cat);
    setStoredInitialBalance(bal);

    if (!isApplyingRemoteRef.current) {
      setSyncStatus('syncing');
      pushToCloudSync(syncCodeState, {
        incomes: inc,
        expenses: exp,
        categories: cat,
        initialBalance: bal
      }).then(() => {
        setSyncStatus('connected');
        setLastSyncedAt(new Date());
      }).catch(() => {
        setSyncStatus('offline');
      });
    }
  };

  // Listen to remote changes from Cloud & local tab BroadcastChannel
  useEffect(() => {
    // 1. Cross-tab local listener
    const cleanupTabSync = setupLocalTabSync((payload) => {
      if (payload) {
        isApplyingRemoteRef.current = true;
        if (payload.incomes) {
          setIncomes(payload.incomes);
          saveStoredData(KEYS.INCOMES, payload.incomes);
        }
        if (payload.expenses) {
          setExpenses(payload.expenses);
          saveStoredData(KEYS.EXPENSES, payload.expenses);
        }
        if (payload.categories) {
          setCategories(payload.categories);
          saveStoredData(KEYS.CATEGORIES, payload.categories);
        }
        if (payload.initialBalance !== undefined) {
          setInitialBalanceState(payload.initialBalance);
          setStoredInitialBalance(payload.initialBalance);
        }
        setLastSyncedAt(new Date());
        setTimeout(() => { isApplyingRemoteRef.current = false; }, 100);
      }
    });

    // 2. Cloud Snapshot Listener across PC & Mobile
    const cleanupCloudSync = subscribeToCloudSync(syncCodeState, (remoteData) => {
      if (remoteData) {
        isApplyingRemoteRef.current = true;
        setSyncStatus('syncing');

        if (Array.isArray(remoteData.incomes)) {
          setIncomes(remoteData.incomes);
          saveStoredData(KEYS.INCOMES, remoteData.incomes);
        }
        if (Array.isArray(remoteData.expenses)) {
          setExpenses(remoteData.expenses);
          saveStoredData(KEYS.EXPENSES, remoteData.expenses);
        }
        if (Array.isArray(remoteData.categories)) {
          setCategories(remoteData.categories);
          saveStoredData(KEYS.CATEGORIES, remoteData.categories);
        }
        if (typeof remoteData.initialBalance === 'number') {
          setInitialBalanceState(remoteData.initialBalance);
          setStoredInitialBalance(remoteData.initialBalance);
        }

        setSyncStatus('connected');
        setLastSyncedAt(new Date());
        setTimeout(() => { isApplyingRemoteRef.current = false; }, 100);
      }
    });

    return () => {
      cleanupTabSync();
      cleanupCloudSync();
    };
  }, [syncCodeState]);

  // Method to update Sync Code (pairing PC with Mobile)
  const updateSyncCode = (newCode) => {
    const formatted = setSyncCode(newCode);
    if (formatted) {
      setSyncCodeState(formatted);
      // Immediately push current local data to new cloud doc
      pushToCloudSync(formatted, {
        incomes,
        expenses,
        categories,
        initialBalance
      });
    }
  };

  // State Updaters
  const updateIncomes = (newIncomes) => {
    setIncomes(newIncomes);
    syncAndPersist(newIncomes, expenses, categories, initialBalance);
  };

  const updateExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    syncAndPersist(incomes, newExpenses, categories, initialBalance);
  };

  const updateCategories = (newCategories) => {
    setCategories(newCategories);
    syncAndPersist(incomes, expenses, newCategories, initialBalance);
  };

  const updateInitialBalance = (amount) => {
    const num = parseFloat(amount) || 0;
    setInitialBalanceState(num);
    syncAndPersist(incomes, expenses, categories, num);
  };

  // CRUD Income
  const addIncome = (incomeData) => {
    const newIncome = {
      id: `inc-${Date.now()}`,
      reconciliationStatus: incomeData.hasAttachment ? 'RECONCILED' : 'MANUAL',
      ...incomeData
    };
    updateIncomes([newIncome, ...incomes]);
  };

  const editIncome = (id, updatedData) => {
    const updated = incomes.map(item => item.id === id ? { ...item, ...updatedData } : item);
    updateIncomes(updated);
  };

  const deleteIncome = (id) => {
    updateIncomes(incomes.filter(item => item.id !== id));
  };

  // CRUD Expense
  const addExpense = (expenseData) => {
    const newExpense = {
      id: `exp-${Date.now()}`,
      reconciliationStatus: expenseData.hasAttachment ? 'RECONCILED' : (expenseData.reconciliationStatus || 'MANUAL'),
      ...expenseData
    };
    updateExpenses([newExpense, ...expenses]);
  };

  const editExpense = (id, updatedData) => {
    const updated = expenses.map(item => item.id === id ? { ...item, ...updatedData } : item);
    updateExpenses(updated);
  };

  const deleteExpense = (id) => {
    updateExpenses(expenses.filter(item => item.id !== id));
  };

  // CRUD Category & Budget
  const addCategory = (catData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      isSystem: false,
      ...catData
    };
    updateCategories([...categories, newCat]);
  };

  const updateCategoryBudget = (catId, newLimit) => {
    const updated = categories.map(cat => cat.id === catId ? { ...cat, budgetLimit: parseFloat(newLimit) || 0 } : cat);
    updateCategories(updated);
  };

  const deleteCategory = (id) => {
    updateCategories(categories.filter(cat => cat.id !== id));
  };

  // Financial Analysis computations
  const financials = calculateFinancials(incomes, expenses, categories, initialBalance);

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        expenses,
        categories,
        financials,
        activeTab,
        setActiveTab,
        // Initial Balance
        initialBalance,
        updateInitialBalance,
        // Real-time Cloud Sync
        syncCode: syncCodeState,
        updateSyncCode,
        syncStatus,
        lastSyncedAt,
        // Income CRUD
        addIncome,
        editIncome,
        deleteIncome,
        // Expense CRUD
        addExpense,
        editExpense,
        deleteExpense,
        // Category CRUD & Budget
        addCategory,
        updateCategoryBudget,
        deleteCategory,
        // Modals
        isQuickActionOpen,
        setIsQuickActionOpen,
        quickActionType,
        setQuickActionType,
        openQuickAction: (type = 'expense') => {
          setQuickActionType(type);
          setIsQuickActionOpen(true);
        },
        viewAttachmentModal,
        setViewAttachmentModal,
        openAttachmentViewer: (attachmentObj, itemTitle) => {
          setViewAttachmentModal({
            title: itemTitle,
            name: attachmentObj.attachmentName,
            type: attachmentObj.attachmentType,
            data: attachmentObj.attachmentData
          });
        }
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
