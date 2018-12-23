import React, { PureComponent } from "react";
import firebase from "../config/firebase";

export default class HighScore extends PureComponent {
  componentDidUpdate(prevProps) {
    if (
      !prevProps.loadingHighScore &&
      !this.props.loadingHighScore &&
      this.props.user
    ) {
      firebase
        .database()
        .ref(`scores/${this.props.user.uid}`)
        .update({
          score: this.props.highScore
        })
        .then(() => console.log("new high score saved"))
        .catch(() =>
          console.log(
            "local high score not saved (probably because your previous high score is greater)"
          )
        );
    }
  }

  render() {
    const {
      login,
      logout,
      loadingHighScore,
      loadingUser,
      highScore,
      user
    } = this.props;

    return (
      <div className="row">
        <div className="col-sm-6">
          <p className=" lead font-weight-bold">
            Your high score: {loadingHighScore ? "loading..." : highScore}
          </p>
        </div>
        <div>
          {loadingUser
            ? ""
            : (user && (
                <button className="btn btn-primary" onClick={logout}>
                  Logout
                </button>
              )) || (
                <button className="btn btn-warning" onClick={login}>
                  Login To Save Your HighScores!
                </button>
              )}
        </div>
      </div>
    );
  }
}
