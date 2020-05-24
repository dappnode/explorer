import React from "react";
import { Route } from "react-router-dom";
import Header from "./components/Header";
import { Home } from "./pages/Home";
import { Repo } from "./pages/Repo";

export default function App() {
  return (
    <div className="App">
      <Header />
      <div className="app-body">
        <Route path="/" exact component={Home} />
        <Route path="/repo/:repoId/:versionId?" component={Repo} />
      </div>
    </div>
  );
}
