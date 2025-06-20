const express = require("express");
const cors = require("cors");
const path = require("path");
const connectToDB = require("./database/connection");
const routes = require("./router/index");

require("dotenv").config({ path: "./config.env" });

const server = express();

server.use(express.static(path.join(__dirname, "public")));

server.use(
  cors({
    origin: "*",
    // origin: "https://admin.synaptrixsol.com",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));

// Register all routes
routes.forEach(({ path, router }) => {
  server.use(path, router);
});

server.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

const Port = process.env.PORT || 7980;

// Connect to DB before starting server
connectToDB()
  .then(() => {
    server.listen(Port, () => {
      console.log(`🖥️  Server running on port ${Port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Could not start server due to DB error");
  });