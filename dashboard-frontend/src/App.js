import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./App.css";
import UserTable from "./components/tables/UserTable";
import ProductTable from "./components/tables/ProductTable";
import OrderTable from "./components/tables/OrderTable";
import TransactionTable from "./components/tables/TransactionTable";
import SupportTicketTable from "./components/tables/SupportTicketTable";
import ProductGrid from "./components/ProductGrid";
const API_BASE_URL = "http://localhost:3001/api";
const SOCKET_URL = "http://localhost:3001";
function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [productViewMode, setProductViewMode] = useState("table");
  const prevUsersRef = useRef([]);
  const prevProductsRef = useRef([]);
  const prevOrdersRef = useRef([]);
  const prevTransactionsRef = useRef([]);
  const prevSupportTicketsRef = useRef([]);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [
          usersRes,
          productsRes,
          ordersRes,
          transactionsRes,
          supportTicketsRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/users`),
          axios.get(`${API_BASE_URL}/products`),
          axios.get(`${API_BASE_URL}/orders`),
          axios.get(`${API_BASE_URL}/transactions`),
          axios.get(`${API_BASE_URL}/support-tickets`),
        ]);
        setUsers(usersRes.data);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setTransactions(transactionsRes.data);
        setSupportTickets(supportTicketsRes.data);
        prevUsersRef.current = usersRes.data;
        prevProductsRef.current = productsRes.data;
        prevOrdersRef.current = ordersRes.data;
        prevTransactionsRef.current = transactionsRes.data;
        prevSupportTicketsRef.current = supportTicketsRes.data;
        setLoading(false);
      } catch (err) {
        setError("Failed to load initial data.");
        setLoading(false);
      }
    };
    fetchInitialData();
    const socket = io(SOCKET_URL);
    socket.on("connect", () => {});
    socket.on("dashboardUpdate", (data) => {
      const findAndUpdateAndHighlight = (
        newData,
        currentDataRef,
        setStateFn,
        type,
      ) => {
        let updatedId = null;
        let foundNewEntry = false;
        const currentDataMap = new Map(
          currentDataRef.current.map((item) => [item.id, item]),
        );
        let updatedDataSorted = [...newData];
        for (const newItem of newData) {
          const oldItem = currentDataMap.get(newItem.id);
          if (!oldItem) {
            updatedId = newItem.id;
            foundNewEntry = true;
            break;
          }
          if (JSON.stringify(newItem) !== JSON.stringify(oldItem)) {
            updatedId = newItem.id;
            break;
          }
        }
        if (updatedId !== null) {
          const itemToMove = updatedDataSorted.find(
            (item) => item.id === updatedId,
          );
          if (itemToMove) {
            updatedDataSorted = updatedDataSorted.filter(
              (item) => item.id !== updatedId,
            );
            updatedDataSorted.unshift(itemToMove);
          }
        }
        if (!updatedId && newData.length < currentDataRef.current.length) {
          const newDataMap = new Map(newData.map((item) => [item.id, item]));
          for (const oldItem of currentDataRef.current) {
            if (!newDataMap.has(oldItem.id)) {
              break;
            }
          }
        }
        setStateFn(updatedDataSorted);
        currentDataRef.current = updatedDataSorted;
        if (updatedId !== null) {
          setHighlightedRows((prev) => [
            ...prev,
            { id: updatedId, type: type },
          ]);
          setTimeout(() => {
            setHighlightedRows((prev) =>
              prev.filter(
                (row) => !(row.id === updatedId && row.type === type),
              ),
            );
          }, 1000);
        }
      };
      if (data.users)
        findAndUpdateAndHighlight(data.users, prevUsersRef, setUsers, "users");
      if (data.products)
        findAndUpdateAndHighlight(
          data.products,
          prevProductsRef,
          setProducts,
          "products",
        );
      if (data.orders)
        findAndUpdateAndHighlight(
          data.orders,
          prevOrdersRef,
          setOrders,
          "orders",
        );
      if (data.transactions)
        findAndUpdateAndHighlight(
          data.transactions,
          prevTransactionsRef,
          setTransactions,
          "transactions",
        );
      if (data.supportTickets)
        findAndUpdateAndHighlight(
          data.supportTickets,
          prevSupportTicketsRef,
          setSupportTickets,
          "supportTickets",
        );
    });
    socket.on("disconnect", () => {});
    socket.on("connect_error", (err) => {
      setError("Socket.IO connection failed.");
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading dashboard data...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-500">
        Error: {error}
      </div>
    );
  }
  const isRowHighlighted = (rowId, rowType) => {
    return highlightedRows.some((hr) => hr.id === rowId && hr.type === rowType);
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 drop-shadow-lg">
        Real-Time Dashboard 📊
      </h1>
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setProductViewMode("table")}
          className={`
            px-6 py-2 rounded-l-lg text-lg font-medium transition-all duration-300 ease-in-out
            ${productViewMode === "table" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
          `}
        >
          Product Table View
        </button>
        <button
          onClick={() => setProductViewMode("grid")}
          className={`
            px-6 py-2 rounded-r-lg text-lg font-medium transition-all duration-300 ease-in-out
            ${productViewMode === "grid" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
          `}
        >
          Product Grid View
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          {productViewMode === "table" ? (
            <ProductTable
              products={products}
              highlightedRow={isRowHighlighted}
              itemsPerPage={10}
            />
          ) : (
            <ProductGrid
              products={products}
              highlightedRow={isRowHighlighted}
            />
          )}
        </div>
        <UserTable
          users={users}
          highlightedRow={isRowHighlighted}
          itemsPerPage={10}
        />
        <OrderTable
          orders={orders}
          highlightedRow={isRowHighlighted}
          itemsPerPage={10}
        />
        <TransactionTable
          transactions={transactions}
          highlightedRow={isRowHighlighted}
          itemsPerPage={10}
        />
        <SupportTicketTable
          supportTickets={supportTickets}
          highlightedRow={isRowHighlighted}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
export default App;
