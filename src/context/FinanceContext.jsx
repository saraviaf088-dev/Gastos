import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getStoredData, saveStoredData, seedInitialData, KEYS, getStoredInitialBalance, setStoredInitialBalance } from '../utils/storage';
import { calculateFinancials } from '../utils/calculations';
import { 
  getSyncCode, 
  setSyncCode, 
  subscribeToCloudSync, 
  pushToCloudSync, 
  pullFromCloudSync,
  setupLocalTabSync 
} from '../utils/cloudSync';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [initialBalance, setInitialBalanceState] = useState(0);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [monthlySavings, setMonthlySavings] = useState([]);
  
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

  // Load initial local data, then pull latest from Supabase
  useEffect(() => {
    seedInitialData();
    const loadedIncomes = getStoredData(KEYS.INCOMES, []);
    const loadedExpenses = getStoredData(KEYS.EXPENSES, []);
    const loadedCategories = getStoredData(KEYS.CATEGORIES, []);
    const loadedBalance = getStoredInitialBalance();
    const loadedSavingsGoals = getStoredData(KEYS.SAVINGS_GOALS, []);
    const loadedMonthlySavings = getStoredData(KEYS.MONTHLY_SAVINGS, []);

    setIncomes(loadedIncomes);
    setExpenses(loadedExpenses);
    setCategories(loadedCategories);
    setInitialBalanceState(loadedBalance);
    setSavingsGoals(loadedSavingsGoals);
    setMonthlySavings(loadedMonthlySavings);

    // Pull from Supabase — if remote has data, use it (remote wins on first load)
    pullFromCloudSync(getSyncCode()).then((remote) => {
      if (remote && (remote.incomes.length > 0 || remote.expenses.length > 0 || remote.initialBalance > 0)) {
        console.log('[INIT] Applying remote data from Supabase');
        isApplyingRemoteRef.current = true;
        setIncomes(remote.incomes);
        setExpenses(remote.expenses);
        setCategories(remote.categories);
        setInitialBalanceState(remote.initialBalance);
        saveStoredData(KEYS.INCOMES, remote.incomes);
        saveStoredData(KEYS.EXPENSES, remote.expenses);
        saveStoredData(KEYS.CATEGORIES, remote.categories);
        setStoredInitialBalance(remote.initialBalance);
        setTimeout(() => { isApplyingRemoteRef.current = false; }, 500);
      } else {
        // No remote data — push local data to cloud
        console.log('[INIT] No remote data, pushing local to cloud');
        pushToCloudSync(getSyncCode(), {
          incomes: loadedIncomes,
          expenses: loadedExpenses,
          categories: loadedCategories,
          initialBalance: loadedBalance
        });
      }
    });
  }, []);

  // Sync to local storage & trigger push to Cloud / TabSync
  const syncAndPersist = (updatedIncomes, updatedExpenses, updatedCategories, updatedBalance, updatedSavingsGoals, updatedMonthlySavings) => {
    const inc = updatedIncomes !== undefined ? updatedIncomes : incomes;
    const exp = updatedExpenses !== undefined ? updatedExpenses : expenses;
    const cat = updatedCategories !== undefined ? updatedCategories : categories;
    const bal = updatedBalance !== undefined ? updatedBalance : initialBalance;
    const goals = updatedSavingsGoals !== undefined ? updatedSavingsGoals : savingsGoals;
    const monthly = updatedMonthlySavings !== undefined ? updatedMonthlySavings : monthlySavings;

    saveStoredData(KEYS.INCOMES, inc);
    saveStoredData(KEYS.EXPENSES, exp);
    saveStoredData(KEYS.CATEGORIES, cat);
    setStoredInitialBalance(bal);
    saveStoredData(KEYS.SAVINGS_GOALS, goals);
    saveStoredData(KEYS.MONTHLY_SAVINGS, monthly);

    if (!isApplyingRemoteRef.current) {
      setSyncStatus('syncing');
      pushToCloudSync(syncCodeState, {
        incomes: inc,
        expenses: exp,
        categories: cat,
        initialBalance: bal,
        savingsGoals: goals,
        monthlySavings: monthly
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
        setTimeout(() => { isApplyingRemoteRef.current = false; }, 500);
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
        setTimeout(() => { isApplyingRemoteRef.current = false; }, 500);
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

  // CRUD Savings Goals
  const addSavingsGoal = (goalData) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
      ...goalData
    };
    const updated = [newGoal, ...savingsGoals];
    setSavingsGoals(updated);
    syncAndPersist(incomes, expenses, categories, initialBalance, updated, monthlySavings);
  };

  const editSavingsGoal = (id, updatedData) => {
    const updated = savingsGoals.map(goal => goal.id === id ? { ...goal, ...updatedData } : goal);
    setSavingsGoals(updated);
    syncAndPersist(incomes, expenses, categories, initialBalance, updated, monthlySavings);
  };

  const deleteSavingsGoal = (id) => {
    const updated = savingsGoals.filter(goal => goal.id !== id);
    setSavingsGoals(updated);
    syncAndPersist(incomes, expenses, categories, initialBalance, updated, monthlySavings);
  };

  const addToSavingsGoal = (id, amount) => {
    const numAmount = parseFloat(amount) || 0;
    const updated = savingsGoals.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: (goal.currentAmount || 0) + numAmount }
        : goal
    );
    setSavingsGoals(updated);
    syncAndPersist(incomes, expenses, categories, initialBalance, updated, monthlySavings);
  };

  // CRUD Monthly Savings
  const addMonthlySaving = (savingData) => {
    const newSaving = {
      id: `msav-${Date.now()}`,
      ...savingData
    };
    const updated = [newSaving, ...monthlySavings];
    setMonthlySavings(updated);
    syncAndPersist(incomes, expenses, categories, initialBalance, savingsGoals, updated);
  };

  const editMonthlySaving = (id, updatedData) => {
    const updated = monthlySavings.map(sav => sav.id === id ? { ...sav, ...updatedData } : sav);
    setMonthlySavings(updated);
    syncAndPersist(incomes, expenses, categories, initialBalance, savingsGoals, updated);
  };

  const deleteMonthlySaving = (id) => {
    const updated = monthlySavings.filter(sav => sav.id !== id);
    setMonthlySavings(updated);
    syncAndPersist(incomes, expenses, categories, initialBalance, savingsGoals, updated);
  };

  // Get monthly savings summary
  const getMonthlySavingsSummary = () => {
    const summary = {};
    monthlySavings.forEach(sav => {
      const monthKey = sav.date ? sav.date.substring(0, 7) : 'unknown';
      if (!summary[monthKey]) {
        summary[monthKey] = { income: 0, expense: 0, saved: 0 };
      }
      summary[monthKey].saved += parseFloat(sav.amount) || 0;
    });

    incomes.forEach(inc => {
      const monthKey = inc.date ? inc.date.substring(0, 7) : 'unknown';
      if (!summary[monthKey]) {
        summary[monthKey] = { income: 0, expense: 0, saved: 0 };
      }
      summary[monthKey].income += parseFloat(inc.amount) || 0;
    });

    expenses.forEach(exp => {
      const monthKey = exp.date ? exp.date.substring(0, 7) : 'unknown';
      if (!summary[monthKey]) {
        summary[monthKey] = { income: 0, expense: 0, saved: 0 };
      }
      summary[monthKey].expense += parseFloat(exp.amount) || 0;
    });

    Object.keys(summary).forEach(key => {
      if (key !== 'unknown') {
        summary[key].netSavings = summary[key].income - summary[key].expense + summary[key].saved;
      }
    });

    return summary;
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
        // Savings Goals
        savingsGoals,
        addSavingsGoal,
        editSavingsGoal,
        deleteSavingsGoal,
        addToSavingsGoal,
        // Monthly Savings
        monthlySavings,
        addMonthlySaving,
        editMonthlySaving,
        deleteMonthlySaving,
        getMonthlySavingsSummary,
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
