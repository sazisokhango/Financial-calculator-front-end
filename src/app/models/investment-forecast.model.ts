export interface MonthlyProjection {
  month: number;
  startingBalance: number;
  monthlyContribution: number;
  interestEarned: number;
  endingBalance: number;
}

export interface InvestmentForecast {
  id: number;
  userId: number;
  title: string;
  description: string;
  initialAmount: number;
  monthlyContribution: number;
  termMonths: number;
  annualInterestRate: number;
  finalProjectedValue: number;
  totalContributions: number;
  totalInterestEarned: number;
  roiPercentage: number;
  averageMonthlyGrowth: number;
  monthlyProjections: MonthlyProjection[];
  createdAt: string;
  updatedAt: string;
}
