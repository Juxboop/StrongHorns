var game = new Phaser.Game(1600, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });

// preload assets
function preload() 
{
    game.load.image('deathscreen', 'assets/deathscreen.png');
    game.load.image('winscreen', 'assets/winscreen.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('tower', 'assets/utTower2.png');
    game.load.image('football', 'assets/football.png');
    game.load.spritesheet('hookem', 'assets/hookemRUNJABJUMP.png', 64, 64);
    game.load.image('sarge', 'assets/olsarge.png');
    game.load.image('confetti', 'assets/confetti.png');
    game.load.image('star', 'assets/star.png');
}

// defined variables
var deathscreen
var player;
var enemy;
var platforms;
var stages;
var cursors;
var bounds;
var score = 0;
var scoreText;
var gameover = false;
var lastLeft = true;
var jumpCounter = 0;
var isJumping;
var canPass;
var hitboxes;
var hitbox1;
var hitbox2;
var hitbox3;
var hitbox4;
var spacebar;
var keyR;
var keyE;
var enemyHitStun = false;
var playerHitStun = false;
var knockback;
var playerKnockback;
var enemyDamage = 0;
var enemyDamageText;
var playerDamage = 0;
var playerDamageText;
var emitter;
var emitter2;
var timeLimit = 20;
var timeOver = false;
var timeText;
var time;
var timeLeft;
var gameOverText;
var leftStoredVelocity = 0;
var rightStoredVelocity = 0;


function create() 
{
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'tower');
    
    bounds = game.add.group();
    bounds.enableBody = true;
    
    //top blast zone
    var bound = bounds.create(0, game.world.height - 1000, 'ground');
    bound.scale.setTo(5,0.01);
    bound.body.immovable = true;
    
    //bottom blast zone
    bound = bounds.create(0, game.world.height + 100, 'ground');
    bound.scale.setTo(5,0.01)
    bound.body.immovable = true;
    
    //left blast zone
    bound = bounds.create(-100, 0, 'ground');
    bound.scale.setTo(0.01, 23)
    bound.body.immovable = true;
    
    //right blast zone
    bound = bounds.create(1700, 0, 'ground');
    bound.scale.setTo(0.01, 23)
    bound.body.immovable = true;
    
    
    
    stages = game.add.group();
    stages.enableBody = true;
    
    //create main stage
    var ground = stages.create(0, game.world.height - 160, 'ground');
    ground.scale.setTo(2, 0.001);
    ground.anchor.set(0.5);
    ground.x = game.world.centerX;
    ground.body.immovable = true;
    
    
    platforms = game.add.group();
    platforms.enableBody = true;
    
    //create left platform
    var ledge = platforms.create(game.world.centerX - 200, 550, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.4, 0.3)
    ledge.anchor.set(0.5);

    //create right platform
    ledge = platforms.create(game.world.centerX + 200, 550, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.4, 0.3)
    ledge.anchor.set(0.5);
    
    //create top platform
    ledge = platforms.create(game.world.centerX, 400, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.4, 0.3)
    ledge.anchor.set(0.5);
    
    //create player
    player = game.add.sprite(game.world.centerX, game.world.height - 300, 'hookem');
    player.scale.setTo(1.25, 1.25);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 2000;
    player.body.collideWorldBounds = false;
    
    //create enemy
    enemy = game.add.sprite(game.world.centerX + 200, game.world.height - 600, 'sarge');
    enemy.scale.setTo(2, 2);
    game.physics.arcade.enable(enemy);
    enemy.body.gravity.y = 2000;
    enemy.body.collideWorldBounds = false;
    
    //player keyboard controls
    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
    keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);


    //player animations
    player.animations.add('right', [0, 1, 2, 3, 4], 10, true);
    player.animations.add('left', [5, 6, 7, 8, 9], 10, true);
    player.animations.add('jableft', [10], 10, true);
    player.animations.add('jabright', [11], 10, true);
    player.animations.add('jumpleft', [12, 13, 14], 3, true);
    player.animations.add('jumpright', [15, 16, 17], 3, true);

    //placeholder footballs

    
    
    //hitboxes
    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    player.addChild(hitboxes);
    
    //right hitbox
    hitbox1 = hitboxes.create(100, 0, 'football');
    hitbox1.scale.setTo(10,3)
    hitbox1.name = 'attack1'
    
    //left hitbox
    hitbox2 = hitboxes.create(-100, 0, 'football');
    hitbox2.scale.setTo(10,3)
    hitbox2.name = 'attack2'
    
    hitbox3 = hitboxes.create(0, -100, 'football');
    hitbox3.scale.setTo(10,3)
    hitbox3.name = 'attack3'
    
    hitbox4 = hitboxes.create(0, 100, 'football');
    hitbox4.scale.setTo(10,3)
    hitbox4.name = 'attack4'
    
    disableHitboxes()
        
    emitter = game.add.emitter(game.world.centerX, 500, 200);
    emitter.scale.setTo(1, 1)
    emitter.makeParticles('sarge');
    emitter.setRotation(0, 0);
    emitter.setAlpha(0.3, 0.8);
    emitter.gravity = 0;
    
    emitter2 = game.add.emitter(game.world.centerX, 500, 200);
    emitter2.scale.setTo(1, 1)
    emitter2.makeParticles('star');
    emitter2.setRotation(0, 0);
    emitter2.setAlpha(0.3, 0.8);
    emitter2.gravity = 0;
    
    // User Interface
    scoreText = game.add.text(16, 16, 'Score: ', { fontSize: '64px', fill: '#ff0000' });
    enemyDamageText = game.add.text(game.world.centerX + 100, 850, enemyDamage + '%', { fontSize: '48px', fill: '#ff0000' });
    playerDamageText = game.add.text(game.world.centerX - 150, 850, playerDamage + '%', { fontSize: '48px', fill: '#ff0000' });
    timeText = game.add.text(1100, 16, 'Time Left: ', { fontSize: '64px', fill: '#ff0000' });
    
    
}

function update() 
{
    if (keyR.isDown)
        {
            restartGame();
        }
    
    if (keyE.isDown)
        {
            endGame();
        }
    
    
        
        //collision
        var hitStage = game.physics.arcade.collide(player, stages);
        var hitStage1 = game.physics.arcade.collide(enemy, stages);
        
        var hitPlatform = game.physics.arcade.collide(player, platforms);
        
        
        //checks overlap of out of bounds
        game.physics.arcade.overlap(player, bounds, gotKilled, null);
        game.physics.arcade.overlap(enemy, bounds, enemyKilled, null);  
    if (gameover == false)
    {
        
        
        
        if (timeOver == false)
        {
             displayTimeRemaining();
        }
        
        else
        {
            endGame();
        }
        /*
        if (playerHitStun == true)
        {
            if (player.body.velocity.x > 0)
            {
                player.body.velocity.x = player.body.velocity.x - 10;
            }
        }
        */
        // checks if player is in hitstun
        if (playerHitStun == false)
        {
            if (player.body.velocity.y < 0)
            {
                player.animations.play('jumpleft')
            }
            
            //if no input, stay still
            player.body.velocity.x = 0;
            
            //move left
            if (cursors.left.isDown)
            {
                rightStoredVelocity = 200;
                lastLeft = true;
                if (!player.body.touching.down && leftStoredVelocity > -450)
                {
                    leftStoredVelocity = leftStoredVelocity - 10;
                    player.body.velocity.x = leftStoredVelocity;
                }
                else
                {
                    player.body.velocity.x = -450
                }
                player.animations.play('left');
            }

            //move right
            else if (cursors.right.isDown)
            {
                leftStoredVelocity = -200;
                lastLeft = false
                if (!player.body.touching.down && rightStoredVelocity < 450)
                {
                    rightStoredVelocity = rightStoredVelocity + 10;
                    player.body.velocity.x = rightStoredVelocity;
                }
                else
                {
                    player.body.velocity.x = 450
                }
                
                player.animations.play('right');
            }

            //player faces the direction of last key pressed
            else
            {
                player.animations.stop();
                if (lastLeft == true)
                {
                    player.frame = 5;

                }
                else
                {
                    player.frame = 0;
                }
            }

            //resets jump counter if touching platform or stage
            if (player.body.touching.down && (hitPlatform || hitStage))
            {
                canPass = false;
                jumpCounter = 2;
                isJumping = false;
            }

            //jumping from platform or stage
            if (upInputIsActive(5) && jumpCounter > 0)
            {
                jump(player);
                canPass = true;
                isJumping = true;
            }

            if (isJumping && upInputReleased()){
                jumpCounter--;
                isJumping = false;
            }

            //fast falling while in the air
            if (cursors.down.isDown)
            {
                player.body.velocity.y = 550;
            }

            //fall through platforms
            if (cursors.down.isDown && player.body.touching.down && hitPlatform)
            {
                player.position.y = player.position.y + 15;
            }

            //right attack
            if (spacebar.isDown && cursors.right.isDown)
            {
                player.animations.play('jabright');
                enableHitbox('attack1');
                hitboxes.position.x = 50;
                hitboxes.position.y = 0;
                this.time.events.add(1000, disableHitboxes);

            }

            //left attack
            if (spacebar.isDown && cursors.left.isDown)
            {
                player.animations.play('jableft');
                enableHitbox('attack2');
                hitboxes.position.x = -100;
                hitboxes.position.y = 0;
                this.time.events.add(1000, disableHitboxes);

            }

            //up attack
            if (spacebar.isDown && cursors.up.isDown)
            {
                enableHitbox('attack3');
                hitboxes.position.y = -100;
                hitboxes.position.x = 0;
                this.time.events.add(1000, disableHitboxes);

            }

            //down attack
            if (spacebar.isDown && cursors.down.isDown)
            {
                enableHitbox('attack4');
                hitboxes.position.y = 50;
                hitboxes.position.x = 0;
                this.time.events.add(1000, disableHitboxes);

            }
            
            // checks if player is hit by enemy
            game.physics.arcade.overlap(enemy, player, hitByEnemy, null);  
        }
        
        //jump through platforms.
        if ((hitPlatform && !(player.body.touching.down) && canPass) || (playerHitStun && (hitPlatform && !(player.body.touching.down))))
        {
            player.position.y = player.position.y - 4.1;
            player.body.velocity.y = -300;
            //player.body.velocity.y = -650;
        }
        
        if (enemyHitStun == false)
        {
            
            // see if enemy and player within 400px of each other
            if (game.physics.arcade.distanceBetween(enemy, player) < 600) 
            {

                    // if player to left of enemy AND enemy moving to right (or not moving)
                    if (player.x < enemy.x - 5 && enemy.body.velocity.x >= 0) {
                        // move enemy to left
                        enemy.body.velocity.x = -250;
                    }
                    // if player to right of enemy AND enemy moving to left (or not moving)
                    else if (player.x > enemy.x + 5 && enemy.body.velocity.x <= 0) {
                        // move enemy to right
                        enemy.body.velocity.x = 250;
                    }
                
                    /*
                    else if (player.y > enemy.y + 5 && enemy.body.velocity.y <= 0) {
                        // move enemy to right
                        enemy.body.velocity.y = 250;
                    }
                    
                    else if (player.y < enemy.y - 5 && enemy.body.velocity.y >= 0) {
                        // move enemy to left
                        enemy.body.velocity.y = -250;
                    }
                    */
                    else if (player.body.velocity.x == 0) {
                        enemy.body.velocity.x = 0
                    }
                
            }
            
            // checks if hitbox hits enemy
            game.physics.arcade.overlap(hitbox1, enemy, hitBox1Enemy, null, this);
            game.physics.arcade.overlap(hitbox2, enemy, hitBox2Enemy, null, this);
            game.physics.arcade.overlap(hitbox3, enemy, hitBox3Enemy, null, this);
            game.physics.arcade.overlap(hitbox4, enemy, hitBox4Enemy, null, this);

        }
    }

}

function restartGame ()
{
    playerHitStun = false;
    gameover = false;
    timeOver = false;
    game.time.reset();
    game.state.restart();
    score = 0;
    
    //deathscreen.kill();
    //gameOverText.kill();
    enemyDamage = 0;
    playerDamage = 0;
    
    
}

function endGame ()
{
    enemy.kill()
    gameOverText = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER', { fontSize: '100px', fill: '#000000' });
    gameover = true;
    
    
}

// ends game and kills player
function gotKilled () 
{
    gameover = true;
    deathscreen = game.add.image(0, 0, 'deathscreen');
    //game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#ff0000' });
     
}

// ends game and kills enemy
function enemyKilled () 
{
    particleBurst();
    enemy.kill();
    enemyDamage = 0;
    enemyDamageText.text = enemyDamage + '%';
    
    enemy = game.add.sprite(game.world.centerX, game.world.height - 600, 'sarge');
    enemy.scale.setTo(2, 2);
    game.physics.arcade.enable(enemy);
    enemy.body.gravity.y = 2000;
    enemy.body.collideWorldBounds = false;
    score += 1;
    scoreText.text = 'Score: ' + score;
}

//what happens when enemy hits player
function hitByEnemy ()
{
    playerDamage += 10;
    playerDamageText.text = playerDamage + '%';
    playerHitStun = true;
    
    //calculates knockback
    playerKnockback = ((playerDamage / 100) * 1000 + 300);
    
    if (player.position.x < enemy.position.x)
    {
        player.body.velocity.x = -1 * playerKnockback;
        player.body.velocity.y = -1 * playerKnockback;
    }
    else
    {
        player.body.velocity.x = playerKnockback;
        player.body.velocity.y = -1 * playerKnockback;
    }
    
    
    
    game.time.events.add(200, disablePlayerHitStun);
}


// makes hitbox appear
function enableHitbox (hitboxName) 
{     
    for(var i = 0; i < hitboxes.children.length; i++)
    {
        if(hitboxes.children[i].name === hitboxName)
        {
            hitboxes.children[i].reset(0, 0);          
        }  
    }
}

// gets rid of all hitboxes.
function disableHitboxes ()
{     
    hitboxes.forEachExists(function(hitbox) {hitbox.kill();});

}

// what happens when enemy is hit
function hitBox1Enemy ()
{
    particleBurstHit();
    enemyDamage += 10;
    enemyDamageText.text = enemyDamage + '%';
    enemyHitStun = true
    
    //calculates knockback
    knockback = ((enemyDamage / 100) * 1000 + 300);
    enemy.body.velocity.y = -1 * knockback;
    enemy.body.velocity.x = knockback;
    this.time.events.add(400, disableEnemyHitStun);
}

function hitBox2Enemy ()
{
    particleBurstHit();
    enemyDamage += 10;
    enemyDamageText.text = enemyDamage + '%';
    enemyHitStun = true
    
    //calculates knockback
    knockback = -1 * ((enemyDamage / 100) * 1000 + 300);
    enemy.body.velocity.y = knockback;
    enemy.body.velocity.x = knockback;
    this.time.events.add(400, disableEnemyHitStun);
}

function hitBox3Enemy ()
{
    particleBurstHit();
    enemyDamage += 10;
    enemyDamageText.text = enemyDamage + '%';
    enemyHitStun = true
    
    //calculates knockback
    knockback = -1 * ((enemyDamage / 100) * 1000 + 300);
    enemy.body.velocity.y = knockback;
    this.time.events.add(400, disableEnemyHitStun);
}

function hitBox4Enemy ()
{
    particleBurstHit();
    enemyDamage += 10;
    enemyDamageText.text = enemyDamage + '%';
    enemyHitStun = true
    
    //calculates knockback
    knockback = -1000;
    enemy.body.velocity.y = knockback;
    this.time.events.add(400, disableEnemyHitStun);
}

// jump
function jump (jumper)
{
    player.animations.play('jumpleft')
    jumper.body.velocity.y = -850;
    
}

function upInputIsActive(duration) {
    return game.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
}

function upInputReleased() {
    return game.input.keyboard.upDuration(Phaser.Keyboard.UP);
}

function disablePlayerHitStun ()
{
    playerHitStun = false;
}

function disableEnemyHitStun ()
{
    enemyHitStun = false;
}

function particleBurst()
{
    emitter.x = enemy.body.x;
    emitter.y = enemy.body.y;
    
    emitter.start(true, 3000, null, 50);
}

function particleBurstHit()
{
    emitter2.x = enemy.body.x;
    emitter2.y = enemy.body.y;
    
    emitter2.start(true, 500, null, 20);
}

function displayTimeRemaining() 
{
    time = Math.floor(game.time.totalElapsedSeconds() );
    timeLeft = timeLimit - time;

    // detect when countdown is over
    if (timeLeft <= 0) {
        timeLeft = 0;
        timeOver = true;
    }

    var min = Math.floor(timeLeft / 60);
    var sec = timeLeft % 60;

    if (min < 10) {
        min = '0' + min;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }
    
    timeText.text = 'Time Left ' + min + ':' + sec;
}