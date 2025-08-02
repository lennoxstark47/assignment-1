import React from "react";
import Table from "../common/Table";

const OrderTable = ({ orders, highlightedRow, itemsPerPage }) => {
  const columns = [
    { header: "ID", accessor: (row) => row.id, isId: true },
    {
      header: "User",
      accessor: (row) => (row.user ? row.user.username : "N/A"),
    },
    {
      header: "Order Date",
      accessor: (row) => new Date(row.order_date).toLocaleDateString(),
    },
    {
      header: "Total Amount",
      accessor: (row) => `$${parseFloat(row.total_amount).toFixed(2)}`,
    },
    { header: "Status", accessor: (row) => row.status },
  ];
  const ordersWithType = orders.map((order) => ({ ...order, type: "orders" }));
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Orders ({orders.length})
      </h2>
      <Table
        columns={columns}
        data={ordersWithType}
        highlightedRow={highlightedRow}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default OrderTable;
