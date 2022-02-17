const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const { hostHeroku } = require("../config.json");

const app = express();

app.use(
  createProxyMiddleware({
    target: `https://${hostHeroku}`,
    changeOrigin: true
  })
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log("Mordax Proxy started on PORT: ", PORT));
