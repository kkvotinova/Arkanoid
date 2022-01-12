export default class Platform {
  speed = 7;
  dx = 0;

  constructor(width, height, game) {
    this.width = width;
    this.height = height;
    this.x = game.width / 2 - 70;
    this.y = game.height - 55;
    this.ball = game.ball;
  }

  animate(game) {
    setInterval(() => {
      const i = Math.trunc(Math.random() * (4 - 1) + 1);
      game.sprites.platform.src = (i === 1) ? `img/platform.png` : `img/platform-${i}.png`;
    }, 40);
  }

  releaseBall(game) {
    if (this.ball) {
      this.animate(game);
      this.ball.jump();
      this.ball = false;
    }
  }

  move() {
    this.x += this.dx;
    if (this.ball) this.ball.x += this.dx;
  }

  stop() {
    this.dx = 0;
    if (this.ball) this.ball.dx = 0;
  }
};
