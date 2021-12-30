'use strict';

(() => {
  const game = {
    width: 1000,
    height: 550,
    ctx: undefined,
    rows: 4,
    cols: 6,
    blocks: [],
    lives: [],
    livesNum: 0,
    scored: 0,
    running: true,
    sprites: {
      platform: undefined,
      ball: undefined,
      blocks: undefined,
      lives: undefined,
    },
    init: function() {
      const canvas = document.querySelector('#myCanvas');
      this.ctx = canvas.getContext('2d');
      this.ctx.font = `bold 25px 'Press Start 2P'`;
      this.ctx.fillStyle = '#df5700';

      document.addEventListener('keydown', e => {
        if (e.key == 'ArrowLeft' && game.platform.x > 0) {
          game.platform.dx = -game.platform.speed;
        } else if (e.key == 'ArrowRight' && game.platform.x < this.width - game.platform.width) {
          game.platform.dx = game.platform.speed;
        } else if (e.key == ' ' || e.key == 'ArrowUp') {
          game.platform.releaseBall();
        }
      });
      document.addEventListener('keyup', () => game.platform.stop());
    },
    load: function() {
      for (const key in this.sprites) {
        this.sprites[key] = new Image();
        this.sprites[key].src = `img/${key}.png`;
      }
    },
    create: function() {
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
      for (let i = 1; i < 4; i++) {
        this.lives.push({
          x: 45 * i + (this.width - 185),
          y: this.height - 40,
          isShow: true,
        });
      }
    },
    start: function() {
      this.init();
      this.load();
      this.create();
      this.run();
    },
    render: function() {
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
    },
    update: function() {
      if (this.ball.collide(this.platform)) this.ball.bumpPlatform(this.platform);
      if (this.platform.dx) this.platform.move();
      if (this.ball.dx || this.ball.dy) this.ball.move();

      this.blocks.forEach(el => {
        if (el.isAlive) {
          if (this.ball.collide(el)) {
            this.ball.bumpBlock(el);
          }
        }
      }, this);

      this.ball.checkBounds();
    },
    run: function() {
      this.update();
      this.render();
      if (this.running)
        window.requestAnimationFrame(() => game.run());
    },
    over: function(flag) {
      document.querySelector('.modal-end').style.display = 'flex';
      const title = document.querySelector('.modal-end-title');
      if (flag) {
        startAudio.play();
        title.textContent = 'You win!';
      } else {
        gameOverAudio.play();
        title.textContent = 'Game over!';
      }
      this.running = false;
      document.querySelector('.modal-end-btn').addEventListener('click', () => window.location.reload());
    }
  };

  game.ball = {
    width: 35,
    height: 35,
    x: game.width / 2 - 19,
    y: game.height - 90,
    dx: 0,
    dy: 0,
    speed: 3,
    jump: function() {
      this.dx = -this.speed;
      this.dy = -this.speed;
    },
    move: function() {
      this.x += this.dx;
      this.y += this.dy;
    },
    collide: function(el) {
      const x = this.x + this.dx;
      const y = this.y + this.dy;
      if (x + this.width > el.x && x < el.x + el.width &&
          y + this.height > el.y && y < el.y + el.height) return true;
    },
    bumpBlock: function(blocks) {
      blockAudio.play();
      this.dy *= -1;
      blocks.isAlive = false;
      ++game.scored;
      if (game.scored >= game.blocks.length) game.over(true);
    },
    onTheLeftSide: function(platform) {
      return (this.x + this.width / 2) < (platform.x + platform.width / 2);
    },
    bumpPlatform: function(platform) {
      platformAudio.play();
      this.dy = -this.speed;
      this.dx = -this.onTheLeftSide(platform) ?  -this.speed : this.speed;
    },
    checkBounds: function() {
      const x = this.x + this.dx;
      const y = this.y + this.dy;
      if (x < 0) {
        this.x = 0;
        this.dx = this.speed;
      } else if (x + this.width > game.width) {
        this.x = game.width - this.width;
        this.dx = -this.speed;
      } else if (y < 0) {
        this.y = 0;
        this.dy = this.speed;
      } else if (y + this.height > game.height) {
        ++game.livesNum;
        if (game.livesNum === 3) {
          game.over(false);
        } else {
          game.lives[game.livesNum - 1].isShow = false;
          this.x = game.width / 2 - 19;
          this.y = game.height - 90;
          game.platform.x = game.width / 2 - 70;
        }
      }
    }
  };

  game.platform = {
    width: 132,
    height: 35,
    x: game.width / 2 - 70,
    y: game.height - 55,
    speed: 7,
    dx: 0,
    ball: game.ball,
    animate: function() {
      setInterval(() => {
        const i = Math.trunc(Math.random() * (4 - 1) + 1);
        game.sprites.platform.src = (i === 1) ? `img/platform.png` : `img/platform-${i}.png`;
      }, 500);
    },
    releaseBall: function() {
      if (this.ball) {
        this.ball.jump();
        this.ball = false;
      }
    },
    move: function() {
      this.animate();
      this.x += this.dx;
      if (this.ball) this.ball.x += this.dx;
    },
    stop: function() {
      this.dx = 0;
      if (this.ball) this.ball.dx = 0;
    }
  };

  const startAudio = new Audio("sound/start.mp3");
  const gameOverAudio = new Audio("sound/gameover.mp3");
  const blockAudio = new Audio("sound/block.mp3");
  const platformAudio = new Audio("sound/platform.mp3");

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.modal-start-hint').addEventListener('click', () => {
      const modal = document.querySelector('.modal-hint');
      modal.classList.toggle('modal-show');
      document.addEventListener('click', (e) => {
        if (modal.classList.contains('modal-show') && e.target.nodeName != 'SPAN') {
          modal.classList.remove('modal-show');
        }
      });
    });
    document.querySelector('.modal-start-btn').addEventListener('click', () => {
      document.querySelector('.modal-start').style.display = 'none';
      startAudio.play();
      game.start();
    });
  });
})();
