import { TransactionRecord } from "../../domain/subscriptions/TransactionRecord";
import { TransactionsService } from "../../domain/subscriptions/TransactionsServices";
import { HttpClient } from "./HttpClient";

export class HttpTransactionsService implements TransactionsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getTransactionsHistory = async (): Promise<TransactionRecord[]> => {
    const response = await this.httpClient.get("v2/transaction-history/");
    return response?.data?.items?.map(this.jsonToTransaction);
  };

  jsonToTransaction = (json: any): TransactionRecord => ({
    type: json?.type,
    date: json?.date,
    amount: json?.amount/100,
  });
}
