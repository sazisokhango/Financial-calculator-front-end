export interface CarLoanForecastResult {
  financedAmount: number;
  monthlyRepayment: number;
  totalRepayments: number;
  totalInterestPaid: number;
  totalFeesPaid: number;
  balloonPayment: number;
  remainingBalance: number;
  estimatedPayoffMonth: number;
  fullyPaid: boolean;
}

export interface CarLoanMonthlyProjection {
  month: number;
  startingBalance: number;
  monthlyRepayment: number;
  interestCharged: number;
  adminFee: number;
  principalPaid: number;
  endingBalance: number;
}

export interface CarLoan {
  id: number;
  title: string;
  description: string;
  purchasePrice: number;
  initialDeposit: number;
  onceOffFee: number;
  adminFee: number;
  balloonPayment: number;
  termMonths: number;
  interestRate: number;
  forecastResults: CarLoanForecastResult;
  monthlyProjection: CarLoanMonthlyProjection[];
}
