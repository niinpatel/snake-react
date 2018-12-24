import React, { Component } from "react";
import firebase from "../config/firebase";
import LeaderboardItem from "./LeaderboardItem";

export default class Leaderboard extends Component {
  state = {
    leaderboard: [],
    error: null
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
          snap.forEach(player => {
            leaderboard.unshift({ ...player.val(), key: player.key });
          });
          this.setState({ leaderboard });
        },
        error => {
          this.setState({
            error: error.toString()
          });
        }
      );
  }

  render() {
    if (this.state.error) {
      return (
        <div className="text-danger">
          We were unable to fetch the scoreboard. {this.state.error}
        </div>
      );
    }
    return (
      <div>
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Highscore</th>
            </tr>
          </thead>
          <tbody>
            {this.state.leaderboard.map((player, index) => {
              return (
                <LeaderboardItem
                  player={player}
                  rank={index + 1}
                  isLoggedInUser={
                    this.props.user && this.props.user.uid === player.key
                  }
                  key={player.name + index + player.score}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
