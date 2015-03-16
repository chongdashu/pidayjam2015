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
    Game.RULE_PLAYER_XSPEED = "rule:player_xspeed";
    Game.RULE_PLAYER_YSPEED = "rule:player_yspeed";
    Game.RULE_ENEMY_DAMAGE = "rule:enemy_damage";
    Game.RULE_COINS = "rule:coins";

    Game.RULES = [
        Game.RULE_LIVES,
        Game.RULE_ENEMIES,
        Game.RULE_PLAYER_DAMAGE,
        Game.RULE_ENEMY_DAMAGE,
        Game.RULE_COINS,
        Game.RULE_PLAYER_XSPEED,
        Game.RULE_PLAYER_YSPEED
    ];

    // Phaser game.
    p.game = null;

    // Rules map.
    p.rulesMap = {};

    // Player sprite
    p.player = null;
    
    p.coins = null;

    p.coinText = null;
    p.rulesText = null;

    // Scoring
    // -------
    p.livesScore = 0;
    p.enemiesKilledScore = 0;
    p.coinScore = 0;

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
        this.game.load.spritesheet("bat",
            "res/bat.png", 32, 32);
    };

    p.create = function() {
        console.log("[Game], create()");

        // create rules
        // ------------
        this.game.me.createRules();

        // create status
        // -------------
        this.game.me.createStatus();

        // create game physics
        // -------------------
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // create player 
        // ----------------
        this.game.me.createPlayer();

        // create coins
        // ------------
        this.game.me.createCoins();

        // create enemies
        // --------------
        this.game.me.createEnemies();

        // create statuts text
        // -------------------
        this.game.me.createStatusText();


    };

    p.createStatus = function() {
        this.livesScore = parseInt(this.rulesMap[Game.RULE_LIVES],10);
        this.playerDamage = parseInt(this.rulesMap[Game.RULE_PLAYER_DAMAGE],10);
    };


    p.createRules = function() {

        var rules = Game.RULES.slice(0);
        var piString = String(Math.PI);

        this.rulesText = this.game.add.group();

        var i=0;
        for (i=0; i < piString.length; i++) {
            if (isNumeric(piString[i])) {
                var digit = parseInt(piString[i], 10);
                var rule = Phaser.ArrayUtils.removeRandomItem(rules);

                if (rule && typeof(rule) !== "undefined") {
                    this.rulesMap[rule] = digit;
                    console.log("Creating rules from PI: %s -> %s", digit, rule);

                    var text = this.game.add.text(16, 400+i*16, piString[i] + ":\t" + rule,
                        {
                            font: '12px Courier',
                            fill: '#fff'
                        });
                    this.rulesText.add(text);

                }

                
            }
        }
    };

    p.createStatusText = function() {
        var fontProp = {
            font: '14px Courier',
            fill: '#fff',
            "text-align": "right"
        };

        this.statusTextGroup = this.game.add.group();

        this.statusTextGroup.add(this.livesText = this.game.add.text(700, 62, "", fontProp));
        this.statusTextGroup.add(this.coinsText = this.game.add.text(700, 50, "", fontProp));
        this.statusTextGroup.add(this.playerDamageText = this.game.add.text(700, 74, "" + this.playerDamage, fontProp));

    };

    p.createEnemies = function() {
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        var i=0;
        var enemy = null;
        for (i=0; i < this.rulesMap[Game.RULE_ENEMIES]; i++) {
            var x = this.game.rnd.between(100,700);
            var y = this.game.rnd.between(100,500);
                
            enemy = this.enemies.create(x, y, "bat");
            enemy.animations.add("up", [0,1,2], 10, true);
            enemy.animations.add("left", [3,4,5], 10, true);
            enemy.animations.add("down", [6,7,8], 10, true);
            enemy.animations.add("right", [9,10,11], 10, true);
            enemy.animations.play("down");
            enemy.name = "enemy_" + this.enemies.length;
        }
    };

    p.createPlayer = function() {
        this.player = this.game.add.sprite(400,300, "player");
        this.player.anchor.set(0.5,0.5);

        this.player.animations.add("up", [0,1,2,3,4,5,6,7,8], 10, true);
        this.player.animations.add("left", [9,10,11,12,13,14,15,16,17], 10, true);
        this.player.animations.add("down", [18,19,20,21,22,23,24,25,26], 10, true);
        this.player.animations.add("right", [27,28,29,30,31,32,33,34,35], 10, true);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.setSize(48,48,0,8);
    };

    p.createCoins = function(count) {
        if (!count || typeof(count) == "None") {
            count = this.rulesMap[Game.RULE_COINS];
        }
        this.coins = this.game.add.group();
        this.coins.enableBody = true;
        this.coins.physicsBodyType = Phaser.Physics.ARCADE;

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
    };

    p.update = function() {
      
      this.game.me.updateCollisions();
      this.game.me.updatePlayer();
      this.game.me.updateEnemies();
      this.game.me.updateStatusText();

    };

    p.updateStatusText = function() {
        this.coinsText.text = "Coins: " + this.coinScore + "/" + this.rulesMap[Game.RULE_COINS];
        this.livesText.text = "Lives: " + this.livesScore;
        this.playerDamageText.text = "Player Damage: " + this.playerDamage;

        this.statusTextGroup.position.set(
            -10 -this.statusTextGroup.width/2 , 0);
    };

    p.updateCollisions = function() {
        this.game.physics.arcade.overlap(this.player, this.coins, this.onPlayerCoinsOverlap, null, this );
    };

    p.updateEnemies = function() {
        var me = this;
        this.enemies.forEach(function(enemy) {
            me.game.physics.arcade.moveToObject(enemy, me.player, 30); 
        });
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
        this.game.debug.text("Pi Roulette Arcade Arena - v1.0", 16, 16);
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


