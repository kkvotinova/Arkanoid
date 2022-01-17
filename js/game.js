import Platform from "./platform.js";
import Ball from "./ball.js";

export default class Game {
  rows = 4;
  cols = 6;
  livesNum = 0;
  scored = 0;
  running = true;
  sprites = { platform:undefined, ball:undefined, blocks:undefined, lives:undefined };

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.ball = new Ball(35, 35, this);
    this.platform = new Platform(132, 35, this);
  }

  init() {
    const canvas = document.querySelector('#myCanvas');
    this.ctx = canvas.getContext('2d');
    this.ctx.font = `bold 25px 'Press Start 2P'`;
    this.ctx.fillStyle = '#df5700';

    document.addEventListener('keydown', e => {
      if (e.key == 'ArrowLeft') {
        this.platform.dx = -this.platform.speed;
      } else if (e.key == 'ArrowRight') {
        this.platform.dx = this.platform.speed;
      } else if (e.key == ' ' || e.key == 'ArrowUp') {
        this.platform.releaseBall(this);
      }
    });
    document.addEventListener('keyup', () => this.platform.stop());
  }

  load() {
    for (const key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = `img/${key}.png`;
    }
  }

  create() {
    this.blocks = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.blocks.push({
          width: 135,
          height: 45,
          x: 145 * col + 65,
          y: 55 * row + 45,
          isAlive: true,
        });
      }
    }

    this.lives = [];
    for (let i = 1; i < 4; i++) {
      this.lives.push({
        x: 45 * i + (this.width - 185),
        y: this.height - 40,
        isShow: true,
      });
    }
  }

  start() {
    // playing music
    startAudio.play();
    // creating an execution context, a button handler
    this.init();
    // uploading images
    this.load();
    // creating an array of blocks and lives
    this.create();
    // start main function
    this.run();
  }

  render() {
    // drawing images in canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
    this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
    this.blocks.forEach(el => {
      if (el.isAlive) {
        this.ctx.drawImage(this.sprites.blocks, el.x, el.y);
      }
    }, this);
    this.lives.forEach(el => {
      if (el.isShow) {
        this.ctx.drawImage(this.sprites.lives, el.x, el.y);
      }
    }, this);
    this.ctx.fillText('Score:' + this.scored, 15, this.height - 15);
  }

  update() {
    /* data updates depending on conditions
        - platform shift/ball
        - delete block/life
    */
    if (this.ball.collide(this.platform)) this.ball.bumpPlatform(this.platform);
    if (this.platform.dx) this.platform.move();
    if (this.ball.dx || this.ball.dy) this.ball.move();

    if (this.platform.x < 0) this.platform.x = 0;
    if (this.platform.x + this.platform.width > this.width) this.platform.x = this.width - this.platform.width;

    this.blocks.forEach(el => {
      if (el.isAlive) {
        if (this.ball.collide(el)) {
          this.ball.bumpBlock(el, this);
        }
      }
    }, this);

    this.ball.checkBounds(this);
  }

  run() {
    this.update();
    this.render();
    if (this.running)
      window.requestAnimationFrame(() => this.run());
  }

  over(flag) {
    // end of the game
    const modal = document.querySelector('.modal-end');
    modal.style.display = 'flex';
    const title = document.querySelector('.modal-end-title');
    if (flag) {
      startAudio.play();
      title.textContent = 'You win!';
    } else {
      gameOverAudio.play();
      title.textContent = 'Game over!';
    }
    this.running = false;
    document.querySelector('.modal-end-btn').addEventListener('click', () => {
      modal.style = '';
      new Game(1000, 550).start();
    });
  }
};

const startAudio = new Audio("sound/start.mp3");
const gameOverAudio = new Audio("sound/gameover.mp3");
