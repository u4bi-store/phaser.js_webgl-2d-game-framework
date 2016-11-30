/*index js*/

var game;
var ball;
var paddle;

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
  
  game.load.image('ball', 'images/ball.png'); /* 이미지 불러오고 ball이란 id를 줌*/
  game.load.image('paddle', 'images/paddle.png');
  
}
function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE); /* 물리 엔진 초기화 함수 내부 첫줄에 설정해야한다고 함.*/
  
  ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
  /* add. sprite x y id 생성 렌더링됨*/
  ball.anchor.set(0.5, 2); /* add한 지정 위치에 대한 x, y 앵커지정*/
  game.physics.enable(ball, Phaser.Physics.ARCADE); /* ball에 물리엔진을 활성화 시킴*/
  ball.body.velocity.set(150, -150); /* ball을 이동 x y*/
  ball.body.collideWorldBounds = true; /* 캔버스 테두리 벽면 활성화 벽에 부딪힐 시 반전*/
  ball.body.bounce.set(0.9); /* 반전될 때의 중력 바운스값*/
  
  paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
  /* game.world.width*0.5 = 중앙, world.height-5 맨 아래 바텀에서-5 에 paddle을 add함 */
  paddle.anchor.set(0.5, 1); /* add한 지정 위치에 대한 x, y 앵커지정*/
  game.physics.enable(paddle, Phaser.Physics.ARCADE); /* paddle에 물리엔진을 활성화 시킴*/
  
  paddle.body.immovable = true;
  /* 외부 오브젝트와 충격을 받아 반전을 일으킬 때 immovable가 true시 paddle는 반전안함*/
}

function update(){
  game.physics.arcade.collide(ball, paddle); /* 충격감지하여 반전*/
  paddle.x = game.input.x || game.world.width*0.5;
  /* paddle의 x값을 인풋의 x값으로 고정함
  위만 하면은 첫 페이지 로드시에 모서리에 고정되어 나타나는걸 볼 수 있음.
  따라서 || game.world.width *0.5;를 기입하여 초기 x자리를 설정해줘야함.
  
  첫 로드 시 input.x가 아직 정의되지 않아 뒤에 || 에 따라 디폴트 위치 설정 가능하다함. */
}