import React, { PureComponent } from "react";

export default class HighScore extends PureComponent {
  render() {
    const { loadingHighScore, highScore } = this.props;
    return (
      <p className=" lead font-weight-bold">
        Your high score: {loadingHighScore ? "loading..." : highScore}
      </p>
    );
  }
}
