export interface CarLoanRequest {
  userId: number;
  title: string;
  description: string;
  purchasePrice: number;
  initialDeposit: number;
  onceOffFee: number;
  adminFee: number;
  balloonPayment: number;
  termMonths: number;
  interestRate: number;
}
