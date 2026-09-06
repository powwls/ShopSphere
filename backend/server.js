const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config({ path: "connect.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

function parseJsonValue(value, fallback) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:4173",
      "http://127.0.0.1:4173",
      "http://localhost:4174",
      "http://127.0.0.1:4174",
    ],
    credentials: true,
  })
);
app.use(express.json());

const products = [
  {
    id: 1,
    name: "NovaForge Gaming PC",
    category: "Gaming PCs",
    price: 64999,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    description:
      "A high-performance gaming rig for competitive play, streaming, and creative work.",
  },
  {
    id: 2,
    name: "Apex 27-inch 180Hz Monitor",
    category: "Monitors",
    price: 15999,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    description:
      "Fast refresh, crisp color, and adaptive sync for a smoother competitive setup.",
  },
  {
    id: 3,
    name: "Striker Mechanical Keyboard",
    category: "Keyboards",
    price: 4499,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    description:
      "Hot-swappable mechanical switches, RGB lighting, and a tournament-ready feel.",
  },
  {
    id: 4,
    name: "Vector Wireless Gaming Mouse",
    category: "Mice",
    price: 3299,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    description:
      "Ultra-light wireless precision with a comfortable shape for long sessions.",
  },
  {
    id: 5,
    name: "Echo 7.1 Gaming Headset",
    category: "Audio",
    price: 3799,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    description:
      "Immersive positional audio and a clear microphone for squad comms and streams.",
  },
  {
    id: 6,
    name: "Forge XL Desk Mat",
    category: "Desk Setup",
    price: 1299,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    description:
      "A smooth extended surface that keeps your keyboard and mouse locked in.",
  },
  {
    id: 7,
    name: "Pulse RGB Light Bar",
    category: "Desk Setup",
    price: 2199,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    description:
      "Bring focused ambient color to your desk with app-controlled RGB lighting.",
  },
  {
    id: 8,
    name: "Titan Dual Monitor Arm",
    category: "Accessories",
    price: 4999,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    description:
      "Free up desk space and position two displays exactly where your setup needs them.",
  },
];

async function initializeDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      user_id BIGINT NOT NULL,
      products JSON NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      order_data JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_data (
      user_id BIGINT NOT NULL,
      data_type VARCHAR(30) NOT NULL,
      data JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, data_type),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  try {
    await db.execute(
      "ALTER TABLE orders ADD COLUMN order_data JSON NOT NULL"
    );
  } catch (error) {
    if (error.code !== "ER_DUP_FIELDNAME") {
      throw error;
    }
  }

  try {
    await db.execute(
      "ALTER TABLE orders ADD COLUMN order_number VARCHAR(50) NULL AFTER id"
    );
  } catch (error) {
    if (error.code !== "ER_DUP_FIELDNAME") {
      throw error;
    }
  }

  await db.execute(`
    UPDATE orders
    SET order_number = COALESCE(
      NULLIF(JSON_UNQUOTE(JSON_EXTRACT(order_data, '$.orderNumber')), ''),
      CONCAT('SS-OLD-', id)
    )
    WHERE order_number IS NULL OR order_number = ''
  `);

  await db.execute(
    "ALTER TABLE orders MODIFY order_number VARCHAR(50) NOT NULL"
  );

  try {
    await db.execute(
      "CREATE UNIQUE INDEX unique_order_number ON orders (order_number)"
    );
  } catch (error) {
    if (error.code !== "ER_DUP_KEYNAME") {
      throw error;
    }
  }

  const [adminRows] = await db.execute(
    "SELECT id FROM users WHERE email = ?",
    ["admin@shopsphere.com"]
  );

  if (adminRows.length === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      ["Admin User", "admin@shopsphere.com", hashedPassword]
    );
  }
}

app.get("/api/health", (_, res) => {
  res.json({ status: "ok", message: "ShopSphere API is running" });
});

app.get("/api/products", (_, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(product);
});

app.get("/api/user-data/:userId/:dataType", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT data FROM user_data WHERE user_id = ? AND data_type = ?",
      [req.params.userId, req.params.dataType]
    );

    return res.json(rows[0] ? parseJsonValue(rows[0].data, null) : null);
  } catch (error) {
    console.error("User data load error:", error);
    return res.status(500).json({ message: "Unable to load user data" });
  }
});

app.put("/api/user-data/:userId/:dataType", async (req, res) => {
  try {
    await db.execute(
      `INSERT INTO user_data (user_id, data_type, data)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [req.params.userId, req.params.dataType, JSON.stringify(req.body)]
    );

    return res.json({ success: true });
  } catch (error) {
    console.error("User data save error:", error);
    return res.status(500).json({ message: "Unable to save user data" });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [String(name).trim(), normalizedEmail, hashedPassword]
    );

    return res.status(201).json({
      id: result.insertId,
      name: String(name).trim(),
      email: normalizedEmail,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email is already registered" });
    }

    console.error("Signup error:", error);
    return res.status(500).json({ message: "Unable to create account" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [String(email).trim().toLowerCase()]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(String(password), user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Unable to log in" });
  }
});

app.post("/api/orders", async (req, res) => {
  const { order } = req.body;

  if (!order || !order.userId || !order.products?.length) {
    return res.status(400).json({
      message: "A user and at least one product are required",
    });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO orders
        (order_number, user_id, products, total, order_data)
       VALUES (?, ?, ?, ?, ?)`,
      [
        order.orderNumber,
        order.userId,
        JSON.stringify(order.products),
        order.total,
        JSON.stringify(order),
      ]
    );

    const savedOrder = {
      ...order,
      id: result.insertId,
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Order save error:", error);
    return res.status(500).json({ message: "Unable to save order" });
  }
});

app.get("/api/orders/:userId", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, order_number, order_data, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.params.userId]
    );

    const userOrders = rows.map((row) => ({
      ...parseJsonValue(row.order_data, {}),
      id: row.id,
      orderNumber: row.order_number,
      createdAt: row.created_at,
    }));

    return res.json(userOrders);
  } catch (error) {
    console.error("Order history error:", error);
    return res.status(500).json({ message: "Unable to load orders" });
  }
});

app.put("/api/auth/password", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({
      message: "All password fields are required",
    });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({
      message: "New password must be at least 6 characters",
    });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, password FROM users WHERE id = ?",
      [userId]
    );
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatches = await bcrypt.compare(
      String(currentPassword),
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(String(newPassword), 10);

    await db.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json({ message: "Unable to change password" });
  }
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`ShopSphere API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  });
