export interface TaxCalculationRequest {
  userEmail: string;
  title: string;
  description: string;
  salary: number;
  interestIncome: number;
  dividend: number;
  capitalGain: number;
  bonus: number;
  retirementAnnuity: number;
  taxAlreadyPaid: number;
  age: number;
}
