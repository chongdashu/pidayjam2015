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
    p.player = null;

    p.coins = [];

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

        this.game.load.spritesheet("coin",
            "res/coin.png", 16, 16);


    };

    p.create = function() {
        console.log("[Game], create()");

        // create game physics
        // -------------------
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // create player 
        // ----------------
        this.game.me.player = this.game.add.sprite(0,0, "player");
        this.game.me.player.anchor.set(0.5,0.5);
        this.game.me.player.position.set(32,96);
        this.game.me.player.animations.add("up", [0,1,2,3,4,5,6,7,8], 10, true);
        this.game.me.player.animations.add("left", [9,10,11,12,13,14,15,16,17], 10, true);
        this.game.me.player.animations.add("down", [18,19,20,21,22,23,24,25,26], 10, true);
        this.game.me.player.animations.add("right", [27,28,29,30,31,32,33,34,35], 10, true);
        this.game.physics.enable(this.game.me.player, Phaser.Physics.ARCADE);
        this.game.me.player.body.setSize(48,48,0,8);

        // create coin
        this.game.me.createCoin(50,50);

        
        // create physics for sprites
        

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

    p.createCoin = function(x, y) {
        var coin = this.game.add.sprite(x, y, "coin");
        coin.animations.add("default", null, 10, true);
        coin.animations.play("default");
        this.game.physics.enable(coin,Phaser.Physics.ARCADE);

        this.coins.push(coin);

    };

    p.update = function() {
      
      this.game.me.updatePlayer();

    };

    p.updatePlayer = function() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.player.animations.play("left");
            this.player.body.velocity.x = -100;
        }
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.animations.play("right");
            this.player.body.velocity.x = 100;
        }
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.player.animations.play("up");
            this.player.body.velocity.y = -100;
        }
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.player.animations.play("down");
            this.player.body.velocity.y = 100;
        }

        if (!this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.body.velocity.x = 0;
        }

        if (!this.game.input.keyboard.isDown(Phaser.Keyboard.UP) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.player.body.velocity.y = 0;
        }


    };

    p.render = function() {
        
        this.game.me.renderDebug();
    
    };

    p.renderDebug = function() {
        this.game.debug.text("Pi Game Jam 2015", 16, 16);
        this.renderDebugPlayer();
        this.renderDebugCoins();
    };

    p.renderDebugPlayer = function() {
        this.game.debug.body(this.player);
        this.game.debug.bodyInfo(this.player, 600,16);
    };

    p.renderDebugCoins = function() {
        var i=0;
        for (i=0; i < this.coins.length; i++) {
            this.game.debug.body(this.coins[i]);
        }
    };

    p.printScreen = function() {
        // TODO: find a way to print the screen.
    };


chongdashu.Game = Game;

}());


