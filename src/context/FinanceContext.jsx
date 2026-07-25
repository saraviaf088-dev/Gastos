import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredData, saveStoredData, seedInitialData, KEYS, getStoredInitialBalance, setStoredInitialBalance } from '../utils/storage';
import { calculateFinancials } from '../utils/calculations';
import { setupLocalTabSync, notifyLocalTabs } from '../utils/cloudSync';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [initialBalance, setInitialBalanceState] = useState(0);
  
  // Modals state
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState('expense');
  const [viewAttachmentModal, setViewAttachmentModal] = useState(null); // { name, type, data, title }

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

  // Sync to local storage & notify other tabs
  const syncAndPersist = (updatedIncomes, updatedExpenses, updatedCategories, updatedBalance) => {
    const inc = updatedIncomes !== undefined ? updatedIncomes : incomes;
    const exp = updatedExpenses !== undefined ? updatedExpenses : expenses;
    const cat = updatedCategories !== undefined ? updatedCategories : categories;
    const bal = updatedBalance !== undefined ? updatedBalance : initialBalance;

    saveStoredData(KEYS.INCOMES, inc);
    saveStoredData(KEYS.EXPENSES, exp);
    saveStoredData(KEYS.CATEGORIES, cat);
    setStoredInitialBalance(bal);

    notifyLocalTabs({
      incomes: inc,
      expenses: exp,
      categories: cat,
      initialBalance: bal
    });
  };

  // Listen to remote changes from other local tabs via BroadcastChannel
  useEffect(() => {
    const cleanupTabSync = setupLocalTabSync((payload) => {
      if (payload) {
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
      }
    });

    return () => {
      cleanupTabSync();
    };
  }, []);

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
