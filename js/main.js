'use strict';

(() => {
  const game = {
    ctx: undefined,
    sprites: {
      background: undefined
    },
    start: function() {
      // находим в html элемент canvas И создаём контекст
      const canvas = document.querySelector('#myCanvas');
      this.ctx = canvas.getContext('2d');

      // загружаем изображение
      this.sprites.background = new Image();
      // this.sprites.background.src = 'img/canvas-back.jpg'

      this.run();
    },
    render: function() {
      this.ctx.drawImage(this.sprites.background, 0, 0);
    },
    run: function() {
      this.render();
      // рисуем изображение
      window.requestAnimationFrame(() => game.run());
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    game.start();
  });
})();
