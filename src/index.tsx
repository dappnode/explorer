import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import "./index.css";
import "./style.scss";
import App from "./App";

const SUBGRAPH_URI =
  import.meta.env.REACT_APP_SUBGRAPH_URI ||
  "https://gateway.thegraph.com/api/subgraphs/id/AnR9aNC4rEFzoCy44wcLHr3CmSpoCrKizPT8GMkKb8z5";

const GATEWAY_TOKEN = (import.meta.env.REACT_APP_GATEWAY_TOKEN || "").trim();
const AUTHORIZATION_HEADER = GATEWAY_TOKEN
  ? GATEWAY_TOKEN.toLowerCase().startsWith("bearer ")
    ? GATEWAY_TOKEN
    : `Bearer ${GATEWAY_TOKEN}`
  : undefined;

if (!AUTHORIZATION_HEADER) {
  // eslint-disable-next-line no-console
  console.warn(
    "[dappnode-explorer] REACT_APP_GATEWAY_TOKEN is not set. " +
      "GraphQL requests will be sent without Authorization and may be rejected."
  );
}

const client = new ApolloClient({
  link: new HttpLink({
    uri: SUBGRAPH_URI,
    headers: AUTHORIZATION_HEADER
      ? { Authorization: AUTHORIZATION_HEADER }
      : undefined,
  }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>
);
