/* coin-run index js*/
var game;
var platforms;

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
  game.physics.startSystem(Phaser.Physics.ARCADE); /* 물리적용*/
  game.add.sprite(0, 0, 'sky'); /* 배경 에드*/
  
  platforms = game.add.group(); /* 그룹핑함*/
  platforms.enableBody = true; /* platforms에 들어가는건 물리가 적용됨*/
  
  var ground = platforms.create(0, game.world.height -64, 'ground'); /* (width, height, )*/
  ground.scale.setTo(2, 2); /* size x1, y1 포인터지정*/
  ground.body.immovable = true; /* 어떠한 충격에 의해 방해를 안받기를 활성화*/
  
  var ledge = platforms.create(400, 400, 'ground'); /* 400,400 위치에생성*/
  ledge.body.immovable = true;
  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;
}

function update() {
}