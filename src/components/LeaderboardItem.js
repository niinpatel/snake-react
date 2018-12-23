import React, { Component } from "react";

export default class LeaderboardItem extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.rank}</td>
        <td>{this.props.name}</td>
        <td>{this.props.score}</td>
      </tr>
    );
  }
}
