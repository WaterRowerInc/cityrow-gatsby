import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { TransactionsService } from "../../domain/subscriptions/TransactionsServices";
import { TransactionRecord } from "../../domain/subscriptions/TransactionRecord";

export class GetTransactionsHistory {
  private readonly transactionsService: TransactionsService;

  constructor(transactionsService: TransactionsService) {
    this.transactionsService = transactionsService;
  }

  execute = async (): Promise<TransactionRecord[]> => {
    try {
      return await this.transactionsService.getTransactionsHistory();
    } catch (error: any) {
      throw new NotExpectedError(error.message);
    }
  };
}
