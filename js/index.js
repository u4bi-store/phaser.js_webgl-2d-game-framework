var background;
var game;
var ball;
var paddle;
var bricks, newBrick, brickInfo;
var scoreText,score;
var liveText,lives,lifeLostText;
var playing;
var startButton;
var bounce, intro;

function init(){
  console.log('ok game');
  game = new Phaser.Game(800, 500, Phaser.AUTO, 'game-area', {
    preload: preload,
    create: create,
    update: update
  });

  score = 0;
  lives = 3;
}

function preload(){
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  //game.stage.backgroundColor = 'rgba(0,0,0,0.44)';

  game.load.image('background', 'images/sky.png');
  game.load.image('paddle', 'images/paddle.png');
  game.load.spritesheet('ball', 'images/spritesheet.png', 25, 26);
  game.load.spritesheet('brick', 'images/brick_spritesheet.png', 23, 27);
  game.load.spritesheet('button', 'images/button.png', 120,40);
  game.load.audio('bounce', 'audio/bounce.mp3');

}

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.checkCollision.down = false; 
  background = game.add.tileSprite(0, 0, 800, 600, 'background');

  ball = game.add.sprite(game.world.width*0.5, game.world.height-10, 'ball');

  ball.animations.add('ballEffect1', [0,2,0,2,0,2,0,2,0], 10);
  ball.animations.add('ballEffect2', [0,1,0,1,0,1,0,1,0], 10);

  ball.anchor.set(0.5, 2);
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  ball.body.collideWorldBounds = true; 
  ball.body.bounce.set(1.1);
  ball.checkWorldBounds = true; 
  ball.events.onOutOfBounds.add(ballLeaveScreen, this);

  paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
  paddle.anchor.set(0.5, 1);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);

  paddle.body.immovable = true;
  initBricks();

  var textStyle = { font: '30px NanumGothic', fill: '#fff' };

  scoreText = game.add.text(5, 5, '점수 : 0', textStyle);
  livesText = game.add.text(game.world.width-5, 5, '목숨 : '+lives, textStyle);
  livesText.anchor.set(1,0);
  lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, '목숨이 남아 있습니다. 클릭하시면 게임이 진행됩니다.', textStyle);
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;

  startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5);

  bounce = game.add.audio('bounce');
  intro = game.add.audio('intro');
}
function update(){
  game.physics.arcade.collide(ball, paddle, ballHitPaddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  if(playing) paddle.x = game.input.x || game.world.width*0.5;
}

function initBricks(){
  brickInfo ={
    width: 30,
    height: 20,
    count: {
      row: 17,
      col: 7
    },
    offset: {
      top: 20,
      left: 35
    },
    padding: 15
  };

  bricks = game.add.group();

  for(c=0; c<brickInfo.count.col; c++){
    for(r=0; r<brickInfo.count.row; r++){

    var brickX = (r * (brickInfo.width + brickInfo.padding) )  + brickInfo.offset.left;
    var brickY = (c * (brickInfo.height + brickInfo.padding) ) + brickInfo.offset.top;
      newBrick = game.add.sprite(brickX, brickY, 'brick');
      var num = Math.floor(Math.random()*(10-0+1));
      newBrick.frame = num;
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
}

function ballHitBrick(ball, brick){
  var killTween = game.add.tween(brick.scale).to({x:0,y:0}, 500, Phaser.Easing.Elastic.Out, true, 0);
  killTween.onComplete.addOnce(function(){
    brick.kill();
    score += 10;
    scoreText.setText('점수 : '+score);
    if(score === brickInfo.count.row * brickInfo.count.col * 10) {
      lifeLostText.setText('승리하였습니다. 화면을 클릭하면 게임이 재진행됩니다.');
      lifeLostText.visible = true;
      ball.reset(game.world.width*0.5, game.world.height-25); 
      paddle.reset(game.world.width*0.5, game.world.height-5);

      game.input.onDown.addOnce(function(){
        restart();
      }, this);
    }
  }, this);
  ball.animations.play('ballEffect2');
  bounce.play();
}

function ballLeaveScreen(){
  lives--;

  if(lives){
    livesText.setText('목숨 : '+lives);
    lifeLostText.setText('목숨이 남아 있습니다. 클릭하시면 게임이 진행됩니다.');
    lifeLostText.visible = true; 
    ball.reset(game.world.width*0.5, game.world.height-25); 
    paddle.reset(game.world.width*0.5, game.world.height-5);

    game.input.onDown.addOnce(function(){
      lifeLostText.visible = false;
      ball.body.velocity.set(0, 100);
    }, this);

  }else{
    livesText.setText('목숨 : Die!');
    lifeLostText.setText('당신의 점수는 '+score+'점입니다. 게임을 다시 시작하시겠습니까?');
    lifeLostText.visible = true;
    ball.reset(game.world.width*0.5, game.world.height-25); 
    paddle.reset(game.world.width*0.5, game.world.height-5);

    game.input.onDown.addOnce(function(){
      for(var i=0; i<bricks.length; i++) {
        bricks.children[i].kill();
      }
      restart();
    }, this);
  }
}

function ballHitPaddle(ball, paddle){
  // ball.animations.play('ballEffect1');
 if(ball.body.velocity.y < -700){
    ball.body.velocity.y = 600;
  }
  ball.body.velocity.x = -1*5*(paddle.x-ball.x);
}

function startGame() {
  startButton.destroy();
  ball.body.velocity.set(0, 200); 
  playing = true;
}

function restart(){
  initBricks();
  score = 0;
  lives=3;
  livesText.setText('목숨 : '+lives);
  scoreText.setText('점수 : '+score);
  lifeLostText.visible = false;
  ball.body.velocity.set(0, 100);
}