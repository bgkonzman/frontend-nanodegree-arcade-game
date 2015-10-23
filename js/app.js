// Enemy class

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    // Starting position
    this.x = -101;
    this.y = (Math.floor(Math.random() * 3) + 1) * 82 - 32;
    // Sprite dimensions for collision detection
    this.width = 101;
    this.height = 66;
    // Initial, randomized speed between 101 and 302 px
    this.speed = Math.floor(Math.random() * 202) + 101;
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // We multiply any movement by the dt parameter
    // to ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    // Check for player-enemy collision.
    // This general box collision code can be found at:
    // https://developer.mozilla.org/en-US/docs/Games/
    // Techniques/2D_collision_detection
    if (this.x < player.x + player.width &&
        this.x + this.width > player.x &&
        this.y < player.y + player.height &&
        this.height + this.y > player.y) {
            // Put player back at starting position.
            player.reset();
            // Decrement score by 200. Minimum score is 0
            if (player.score > 100)
                player.score -= 200;
            else
                player.score = 0;
        }

    // Once the enemy is off-screen, remove it from the array
    // so that we don't keep iterating over it, and so that it
    // might get GCed
    if (this.x > 505 + this.width) {
        allEnemies.splice(allEnemies.indexOf(this), 1);
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Player class

var Player = function() {
    this.sprite = 'images/char-boy.png';
    // Starting position
    this.reset();
    // Sprite dimensions
    this.width = 70;
    this.height = 76;
    // Starting score
    this.score = 0;
};

// Put player at the starting position
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 383;
};

Player.prototype.update = function() {
    // Check win condition
    if (this.y < 21) {
        this.reset();
        this.score += 100;
    }

    // Random chance to add a new enemy, max of 4 on screen
    if (Math.random()*100 > 98 && allEnemies.length < 4)
        allEnemies.push(new Enemy());
};

// Draw the player and score on screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Clear the old score
    ctx.clearRect(150, 10, 250, 20);

    // Display the new score
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Score: ' + this.score, 252, 30);
};

// Move the player in response to arrow key input
Player.prototype.handleInput = function(direction) {
    if (direction === 'left' && this.x > 0)
        this.x -= 101;
    if (direction === 'right' && this.x < 404)
        this.x += 101;
    if (direction === 'up')
        this.y -= 83;
    if (direction === 'down' && this.y < 383)
        this.y += 83;
};

// Instantiate the player object
var player = new Player();
// Place all enemy objects in an array called allEnemies
// Start off with one enemy instantiated
var allEnemies = [new Enemy()];

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
