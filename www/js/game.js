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

    // Phaser game.
    p.game = null;

    p.initialize = function() {
        
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
    };

    p.preload = function() {
        console.log("[Game], preload()");
    };

    p.create = function() {
        console.log("[Game], create()");

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
        this.game.debug.text("Pi Game Jam 2015", 32, 32);
    };

    p.printScreen = function() {
        // TODO: find a way to print the screen.
    };


chongdashu.Game = Game;

}());


