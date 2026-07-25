// Calculation Utilities for Financial Analysis & Optimization Engine

export const calculateFinancials = (incomes = [], expenses = [], categories = []) => {
  // Current month filter or total
  const totalIncome = incomes.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
  const totalExpense = expenses.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((netBalance / totalIncome) * 100)) : 0;

  // Breakdown by Category
  const expenseByCategory = {};
  const antExpenses = [];
  let totalAntExpenseAmount = 0;
  let reconciledCount = 0;
  let pendingReceiptCount = 0;
  let manualCount = 0;

  expenses.forEach(exp => {
    const amount = parseFloat(exp.amount) || 0;
    const catName = exp.category || 'Otros';

    if (!expenseByCategory[catName]) {
      expenseByCategory[catName] = 0;
    }
    expenseByCategory[catName] += amount;

    if (exp.isAntExpense) {
      antExpenses.push(exp);
      totalAntExpenseAmount += amount;
    }

    if (exp.reconciliationStatus === 'RECONCILED' || exp.hasAttachment) {
      reconciledCount++;
    } else if (exp.reconciliationStatus === 'PENDING') {
      pendingReceiptCount++;
    } else {
      manualCount++;
    }
  });

  // Category Budget Auditing & Alerts
  const categoryStatusList = categories
    .filter(cat => cat.type === 'expense' && cat.budgetLimit > 0)
    .map(cat => {
      const spent = expenseByCategory[cat.name] || 0;
      const limit = parseFloat(cat.budgetLimit) || 0;
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;
      
      let status = 'SAFE'; // SAFE (< 75%), WARNING (75%-99%), EXCEEDED (>= 100%)
      if (percentage >= 100) {
        status = 'EXCEEDED';
      } else if (percentage >= 75) {
        status = 'WARNING';
      }

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        color: cat.color,
        icon: cat.icon,
        limit,
        spent,
        remaining: Math.max(0, limit - spent),
        overspendAmount: spent > limit ? spent - limit : 0,
        percentage: Math.min(percentage, 999), // Cap for display safety
        status
      };
    });

  // Active Alerts List
  const activeAlerts = [];
  categoryStatusList.forEach(cat => {
    if (cat.status === 'EXCEEDED') {
      activeAlerts.push({
        id: `alert-exc-${cat.categoryId}`,
        type: 'CRITICAL',
        title: `¡Presupuesto Excedido en ${cat.categoryName}!`,
        message: `Has superado el límite fijado ($${cat.limit.toLocaleString()}) con un total consumido de $${cat.spent.toLocaleString()} (+${cat.percentage.toFixed(0)}%).`,
        category: cat.categoryName,
        date: new Date().toLocaleDateString('es-ES')
      });
    } else if (cat.status === 'WARNING') {
      activeAlerts.push({
        id: `alert-warn-${cat.categoryId}`,
        type: 'WARNING',
        title: `Alerta de Umbral en ${cat.categoryName}`,
        message: `Has consumido el ${cat.percentage.toFixed(1)}% de tu presupuesto. Te quedan solo $${cat.remaining.toLocaleString()}.`,
        category: cat.categoryName,
        date: new Date().toLocaleDateString('es-ES')
      });
    }
  });

  if (totalAntExpenseAmount > (totalIncome * 0.05) && totalIncome > 0) {
    activeAlerts.push({
      id: 'alert-ant-high',
      type: 'INFO',
      title: 'Detección de Gastos Hormiga Elevados',
      message: `Tus pequeños gastos acumulados suman $${totalAntExpenseAmount.toLocaleString()} (${((totalAntExpenseAmount / totalExpense) * 100).toFixed(1)}% de tus gastos totales).`,
      category: 'Gastos Hormiga',
      date: new Date().toLocaleDateString('es-ES')
    });
  }

  // 50 / 30 / 20 Rule Analysis
  // Needs: Alimentación, Vivienda, Servicios, Salud, Transporte
  // Wants: Entretenimiento, Suscripciones, Gastos Hormiga
  // Savings: Inversiones, Educación
  let needsSpent = 0;
  let wantsSpent = 0;
  let savingsSpent = 0;

  Object.entries(expenseByCategory).forEach(([catName, amount]) => {
    const nameLower = catName.toLowerCase();
    if (nameLower.includes('alimento') || nameLower.includes('vivienda') || nameLower.includes('servicio') || nameLower.includes('salud') || nameLower.includes('transporte')) {
      needsSpent += amount;
    } else if (nameLower.includes('entretenimiento') || nameLower.includes('suscripció') || nameLower.includes('hormiga') || nameLower.includes('capricho')) {
      wantsSpent += amount;
    } else {
      savingsSpent += amount;
    }
  });

  const targetNeeds = totalIncome * 0.50;
  const targetWants = totalIncome * 0.30;
  const targetSavings = totalIncome * 0.20;

  // Financial Health Score calculation (0 - 100)
  let healthScore = 100;
  if (totalExpense > totalIncome) healthScore -= 40;
  if (savingsRate < 10) healthScore -= 20;
  else if (savingsRate < 20) healthScore -= 10;

  const exceededCount = categoryStatusList.filter(c => c.status === 'EXCEEDED').length;
  healthScore -= (exceededCount * 15);

  if (totalAntExpenseAmount > 300) healthScore -= 10;
  healthScore = Math.max(10, Math.min(100, healthScore));

  // Optimization & Savings Suggestions
  const recommendations = [];

  // Rec 1: Reduce top variable expense
  const sortedExpenses = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .filter(([name]) => !name.toLowerCase().includes('alquiler') && !name.toLowerCase().includes('vivienda'));

  if (sortedExpenses.length > 0) {
    const [topCat, topAmount] = sortedExpenses[0];
    const cut15 = topAmount * 0.15;
    const cut30 = topAmount * 0.30;
    recommendations.push({
      id: 'rec-1',
      impact: 'HIGH',
      title: `Optimizar gasto en ${topCat}`,
      description: `Actualmente gastas $${topAmount.toLocaleString()} en esta categoría. Reduciendo un 20% ahorrarías $${(topAmount * 0.2).toFixed(0)}/mes ($${(topAmount * 0.2 * 12).toFixed(0)} al año).`,
      potentialMonthlySavings: topAmount * 0.2,
      actionStep: `Establece un techo semanal de $${((topAmount * 0.8) / 4).toFixed(0)}.`
    });
  }

  // Rec 2: Eliminate or consolidate Ant-Expenses
  if (totalAntExpenseAmount > 0) {
    recommendations.push({
      id: 'rec-2',
      impact: 'MEDIUM',
      title: 'Fuga de capital por Gastos Hormiga',
      description: `Tienes $${totalAntExpenseAmount.toLocaleString()} registrados en micro-gastos (cafés, snacks, impulsos). Eliminando la mitad recuperas $${(totalAntExpenseAmount * 0.5).toFixed(0)}/mes.`,
      potentialMonthlySavings: totalAntExpenseAmount * 0.5,
      actionStep: 'Prepara tus snacks/cafés en casa o fija una cuota semanal en efectivo estricta.'
    });
  }

  // Rec 3: Reallocate to reach 20% savings rule
  if (savingsRate < 20 && totalIncome > 0) {
    const gap = targetSavings - netBalance;
    if (gap > 0) {
      recommendations.push({
        id: 'rec-3',
        impact: 'CRITICAL',
        title: 'Impulsar el Fondo de Reserva (Regla 20%)',
        description: `Tu tasa actual de ahorro es del ${savingsRate.toFixed(1)}%. Para llegar a la meta óptima del 20% ($${targetSavings.toFixed(0)}), necesitas ajustar tu gasto global en $${gap.toFixed(0)}/mes.`,
        potentialMonthlySavings: gap,
        actionStep: 'Automatiza la transferencia del 20% de tu sueldo a una cuenta de ahorro el primer día de cobro.'
      });
    }
  }

  return {
    totalIncome,
    totalExpense,
    netBalance,
    savingsRate,
    expenseByCategory,
    antExpenses,
    totalAntExpenseAmount,
    reconciliationStats: {
      totalCount: expenses.length,
      reconciledCount,
      pendingReceiptCount,
      manualCount,
      reconciledPercent: expenses.length > 0 ? (reconciledCount / expenses.length) * 100 : 0
    },
    categoryStatusList,
    activeAlerts,
    rule503020: {
      needs: { spent: needsSpent, target: targetNeeds, percent: totalIncome > 0 ? (needsSpent / totalIncome) * 100 : 0 },
      wants: { spent: wantsSpent, target: targetWants, percent: totalIncome > 0 ? (wantsSpent / totalIncome) * 100 : 0 },
      savings: { spent: savingsSpent, target: targetSavings, percent: totalIncome > 0 ? (savingsSpent / totalIncome) * 100 : 0 }
    },
    healthScore,
    recommendations
  };
};
