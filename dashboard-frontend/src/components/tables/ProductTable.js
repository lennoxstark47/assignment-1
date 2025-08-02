import React from "react";
import Table from "../common/Table";

const ProductTable = ({ products, highlightedRow, itemsPerPage }) => {
  const columns = [
    { header: "ID", accessor: (row) => row.id, isId: true },
    { header: "Name", accessor: (row) => row.name },
    {
      header: "Description",
      accessor: (row) => row.description,
      truncate: true,
    },
    {
      header: "Price",
      accessor: (row) => `$${parseFloat(row.price).toFixed(2)}`,
    },
    { header: "Stock", accessor: (row) => row.stock_quantity },
  ];

  const productsWithType = products.map((product) => ({
    ...product,
    type: "products",
  }));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Products ({products.length})
      </h2>
      <Table
        columns={columns}
        data={productsWithType}
        highlightedRow={highlightedRow}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default ProductTable;
