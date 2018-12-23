import React, { Component } from "react";
import "./App.css";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import Footer from "./components/Footer";

class App extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="text-center mt-3">
            <h1>Snake Master</h1>
          </div>
          <div className="row">
            <Game />
            <Leaderboard />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
