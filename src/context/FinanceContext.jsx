import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredData, saveStoredData, seedInitialData, KEYS, getStoredInitialBalance, setStoredInitialBalance } from '../utils/storage';
import { calculateFinancials } from '../utils/calculations';

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

  // Load and seed initial data
  useEffect(() => {
    seedInitialData();
    setIncomes(getStoredData(KEYS.INCOMES, []));
    setExpenses(getStoredData(KEYS.EXPENSES, []));
    setCategories(getStoredData(KEYS.CATEGORIES, []));
    setInitialBalanceState(getStoredInitialBalance());
  }, []);

  // Sync to local storage
  const updateIncomes = (newIncomes) => {
    setIncomes(newIncomes);
    saveStoredData(KEYS.INCOMES, newIncomes);
  };

  const updateExpenses = (newExpenses) => {
    setExpenses(newExpenses);
    saveStoredData(KEYS.EXPENSES, newExpenses);
  };

  const updateCategories = (newCategories) => {
    setCategories(newCategories);
    saveStoredData(KEYS.CATEGORIES, newCategories);
  };

  const updateInitialBalance = (amount) => {
    const num = parseFloat(amount) || 0;
    setInitialBalanceState(num);
    setStoredInitialBalance(num);
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
