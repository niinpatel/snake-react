import React, { Component } from "react";
import HighScore from "./HighScore";
import firebase, { google_provider } from "../config/firebase";

// game constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;
const SNAKE_LENGTH = 15; // should be divisible by both canvas height and width
const FRAME_RATE = 30;
const START_BUTTON = { width: 150, height: 50 };
START_BUTTON.x = CANVAS_WIDTH / 2 - START_BUTTON.width / 2;
START_BUTTON.y = CANVAS_HEIGHT / 2 - START_BUTTON.height / 2;

export default class Game extends Component {
  state = {
    gameIsRunning: false,
    highScore: 0,
    loadingHighScore: false,
    loadingUser: true,
    user: null
  };

  // constants for initial snake body and directions
  initialSnakeBody = [
    { x: 0 * SNAKE_LENGTH, y: 0 * SNAKE_LENGTH },
    { x: 1 * SNAKE_LENGTH, y: 0 * SNAKE_LENGTH },
    { x: 2 * SNAKE_LENGTH, y: 0 * SNAKE_LENGTH }
  ];
  initialDirections = { x: 1, y: 0 };
  initialSnakeSpeed = 5;

  componentDidMount() {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "24px Arial";
    this.clearCanvas(this.ctx);
    this.drawStartButton(this.ctx);
    this.getLoggedInUser();
  }

  getLoggedInUser = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState(
          { user, loadingHighScore: true, loadingUser: false },
          () => {
            firebase
              .database()
              .ref(`scores/${user.uid}`)
              .once(
                "value",
                snap => {
                  this.setState({
                    highScore: snap.val().score,
                    loadingHighScore: false
                  });
                },
                error => {
                  this.setState(
                    {
                      loadingHighScore: false
                    },
                    () => alert(error.toString())
                  );
                }
              );
          }
        );
      } else {
        this.setState({ loadingUser: false, loadingHighScore: false });
      }
    });
  };

  componentDidUpdate() {
    // create a 'bonus' food when score is a multiple of ten
    const { score, bonusFoods, gameIsRunning } = this.state;
    if (gameIsRunning && score && score % 10 === 0) {
      if (!bonusFoods.length) {
        this.setState({
          bonusFoods: [this.createNewBonusFood(score)]
        });
      } else {
        const previousBonus = bonusFoods[bonusFoods.length - 1];
        if (previousBonus.id !== score) {
          this.setState({
            bonusFoods: [previousBonus, this.createNewBonusFood(score)]
          });
        }
      }
    }
  }

  startGame = () => {
    const { canvas, createNewFood, drawGame } = this;
    this.setState(
      {
        food: createNewFood(),
        bonusFoods: [],
        score: 0,
        gameIsRunning: true,
        snakeBody: [...this.initialSnakeBody],
        snakeDirection: this.initialDirections,
        snakeLives: 3,
        snakeSpeed: this.initialSnakeSpeed
      },
      () => {
        const ctx = canvas.getContext("2d");
        drawGame(ctx);
      }
    );
  };

  stopGame = ctx => {
    const { score, highScore, gameInterval } = this.state;
    this.clearCanvas(ctx);

    const newHighScore = score > highScore ? score : highScore;
    ctx.fillStyle = "black";
    ctx.fillText(
      `Your Score ${score}, High Score ${newHighScore}`,
      CANVAS_WIDTH / 2,
      START_BUTTON.y - 25
    );

    this.drawStartButton(ctx);
    this.setState({ gameIsRunning: false, highScore: newHighScore }, () =>
      clearInterval(gameInterval)
    );
  };

  pauseOrUnpause = () => {
    const { paused, gameInterval, gameIsRunning } = this.state;
    if (!gameIsRunning) {
      return;
    }
    if (paused) {
      this.setState(
        {
          paused: false
        },
        () => this.drawGame(this.ctx)
      );
    } else {
      this.setState(
        {
          paused: true
        },
        () => clearInterval(gameInterval)
      );
    }
  };

  drawGame = ctx => {
    let currentFrame = 0;
    const game = setInterval(() => {
      this.clearCanvas(ctx);
      this.displayScoreAndLives(ctx);
      Math.floor(currentFrame % (FRAME_RATE / this.state.snakeSpeed)) === 0 &&
        this.moveSnake();
      this.drawFood(ctx);
      this.drawBonusFood(ctx);
      this.drawSnake(ctx);
      this.checkGameOver(ctx, game);
      currentFrame++;
    }, 1000 / FRAME_RATE);
    this.setState({
      gameInterval: game
    });
  };

  displayScoreAndLives = ctx => {
    const { score, snakeLives } = this.state;
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${score}`, CANVAS_WIDTH * 0.85, 30);
    ctx.fillText(
      `Lives : ${snakeLives}`,
      CANVAS_WIDTH * 0.85,
      CANVAS_HEIGHT - 30
    );
  };

  drawSnake = ctx => {
    const { snakeBody } = this.state;
    ctx.strokeStyle = "green";
    for (let part of snakeBody) {
      ctx.strokeRect(part.x, part.y, SNAKE_LENGTH, SNAKE_LENGTH);
    }
  };

  createNewFood = () => {
    const x = Math.floor(Math.random() * CANVAS_WIDTH);
    const y = Math.floor(Math.random() * CANVAS_HEIGHT);
    return {
      x: x - (x % SNAKE_LENGTH),
      y: y - (y % SNAKE_LENGTH)
    };
  };

  createNewBonusFood = id => {
    const newBonusFood = this.createNewFood();
    newBonusFood.expires = Date.now() + 7000;
    newBonusFood.eaten = false;
    newBonusFood.id = id;
    return newBonusFood;
  };

  drawFood = ctx => {
    const { food } = this.state;
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, SNAKE_LENGTH, SNAKE_LENGTH);
  };

  drawBonusFood = ctx => {
    const { bonusFoods } = this.state;
    const bonusFood = bonusFoods[bonusFoods.length - 1];
    ctx.fillStyle = "blue";
    if (bonusFood && bonusFood.expires > Date.now() && !bonusFood.eaten) {
      ctx.beginPath();
      ctx.arc(
        bonusFood.x + SNAKE_LENGTH / 2,
        bonusFood.y + SNAKE_LENGTH / 2,
        SNAKE_LENGTH * (Math.random() * 0.25 + 0.25),
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  moveSnake = () => {
    const { snakeDirection, snakeBody } = this.state;
    const snakeHead = snakeBody[snakeBody.length - 1];
    const newHead = {
      x: snakeHead.x + snakeDirection.x * SNAKE_LENGTH,
      y: snakeHead.y + snakeDirection.y * SNAKE_LENGTH
    };

    if (newHead.x >= CANVAS_WIDTH) {
      newHead.x = 0;
    }
    if (newHead.x < 0) {
      newHead.x = CANVAS_WIDTH - SNAKE_LENGTH;
    }
    if (newHead.y >= CANVAS_HEIGHT) {
      newHead.y = 0;
    }
    if (newHead.y < 0) {
      newHead.y = CANVAS_HEIGHT - SNAKE_LENGTH;
    }

    snakeBody.push(newHead);
    snakeBody.shift();
    this.eatFood();
  };

  changeSnakeDirection = (x, y) => {
    this.setState(
      {
        snakeDirection: { x, y }
      },
      this.moveSnake
    );
  };

  eatFood = () => {
    const { food, snakeBody, bonusFoods } = this.state;
    const snakeHead = snakeBody[snakeBody.length - 1];
    const bonusFood = bonusFoods[bonusFoods.length - 1];
    if (food.x === snakeHead.x && food.y === snakeHead.y) {
      this.setState(
        prevState => ({
          ...prevState,
          food: this.createNewFood(),
          score: ++prevState.score
        }),
        () => {
          this.growSnake();
          this.adjustDifficulty();
        }
      );
    }

    if (
      bonusFood &&
      bonusFood.x === snakeHead.x &&
      bonusFood.y === snakeHead.y &&
      !bonusFood.eaten &&
      bonusFood.expires > Date.now()
    ) {
      bonusFood.eaten = true;
      this.setState(prevState => ({
        ...prevState,
        score:
          prevState.score +
          Math.floor(((bonusFood.expires - Date.now()) / 1000) * 4)
      }));
    }
  };

  growSnake = () => {
    const { snakeBody, snakeDirection } = this.state;
    const snakeTail = snakeBody[0];
    const newSnakeTail = {
      x: snakeTail.x - snakeDirection.x,
      y: snakeTail.y - snakeDirection.y
    };
    snakeBody.unshift(newSnakeTail);
  };

  adjustDifficulty = () => {
    const snakeLen = this.state.snakeBody.length;
    if (snakeLen % 10 === 0 && snakeLen < 100) {
      this.setState(prevState => ({
        ...prevState,
        snakeSpeed: prevState.snakeSpeed * 1.25
      }));
    }
  };

  checkSnakeTailCollision = () => {
    const { snakeBody } = this.state;
    const snakeHead = snakeBody[snakeBody.length - 1];
    for (let part of snakeBody) {
      if (
        part !== snakeHead &&
        part.x === snakeHead.x &&
        part.y === snakeHead.y
      ) {
        return true;
      }
    }
  };

  checkGameOver = ctx => {
    const { snakeLives } = this.state;
    const dead = this.checkSnakeTailCollision();

    if (dead) {
      if (snakeLives <= 1) {
        this.stopGame(ctx);
      } else {
        this.setState(prevState => ({
          ...prevState,
          snakeLives: --prevState.snakeLives,
          snakeBody: [...this.initialSnakeBody],
          snakeDirection: this.initialDirections,
          snakeSpeed: this.initialSnakeSpeed
        }));
      }
    }
  };

  clearCanvas = ctx => {
    ctx.fillStyle = "RGB(220,220,200)";
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  handleKeyPress = e => {
    e.preventDefault();
    const { snakeDirection, paused } = this.state;
    switch (e.key) {
      case "ArrowUp":
        !paused && snakeDirection.y !== 1 && this.changeSnakeDirection(0, -1);
        break;
      case "ArrowDown":
        !paused && snakeDirection.y !== -1 && this.changeSnakeDirection(0, 1);
        break;
      case "ArrowLeft":
        !paused && snakeDirection.x !== 1 && this.changeSnakeDirection(-1, 0);
        break;
      case "ArrowRight":
        !paused && snakeDirection.x !== -1 && this.changeSnakeDirection(1, 0);
        break;
      case "Escape":
        this.stopGame(this.ctx);
        break;
      case " ":
        this.pauseOrUnpause();
        break;
      default:
    }
  };

  drawStartButton = ctx => {
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "blue";
    ctx.strokeRect(
      START_BUTTON.x,
      START_BUTTON.y,
      START_BUTTON.width,
      START_BUTTON.height
    );
    ctx.fillText("Click to Start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.fillStyle = "black";
    ctx.fillText(
      "Arrow Keys: Move Snake",
      CANVAS_WIDTH / 2,
      (2 * CANVAS_HEIGHT) / 3
    );
    ctx.fillText(
      "Space Key: Pause/Unpause",
      CANVAS_WIDTH / 2,
      (2.2 * CANVAS_HEIGHT) / 3
    );
    ctx.fillText("Esc Key: Stop", CANVAS_WIDTH / 2, (2.4 * CANVAS_HEIGHT) / 3);
  };

  handleClick = e => {
    const { layerX, layerY } = e.nativeEvent;
    const { gameIsRunning } = this.state;
    if (
      !gameIsRunning &&
      layerX > START_BUTTON.x &&
      layerX < START_BUTTON.x + START_BUTTON.width &&
      layerY > START_BUTTON.y &&
      layerY < START_BUTTON.y + START_BUTTON.height
    ) {
      this.startGame();
    }
  };

  login = () => {
    firebase
      .auth()
      .signInWithPopup(google_provider)
      .then(result => {
        const ref = firebase.database().ref(`scores/${result.user.uid}/score`);
        ref.once("value", snap => {
          const val = snap.val();
          if (val < this.state.highScore) {
            ref
              .update(this.state.highScore)
              .then(() => console.log("new high score saved"))
              .catch(() =>
                console.log(
                  "local high score not saved (probably because your previous high score is greater)"
                )
              );
          } else {
            this.setState({
              highScore: snap.val()
            });
          }
        });
      })
      .catch(console.error);
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState(
          {
            user: null,
            highScore: 0
          },
          () => alert("You have been logged out!")
        );
      })
      .catch(error => {
        alert(error.toString());
      });
  };

  render() {
    const { user, highScore, loadingHighScore, loadingUser } = this.state;
    return (
      <div className="col-md-12 col-xl-7 col-lg-8 pt-3">
        <canvas
          height={CANVAS_HEIGHT}
          width={CANVAS_WIDTH}
          ref={canvas => (this.canvas = canvas)}
          tabIndex="0"
          onKeyDown={this.handleKeyPress}
          onClick={this.handleClick}
        />
        <HighScore
          highScore={highScore}
          user={user}
          loadingHighScore={loadingHighScore}
          loadingUser={loadingUser}
          login={this.login}
          logout={this.logout}
        />
      </div>
    );
  }
}
