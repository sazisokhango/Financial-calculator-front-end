export interface InvestmentForecastRequest {
  userId: number;
  title: string;
  description: string;
  initialAmount: number;
  monthlyContribution: number;
  termMonths: number;
  annualInterestRate: number;
}
