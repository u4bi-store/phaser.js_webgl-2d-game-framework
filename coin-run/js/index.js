/* coin-run index js*/
var game;

function init(){
  game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-area',{
    preload: preload,
    create: create,
    update: update
  });  
}

function preload() {
  game.load.image('sky', 'images/sky.png');
  game.load.image('ground', 'images/platform.png');
  game.load.image('star', 'images/star.png');
  game.load.spritesheet('dude', 'images/dude.png', 32, 48);
}

function create() {
  game.add.sprite(0, 0, 'star');
}

function update() {
}