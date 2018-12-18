import React, { Component } from "react";
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const FRAME_RATE = 30;
const SNAKE_HEIGHT = 15;
const SNAKE_WIDTH = 15;

export default class Game extends Component {
  state = {
    snakeBody: [{ x: 0, y: 0 }],
    dir: { x: 1, y: 0 }
  };

  componentDidMount() {
    const { canvas } = this;
    const ctx = canvas.getContext("2d");
    this.drawGame(ctx);
  }

  drawGame = ctx => {
    setInterval(() => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      this.moveSnake();
      // update snake position
      // check snake and food collision
      // check snake with own body collision
      // draw snake
      this.drawSnake(ctx);
      // draw food
    }, 1000 / FRAME_RATE);
  };

  drawSnake = ctx => {
    const { snakeBody } = this.state;
    for (let part of snakeBody) {
      ctx.fillRect(part.x, part.y, SNAKE_WIDTH, SNAKE_HEIGHT);
    }
  };

  moveSnake = () => {
    const { dir, snakeBody } = this.state;
    const snakeHead = snakeBody[snakeBody.length - 1];
    const newPos = {
      x: snakeHead.x + dir.x * SNAKE_WIDTH,
      y: snakeHead.y + dir.y * SNAKE_HEIGHT
    };

    if (newPos.x >= CANVAS_WIDTH) {
      newPos.x = 0;
    }
    if (newPos.x < 0) {
      newPos.x = CANVAS_WIDTH - SNAKE_WIDTH;
    }
    if (newPos.y >= CANVAS_HEIGHT) {
      newPos.y = 0;
    }
    if (newPos.y < 0) {
      newPos.y = CANVAS_HEIGHT - SNAKE_HEIGHT;
    }
    snakeBody.push(newPos);
    snakeBody.shift();
  };

  changeDirection = (x, y) => {
    this.setState({
      dir: { x, y }
    });
  };

  handleKeyPress = e => {
    switch (e.key) {
      case "ArrowUp":
        this.changeDirection(0, -1);
        break;
      case "ArrowDown":
        this.changeDirection(0, 1);
        break;
      case "ArrowLeft":
        this.changeDirection(-1, 0);
        break;
      case "ArrowRight":
        this.changeDirection(1, 0);
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
