const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const db = require("./models");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/users", async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await db.Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      include: [
        { model: db.User, as: "user", attributes: ["username", "email"] },
      ],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await db.Transaction.findAll({
      include: [
        {
          model: db.Order,
          as: "order",
          attributes: ["total_amount", "status"],
        },
      ],
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
});

app.get("/api/support-tickets", async (req, res) => {
  try {
    const supportTickets = await db.SupportTicket.findAll({
      include: [
        { model: db.User, as: "user", attributes: ["username", "email"] },
      ],
    });
    res.json(supportTickets);
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    res.status(500).json({
      message: "Error fetching support tickets",
      error: error.message,
    });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A client connected via Socket.IO:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
  socket.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });
});

const broadcastDataUpdates = async () => {
  try {
    let users = await db.User.findAll();
    let products = await db.Product.findAll();
    let orders = await db.Order.findAll({
      include: [
        { model: db.User, as: "user", attributes: ["username", "email"] },
      ],
    });
    let transactions = await db.Transaction.findAll({
      include: [
        {
          model: db.Order,
          as: "order",
          attributes: ["total_amount", "status"],
        },
      ],
    });
    let supportTickets = await db.SupportTicket.findAll({
      include: [
        { model: db.User, as: "user", attributes: ["username", "email"] },
      ],
    });

    if (products.length > 0) {
      const productToUpdate =
        products[Math.floor(Math.random() * products.length)];
      const newStock = Math.max(
        1,
        productToUpdate.stock_quantity + Math.floor(Math.random() * 21) - 10,
      );
      const newPrice = (
        parseFloat(productToUpdate.price) +
        (Math.random() * 10 - 5)
      ).toFixed(2);
      await db.Product.update(
        { stock_quantity: newStock, price: newPrice },
        { where: { id: productToUpdate.id } },
      );
      const updatedProduct = await db.Product.findByPk(productToUpdate.id);
      products = products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p,
      );
    }

    if (orders.length > 0) {
      const orderToUpdate = orders[Math.floor(Math.random() * orders.length)];
      const statuses = ["Pending", "Completed", "Shipped", "Cancelled"];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      await db.Order.update(
        { status: newStatus },
        { where: { id: orderToUpdate.id } },
      );
      const updatedOrder = await db.Order.findByPk(orderToUpdate.id, {
        include: [
          { model: db.User, as: "user", attributes: ["username", "email"] },
        ],
      });
      orders = orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    }

    if (supportTickets.length > 0) {
      const ticketToUpdate =
        supportTickets[Math.floor(Math.random() * supportTickets.length)];
      const statuses = ["Open", "Closed", "In Progress", "Resolved"];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      await db.SupportTicket.update(
        { status: newStatus },
        { where: { id: ticketToUpdate.id } },
      );
      const updatedTicket = await db.SupportTicket.findByPk(ticketToUpdate.id, {
        include: [
          { model: db.User, as: "user", attributes: ["username", "email"] },
        ],
      });
      supportTickets = supportTickets.map((t) =>
        t.id === updatedTicket.id ? updatedTicket : t,
      );
    }
    if (Math.random() < 0.05) {
      const { faker } = require("@faker-js/faker");
      const newUser = await db.User.create({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        registration_date: faker.date
          .recent({ days: 7 })
          .toISOString()
          .split("T")[0],
      });
      users.push(newUser);
      console.log("Added new user:", newUser.username);
    }
    const dataUpdates = {
      users: users,
      products: products,
      orders: orders,
      transactions: transactions,
      supportTickets: supportTickets,
    };
    io.emit("dashboardUpdate", dataUpdates);
  } catch (error) {
    console.error("Error broadcasting data updates:", error);
  }
};

setInterval(broadcastDataUpdates, 3000);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synchronized.");
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`HTTP: http://localhost:${port}`);
      console.log(`Socket.IO: ws://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database or sync models:", err);
    process.exit(1);
  });
