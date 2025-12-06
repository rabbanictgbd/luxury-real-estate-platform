// ======================================================
//      BASIC SERVER SETUP
// ======================================================
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ======================================================
//      MONGODB CONNECTION
// ======================================================
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;
let usersCollection;
let categoriesCollection;
let bookingsCollection;
let mediaCollection;
let paymentsCollection;
let propertiesCollection;

async function connectDB() {
  try {
    await client.connect();

    // Correct database name
    db = client.db("luxury_real_estate_platform_db");

    // Correct collections
    usersCollection = db.collection("users");
    bookingsCollection = db.collection("bookings");
    categoriesCollection = db.collection("categories");
    mediaCollection = db.collection("media");
    paymentsCollection = db.collection("payments");
    propertiesCollection = db.collection("properties");

    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
  }
}
connectDB();

// ======================================================
//      Helper Function to Return Collection
// ======================================================
function getCollection(name) {
  const collections = {
    users: usersCollection,
    bookings: bookingsCollection,
    categories: categoriesCollection,
    media: mediaCollection,
    payments: paymentsCollection,
    properties: propertiesCollection,
  };
  return collections[name];
}

// ======================================================
//      UNIVERSAL CRUD ROUTES
// ======================================================

// CREATE (POST)
app.post("/api/:collection", async (req, res) => {
  try {
    const col = getCollection(req.params.collection);
    const result = await col.insertOne(req.body);
    res.send({ success: true, id: result.insertedId });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// READ ALL (GET)
app.get("/api/:collection", async (req, res) => {
  try {
    const col = getCollection(req.params.collection);
    const result = await col.find().toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// READ SINGLE (GET)
app.get("/api/:collection/:id", async (req, res) => {
  try {
    const col = getCollection(req.params.collection);
    const id = req.params.id;

    const result = await col.findOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// UPDATE (PUT)
app.put("/api/:collection/:id", async (req, res) => {
  try {
    const col = getCollection(req.params.collection);
    const id = req.params.id;

    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    res.send({ success: true, result });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// DELETE (DELETE)
app.delete("/api/:collection/:id", async (req, res) => {
  try {
    const col = getCollection(req.params.collection);
    const id = req.params.id;

    const result = await col.deleteOne({ _id: new ObjectId(id) });
    res.send({ success: true, result });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// ======================================================
//      DEFAULT ROUTE
// ======================================================
app.get("/", (req, res) => {
  res.send("Luxury Real Estate Platform Backend is Running...");
});

// ======================================================
//      START SERVER
// ======================================================
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
