/*index js*/

var game;
var ball;
var paddle;
var bricks, newBrick, brickInfo;
var scoreText,score;
var liveText,lives,lifeLostText;

function init(){
  /* Game : width, height, renderer, parent(dom id string)
  https://phaser.io/docs/2.6.2/Phaser.Game.html */
  game = new Phaser.Game(480, 320, Phaser.AUTO, 'game-area', {
    preload: preload,
    create: create,
    update: update
  });
  
  score = 0;
  lives = 3;
  
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
  game.load.image('brick', 'images/brick.png');
  
}
function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE); /* 물리 엔진 초기화 함수 내부 첫줄에 설정해야한다고 함.*/
  game.physics.arcade.checkCollision.down = false; /* 아래면 충돌감지 해제 비활성화 */
  ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
  /* add. sprite x y id 생성 렌더링됨*/
  ball.anchor.set(0.5, 2); /* add한 지정 위치에 대한 x, y 앵커지정*/
  game.physics.enable(ball, Phaser.Physics.ARCADE); /* ball에 물리엔진을 활성화 시킴*/
  ball.body.velocity.set(150, -150); /* ball을 이동 x y*/
  ball.body.collideWorldBounds = true; /* 캔버스 테두리 벽면 활성화 벽에 부딪힐 시 반전*/
  ball.body.bounce.set(0.9); /* 반전될 때의 중력 바운스값*/
  ball.checkWorldBounds = true; /* ball에 대한 월드바운스에서의 활동감지 활성화*/
  ball.events.onOutOfBounds.add(function(){
    /* ball이 화면 밖으로 나갔을 시 이벤트 핸들러가 발생함 */
    location.reload();
  });
  
  paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
  /* game.world.width*0.5 = 중앙, world.height-5 맨 아래 바텀에서-5 에 paddle을 add함 */
  paddle.anchor.set(0.5, 1); /* add한 지정 위치에 대한 x, y 앵커지정*/
  game.physics.enable(paddle, Phaser.Physics.ARCADE); /* paddle에 물리엔진을 활성화 시킴*/
  
  paddle.body.immovable = true;
  /* 외부 오브젝트와 충격을 받아 반전을 일으킬 때 immovable가 true시 paddle는 반전안함*/
  
  initBricks();
  
  var textStyle = { font: '16px Consolas', fill: '#072541' }; /* 중복 코드를 핸들링함 */
  
  scoreText = game.add.text(5, 5, '점수 : 0', textStyle);
  /* add.text( x,y, 'string', {canvas style} )*/
  livesText = game.add.text(game.world.width-5, 5, '목숨 : '+lives, textStyle);
  livesText.anchor.set(1,0);
  lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, '목숨이 남아 있습니다. 클릭하시면 게임이 진행됩니다.', textStyle);
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false; /* 화면에서 숨김 */
}

function update(){
  game.physics.arcade.collide(ball, paddle); /* 충격감지하여 반전*/
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  /* collide의 세번째 매개변수는 옵션 : 충돌이 발생했을 때 실행된다 함.
     ballHitBrick함수는 충돌된 오브젝트들의 지정된 이름들을 인자로 받아냄 */
  paddle.x = game.input.x || game.world.width*0.5;
  /* paddle의 x값을 인풋의 x값으로 고정함
  위만 하면은 첫 페이지 로드시에 모서리에 고정되어 나타나는걸 볼 수 있음.
  따라서 || game.world.width *0.5;를 기입하여 초기 x자리를 설정해줘야함.
  
  첫 로드 시 input.x가 아직 정의되지 않아 뒤에 || 에 따라 디폴트 위치 설정 가능하다함. */
}

function initBricks(){
  /* 생성될 벽돌의 정보를 brickInfo 객체에 담음 */
  brickInfo ={
    width: 50,
    height: 20,
    count: {
      row: 5,
      col: 1
    },
    offset: {
      top: 50,
      left: 60
    },
    padding: 40
  };
  
  bricks = game.add.group(); /* bricks를 비어있는 그룹에 담음 그 후 루프를 돌려 newBrick을 담을 것임*/
  
  /* c = column, r = row 행과 열을 잇는 포문*/
  for(c=0; c<brickInfo.count.col; c++){
    for(r=0; r<brickInfo.count.row; r++){
      
    var brickX = (r * (brickInfo.width + brickInfo.padding) )  + brickInfo.offset.left;
      /* (로우값 x (블럭 너비값 + 블럭 패딩값) ) + 블럭 왼쪽 마진값 
      */
    var brickY = (c * (brickInfo.height + brickInfo.padding) ) + brickInfo.offset.top;
      /* (컬럼값 x (블럭 높이값 + 블럭 패딩값) ) + 블럭 위쪽 마진값 
      */
      newBrick = game.add.sprite(brickX, brickY, 'brick'); /* x,y를 지정하고 brick을 add함 */
      game.physics.enable(newBrick, Phaser.Physics.ARCADE); /* 지정된 newBrick의 중력 활성화 */
      newBrick.body.immovable = true; /* 외부의 충돌이 자신에게 감지되어도 안 움직이게함 */
      newBrick.anchor.set(0.5); /* add한 지정 위치에 대한 x, y 앵커지정 */
      bricks.add(newBrick); /* bricks란 그룹에 newBrick을 집어 넣음 */
    }
  }
}

function ballHitBrick(ball, brick){
  /* 인자가 들어오는 순서
     첫인자 : 충돌하는 오브젝트
     두번째 : 외부 충격받는 오브젝트
  */
  brick.kill(); /* 만약 ball.kill()하게되면 ball이 사라짐 */
  score += 10;
  scoreText.setText('점수 : '+score);
  
  var count_alive = 0; /* 카운트*/
  for(i=0; i< bricks.children.length; i++){ /* bricks 그룹에 속한 자식들의 length까지 루프*/
    if(bricks.children[i].alive == true){ /* 자식들의 노드가 살아있다면 count+1 해줌*/
      count_alive++;
    }
  }
  
  /* 루프가 종료된 후*/
  if(count_alive==0){ /* bricks그룹에 속한 자식들의 노드가 모두 죽어있다면 count가 0 따라서 게임승리 */
    alert('win');
    location.reload();
  }
}