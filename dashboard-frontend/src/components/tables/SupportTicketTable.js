import React from "react";
import Table from "../common/Table";

const SupportTicketTable = ({
  supportTickets,
  highlightedRow,
  itemsPerPage,
}) => {
  const columns = [
    { header: "ID", accessor: (row) => row.id, isId: true },
    {
      header: "User",
      accessor: (row) => (row.user ? row.user.username : "N/A"),
    },
    { header: "Subject", accessor: (row) => row.subject, truncate: true },
    { header: "Status", accessor: (row) => row.status },
    {
      header: "Created At",
      accessor: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  const supportTicketsWithType = supportTickets.map((ticket) => ({
    ...ticket,
    type: "supportTickets",
  }));

  return (
    <div>
      {" "}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Support Tickets ({supportTickets.length})
      </h2>
      <Table
        columns={columns}
        data={supportTicketsWithType}
        highlightedRow={highlightedRow}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default SupportTicketTable;
