import React, { Component } from "react";
import firebase from "../config/firebase";
import LeaderboardItem from "./LeaderboardItem";

export default class Leaderboard extends Component {
  state = {
    leaderboard: []
  };

  componentDidMount() {
    const ref = firebase.database().ref("scores");
    ref
      .orderByChild("score")
      .limitToLast(10)
      .on(
        "value",
        snap => {
          const leaderboard = [];
          snap.forEach(c => {
            leaderboard.unshift(c.val());
          });
          this.setState({ leaderboard });
        },
        e => {
          console.log("e", e);
        }
      );
  }

  render() {
    return (
      <div className="col-xl-5 col-lg-4 leaderboard">
        <h2>Leaderboard </h2>
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Highscore</th>
            </tr>
          </thead>
          <tbody>
            {this.state.leaderboard.map((user, index) => {
              return (
                <LeaderboardItem
                  rank={index + 1}
                  name={user.name}
                  score={user.score}
                  key={user.name + index + user.score}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
