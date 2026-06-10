import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import "./index.css";
import "./style.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const SUBGRAPH_URI =
  process.env.REACT_APP_SUBGRAPH_URI ||
  "https://gateway.thegraph.com/api/subgraphs/id/AnR9aNC4rEFzoCy44wcLHr3CmSpoCrKizPT8GMkKb8z5";

const GATEWAY_TOKEN = process.env.REACT_APP_GATEWAY_TOKEN;

if (!GATEWAY_TOKEN) {
  // eslint-disable-next-line no-console
  console.warn(
    "[dappnode-explorer] REACT_APP_GATEWAY_TOKEN is not set. " +
      "GraphQL requests will be sent without Authorization and may be rejected."
  );
}

const client = new ApolloClient({
  uri: SUBGRAPH_URI,
  request: async (operation) => {
    operation.setContext({
      headers: GATEWAY_TOKEN
        ? { Authorization: `Bearer ${GATEWAY_TOKEN}` }
        : {},
    });
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
