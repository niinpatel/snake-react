import React, { Component } from "react";
import "./App.css";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import Footer from "./components/Footer";
import HighScore from "./components/HighScore";
import LoginLogout from "./components/LoginLogout";
import firebase from "./config/firebase";

class App extends Component {
  state = {
    highScore: 0,
    user: null,
    loadingUser: true,
    loadingHighScore: false
  };

  updateHighScore = newhighScore => {
    if (newhighScore < this.state.highScore) {
      throw new Error(
        "Score you're trying to save is less than the current high score"
      );
    }
    this.setState({ highScore: newhighScore }, () => {
      if (this.state.user) {
        const ref = firebase.database().ref(`scores/${this.state.user.uid}`);
        ref
          .update({
            score: newhighScore
          })
          .catch(error => alert(error.toString()));
      }
    });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      user => {
        this.setState({
          user,
          loadingUser: false,
          loadingHighScore: true
        });
        if (user) {
          // a user logged in
          const ref = firebase.database().ref(`scores/${user.uid}`);
          ref.once(
            "value",
            snapShot => {
              if (
                snapShot.hasChild("score") &&
                snapShot.val().score > this.state.highScore
              ) {
                this.setState({
                  highScore: snapShot.val().score,
                  loadingHighScore: false
                });
              } else {
                ref
                  .update({
                    score: this.state.highScore
                  })
                  .then(() => {
                    this.setState({ loadingHighScore: false });
                  })
                  .catch(error => {
                    console.log(error);
                    alert(
                      `We were unable to save your score. \n${error.toString()}`
                    );
                  });
              }
            },
            error => {
              this.setState(
                {
                  loadingHighScore: false
                },
                () => {
                  console.log(error);
                  alert(
                    `Unable to fetch your score from server. \n${error.toString()}`
                  );
                }
              );
            }
          );
        } else {
          // a user logged out or is not logged in
          this.setState({ highScore: 0, loadingHighScore: false });
        }
      },
      error => console.log(error)
    );
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="text-center mt-3">
            <h1>Snake Master</h1>
          </div>
          <div className="row">
            <div className="col-md-12 col-xl-7 col-lg-8 pt-3">
              <Game
                highScore={this.state.highScore}
                updateHighScore={this.updateHighScore}
              />
              <div className="row">
                <div className="col-xs-12 col-sm-6">
                  <HighScore
                    highScore={this.state.highScore}
                    loadingHighScore={this.state.loadingHighScore}
                  />
                </div>
                <div>
                  <LoginLogout
                    user={this.state.user}
                    loadingUser={this.state.loadingUser}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-4">
              <h2>Leaderboard </h2>
              <Leaderboard user={this.state.user} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
