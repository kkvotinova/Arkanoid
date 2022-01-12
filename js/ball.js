export default class Ball {
  dx = 0;
  dy = 0;
  speed = 3;

  constructor(width, height, game) {
    this.width = width;
    this.height = height;
    this.x = game.width / 2 - 19;
    this.y = game.height - 90;
  }

  jump() {
    this.dx = -this.speed;
    this.dy = -this.speed;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  collide(el) {
    const x = this.x + this.dx;
    const y = this.y + this.dy;
    if (x + this.width > el.x && x < el.x + el.width &&
        y + this.height > el.y && y < el.y + el.height) return true;
  }

  bumpBlock(blocks, game) {
    blockAudio.play();
    this.dy *= -1;
    blocks.isAlive = false;
    ++game.scored;
    if (game.scored >= game.blocks.length) game.over(true);
  }

  whichSide(platform) {
    if ((this.x + this.width / 2) < (platform.x + platform.width / 2)) {
      return (((this.x + this.width / 2) - (platform.x + platform.width / 2)) < -30) ? -this.speed / 2 : -this.speed;
    } else {
      return (((this.x + this.width / 2) - (platform.x + platform.width / 2)) < 30) ? this.speed / 2 : this.speed;
    }
  }

  bumpPlatform(platform) {
    platformAudio.play();
    this.dy = -this.speed;
    this.dx = this.whichSide(platform);
  }

  checkBounds(game) {
    const x = this.x + this.dx;
    const y = this.y + this.dy;
    if (x < 0) {
      // left
      this.x = 0;
      this.dx = this.speed;
    } else if (x + this.width > game.width) {
      // right
      this.x = game.width - this.width;
      this.dx = -this.speed;
    } else if (y < 0) {
      // top
      this.y = 0;
      this.dy = this.speed;
    } else if (y + this.height > game.height) {
      // bottom
      ++game.livesNum;
      game.lives[game.livesNum - 1].isShow = false;
      if (game.livesNum === 3) {
        game.over(false);
      } else {
        this.x = game.width / 2 - 19;
        this.y = game.height - 90;
        game.platform.x = game.width / 2 - 70;
      }
    }
  }
};

const blockAudio = new Audio("sound/block.mp3");
const platformAudio = new Audio("sound/platform.mp3");
