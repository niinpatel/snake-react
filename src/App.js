import React, { Component } from "react";
import "./App.css";
import Game from "./components/Game";

class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Snake Game</h1>
        <Game />
      </div>
    );
  }
}

export default App;
