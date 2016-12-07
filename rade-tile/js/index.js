/* rade-tile index.js*/
	
var game, game_data;
var radeTile = function(){};

function init(){
  game_data = {width: 600, height: 500 };
  
  game = new Phaser.Game(game_data.width, game_data.height);
  game.state.add("radeTile", radeTile);
  game.state.start("radeTile");
}

radeTile.prototype = {
  preload : function(){},
  create: function(){},
  update: function(){},
  createLevel: function(){},
  addTile: function(){},
  pickTile: function(){},
  moveTile: function(){},
  releaseTile: function(){},
  addArrow: function(){}
}