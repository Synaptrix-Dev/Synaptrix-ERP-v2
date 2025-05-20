const express = require("express");
const cors = require("cors");
const path = require('path');
const rootRouter = require("./router/root-auth.route");
const adminRouter = require("./router/admin-auth.route");
const credsRouter = require('./router/credential.route')
const leadsRouter = require('./router/leads.route');
const projectsRouter = require('./router/projects.route')

const server = express();

server.use(express.static(path.join(__dirname, 'public')));

server.use(
  cors({
    // origin: "https://synaptrix-erp-v2.vercel.app",
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);

require("dotenv").config({ path: "./config.env" });
require("./database/connection");

server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));

server.use("/api/root/auth", rootRouter);
server.use("/api/root/credentials", credsRouter);
server.use("/api/root/leads", leadsRouter);
server.use("/api/root/projects", projectsRouter);

server.use("/api/admin/auth", adminRouter);

server.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
});

const Port = 7980;
server.listen(Port, () => {
  console.log(
    `🖥️  =================== Server Initiated at Port# ${Port} =================== 🖥️`
  );
});
