import React, { Component } from "react";
const WIDTH = 600;
const HEIGHT = 600;
const FRAME_RATE = 30;
const SNAKE_HEIGHT = 20;
const SNAKE_WIDTH = 20;

export default class Game extends Component {
  state = {
    snakeBody: [{ x: 0, y: 0 }]
  };

  componentDidMount() {
    const { canvas } = this;
    const ctx = canvas.getContext("2d");
    this.drawGame(ctx);
  }

  drawGame = ctx => {
    setInterval(() => {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      // update snake position
      // draw snake
      this.drawSnake(ctx);
      // check snake and food collision
      // check snake with own body collision
      // draw snake
      // draw food
    }, 1000 / FRAME_RATE);
  };

  drawSnake = ctx => {
    const { snakeBody } = this.state;

    for (let part of snakeBody) {
      ctx.fillRect(part.x, part.y, SNAKE_WIDTH, SNAKE_HEIGHT);
    }
  };

  handleKeyPress = e => {
    switch (e.key) {
      case "ArrowUp":
        console.log("up");
        break;
      case "ArrowDown":
        console.log("down");
        break;
      case "ArrowLeft":
        console.log("left");
        break;
      case "ArrowRight":
        console.log("right");
        break;
      default:
    }
  };

  render() {
    return (
      <canvas
        height={HEIGHT}
        width={WIDTH}
        ref={canvas => (this.canvas = canvas)}
        tabIndex="0"
        onKeyDown={this.handleKeyPress}
      />
    );
  }
}
