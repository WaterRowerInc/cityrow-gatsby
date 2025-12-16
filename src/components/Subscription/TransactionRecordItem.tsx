import { TransactionRecordVM } from "./TransactionRecordVM";
import React from "react";

export const TransactionRecordItem = ({ record }: { record: TransactionRecordVM }) => {
  return (
    <div className={"transaction-history-section__record__"}>
      <h5 className={"transaction-history-section__record__type"}>{record.type}</h5>
      <div className={"transaction-history-section__record__subtitle"}>
        <h5 className={"transaction-history-section__record__date"}>{record.date}</h5>
        <h5 className={"transaction-history-section__record__dotted"}>
          ·····························································
        </h5>
        <h5 className={"transaction-history-section__record__amount"}>{record.amount}</h5>
      </div>
    </div>
  );
};
