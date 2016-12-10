/* shot-training index.js*/

var game;
var target, background;
var crosshair;
var info;
var click;
var playing = false;

var timeText, time;
var resultText;

var passTimer;

var die;

var gameWidth = 1920, gameHeight = 1200;
function init(){
  game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game-area', {
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
  game.load.image('click', 'images/click.png');
  game.load.image('info', 'images/info_0.png');
  game.load.image('crosshair', 'images/crosshair.png');
  game.load.image('target', 'images/target.png');
  
  game.load.audio('die', 'audio/die.mp3');
}
function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);
  background = game.add.tileSprite(0, 0, 1920, 1200, 'background');
  ready();
  
  target = game.add.sprite(click.x, click.y, 'target');
  game.physics.enable(target, Phaser.Physics.ARCADE);
  target.body.collideWorldBounds = true;
  target.body.bounce.set(1);
  target.checkWorldBounds = true;
  
  crosshair = game.add.sprite(0, 0, 'crosshair');
  game.physics.enable(crosshair, Phaser.Physics.ARCADE);

  resultText = game.add.text(gameWidth/1.5, gameHeight/2, '', { font: 'bold 10rem NanumGothic', fill: '#ffff00' });
  
  die = game.add.audio('die');
}

function update(){
  crosshair.x = game.input.x-(crosshair.width/2);
  crosshair.y = game.input.y-(crosshair.height/2);
  var targetIn = game.physics.arcade.overlap(crosshair, target, null, null, this);
  
  if(playing){
    if(!targetIn){
      if(time == 0) return;
      clearTimeout(passTimer);
      playing=!playing;
      ready();
      target.reset(click.x, click.y);
      target.body.velocity.set(0, 0);
      timeText.destroy();
      resultText.text = time+'초!';
      setTimeout(function(){resultText.text ='';},1500);
      die.play();
    }
  }
}

function start(){
  target.body.velocity.set(200, 0);
  click.destroy();
  info.destroy();
  playing =true;
  time = 0;
  
  var textStyle = { font: 'bold 5rem NanumGothic', fill: '#000' };
  timeText = game.add.text(gameWidth/1.6, 5, '누적시간 : '+time+'초', textStyle);
  updateTarget();
  setTimeout('passTime()', 1000);
}

function passTime(){
  time++;
  updateTarget();
  timeText.text = '누적시간 : '+time+'초';
  passTimer = setTimeout('passTime()', 1000);
}

function ready(){
  info = game.add.sprite(gameWidth/3.7, 0, 'info');
  click = game.add.button(gameWidth/2, gameHeight/2, 'click',start, this, 1, 0, 2);
  click.anchor.set(-0.2, -0.2);
}

function updateTarget(){
  
  var value = Math.floor(Math.random() * 100);
  
  value+=time*10;
  var flag_rand  = Math.floor(Math.random() * 2);
  if(flag_rand) value = -value;
  
  target.body.velocity.x +=value;
  target.body.velocity.y +=value;
}