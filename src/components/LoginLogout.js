import React, { Component } from "react";
import firebase, { google_provider } from "../config/firebase";

export default class LoginLogout extends Component {
  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert("You have been logged out!");
      })
      .catch(error => {
        console.log(error);
        alert(`There was an error logging out. \n${error.toString()}`);
      });
  };

  login = () => {
    firebase
      .auth()
      .signInWithPopup(google_provider)
      .then(result => {
        const ref = firebase.database().ref(`scores/${result.user.uid}`);
        ref.update({ name: result.user.displayName || "Anonymous" });
      })
      .catch(error => {
        console.log(error);
        alert(`There was an error logging in. \n${error.toString()}`);
      });
  };

  render() {
    const {
      login,
      logout,
      props: { loadingUser, user }
    } = this;

    return loadingUser
      ? ""
      : (user && (
          <button className="btn btn-primary" onClick={logout}>
            Logout
          </button>
        )) || (
          <button className="btn btn-warning" onClick={login}>
            Login To Save Your HighScore!
          </button>
        );
  }
}
