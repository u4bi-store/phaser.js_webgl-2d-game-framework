/*index js*/

var game;
var ball;

function init(){
  /* Game : width, height, renderer, parent(dom id string)
  https://phaser.io/docs/2.6.2/Phaser.Game.html */
  game = new Phaser.Game(480, 320, Phaser.AUTO, 'game-area', {
    preload: preload,
    create: create,
    update: update
  });
  
}

function preload(){
  /* scale : 캔버스 내 설정을 바꿀 수 있음 */
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  /* ScaleManager
     @ NO_SCALE  : 아무것도 안함
     @ EXACT_FIT : 종횡비 유지안함 가로로 꽉채움
     @ SHOW_ALL  : 이미지나 화면이 왜곡되지 않게 가로 세로 비율을 유지하며 캔버스 크기를 채움
     @ RESIZE    : 최대 가능한 폭과 높이로 캔버스 크기를 동적으로 만듬
     @ USER_SCALE: 자신이 설정한 크기 사용자가 정의한 동적 크기로 조정
  */
  game.scale.pageAlignHorizontally = true; /* 가로 정렬 */
  game.scale.pageAlignVertically = true; /* 세로 정렬 */
  
  game.stage.backgroundColor = 'rgba(245, 245, 245, 1)'; /* css 문법 이용해 컬러 변경 가능*/
  
  game.load.image('ball', 'images/smiley.gif'); /* 이미지 불러오고 ball이란 id를 줌*/
  
}
function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE); /* 물리 엔진 초기화 함수 내부 첫줄에 설정해야한다고 함.*/
  ball = game.add.sprite(50, 50, 'ball'); /* add. sprite x y id 생성 렌더링됨*/
  game.physics.enable(ball, Phaser.Physics.ARCADE); /* ball에 물리엔진을 활성화 시킴*/
  
  ball.body.velocity.set(100,0); /* ball을 이동 x y*/
  
  ball.body.collideWorldBounds = true; /* 캔버스 테두리 벽면 활성화 벽에 부딪힐 시 반전*/
  ball.body.bounce.set(0.9); /* 반전될 때의 중력 바운스값*/
}
function update(){
}