import { TransactionRecord } from "./TransactionRecord";
export interface TransactionsService {
  getTransactionsHistory(): Promise<TransactionRecord[]>;
}
