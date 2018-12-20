import React, { Component } from "react";
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;
const SNAKE_LENGTH = 15; // should be divisible by both canvas height and width
const FRAME_RATE = 15;
const SNAKE_SPEED = 5; // cannot be more than the FRAME_RATE
const START_BUTTON = { width: 150, height: 50 };
START_BUTTON.x = CANVAS_WIDTH / 2 - START_BUTTON.width / 2;
START_BUTTON.y = CANVAS_HEIGHT / 2 - START_BUTTON.height / 2;

export default class Game extends Component {
  state = {
    gameState: 0, // zero: game is stopped/not started, one: game running
    highScore: 0
  };

  componentDidMount() {
    const ctx = this.canvas.getContext("2d");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "24px Arial";
    this.clearCanvas(ctx);
    this.drawStartButton(ctx);
  }

  componentDidUpdate() {
    const { score, bonusFoods } = this.state;
    if (score && score % 10 === 0) {
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
        gameState: 1,
        snakeBody: [
          { x: 0 * SNAKE_LENGTH, y: 0 * SNAKE_LENGTH },
          { x: 1 * SNAKE_LENGTH, y: 0 * SNAKE_LENGTH },
          { x: 2 * SNAKE_LENGTH, y: 0 * SNAKE_LENGTH }
        ],
        snakeDirection: { x: 1, y: 0 }
      },
      () => {
        const ctx = canvas.getContext("2d");
        drawGame(ctx);
      }
    );
  };

  drawGame = ctx => {
    let currentFrame = 0;

    const game = setInterval(() => {
      this.clearCanvas(ctx);

      ctx.fillStyle = "black";
      ctx.fillText(`Score: ${this.state.score}`, CANVAS_WIDTH * 0.85, 30);

      if (Math.floor(currentFrame % (FRAME_RATE / SNAKE_SPEED)) === 0) {
        this.moveSnake();
      }

      this.drawFood(ctx);
      this.drawBonusFood(ctx);
      this.drawSnake(ctx);
      this.checkGameOver(ctx, game);

      currentFrame++;
    }, 1000 / FRAME_RATE);
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
        SNAKE_LENGTH * Math.random() * 0.5,
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
        this.growSnake
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

  checkGameOver = (ctx, game) => {
    const gameOver = this.checkSnakeTailCollision();
    if (gameOver) {
      const { score, highScore } = this.state;
      this.clearCanvas(ctx);

      const newHighScore = score > highScore ? score : highScore;
      ctx.fillStyle = "black";
      ctx.fillText(
        `Your Score ${score}, High Score ${newHighScore}`,
        CANVAS_WIDTH / 2,
        START_BUTTON.y - 25
      );

      this.drawStartButton(ctx);
      this.setState({ gameState: 0, highScore: newHighScore }, () =>
        clearInterval(game)
      );
    }
  };

  clearCanvas = ctx => {
    ctx.fillStyle = "RGB(220,220,200)";
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  handleKeyPress = e => {
    const { snakeDirection } = this.state;
    switch (e.key) {
      case "ArrowUp":
        snakeDirection.y !== 1 && this.changeSnakeDirection(0, -1);
        break;
      case "ArrowDown":
        snakeDirection.y !== -1 && this.changeSnakeDirection(0, 1);
        break;
      case "ArrowLeft":
        snakeDirection.x !== 1 && this.changeSnakeDirection(-1, 0);
        break;
      case "ArrowRight":
        snakeDirection.x !== -1 && this.changeSnakeDirection(1, 0);
        break;
      // case " ":
      //   this.growSnake(); // for testing only
      //   break;
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
  };

  handleClick = e => {
    const { layerX, layerY } = e.nativeEvent;
    const { gameState } = this.state;
    if (
      gameState === 0 &&
      layerX > START_BUTTON.x &&
      layerX < START_BUTTON.x + START_BUTTON.width &&
      layerY > START_BUTTON.y &&
      layerY < START_BUTTON.y + START_BUTTON.height
    ) {
      this.startGame();
    }
  };

  render() {
    return (
      <canvas
        height={CANVAS_HEIGHT}
        width={CANVAS_WIDTH}
        ref={canvas => (this.canvas = canvas)}
        tabIndex="0"
        onKeyDown={this.handleKeyPress}
        onClick={this.handleClick}
      />
    );
  }
}
