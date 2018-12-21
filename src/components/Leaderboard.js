import React, { Component } from "react";

export default class Leaderboard extends Component {
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
            <tr>
              <td>1</td>
              <td>Smith</td>
              <td>50</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jackson</td>
              <td>94</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Doe</td>
              <td>80</td>
            </tr>

            <tr>
              <td>4</td>
              <td>Smith</td>
              <td>50</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Jackson</td>
              <td>94</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Doe</td>
              <td>80</td>
            </tr>

            <tr>
              <td>7</td>
              <td>Smith</td>
              <td>50</td>
            </tr>
            <tr>
              <td>8</td>
              <td>Jackson</td>
              <td>94</td>
            </tr>
            <tr>
              <td>9</td>
              <td>Doe</td>
              <td>80</td>
            </tr>

            <tr>
              <td>10</td>
              <td>Smith</td>
              <td>50</td>
            </tr>

            <tr>
              <td>11</td>
              <td>Smith</td>
              <td>50</td>
            </tr>
            <tr>
              <td>12</td>
              <td>Smith</td>
              <td>50</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
