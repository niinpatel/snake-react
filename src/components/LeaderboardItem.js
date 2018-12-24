import React, { Component } from "react";

export default class LeaderboardItem extends Component {
  render() {
    const {
      player: { name, score },
      rank,
      isLoggedInUser
    } = this.props;

    return (
      <tr className={isLoggedInUser ? "table-success" : ""}>
        <td>{rank}</td>
        <td>{isLoggedInUser ? name + " (You)" : name}</td>
        <td>{score}</td>
      </tr>
    );
  }
}
