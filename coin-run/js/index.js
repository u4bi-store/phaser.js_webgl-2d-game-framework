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
  ledge.body.immovable = true; /* 어떠한 충격에 의해 방해를 안받기를 활성화*/
  ledge = platforms.create(-150, 250, 'ground');  /* -150,250 위치에생성*/
  ledge.body.immovable = true; /* 어떠한 충격에 의해 방해를 안받기를 활성화*/

  player = game.add.sprite(32, game.world.height - 150, 'dude'); /* 캐릭터 에드*/
  game.physics.arcade.enable(player); /* 캐릭터에게 물리 적용*/

  player.body.bounce.y = 0.2; /* 캐릭터에게 충돌에 의한 튕김값 정의*/
  player.body.gravity.y = 300; /* 캐릭터의 중력도 y값 정의*/
  player.body.collideWorldBounds = true; /* 활동 경계면과의 충돌 감지*/
  
  player.animations.add('left', [0, 1, 2, 3], 10, true); /* 캐릭터의 애니메이션 정의 왼쪽*/
  player.animations.add('right', [5, 6, 7, 8], 10, true); /* 캐릭터의 애니메이션 정의 오른쪽*/
}

function update() {
  var gitPlatform = game.physics.arcade.collide(player, platforms); /* 플레이어와 플랫폼스안의 요소들과 충돌시 감지*/
}