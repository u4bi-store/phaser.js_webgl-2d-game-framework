/* rade-tile index.js*/
	
var game, game_data;
var radeTile = function(){}; /* 클래스로 초기화*/

function init(){
  game_data = {width: 750, height: 700, tileSize: 140, fieldSize: 5};
  
  game = new Phaser.Game(game_data.width, game_data.height);
  game.state.add("radeTile", radeTile); /* 클래스 정의후 타입줌*/
  game.state.start("radeTile"); /* 정의된 타입호출*/
}

radeTile.prototype = { /* 클래스 호출됨 prototype에 모두 담음*/
  preload : function(){
    game.stage.backgroundColor = 0x333333; /* css 문법 이용해 컬러 변경 가능 'rgba(245, 245, 245, 1)' '#ffff00' */
    game.load.image("tiles", "images/tiles.png"); /* 이미지 불러오고 titles이란 id를 줌*/
    game.load.spritesheet("arrows", "images/arrows.png", 420, 420); /* 스프라이트시트 이미지 불러오고 arrows이란 id를 줌*/
  },
  create: function(){
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; /* 종횡비 설정*/
    /* ScaleManager
      @ NO_SCALE  : 아무것도 안함
      @ EXACT_FIT : 종횡비 유지안함 가로로 꽉채움
      @ SHOW_ALL  : 이미지나 화면이 왜곡되지 않게 가로 세로 비율을 유지하며 캔버스 크기를 채움
      @ RESIZE    : 최대 가능한 폭과 높이로 캔버스 크기를 동적으로 만듬
			@ USER_SCALE: 자신이 설정한 크기 사용자가 정의한 동적 크기로 조정
    */
    game.scale.pageAlignHorizontally = true; /* 가로 정렬 */
    game.scale.pageAlignVertically = true; /* 세로 정렬 */
    this.initTile(); /* 타일 초기화함*/
    game.input.onDown.add(this.pickTile, this);
  },
  update: function(){},
  initTile: function(){
    this.tilesArray = []; /* tiles 어레이 */
    this.arrowsArray = []; /* arrow 어레이 */
    
    this.tileGroup = game.add.group(); /* 그룹화함*/
    this.arrowsGroup = game.add.group(); /* 그룹화함*/
    
    var groupSize = game_data.tileSize * game_data.fieldSize; /* 그룹내 x,y값 사이즈 리턴*/
    this.tileGroup.x = (game.width - groupSize) / 2; /* tileGroup 그룹의 x값에 캔버스 너비 - 종횡비 나누기 2*/
    this.tileGroup.y = (game.height - groupSize) / 2; /* tileGroup 그룹의 y값에  캔버스 높이 - 종횡비 나누기 2*/
    this.arrowsGroup.x = (game.width - groupSize) / 2; /* arrowsGroup 그룹의 x값에 캔버스 너비 - 종횡비 나누기 2*/
    this.arrowsGroup.y = (game.height - groupSize) / 2; /* arrowsGroup 그룹의 y값에 캔버스 높이 - 종횡비 나누기 2*/
    
    for(var i = 0; i < game_data.fieldSize; i++){ /* 포문루프*/
      this.tilesArray[i] = []; /* 2중 선언*/
      for(var j = 0; j < game_data.fieldSize; j++){
        this.addTile(i, j); /*루프값에 따른 로우 컬럼을 매개변수로 주입하여 함수 호출*/
      }
    }
  },
  addTile: function(row, col){ /* 로우 컬럼을 인자로 받아 어레이 정의*/
    var tileXPos = col * game_data.tileSize + game_data.tileSize / 2;
    var tileYPos = row * game_data.tileSize + game_data.tileSize / 2;
    var theTile = game.add.sprite(tileXPos, tileYPos, "tiles"); /* add. sprite x y id 생성 렌더링됨*/
    
    theTile.picked = false; /* 선택되어지지 않은 타일로 초기화함*/
    theTile.anchor.set(0.5); /* add한 지정 위치에 대한 x, y 앵커지정 */
    theTile.coordinate = new Phaser.Point(col, row); /* 포인터지정*/
    
    this.tilesArray[row][col] = theTile;
    this.tileGroup.add(theTile); /*tileGroup 그룹에 정의된 theTile를 에드함*/
  },
  pickTile: function(e){ /* 타일을 눌렀을 때 호출*/
    this.visitedTiles = []; /* visitedTiles 어레이*/
    this.visitedTiles.length = 0;
    
    if(!this.tileGroup.getBounds().contains(e.position.x, e.position.y)) return;
    /* 이벤트를 전달받은 x,y 값이 tileGroup 그룹내 지정된 컨테이너 내부가 아닐 경우 리턴 */                                                                                       
    var col = Math.floor((e.position.x - this.tileGroup.x) / game_data.tileSize);
    var row = Math.floor((e.position.y - this.tileGroup.y) / game_data.tileSize);
    
    this.tilesArray[row][col].alpha = 0.5; /*그룹안에 속한 특정 tile의 알파값을 0.5로 조정*/
    this.tilesArray[row][col].picked = true; /* 현재 포인트 지정 타일 선택되어짐*/
    
    game.input.onDown.remove(this.pickTile, this); /* 눌렀을 시 이후 해당 함수의 호출을 리무브함*/
    game.input.onUp.add(this.releaseTile, this); /* 누른 상태에서 때었을 때 releaseTile 콜백 호출*/
    game.input.addMoveCallback(this.moveTile, this); /* 누른 상태에서 무브를 하게 된다면 moveTile 콜백 호출*/
    this.visitedTiles.push(this.tilesArray[row][col].coordinate); /* 포인터가 찍힌 타일을 푸쉬함*/
  },
  moveTile: function(e){
    if(!this.tileGroup.getBounds().contains(e.position.x, e.position.y)) return;
      
    var col = Math.floor((e.position.x - this.tileGroup.x) / game_data.tileSize); /* 컬럼체크 */
    var row = Math.floor((e.position.y - this.tileGroup.y) / game_data.tileSize); /* 로우체크 */
    var distance = new Phaser.Point(e.position.x - this.tileGroup.x, e.position.y - this.tileGroup.y).distance(this.tilesArray[row][col]);
    if(distance < game_data.tileSize * 0.4){ /*반경보다 넓다면*/
      if(!this.tilesArray[row][col].picked && this.checkAdjacent(new Phaser.Point(col, row), this.visitedTiles[this.visitedTiles.length - 1])){
        /* 처음 포인터가 찍히는 곳이라면*/
        console.log('처음가는 길목 f-1 로우 : '+row + ' 컬럼 : '+col);
        this.tilesArray[row][col].picked = true; /* 현재 포인트 지정 타일 선택되어짐*/
        this.tilesArray[row][col].alpha = 0.5; /*그룹안에 속한 특정 tile의 알파값을 0.5로 조정*/
        this.visitedTiles.push(this.tilesArray[row][col].coordinate); /* 포인터가 찍힌 타일을 푸쉬함*/
        
      }else{/* 그게 아니라면*/
        if(this.visitedTiles.length > 1 && row == this.visitedTiles[this.visitedTiles.length - 2].y && col == this.visitedTiles[this.visitedTiles.length - 2].x){
          /* 되돌아갔다면*/
					console.log('이미 갔던길임 f-2 로우 : '+row + ' 컬럼 : '+col);
          this.tilesArray[this.visitedTiles[this.visitedTiles.length - 1].y][this.visitedTiles[this.visitedTiles.length - 1].x].picked = false; /* 되돌아감으로 해당 타일을 선택하지 않은 타일로 조정*/
          this.tilesArray[this.visitedTiles[this.visitedTiles.length - 1].y][this.visitedTiles[this.visitedTiles.length - 1].x].alpha = 1; /* 알파값을 1로 설정해줌 */
          this.visitedTiles.pop(); /* visitedTiles란 어레이에 담겨진 마지막 요소 즉 마지막으로 푸쉬된 타일을 삭제함*/
        }
      }
    }
  },
  releaseTile: function(){ /* 타일을 눌른 상태에서 때었을 때 호출*/
  	this.arrowsGroup.removeAll(true); /* arrows 그룹 내 모든걸 요소를 리무브함*/
    
    for(var i = 0; i < game_data.fieldSize; i++){
    	for(var j = 0; j < game_data.fieldSize; j++){
    		this.tilesArray[i][j].alpha = 1; /* 사이즈까지 루프를 돌려 모든 필드의 알파값을 1로 조정함*/
        this.tilesArray[i][j].picked = false; /* 모든 필드의 타일들을 선택되어지지 않은 타일로 조정함*/
  		}
  	}
    game.input.onUp.remove(this.releaseTile, this); /* 때었을 시 이후 해당 함수의 호출 이벤트를 제거함*/
    game.input.deleteMoveCallback(this.moveTile, this); /* 무브하고 있다 때었을 시 해당함수의 호출 이벤트를 제거함*/
    game.input.onDown.add(this.pickTile, this); /* 땐 상태에서 다시 눌렀을 때 pickTile 콜백 호출*/
  },
  checkAdjacent: function(p1, p2){ /*p1과 p2가 서로 인접한지를 체크함*/
    return (Math.abs(p1.x - p2.x) <= 1) && (Math.abs(p1.y - p2.y) <= 1);
  },
  addArrow: function(){}
};