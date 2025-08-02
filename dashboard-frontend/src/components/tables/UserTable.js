import React from "react";
import Table from "../common/Table";

const UserTable = ({ users, highlightedRow, itemsPerPage }) => {
  const columns = [
    { header: "ID", accessor: (row) => row.id, isId: true },
    { header: "Username", accessor: (row) => row.username },
    { header: "Email", accessor: (row) => row.email },
    {
      header: "Registration Date",
      accessor: (row) => new Date(row.registration_date).toLocaleDateString(),
    },
  ];

  const usersWithType = users.map((user) => ({ ...user, type: "users" }));

  return (
    <div>
      {" "}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Users ({users.length})
      </h2>
      <Table
        columns={columns}
        data={usersWithType}
        highlightedRow={highlightedRow}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default UserTable;
