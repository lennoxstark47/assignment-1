import React from "react";
import Table from "../common/Table";

const TransactionTable = ({ transactions, highlightedRow, itemsPerPage }) => {
  const columns = [
    { header: "ID", accessor: (row) => row.id, isId: true },
    { header: "Order ID", accessor: (row) => row.order_id },
    {
      header: "Transaction Date",
      accessor: (row) => new Date(row.transaction_date).toLocaleDateString(),
    },
    {
      header: "Amount",
      accessor: (row) => `$${parseFloat(row.amount).toFixed(2)}`,
    },
    { header: "Payment Method", accessor: (row) => row.payment_method },
  ];

  const transactionsWithType = transactions.map((transaction) => ({
    ...transaction,
    type: "transactions",
  }));

  return (
    <div>
      {" "}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Transactions ({transactions.length})
      </h2>
      <Table
        columns={columns}
        data={transactionsWithType}
        highlightedRow={highlightedRow}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default TransactionTable;
