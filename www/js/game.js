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
    Game.RULE_ENEMIES = "rule:enemies";
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
    p.coins = null;

    p.coinText = null;
    p.coinScore = 0;

    p.ruleTexts = null;

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

        // create rules
        // ------------
        this.game.me.createRules();

        // create game physics
        // -------------------
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // create player 
        // ----------------
        this.game.me.createPlayer();

        // create coins
        // ------------
        this.game.me.createCoins();

        // create text: coins
        // -------------------
        this.game.me.createCoinsText();


    };

    p.createRules = function() {

        var rules = Game.RULES.slice(0);
        var piString = String(Math.PI);

        var i=0;
        for (i=0; i < piString.length; i++) {
            if (isNumeric(piString[i])) {
                var digit = parseInt(piString[i], 10);
                var rule = Phaser.ArrayUtils.removeRandomItem(rules);
                console.log("Creating rules from PI: %s -> %s", digit, rule);
            }
        }
    };

    p.createCoinsText = function() {
        var scoreString = 'Coins : ';
        this.scoreText = this.game.add.text(400, 50,
                        scoreString + this.coinScore,
                        {
                            font: '34px Tahoma',
                            fill: '#fff'
                        });
        this.scoreText.anchor.set(0.5,0.5);
    };

    p.createPlayer = function() {
        this.player = this.game.add.sprite(0,0, "player");
        this.player.anchor.set(0.5,0.5);
        this.player.position.set(32,96);
        this.player.animations.add("up", [0,1,2,3,4,5,6,7,8], 10, true);
        this.player.animations.add("left", [9,10,11,12,13,14,15,16,17], 10, true);
        this.player.animations.add("down", [18,19,20,21,22,23,24,25,26], 10, true);
        this.player.animations.add("right", [27,28,29,30,31,32,33,34,35], 10, true);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.setSize(48,48,0,8);
    };

    p.createCoins = function(count) {
        if (!count || typeof(count) == "None") {
            count = 10;
        }
        this.game.me.coins = this.game.add.group();
        this.game.me.coins.enableBody = true;
        this.game.me.coins.physicsBodyType = Phaser.Physics.ARCADE;

        var i=0;
        for (i=0; i<count; i++) {
            this.createCoin(
                this.game.rnd.between(100,700),
                this.game.rnd.between(100,500));
        }
        
    };

    p.createCoin = function(x, y) {
        var coin = this.coins.create(x, y, "coin");
        coin.animations.add("default", null, 10, true);
        coin.animations.play("default");
        coin.name = "coin_" + this.coins.length;
        // this.game.physics.enable(coin,Phaser.Physics.ARCADE);

    };

    p.onPlayerCoinsOverlap = function(player, coin) {
        console.log("onPlayerCoinsOverlap()");
        coin.kill();
        this.coinScore++;
        this.scoreText.text = "Coins: " + this.coinScore;
    };

    p.update = function() {
      
      this.game.me.updateCollisions();
      this.game.me.updatePlayer();

    };

    p.updateCollisions = function() {
        this.game.physics.arcade.overlap(this.player, this.coins, this.onPlayerCoinsOverlap, null, this );
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

        if (this.player.body.velocity.y === 0 && this.player.body.velocity.x === 0) {
            
            this.player.animations.stop(null, true);
        }


    };

    p.render = function() {
        this.game.debug.text("Pi Game Jam 2015", 16, 16);
        // this.game.me.renderDebug();
    
    };

    p.renderDebug = function() {
        
        this.renderDebugPlayer();
        this.renderDebugCoins();
    };

    p.renderDebugPlayer = function() {
        this.game.debug.body(this.player);
        this.game.debug.bodyInfo(this.player, 600,16);
    };

    p.renderDebugCoins = function() {
        var i=0;
        var me = this;
        // this.game.debug.body(this.coins);
        this.coins.forEach(function(coin) {
            me.game.debug.body(coin);
        });
        
    };

    p.printScreen = function() {
        // TODO: find a way to print the screen.
    };


chongdashu.Game = Game;

}());


