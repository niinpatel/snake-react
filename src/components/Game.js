import React, { Component } from "react";
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;
const SNAKE_LENGTH = 15; // should be divisible by both canvas height and width
const FRAME_RATE = 60;
const SNAKE_SPEED = 5; // cannot be more than the FRAME_RATE

export default class Game extends Component {
  state = {
    snakeBody: [
      { x: 0 * SNAKE_LENGTH, y: 0 * SNAKE_LENGTH },
      { x: 1 * SNAKE_LENGTH, y: 0 * SNAKE_LENGTH },
      { x: 2 * SNAKE_LENGTH, y: 0 * SNAKE_LENGTH }
    ],
    dir: { x: 1, y: 0 },
    score: 0
  };

  componentDidMount() {
    const { canvas, createNewFood, drawGame } = this;
    this.setState({
      food: createNewFood()
    });
    const ctx = canvas.getContext("2d");
    drawGame(ctx);
  }

  drawGame = ctx => {
    let currentFrame = 0;

    const game = setInterval(() => {
      ctx.font = "24px Arial";
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.strokeStyle = "black";
      ctx.strokeText(`Score: ${this.state.score}`, 450, 30);

      if (Math.floor(currentFrame % (FRAME_RATE / SNAKE_SPEED)) === 0) {
        this.moveSnake();
      }

      ctx.fillStyle = "red";
      this.drawFood(ctx);

      ctx.strokeStyle = "green";
      this.drawSnake(ctx);

      if (this.checkGameOver()) {
        ctx.font = "72px Arial";
        ctx.fillText("Game Over", 100, 300);
        clearInterval(game);
      }

      currentFrame++;
    }, 1000 / FRAME_RATE);
  };

  drawSnake = ctx => {
    const { snakeBody } = this.state;
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

  drawFood = ctx => {
    const { food } = this.state;
    ctx.fillRect(food.x, food.y, SNAKE_LENGTH, SNAKE_LENGTH);
  };

  moveSnake = () => {
    const { dir, snakeBody } = this.state;
    const snakeHead = snakeBody[snakeBody.length - 1];
    const newHead = {
      x: snakeHead.x + dir.x * SNAKE_LENGTH,
      y: snakeHead.y + dir.y * SNAKE_LENGTH
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

  changeDirection = (x, y) => {
    this.setState(
      {
        dir: { x, y }
      },
      this.moveSnake
    );
  };

  eatFood = () => {
    const { food, snakeBody } = this.state;
    const snakeHead = snakeBody[snakeBody.length - 1];
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
  };

  growSnake = () => {
    const { snakeBody, dir } = this.state;
    const snakeTail = snakeBody[0];
    const newSnakeTail = {
      x: snakeTail.x - dir.x,
      y: snakeTail.y - dir.y
    };
    snakeBody.unshift(newSnakeTail);
  };

  checkGameOver = () => {
    const { snakeBody } = this.state;
    const snakeHead = snakeBody[snakeBody.length - 1];

    for (let part of snakeBody) {
      if (
        part.x === snakeHead.x &&
        part.y === snakeHead.y &&
        part !== snakeHead
      ) {
        return true;
      }
    }

    return false;
  };

  handleKeyPress = e => {
    const { snakeBody, dir } = this.state;
    switch (e.key) {
      case "ArrowUp":
        (snakeBody.length === 1 || dir.y !== 1) && this.changeDirection(0, -1);
        break;
      case "ArrowDown":
        (snakeBody.length === 1 || dir.y !== -1) && this.changeDirection(0, 1);
        break;
      case "ArrowLeft":
        (snakeBody.length === 1 || dir.x !== 1) && this.changeDirection(-1, 0);
        break;
      case "ArrowRight":
        (snakeBody.length === 1 || dir.x !== -1) && this.changeDirection(1, 0);
        break;
      case " ":
        this.growSnake(); // for testing only
        break;
      default:
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
      />
    );
  }
}
