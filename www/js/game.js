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
    Game.RULE_ENEMY_BATS = "rule:enemy_bats";
    Game.RULE_ENEMY_SLIMES = "rule:enemy_slimes";
    Game.RULE_PLAYER_DAMAGE = "rule:player_damager";
    Game.RULE_PLAYER_XSPEED = "rule:player_xspeed";
    Game.RULE_PLAYER_YSPEED = "rule:player_yspeed";
    Game.RULE_ENEMY_DAMAGE = "rule:enemy_damage";
    Game.RULE_COINS = "rule:coins";

    Game.STATE_PLAY = "state:play";
    Game.STATE_GAMEOVER = "state:gameover";
    Game.STATE_WIN = "state:win";

    Game.RULES = [
        Game.RULE_LIVES,
        Game.RULE_ENEMY_BATS,
        Game.RULE_ENEMY_SLIMES,
        Game.RULE_PLAYER_DAMAGE,
        Game.RULE_ENEMY_DAMAGE,
        Game.RULE_COINS,
        Game.RULE_PLAYER_XSPEED,
        Game.RULE_PLAYER_YSPEED
    ];

    // Phaser game.
    p.game = null;

    p.gameState = null;

    // Rules map.
    p.rulesMap = {};

    // Player
    // -------
    p.player = null;

    // Groups
    // ------
    p.coins = null;
    p.enemies = null;
    p.bats = null;
    p.slimes = null;

    p.coinText = null;
    p.rulesText = null;

    // Scoring
    // -------
    p.livesScore = 0;
    p.enemiesKilledScore = 0;
    p.coinScore = 0;

    // Emitter
    // -------

    p.initialize = function() {
        $(".ui").hide();
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

        this.game.load.spritesheet("player", "res/soldier.png", 64, 64);

        this.game.load.spritesheet("coin", "res/coin.png", 16, 16);
        this.game.load.spritesheet("bat", "res/bat.png", 32, 32);
        this.game.load.spritesheet("slime", "res/slime.png", 32, 32);

        this.game.load.tilemap("map_1", "res/map_1.json", null, Phaser.Tilemap.TILED_JSON);

        this.game.load.image("grass", "res/grass.png");
        this.game.load.image("dirt", "res/dirt.png");
        this.game.load.image("rock", "res/rock.png");
    };

    p.create = function() {
        console.log("[Game], create()");

        this.game.me.state = Game.STATE_PLAY;

        // hide UI
        // -------
        $(".ui").hide();

        // create rules
        // ------------
        this.game.me.createRules();

        // create status
        // -------------
        this.game.me.createStatus();

        // create game physics
        // -------------------
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // create tilemap
        // --------------
        this.game.me.createMap();

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

    p.createMap = function() {
        this.map = this.game.add.tilemap("map_1");
        this.map.addTilesetImage("grass");
        this.map.addTilesetImage("dirt");
        this.map.addTilesetImage("rock");

        this.mapLayerBackground = this.map.createLayer("backgroundLayer");
        this.mapLayerBlocking = this.map.createLayer("blockingLayer");

        this.map.setCollisionBetween(1, 40, true, 'blockingLayer');

        this.mapLayerBackground.resizeWorld();
        this.mapLayerBlocking.resizeWorld();

    };

    p.createStatus = function() {
        this.livesScore = parseInt(this.rulesMap[Game.RULE_LIVES],10);
        this.coinScore = 0;
        this.playerDamage = parseInt(this.rulesMap[Game.RULE_PLAYER_DAMAGE],10);
        this.playerXSpeed = parseInt(this.rulesMap[Game.RULE_PLAYER_XSPEED],10);
        this.playerYSpeed = parseInt(this.rulesMap[Game.RULE_PLAYER_YSPEED],10);
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

        this.statusTextGroup.add(this.livesText = this.game.add.text(700, 50+12*(this.statusTextGroup.length), "", fontProp));
        this.statusTextGroup.add(this.coinsText = this.game.add.text(700, 50+12*(this.statusTextGroup.length), "", fontProp));
        this.statusTextGroup.add(this.playerDamageText = this.game.add.text(700, 50+12*(this.statusTextGroup.length), "" + this.playerDamage, fontProp));
        this.statusTextGroup.add(this.playerXSpeedText = this.game.add.text(700, 50+12*(this.statusTextGroup.length), "" + this.playerXSpeed, fontProp));
        this.statusTextGroup.add(this.playerYSpeedText = this.game.add.text(700, 50+12*(this.statusTextGroup.length), "" + this.playerYSpeed, fontProp));

    };

    p.createEnemies = function() {
        this.enemies = this.game.add.group();
        

        this.createEnemyGroup(this.bats = this.game.add.group());
        this.createEnemyGroup(this.slimes = this.game.add.group());

        var i=0;
        for (i=0; i < this.rulesMap[Game.RULE_ENEMY_BATS]; i++) {
            this.createEnemy("bat", this.bats);
        }
        for (i=0; i < this.rulesMap[Game.RULE_ENEMY_SLIMES]; i++) {
            this.createEnemy("slime", this.slimes);
        }
    };

    p.createEnemyGroup = function(enemyGroup) {
        enemyGroup.enableBody = true;
        enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies.add(enemyGroup);
    };

    p.createEnemy = function(name, enemyGroup) {
        
        var x = this.game.rnd.between(100,700);
        var y = this.game.rnd.between(100,500);

        var enemy = enemyGroup.create(x, y, name);

        enemy.name = name + "_" + parseInt(enemyGroup.length-1, 10);
        
        enemy.anchor.set(0.5, 0.5);
        enemy.animations.add("up", [0,1,2], 10, true);
        enemy.animations.add("left", [3,4,5], 10, true);
        enemy.animations.add("down", [6,7,8], 10, true);
        enemy.animations.add("right", [9,10,11], 10, true);
        enemy.animations.play("down");

        return enemy;
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

        // this.player.body.collideWorldBounds = true;
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


    p.onPlayerEnemyOverlap = function(player, enemy) {
        enemy.kill();
        this.livesScore--;
    };

    p.onPlayerCoinsOverlap = function(player, coin) {
        console.log("onPlayerCoinsOverlap()");
        coin.kill();
        this.coinScore++;
    };

    p.update = function() {
        
        if (this.game.me.state == Game.STATE_PLAY) {
            this.game.me.updateCollisions();
            this.game.me.updatePlayer();
            this.game.me.updateEnemies();
        }

        this.game.me.updateStatusText();
        this.game.me.updateGameState();

    };

    p.updateGameState = function() {

        if (this.coinScore >= this.rulesMap[Game.RULE_COINS]) {
            this.gameWin();
        }
        if (this.livesScore <= 0) {
            this.gameOver();
        }

    };

    p.gameWin = function() {
        if (this.state != Game.STATE_WIN) {
            this.gameWin();
        }
    };

    p.gameOver = function() {
        if (this.state != Game.STATE_GAMEOVER) {
            this.player.kill();
            this.state = Game.STATE_GAMEOVER;
            $("#game-label").html("YOU LOSE! GAME OVER!");
            $(".ui").fadeIn(250);
        }
    };

    p.gameWin = function() {
        if (this.state != Game.STATE_WIN) {
            this.state = Game.STATE_WIN;
            this.player.body.velocity.set(0,0);
            $("#game-label").html("YOU WIN! HOORAY!");
            $(".ui").fadeIn(250);
        }
    };

    p.updateStatusText = function() {
        this.coinsText.text = "Coins: " + this.coinScore + "/" + this.rulesMap[Game.RULE_COINS];
        this.livesText.text = "Lives: " + this.livesScore + "/" + this.rulesMap[Game.RULE_LIVES];
        this.playerDamageText.text = "Player Damage: " + this.playerDamage;
        this.playerXSpeedText.text = "Player X-Speed: " + this.playerXSpeed;
        this.playerYSpeedText.text = "Player Y-Speed: " + this.playerYSpeed;

        this.statusTextGroup.position.set(
            -10 -this.statusTextGroup.width/2 , 0);
    };

    p.updateCollisions = function() {
        this.game.physics.arcade.overlap(this.player, this.coins, this.onPlayerCoinsOverlap, null, this );
        this.game.physics.arcade.overlap(this.player, this.bats, this.onPlayerEnemyOverlap, null, this );
        this.game.physics.arcade.collide(this.player, this.mapLayerBlocking);
    };

    p.updateEnemies = function() {
        var me = this;


        this.enemies.forEach(function(enemyGroup) {
            enemyGroup.forEach(function(enemy) {
                
                me.updateEnemy(enemy);

                if (Math.abs(enemy.body.velocity.x) > Math.abs(enemy.body.velocity.y)) {
                    if (enemy.body.velocity.x > 0) {
                        enemy.animations.play("right");
                    }
                    else if (enemy.body.velocity.x < 0) {
                        enemy.animations.play("left");
                    }
                }
                else {
                     if (enemy.body.velocity.y > 0) {
                        enemy.animations.play("down");
                    }
                    else if (enemy.body.velocity.y < 0) {
                        enemy.animations.play("up");
                    }
                }
            });
        });
    };

    p.updateEnemy = function(enemy) {
        var groupName = enemy.name.split("_")[0];
        var distanceToPlayerX = Math.abs(enemy.position.x - this.player.position.x);
        var distanceToPlayerY = Math.abs(enemy.position.y - this.player.position.y);

        if (groupName == "bat") {
            this.game.physics.arcade.moveToObject(enemy, this.player, this.game.rnd.between(30,50));
        }
        else if (groupName == "slime") {
            if (distanceToPlayerX > distanceToPlayerY) {
                enemy.body.velocity.set(Phaser.Math.sign(this.player.position.x - enemy.position.x)*90, 0);   
                
            }
            else if (distanceToPlayerX < distanceToPlayerY) {
                enemy.body.velocity.set(0, Phaser.Math.sign(this.player.position.y - enemy.position.y)*90);
            }
            else {
                // enemy.body.velocity.set(this.player.position.x - enemy.position.x, this.player.position.y - enemy.position.y);  
            }
        }

    };

    p.updatePlayer = function() {

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            
            this.player.body.velocity.x = -50 * this.rulesMap[Game.RULE_PLAYER_XSPEED];
        }
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            
            this.player.body.velocity.x = 50 * this.rulesMap[Game.RULE_PLAYER_XSPEED];
        }
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
           
            this.player.body.velocity.y = -50 * this.rulesMap[Game.RULE_PLAYER_YSPEED];
        }
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            
            this.player.body.velocity.y = 50 * this.rulesMap[Game.RULE_PLAYER_YSPEED];
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
        else if (Math.abs(this.player.body.velocity.x) > Math.abs(this.player.body.velocity.y)) {
            this.player.animations.play(this.player.body.velocity.x > 0 ? "right" : "left");
        }
        else {
            this.player.animations.play(this.player.body.velocity.y > 0 ? "down" : "up");
        }


    };

    p.render = function() {
        this.game.debug.text("Pi Roulette Arcade Arena - v1.0", 16, 600-8);
        // this.game.me.renderDebug();
    
    };

    p.renderDebug = function() {
        
        this.mapLayerBackground.debug = true;
        this.mapLayerBlocking.debug = true;
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


