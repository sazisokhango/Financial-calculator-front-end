export interface BondMonthlyProjection {
  month: number;
  startingBalance: number;
  monthlyPayment: number;
  interestCharged: number;
  principalPaid: number;
  endingBalance: number;
}

export interface BondForecastResult {
  totalLoanAmount: number;
  totalRepayments: number;
  totalInterestPaid: number;
  remainingBalance: number;
  estimatedPayoffMonth: number;
  fullyPaid: boolean;
}

export interface PropertyBond {
  id: number;
  userEmail: string;
  title: string;
  description: string;
  initialAmount: number;
  monthlyContribution: number;
  termMonths: number;
  interestRate: number;
  forecastResults: BondForecastResult;
  monthlyProjection: BondMonthlyProjection[];
}
