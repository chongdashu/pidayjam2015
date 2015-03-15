/**
 * Pi Day Jam 2015
 * 
 * Copyright (c) 2015-present Chong-U Lim
 * http://github.com/chongdashu/
 */
this.chongdashu = this.chongdashu||{};

(function() {
    "use strict";

/**
 * Game is the main Game loop runner..
 * @class Game
 * @constructor
 **/
var Game = function() {
  this.initialize();
};
var p = Game.prototype;
Game.prototype.constructor = Game;
    
    Game.BASE_WIDTH = 800;
    Game.BASE_HEIGHT = 600;

    Game.TITLE = "Pi Game Jam 2015";


    Game.RULE_LIVES = "rule:lives";
    Game.RULE_ENEMIES = "rule:lives";
    Game.RULE_PLAYER_DAMAGE = "rule:player_damager";
    Game.RULE_ENEMY_DAMAGE = "rule:enemy_damage";
    Game.RULE_COINS = "rule:coins";

    Game.RULES = [
        Game.RULE_LIVES,
        Game.RULE_ENEMIES,
        Game.RULE_PLAYER_DAMAGE,
        Game.RULE_ENEMY_DAMAGE,
        Game.RULE_COINS,
    ];

    // Phaser game.
    p.game = null;

    // Rules map.
    p.rulesMap = {};

    // Player sprite
    p.player = {};

    p.initialize = function() {
        this.initRulesMap();
    };

    p.initRulesMap = function() {
    };

    p.initPhaser = function(div) {
        this.game = new Phaser.Game(
            Game.BASE_WIDTH,
            Game.BASE_HEIGHT,
            Phaser.AUTO,
            div,
            {
                preload: this.preload,
                create: this.create,
                update: this.update,
                render : this.render
            });
        this.game.me = this;
    };

    p.preload = function() {
        console.log("[Game], preload()");

        this.game.load.spritesheet("player",
            "res/soldier.png", 64, 64);
    };

    p.create = function() {
        console.log("[Game], create()");

        // create player 
        // ----------------
        this.player = this.game.add.sprite(100,100, "player");
        this.player.animations.add("up", [0,1,2,3,4,5,6,7,8], 10, true);
        this.player.animations.add("left", [9,10,11,12,13,14,15,16,17], 10, true);
        this.player.animations.add("right", [18,19,20,21,22,23,24,25,26], 10, true);
        this.player.animations.add("down", [27,28,29,30,31,32,33,34,35], 10, true);
        this.player.animations.play("up");
        this.player.animations.play("left");
        this.player.animations.play("right");
        this.player.animations.play("down");


        // create game rules
        // -----------------
        // rules:
        //  1) number of lives  
        //  2) number of enemies 
        //  3) number of enemies multiplier
        //  4) number of coins
        //  5) points per coins
        //  6) points per enemy
        //  7) number of shots per clip
        //  8) x-speed 
        //  9) y-speed
        //  10) number of random drops

    };

    p.update = function() {
      // console.log("[Game], update()");
    };

    p.render = function() {
        
        this.game.me.renderDebug();
    
    };

    p.renderDebug = function() {
        this.game.debug.text("Pi Game Jam 2015", 32, 32);
    };

    p.printScreen = function() {
        // TODO: find a way to print the screen.
    };


chongdashu.Game = Game;

}());


