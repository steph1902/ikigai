/**
 * Budget & Affordability Calculator.
 *
 * Calculates maximum affordable property price based on
 * income, expenses, and Japanese mortgage parameters.
 */

interface AffordabilityInput {
    /** Annual income in yen */
    annualIncome: number;
    /** Monthly expenses (not including housing) in yen */
    monthlyExpenses?: number;
    /** Down payment available in yen */
    downPayment?: number;
    /** Mortgage term in years (default: 35) */
    loanTermYears?: number;
    /** Annual interest rate as decimal (default: 0.005 = 0.5%) */
    annualInterestRate?: number;
    /** Maximum debt-to-income ratio (default: 0.35 = 35%) */
    maxDtiRatio?: number;
}

export interface AffordabilityResult {
    /** Maximum monthly payment in yen */
    maxMonthlyPayment: number;
    /** Maximum loan amount in yen */
    maxLoanAmount: number;
    /** Maximum property price (loan + down payment) */
    maxPropertyPrice: number;
    /** Debt-to-income ratio used */
    dtiRatio: number;
    /** Monthly payment breakdown estimate */
    monthlyBreakdown: {
        mortgage: number;
        managementFee: number;
        repairFund: number;
        total: number;
    };
}

/**
 * Calculate maximum affordable property price.
 */
export function calculateAffordability(
    input: AffordabilityInput,
): AffordabilityResult {
    const loanTermYears = input.loanTermYears ?? 35;
    const annualRate = input.annualInterestRate ?? 0.005;
    const maxDtiRatio = input.maxDtiRatio ?? 0.35;
    const downPayment = input.downPayment ?? 0;
    const monthlyExpenses = input.monthlyExpenses ?? 0;

    const monthlyIncome = input.annualIncome / 12;

    // Max housing payment = income × DTI ratio - existing expenses
    const maxMonthlyPayment = Math.floor(
        monthlyIncome * maxDtiRatio - monthlyExpenses,
    );

    // Subtract estimated management fees (typical: ¥15,000-25,000/month)
    const estimatedFees = 20_000;
    const maxMortgagePayment = maxMonthlyPayment - estimatedFees;

    // Calculate max loan from monthly payment using standard mortgage formula
    const maxLoanAmount = calculateLoanFromPayment(
        Math.max(0, maxMortgagePayment),
        annualRate,
        loanTermYears,
    );

    const maxPropertyPrice = maxLoanAmount + downPayment;

    return {
        maxMonthlyPayment: Math.max(0, maxMonthlyPayment),
        maxLoanAmount: Math.max(0, maxLoanAmount),
        maxPropertyPrice: Math.max(0, maxPropertyPrice),
        dtiRatio: maxDtiRatio,
        monthlyBreakdown: {
            mortgage: Math.max(0, maxMortgagePayment),
            managementFee: 12_000,
            repairFund: 8_000,
            total: Math.max(0, maxMonthlyPayment),
        },
    };
}

/**
 * Calculate maximum loan amount from desired monthly payment.
 * Uses standard amortization formula: P = M × [(1+r)^n - 1] / [r × (1+r)^n]
 */
function calculateLoanFromPayment(
    monthlyPayment: number,
    annualRate: number,
    termYears: number,
): number {
    if (monthlyPayment <= 0) return 0;

    const monthlyRate = annualRate / 12;
    const numPayments = termYears * 12;

    if (monthlyRate === 0) {
        return monthlyPayment * numPayments;
    }

    const factor = Math.pow(1 + monthlyRate, numPayments);
    const loanAmount = monthlyPayment * ((factor - 1) / (monthlyRate * factor));

    return Math.floor(loanAmount);
}

/**
 * Calculate monthly mortgage payment for a given loan.
 */
export function calculateMonthlyPayment(
    loanAmount: number,
    annualRate: number,
    termYears: number,
): number {
    const monthlyRate = annualRate / 12;
    const numPayments = termYears * 12;

    if (monthlyRate === 0) {
        return Math.ceil(loanAmount / numPayments);
    }

    const factor = Math.pow(1 + monthlyRate, numPayments);
    const payment = loanAmount * ((monthlyRate * factor) / (factor - 1));

    return Math.ceil(payment);
}
