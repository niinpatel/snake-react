# Snake Master

The classic snake game, implemented in JavaScript using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) on a ReactJS front-end. This project uses firebase as a backend to store highscores of the players. It is deployed live at Heroku [here.](http://snake-game-react-n.herokuapp.com)

## How it works

This game is playable with four arrow keys to move the snake up, down, left and right. A food is generated on the canvas at random locations.

Eating the food causes the snake to grow in length and increase the score. Touching its own tail kills the snake. The goal is to collect as many points as possible without dying. The snake has 3 lives in the beginning. The game is over when snake has no lives left.

Other than regular food, a bonus food is created at random intervals. These last for few seconds and carry a reward based on how fast the snake eats it. Eat the bonus as fast as possible to get most points.

As the snake length increases, the difficulty rises as it gets faster.

You can signup/login using Google to save your highscores after the game is over and be featured on the leaderboard of high scores if you're among the top ten players.

## Running it on your local machine

### Prerequisites

You need latest version of NodeJS and Yarn installed, which is a dependency manager for Node/JS.

### Getting Started

Once you have that, run following commands to get the project up and running:

    git clone https://github.com/niinpatel/snake-react
    cd snake-react
    yarn install
    yarn start

To run it with your own firebase credentials, you can change it to yours in _src/config/firebase.js_ file.

## Acknowledgments

This was made as a take home project for [Pesto Training Program](http://pesto.tech).
