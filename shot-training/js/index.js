/* shot-training index.js*/

var game;
var target, background;
var crosshair;
var info;
var click;
var playing = false;

var timeText, time;

var passTimer;

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
  game.load.image('click', 'images/click.png');
  game.load.image('info', 'images/info.png');
  game.load.image('crosshair', 'images/crosshair.png');
  game.load.image('target', 'images/target.png');
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
 
}

function update(){
  crosshair.x = game.input.x-(crosshair.width/2);
  crosshair.y = game.input.y-(crosshair.height/2);
  var targetIn = game.physics.arcade.overlap(crosshair, target, null, null, this);
  
  if(playing){
    if(!targetIn){
      clearTimeout(passTimer);
      playing=!playing;
      ready();
      target.reset(click.x, click.y);
      target.body.velocity.set(0, 0);
      timeText.destroy();
    }
  }
}

function start(){
  target.body.velocity.set(200, 0);
  click.destroy();
  info.destroy();
  playing =true;
  time = 0;
  
  var textStyle = { font: 'bold 3rem NanumGothic', fill: '#000' };
  timeText = game.add.text(window.innerWidth+200, 5, '누적시간 : '+time+'초', textStyle);
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
  info = game.add.sprite(window.innerWidth-(window.innerWidth/4.3), 0, 'info');
  click = game.add.button(window.innerWidth/2, window.innerHeight/2, 'click',start, this, 1, 0, 2);
  click.anchor.set(-0.2, -0.2);
}

function updateTarget(){
  var value = Math.floor(Math.random() * 100);
  
  var flag_rand  = Math.floor(Math.random() * 2);
  if(flag_rand) value = -value;
  
  target.body.velocity.x +=value+time;
  target.body.velocity.y +=value+time;
}