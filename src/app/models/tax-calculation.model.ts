export interface TaxCalculation {
  id: number;
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
  totalGrossIncome: number;
  totalDeductions: number;
  netTaxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  finalTaxLiability: number;
  createdAt: string;
  updatedAt: string;
}
