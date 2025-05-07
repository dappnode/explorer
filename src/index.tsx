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

const client = new ApolloClient({
  uri:
    "https://api.studio.thegraph.com/query/90626/dappnode-explorer/v0.1.0/",
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
