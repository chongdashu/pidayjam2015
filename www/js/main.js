var game = null;

/**
 * Entry point of the entire application.
 */
var init = function() {

    // Create the Game
    game = new chongdashu.Game();

    // Create phaser context.
    var gameDiv = $(".game").get(0);
    game.initPhaser(gameDiv);
};