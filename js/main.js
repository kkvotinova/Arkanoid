'use strict';

import Game from "./game.js";

document.addEventListener('DOMContentLoaded', () => {
  //* modal hint
  document.querySelector('.modal-start-hint').addEventListener('click', () => {
    const modal = document.querySelector('.modal-hint');
    modal.classList.toggle('modal-show');
    const modalBack = document.querySelector('.modal-back');
    modalBack.style.display = 'block';
    document.addEventListener('click', (e) => {
      if (modal.classList.contains('modal-show') && e.target.nodeName != 'SPAN') {
        modal.classList.remove('modal-show');
        modalBack.style.display = 'none';
      }
    });
  });
  //* start game
  document.querySelector('.modal-start-btn').addEventListener('click', () => {
    document.querySelector('.modal-start').style.display = 'none';
    const game = new Game(1000, 550);
    game.start();
  });
});
