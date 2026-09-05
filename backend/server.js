const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
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

const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@shopsphere.com",
    password: "admin123",
    createdAt: new Date().toISOString(),
  },
];

const orders = [];

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

app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === String(email).trim().toLowerCase()
  );

  if (emailExists) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const newUser = {
    id: Date.now(),
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    password: String(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  return res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find(
    (savedUser) =>
      savedUser.email.toLowerCase() === String(email).trim().toLowerCase() &&
      savedUser.password === String(password)
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

app.post("/api/orders", (req, res) => {
  const { order } = req.body;

  if (!order || !order.userId || !order.products?.length) {
    return res.status(400).json({
      message: "A user and at least one product are required",
    });
  }

  const savedOrder = {
    ...order,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };

  orders.unshift(savedOrder);

  return res.status(201).json({ success: true, order: savedOrder });
});

app.get("/api/orders/:userId", (req, res) => {
  const userOrders = orders.filter(
    (order) => String(order.userId) === String(req.params.userId)
  );

  return res.json(userOrders);
});

app.listen(PORT, () => {
  console.log(`ShopSphere API running on http://localhost:${PORT}`);
});
