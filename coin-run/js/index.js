/* coin-run index js*/
var game;
var platforms;
var player, stars;
var cursors;

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
  cursors = game.input.keyboard.createCursorKeys();
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
  
  stars = game.add.group();  /* 그룹핑함*/
  stars.enableBody = true; /* stars에 들어가는건 물리가 적용됨*/
  
  for(var i=0; i< 12; i++){ /* 포문을 돌려 별생성*/
    var star = stars.create(i * 70, 0, 'star'); /*너비는 현재루프 인덱스값 곱하기 70, 높이는 0 위치에 star 생성*/
    star.body.gravity.y = 6; /* star의 중력도 y값 정의*/
    star.body.bounce.y = 0.7+Math.random()*0.2; /* star에게 충돌에 의한 튕김값 정의함*/
  }
}

function update() {
  var hitPlatform = game.physics.arcade.collide(player, platforms); /* 플레이어와 플랫폼스안의 요소들과 충돌시 감지*/
  game.physics.arcade.collide(stars, platforms); /* stars그룹이 플랫폼스그룹과 충돌시 감지 팅겨져감*/
  game.physics.arcade.overlap(player, stars, collectStar, null, this); /* stars그룹이 플레이어와 오버랩될지collectStar 함수 호출*/
  
  player.body.velocity.x = 0; /* 캐릭터 속력의 x값을 0으로 초기화*/

  if(cursors.left.isDown){ /* cursors에 정의된 메서드내의 left를 누른 상태일시*/
      player.body.velocity.x = -150; /* 속력의 x값을 -150으로 설정함*/
      player.animations.play('left'); /* 정의된 애니메이션인 left를 호출함*/
  }else if (cursors.right.isDown){ /* right를 누른 상태일시*/
      player.body.velocity.x = 150; /* 속력의 x값을 150으로 설정함*/
      player.animations.play('right'); /* 정의된 애니메이션인 right를 호출함*/
  }else{ /*아무것도 아니면 */
      player.animations.stop(); /* 호출중인 애니메이션을 멈춰줌*/
      player.frame = 4; /* 캐릭터에게 주입된 스프라이트 시트의 4번째 프레임을 보여줌*/
  }
  
  if (cursors.up.isDown && player.body.touching.down && hitPlatform){
    /* 위쪽키를 누른 상태에서 플랫폼과 캐릭터간의 충돌이 감지된 상태에서 그 충돌이 캐릭터의 바디 아래쪽이라면*/
      player.body.velocity.y = -350; /* 속력의 y값을 -350으로 설정함*/
  }
}

function collectStar (player, star) {
  star.kill(); /* starts 그룹안의 특정 요소 star를 지움*/
}