const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const { hostAzure } = require("../config.json");

const app = express();

app.use(
  createProxyMiddleware({
    target: `https://${hostAzure}`,
    changeOrigin: true
  })
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log("Mordax Proxy started on PORT: ", PORT));
