const proxy = require("http-proxy-middleware");

module.exports = function setupProxy(app) {
  const endpoint = (process.env.REACT_APP_DASHBOARD_API_URL || "").trim();
  if (!/^https?:\/\//i.test(endpoint)) return;
  const target = new URL(endpoint);
  app.use(proxy("/v1/explorer/dashboard", {
    target: target.origin,
    changeOrigin: true,
    pathRewrite: () => target.pathname + target.search,
    proxyTimeout: 20000,
    timeout: 20000,
    logLevel: "warn",
  }));
};
