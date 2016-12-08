/* tile game index.js*/
	
var game, game_data;
var tileGame = function(){}; /* 클래스로 초기화*/

function init(){
  game_data = {width: 1680, height: 1680, tileSize: 140, fieldSize: 12,fallSpeed: 250};
  
  game = new Phaser.Game(game_data.width, game_data.height);
  game.state.add("tileGame", tileGame); /* 클래스 정의후 타입줌*/
  game.state.start("tileGame"); /* 정의된 타입호출*/
}

tileGame.prototype = { /* 클래스 호출됨 prototype에 모두 담음*/
  preload : function(){
    game.stage.backgroundColor = '0x333333'; /* css 문법 이용해 컬러 변경 가능 'rgba(245, 245, 245, 1)' '#ffff00' */
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
    var text = game.add.text(-game_data.tileSize / 2.8, 0, "로" + theTile.coordinate.y.toString() + ", 컬" + theTile.coordinate.x.toString(), {fill: "#000", font:"bold 30px Arial"});
    /* text 정의 (windth, height , 'string', css style) */
    theTile.addChild(text); /*정의된 text를 theTile에 에드함*/
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
    console.log("첫픽 로: " + row + " 컬: " + col);
  },
  moveTile: function(e){
    if(!this.tileGroup.getBounds().contains(e.position.x, e.position.y)) return;
      
    var col = Math.floor((e.position.x - this.tileGroup.x) / game_data.tileSize); /* 컬럼체크 */
    var row = Math.floor((e.position.y - this.tileGroup.y) / game_data.tileSize); /* 로우체크 */
    var distance = new Phaser.Point(e.position.x - this.tileGroup.x, e.position.y - this.tileGroup.y).distance(this.tilesArray[row][col]);
    if(distance < game_data.tileSize * 0.4){ /*반경보다 넓다면*/
      if(!this.tilesArray[row][col].picked && this.checkAdjacent(new Phaser.Point(col, row), this.visitedTiles[this.visitedTiles.length - 1])){
        /* 처음 포인터가 찍히는 곳이라면*/
        this.tilesArray[row][col].picked = true; /* 현재 포인트 지정 타일 선택되어짐*/
        this.tilesArray[row][col].alpha = 0.5; /*그룹안에 속한 특정 tile의 알파값을 0.5로 조정*/
        this.visitedTiles.push(this.tilesArray[row][col].coordinate); /* 포인터가 찍힌 타일을 푸쉬함*/
        this.addArrow(); /* addArrow 함수호출*/
        console.log("고픽 로: " + row + " 컬: " + col);
        
      }else{/* 그게 아니라면*/
        if(this.visitedTiles.length > 1 && row == this.visitedTiles[this.visitedTiles.length - 2].y && col == this.visitedTiles[this.visitedTiles.length - 2].x){
          /* 되돌아갔다면*/
          this.tilesArray[this.visitedTiles[this.visitedTiles.length - 1].y][this.visitedTiles[this.visitedTiles.length - 1].x].picked = false; /* 되돌아감으로 해당 타일을 선택하지 않은 타일로 조정*/
          this.tilesArray[this.visitedTiles[this.visitedTiles.length - 1].y][this.visitedTiles[this.visitedTiles.length - 1].x].alpha = 1; /* 알파값을 1로 설정해줌 */
          this.visitedTiles.pop(); /* visitedTiles란 어레이에 담겨진 마지막 요소 즉 마지막으로 푸쉬된 타일을 삭제함*/
          
          this.arrowsArray[this.arrowsArray.length - 1].destroy(); /* addArray의 랭쓰 -1 요소 삭제*/
          this.arrowsArray.pop(); /* arrowsArray란 어레이에 담겨진 마지막 요소 즉 마지막으로 푸쉬된 화살표를 제외함*/
          console.log("빽픽 로: " + row + " 컬: " + col);
        }
      }
    }
    /**/
  },
  releaseTile: function(){ /* 타일을 눌른 상태에서 때었을 때 호출*/
    game.input.onUp.remove(this.releaseTile, this); /* 때었을 시 이후 해당 함수의 호출 이벤트를 제거함*/
    game.input.deleteMoveCallback(this.moveTile, this); /* 무브하고 있다 때었을 시 해당함수의 호출 이벤트를 제거함*/
    game.input.onDown.add(this.pickTile, this); /* 땐 상태에서 다시 눌렀을 때 pickTile 콜백 호출*/
    
    this.arrowsGroup.removeAll(true); /* arrows 그룹 내 모든걸 요소를 리무브함*/
    
    for(var i = 0; i < this.visitedTiles.length; i++){ /* 픽되서 visitedTiles 어레이에 들어간 랭쓰만큼 포문 돌림*/
      console.log("리무브 됨[" + this.visitedTiles[i].y + "][" + this.visitedTiles[i].x + "]");
      this.tilesArray[this.visitedTiles[i].y][this.visitedTiles[i].x].destroy(); /*해당 배열내 속한 타일 삭제*/
      this.tilesArray[this.visitedTiles[i].y][this.visitedTiles[i].x] = null; /* 이후 null값으로 초기화함*/
    }
    
    for(var i = game_data.fieldSize -1; i >= 0; i--){ /* 로우랭쓰-1에서 i를 하나씩줄임*/
      /* i가 0보다 높거나 같을때까지 루프돌림*/
    	for(var j = 0; j < game_data.fieldSize; j++){
        
        if(this.tilesArray[i][j] != null){
          var holes = this.holesBelow(i, j);
          if(holes > 0){
            console.log('holes low: '+holes);
            var coordinate = new Phaser.Point(this.tilesArray[i][j].coordinate.x, this.tilesArray[i][j].coordinate.y); /* 최상단 타일 포인터잡아줌*/
            var destination = new Phaser.Point(j, i + holes); /* 리무브되는 타일 포인터잡아줌*/
            console.log("최상단 타일 로: " + coordinate.y + " 컬: " + coordinate.x + "이 이동한곳 로: " + destination.y + " 컬: " + destination.x +'')

            var tween = game.add.tween(this.tilesArray[i][j]).to(
              { y: this.tilesArray[i][j].y + holes * game_data.tileSize}, /* 타일 사이즈만큼 y값을*/
              game_data.fallSpeed, /*faillSpeed에 정의된 속도만큼*/
              Phaser.Easing.Linear.None, /* 속성에 걸맞는 이벤트를 줌*/
              true /* 트윈 이벤트 활성화*/
            );
            
            tween.onComplete.add(function(s){}, this); /* 트윈을 진행함 즉 떨굼*/
            
            this.tilesArray[destination.y][destination.x] = this.tilesArray[i][j]; /* 트윈되어 비어있는 곳을 주입하여 보충해줌*/
            console.log("보충됨[" + destination.y + "][" + destination.x + "]");
            
            this.tilesArray[coordinate.y][coordinate.x] = null; /* 널로 초기화*/
            console.log("삭제됨[" + coordinate.y + "][" + coordinate.x + "]");
            
            this.tilesArray[destination.y][destination.x].coordinate = new Phaser.Point(destination.x, destination.y); /* 주입한후*/
            this.tilesArray[destination.y][destination.x].children[0].text = "로" + destination.y + ", 컬" + destination.x;  /* 타일내 텍스트 변경*/
 
          }
        }
        
  		}
  	}

    for(var i = 0; i < game_data.fieldSize; i++){
      var holes = this.holesInCol(i);
      if(holes > 0){
        console.log('holes col: '+holes);
        for(var j = 1; j <= holes; j++){

          var tileXPos = i * game_data.tileSize + game_data.tileSize / 2; /* 루프가 돌아지는 타일의 x값을 리턴*/
          var tileYPos = -j * game_data.tileSize + game_data.tileSize / 2; /* 루프가 돌아지는 타일의 y값을 리턴*/

          var theTile = game.add.sprite(tileXPos, tileYPos, "tiles"); /* 타일의 스프라이트 이미지를 지정*/
          theTile.anchor.set(0.5); /* add한 지정 위치에 대한 x, y 앵커지정 */
          theTile.picked = false; /* 선택되어지지 않은 타일로 초기화함*/
          
          var tween = game.add.tween(theTile).to(
            { y: theTile.y + holes * game_data.tileSize}, /* theTile의 y와 중첩된 열과 곱해진 타일 사이즈만큼의 y로지정*/
            game_data.fallSpeed, /*faillSpeed에 정의된 속도만큼*/
            Phaser.Easing.Linear.None, /* 속성에 걸맞는 이벤트를 줌*/
            true  /* 트윈 이벤트 활성화*/
          );

          theTile.coordinate = new Phaser.Point(i, holes - j);
          this.tilesArray[holes - j][i] = theTile;
          var text = game.add.text(-game_data.tileSize / 2.8, 0, "로" + theTile.coordinate.y.toString() + ", 컬" + theTile.coordinate.x.toString(), {fill: "#000", font:"bold 30px Arial"});
           /* 타일내 텍스트 정보 초기화해줌*/
          
          console.log("생성된 로: " + theTile.coordinate.y.toString() + " 컬: " + theTile.coordinate.x.toString());
          console.log("에드됨[" + (holes - j).toString() + "][" + i + "]");
          theTile.addChild(text);  /* 타일내 텍스트 변경*/

          this.tileGroup.add(theTile);
        }
      }
    } 

  },
  checkAdjacent: function(p1, p2){ /*p1과 p2가 서로 인접한지를 체크함*/
    return (Math.abs(p1.x - p2.x) <= 1) && (Math.abs(p1.y - p2.y) <= 1);
  },
  addArrow: function(){ /* 화살표 스프라이트시트 이미지를 현재 타일에 에드함*/
    var fromTile = this.visitedTiles[this.visitedTiles.length - 2]; /* 현재 타일 이전 요소의 폼 리턴*/
    var arrow = game.add.sprite(this.tilesArray[fromTile.y][fromTile.x].x, this.tilesArray[fromTile.y][fromTile.x].y, "arrows"); /* 스프라이트 시트 이미지 주입*/
    this.arrowsGroup.add(arrow); /*화살표 그룹에 정의된 arrow를 에드함*/
    arrow.anchor.set(0.5); /* add한 지정 위치에 대한 x, y 앵커지정 */
    
    /* 스프라이트 시트의 앵글 정의 내림*/
    var tileDiff = new Phaser.Point(this.visitedTiles[this.visitedTiles.length - 1].x, this.visitedTiles[this.visitedTiles.length - 1].y);
    tileDiff.subtract(this.visitedTiles[this.visitedTiles.length - 2].x, this.visitedTiles[this.visitedTiles.length - 2].y); /* 현재 타일 이전 요소의 폼 x,y 짜룸*/
    
    if(tileDiff.x == 0) arrow.angle = -90 * tileDiff.y; /* 0일시 앵글 -90 곱하기 tilediff의 y값*/
    else{
      /* 그게 아닐시에*/
      arrow.angle = 90 * (tileDiff.x + 1); /* 앵글 90 곱하기 tilediff의 y값*/
      
      if(tileDiff.y != 0) arrow.frame = 1; /* 정의된 tilediff의 y값이 0이 아니라면 스프라이트 시트의 1번 이미지를 폼에 주입*/
      if(tileDiff.y + tileDiff.x == 0) arrow.angle -= 90; /* tileDiff의 x더하기 y값이 즉 0이라면 폼내 배치되는 화살표 이미지의 앵글값에 90을 빼줌 */
		}
    this.arrowsArray.push(arrow); /*arrowArray 어레이에 현재 정의된 arrow 객체를 푸쉬함*/
  },
  holesBelow: function(row, col){ /* 해당 행의 열중에 null로 초기화된 수를 리턴함 즉 아래로 얼만큼 떨어트릴지를 구하기 위함*/
    var result = 0; /* 0으로 초기화*/
    for(var i = row + 1; i < game_data.fieldSize; i++){ /* 해당 열에서 부터 배치된 행만큼 포문을 돌림*/
      if(this.tilesArray[i][col] == null) result ++; /* 만약 해당 행의 열중에 null이 있다면* 리절트를 쁠쁠해줌*/
    } /*포문이 끝나면*/
    return result; /* 리절트만큼 반환*/
  },
  holesInCol: function(col){ /* 해당 열의 행중에 null로 초기화된 수를 리턴함 즉 아래로 얼마의 열이 연달아 떨어질지를 구하기 위함*/
    var result = 0; /* 0으로 초기화*/
    for(var i = 0; i < game_data.fieldSize; i++){ /* 모든 열들중에서 배치된 행만큼 포문을 돌림*/
      if(this.tilesArray[i][col] == null) result ++; /* 만약 해당 행의 열중에 null이 있다면* 리절트를 쁠쁠해줌*/
    }
    return result;
  }
};