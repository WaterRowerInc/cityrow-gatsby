import React from "react";
import "./TransactionHistorySection.scss";
import { TransactionRecordVM } from "./TransactionRecordVM";
import { TransactionRecordItem } from "./TransactionRecordItem";

export const TransactionHistorySection = ({ transactionRecords }: { transactionRecords?: TransactionRecordVM[] }) => {
  return (
    <>
      <div className='transaction-history-section__'>
        <div className='transaction-history-section__container__'>
          <div className='transaction-history-section__container__box'>
            <span className='transaction-history-section__container__title'>TRANSACTION HISTORY</span>
          </div>
          <div className='transaction-history-section__container__box transaction-history-section__records'>
            {transactionRecords?.length ? (
              transactionRecords?.map((record: TransactionRecordVM, index: number) => (
                <TransactionRecordItem record={record} key={`tr-${index}`} />
              ))
            ) : (
              <div className='transaction-history-section__no-records'>You have no transaction history to view yet</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
