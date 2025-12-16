import { TransactionsService } from "./../../domain/subscriptions/TransactionsServices";
import { GetTransactionsHistory } from "./GetTransactionsHistory";
import { instance, mock, verify, when } from "ts-mockito";
import { NotExpectedError } from "../../domain/orders/NotExpectedError";
import { expectThrows } from "../../../utils/testing/expectThrows";

describe("GetTransactionsHistory should", () => {
  it("retrieve the user's transaction history", async () => {
    await getTransactionsHistory().execute();

    verify(transactionService.getTransactionsHistory()).called();
  });

  it("fail if get transactions history fails", async () => {
    when(transactionService.getTransactionsHistory()).thenThrow(new NotExpectedError("Not Expected Error"));

    await expectThrows(async () => {
      await getTransactionsHistory().execute();
    }, NotExpectedError);
  });

  beforeEach(() => {
    transactionService = mock<TransactionsService>();
  });

  function getTransactionsHistory(): GetTransactionsHistory {
    return new GetTransactionsHistory(instance(transactionService));
  }

  let transactionService: TransactionsService;
});
