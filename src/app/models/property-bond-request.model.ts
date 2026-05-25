export interface PropertyBondRequest {
  userEmail: string;
  title: string;
  description: string;
  initialAmount: number;
  monthlyContribution: number;
  termMonths: number;
  interestRate: number;
}
