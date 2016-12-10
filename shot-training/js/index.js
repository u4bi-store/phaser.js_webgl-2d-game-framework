/* shot-training index.js*/

var game;
var target, background;

function init(){
  game = new Phaser.Game(1920, 1200, Phaser.AUTO, 'game-area', {
    preload: preload,
    create: create,
    update: update
  });
}

function preload(){
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.load.image('background', 'images/back_0.jpg');
  game.load.image('target', 'images/target.png');
}
function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  background = game.add.tileSprite(0, 0, 1920, 1200, 'background');
  
  target = game.add.sprite(100, 100, 'target');
  game.physics.enable(target, Phaser.Physics.ARCADE);
  target.body.collideWorldBounds = true; 
  target.body.bounce.set(1);
  target.checkWorldBounds = true;
  target.body.velocity.set(1000, 1000);
}
function update(){}