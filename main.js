var game = new Phaser.Game(1600, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });

// preload assets
function preload() 
{
    game.load.image('deathscreen', 'assets/Endscreen.png');
    game.load.image('winscreen', 'assets/winscreen.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.image('tower', 'assets/utTower2.png');
    game.load.image('football', 'assets/fist.png');
    game.load.image('greenplus', 'assets/greenplus.png');
    game.load.spritesheet('hookem', 'assets/hookemRUNJABJUMP.png', 64, 64);
    game.load.spritesheet('olsarge', 'assets/olsarge.png', 64, 64);
    game.load.image('confetti', 'assets/confetti.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('redstar', 'assets/redstar.png');
    game.load.image('goalright', 'assets/fieldgoalright.png');
    game.load.image('goalleft', 'assets/fieldgoalleft.png');
    
    game.load.image('titlescreen', 'assets/Strong_horns_title.png')
    game.load.image('endscreen', 'assets/Endscreen.png')
    game.load.image('tutorial', 'assets/Strong_horns_tutorial.png')
    
    game.load.audio('bgm', 'assets/bensound-extremeaction.mp3')
    game.load.audio('punchsound', 'assets/punch_sound.wav')
    game.load.audio('smashsound', 'assets/smash_sound.mp3')
    game.load.audio('awwsound', 'assets/aww_sound.mp3')
    game.load.audio('KOsound', 'assets/KOsound.mp3')
    game.load.audio('whistle', 'assets/whistle.mp3')
}

// defined variables
var instantRestart = false;
var music;
var punchsound;
var smashsound;
var awwsound;
var KOsound;
var whistlesound;
var deathscreen;
var endscreen;
var tutorialScreen;
var canTutorial;
var player;
var enemy;
var platforms;
var stages;
var pointfieldgoals;
var nullfieldgoals;
var cursors;
var bounds;
var score = 0;
var hiscore = 0;
var scoreText;
var canScore = true;
var gameover = true;
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
var keyEnter;
var keyT;
var keyBackSpace;
var enemyJumpCounter;
var enemyHitStun = false;
var playerHitStun = false;
var knockback;
var isAttacking = false;
var playerKnockback;
var enemyDamage = 0;
var enemyDamageText;
var playerDamage = 0;
var playerDamageText;
var emitter;
var emitter2;
var emitter3;
var emitter4;
var emitter5;
var timeLimit = 60;
var timeOver = false;
var timeText;
var time;
var timeLeft;
var gameOverText;
var countdownText;
var leftStoredVelocity = 0;
var rightStoredVelocity = 0;
var titleScreen;


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
    bound = bounds.create(-50, 0, 'ground');
    bound.scale.setTo(0.01, 29)
    bound.body.immovable = true;
    
    //right blast zone
    bound = bounds.create(1700, 0, 'ground');
    bound.scale.setTo(0.01, 29)
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
    var ledge = platforms.create(game.world.centerX - 200, 550, 'platform');
    ledge.body.immovable = true;
    ledge.scale.setTo(1.5, 1.3)
    ledge.anchor.set(0.5);

    //create right platform
    ledge = platforms.create(game.world.centerX + 217, 550, 'platform');
    ledge.body.immovable = true;
    ledge.scale.setTo(1.5, 1.3)
    ledge.anchor.set(0.5);
    
    //create top platformu
    ledge = platforms.create(game.world.centerX + 10, 400, 'platform');
    ledge.body.immovable = true;
    ledge.scale.setTo(1.5, 1.3)
    ledge.anchor.set(0.5);
    
    //create fieldgoals
    pointfieldgoals = game.add.group();
    pointfieldgoals.enableBody = true;
    
    nullfieldgoals = game.add.group();
    nullfieldgoals.enableBody = true;
    
    // leftside goal
    var fieldgoalleft = pointfieldgoals.create(58, game.world.centerY - 246, 'goalleft');
    fieldgoalleft.body.immovable = true;
    fieldgoalleft.scale.setTo(0.5, 0.5);
    
    var fieldgoalright = nullfieldgoals.create(40, game.world.centerY - 300, 'goalright');
    fieldgoalright.body.immovable = true;
    fieldgoalright.scale.setTo(0.5, 0.5);
    
    fieldgoalleft = nullfieldgoals.create(114, game.world.centerY + 100, 'goalleft');
    fieldgoalleft.body.immovable = true;
    fieldgoalleft.scale.setTo(0.5, 1);
    fieldgoalleft.scale.x *= -1;
    
    // rightside goal
    fieldgoalleft = pointfieldgoals.create(1532, game.world.centerY - 246, 'goalleft');
    fieldgoalleft.body.immovable = true;
    fieldgoalleft.scale.setTo(0.5, 0.5);
    fieldgoalleft.scale.x *= -1;
    
    fieldgoalright = nullfieldgoals.create(1550, game.world.centerY - 300, 'goalright');
    fieldgoalright.body.immovable = true;
    fieldgoalright.scale.setTo(0.5, 0.5);
    fieldgoalright.scale.x *= -1;
    
    fieldgoalleft = nullfieldgoals.create(1494, game.world.centerY + 100, 'goalleft');
    fieldgoalleft.body.immovable = true;
    fieldgoalleft.scale.setTo(0.5, 1);
    fieldgoalleft.scale.x *= -1;
    
    //create player
    player = game.add.sprite(game.world.centerX, game.world.height - 300, 'hookem');
    player.scale.setTo(1.25, 1.25);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 2000;
    player.body.collideWorldBounds = false;
    
    //create enemy
    enemy = game.add.sprite(game.world.centerX + 200, game.world.height - 600, 'olsarge');
    enemy.scale.setTo(1.5, 1.5);
    game.physics.arcade.enable(enemy);
    enemy.body.gravity.y = 2000;
    enemy.body.collideWorldBounds = false;
    
    //player keyboard controls
    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
    keyE = game.input.keyboard.addKey(Phaser.Keyboard.E);
    keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
    keyT = game.input.keyboard.addKey(Phaser.Keyboard.T)
    keyBackSpace = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE)
    
    //player animations
    player.animations.add('right', [0, 1, 2, 3, 4], 10, true);
    player.animations.add('left', [5, 6, 7, 8, 9], 10, true);
    player.animations.add('jableft', [10], 10, true);
    player.animations.add('jabright', [11], 10, true);
    player.animations.add('jumpleft', [12, 13, 14], 3, true);
    player.animations.add('jumpright', [15, 16, 17], 3, true);
    
    //enemy animations
    enemy.animations.add('enemyright', [0, 2, 3], 10, true);
    enemy.animations.add('enemyleft', [1, 4, 5], 10, true);
    
    //sounds
    music = game.add.audio('bgm');
    music.volume = 0.03;
    
    punchsound = game.add.audio('punchsound');
    smashsound = game.add.audio('smashsound'); 
    awwsound = game.add.audio('awwsound');
    KOsound = game.add.audio('KOsound');
    whistlesound = game.add.audio('whistle');
    
    KOsound.volume = 0.2;
    whistlesound.volume = 0.2;
    
    
    
    //hitboxes
    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    player.addChild(hitboxes);
    
    //right hitbox
    hitbox1 = hitboxes.create(100, 0, 'football');
    hitbox1.scale.setTo(.1, .1)
    hitbox1.name = 'attack1'
    hitbox1.alpha = 1;
    
    //left hitbox
    hitbox2 = hitboxes.create(-100, 0, 'football');
    hitbox2.scale.setTo(.1, .1)
    hitbox2.name = 'attack2'
    hitbox2.alpha = 1;
    
    hitbox3 = hitboxes.create(0, -100, 'football');
    hitbox3.scale.setTo(.1, .1)
    hitbox3.name = 'attack3'
    hitbox3.alpha = 1;
    
    hitbox4 = hitboxes.create(0, 100, 'football');
    hitbox4.scale.setTo(.1, .1)
    hitbox4.name = 'attack4'
    hitbox4.alpha = 1;
    
    disableHitboxes()
    
    // sarge particles
    emitter = game.add.emitter(game.world.centerX, 500, 200);
    emitter.scale.setTo(1, 1)
    emitter.makeParticles('olsarge');
    emitter.setRotation(0, 0);
    emitter.setAlpha(0.3, 0.8);
    emitter.gravity = 0;
    
    // cause damage particles
    emitter2 = game.add.emitter(game.world.centerX, 500, 200);
    emitter2.scale.setTo(1, 1)
    emitter2.makeParticles('star');
    emitter2.setRotation(0, 0);
    emitter2.setAlpha(0.3, 0.8);
    emitter2.gravity = 0;
    
    // receive damage particles
    emitter3 = game.add.emitter(game.world.centerX, 500, 200);
    emitter3.scale.setTo(1, 1)
    emitter3.makeParticles('redstar');
    emitter3.setRotation(0, 0);
    emitter3.setAlpha(0.3, 0.8);
    emitter3.gravity = 0;
    
    emitter4 = game.add.emitter(200, 50, 200);
    emitter4.scale.setTo(1, 1)
    emitter4.makeParticles('star');
    emitter4.setRotation(0, 0);
    emitter4.setAlpha(0.3, 0.8);
    emitter4.gravity = 0;
    
    emitter5 = game.add.emitter(game.world.centerX - 150, 830, 200);
    emitter5.scale.setTo(1, 1)
    emitter5.makeParticles('greenplus');
    emitter5.setRotation(0, 0);
    emitter5.setAlpha(0.3, 0.8);
    emitter5.gravity = 0;
    
    // User Interface
    scoreText = game.add.text(16, 16, 'Score: ' + score, { fontSize: '64px', fill: '#ff0000' });
    enemyDamageText = game.add.text(game.world.centerX + 100, 830, enemyDamage + '%', { fontSize: '48px', fill: '#FFFFFF' });
    playerDamageText = game.add.text(game.world.centerX - 150, 830, playerDamage + '%', { fontSize: '48px', fill: '#FFFFFF' });
    timeText = game.add.text(game.world.centerX - 75, 16, '', { fontSize: '64px', fill: '#FFFFFF' });


    scoreText.stroke = '#000000';
    scoreText.strokeThickness = 6;
    scoreText.fill = '#FFFFFF';

    enemyDamageText.stroke = '#000000';
    enemyDamageText.strokeThickness = 6;
    enemyDamageText.fill = '#FFFFFF';

    playerDamageText.stroke = '#000000';
    playerDamageText.strokeThickness = 6;
    playerDamageText.fill = '#FFFFFF';

    timeText.stroke = '#000000';
    timeText.strokeThickness = 6;
    timeText.fill = '#FFFFFF';
    
    displayTitleScreen();
}

function update() 
{   
    if (keyR.justDown)
    {
        instantRestart = true;
        restartGame();
    }
    
    if (keyBackSpace.justDown)
    {   instantRestart = false;
        restartGame();
    }
    
    if (keyEnter.justDown)
    {
        hideTitleScreen();
        music.play();
    }
    
    if (keyT.justDown)
    {
        toggleTutorial();
    }


    //collision
    var hitStage = game.physics.arcade.collide(player, stages);
    var hitStage1 = game.physics.arcade.collide(enemy, stages);
    
    game.physics.arcade.overlap(enemy, pointfieldgoals, enemyFieldGoal, null);
    
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
            var hitPlatform = game.physics.arcade.collide(player, platforms);
            
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
            if (isAttacking == false)
            {
                
                //right attack
                if (spacebar.isDown && cursors.right.isDown)
                {
                    isAttacking = true;
                    player.animations.play('jabright');
                    enableHitbox('attack1');
                    this.time.events.add(300, disableHitboxes);
                    if (lastLeft)
                    {
                        hitboxes.position.y = 50;
                        hitboxes.position.x = -75;
                    }
                    else
                    {
                        hitboxes.position.y = 0;
                        hitboxes.position.x = 75;
                    }

                }

                //left attack
                if (spacebar.isDown && cursors.left.isDown)
                {
                    isAttacking = true;
                    player.animations.play('jableft');
                    enableHitbox('attack2');
                    hitboxes.position.x = -100;
                    hitboxes.position.y = 0;
                    this.time.events.add(300, disableHitboxes);

                }

                //up attack
                if (spacebar.isDown && cursors.up.isDown)
                {
                    isAttacking = true;
                    enableHitbox('attack3');
                    hitboxes.position.y = -100;
                    hitboxes.position.x = 0;
                    this.time.events.add(300, disableHitboxes);

                }

                //down attack
                if (spacebar.isDown && cursors.down.isDown)
                {
                    isAttacking = true;
                    enableHitbox('attack4');

                    if (lastLeft)
                    {
                        hitboxes.position.y = 50;
                        hitboxes.position.x = -100;
                    }
                    else
                    {
                        hitboxes.position.y = 50;
                        hitboxes.position.x = 75;
                    }

                    this.time.events.add(300, disableHitboxes);

                }
            }
            
            
            // checks if player is hit by enemy
            game.physics.arcade.overlap(enemy, player, hitByEnemy, null);  
        }
        
        //jump through platforms.
        if ((hitPlatform && !(player.body.touching.down) && canPass) || (playerHitStun && (hitPlatform && !(player.body.touching.down))))
        {
            player.position.y = player.position.y - 4.1;
            player.body.velocity.y = -300;
        }
        
        if (enemyHitStun == false)
        {
            var hitPlatform1 = game.physics.arcade.collide(enemy, platforms);
            
            // Enemy AI
            // see if enemy and player within 400px of each other
            if (game.physics.arcade.distanceBetween(enemy, player) < 600) 
            {       
                    // resets jump counter
                    if (enemy.body.touching.down && (hitPlatform1 || hitStage1))
                    {
                        enemyJumpCounter = 1;
                    }
                    
                    if ((hitPlatform1 && !(player.body.touching.down)) || (enemyHitStun && (hitPlatform1 && !(enemy.body.touching.down))))
                    {
                        enemy.position.y = enemy.position.y - 10;
                        //enemy.body.velocity.y = -300;
                    }

                    // if player to left of enemy AND enemy moving to right (or not moving)
                    if (player.x < enemy.x - 5 && enemy.body.velocity.x >= 0) {
                        // move enemy to left
                        enemy.body.velocity.x = -250;
                        enemy.animations.play('enemyleft')
                    }
                
                    // if player to right of enemy AND enemy moving to left (or not moving)
                    else if (player.x > enemy.x + 5 && enemy.body.velocity.x <= 0) {
                        // move enemy to right
                        enemy.body.velocity.x = 250;
                        enemy.animations.play('enemyright')
                    }
                    
                    // enemy jump
                    else if (player.y < enemy.y - 120 && enemyJumpCounter == 1 && enemy.x < player.x + 100 && enemy.x > player.x - 100){
                        enemyJumpCounter = enemyJumpCounter - 1
                        enemy.body.velocity.y = -900;
                    }   
                    
                
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
    // gameover = true;
    timeOver = false;
    game.time.reset();
    game.state.restart();
    score = 0;
    
    enemyDamage = 0;
    playerDamage = 0;
    music.stop();
    
    
}

function endGame ()
{
    gameover = true;
    enemy.kill();
    player.kill();
    // gameOverText = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER', { fontSize: '100px', fill: '#000000' });
    endscreen = game.add.image(0, 0, 'endscreen');
    endscreen.scale.setTo(.85, .85);
    
    if (score > hiscore)
    {
        hiscore = score;
    }
   
    var hiscoreText = game.add.text(1250, 117, ': ' + hiscore, { fontSize: '64px', fill: '#ff0000' });
    scoreText = game.add.text(975, 250, 'Current Score: ' + score, { fontSize: '64px', fill: '#FFFFFF', stroke: '#000000', strokeThickness: 6 });
    
    
}

// ends game and kills player
function gotKilled () 
{
    enemy.kill();
    awwsound.play();
    gameover = true;
    deathscreen = game.add.image(0, 0, 'deathscreen');
    deathscreen.scale.setTo(0.85, 0.85);
    
    if (score > hiscore)
    {
        hiscore = score;
    }
   
    var hiscoreText = game.add.text(1250, 117, ': ' + hiscore, { fontSize: '64px', fill: '#ff0000' });
    scoreText = game.add.text(975, 250, 'Current Score: ' + score, { fontSize: '64px', fill: '#FFFFFF', stroke: '#000000', strokeThickness: 6 });
     
}

// ends game and kills enemy
function enemyKilled () 
{
    emitter4.start(true, 1000, null, 20);
    canScore = true;
    KOsound.play();
    particleBurst(emitter);
    enemy.kill();
    enemyDamage = 0;
    enemyDamageText.text = enemyDamage + '%';
    setDamageColor(enemyDamage, enemyDamageText);
    
    enemy = game.add.sprite(400 + Math.random() * 800, game.world.height - 800, 'olsarge');
    enemy.scale.setTo(1.5, 1.5);
    game.physics.arcade.enable(enemy);
    enemy.body.gravity.y = 2000;
    enemy.body.collideWorldBounds = false;
    enemy.animations.add('enemyright', [0, 2, 3], 10, true);
    enemy.animations.add('enemyleft', [1, 4, 5], 10, true);
    
    score += 1;
    scoreText.text = 'Score: ' + score;
    
    if (score % 5 == 0)
    {
        heal();
    }
}

//what happens when enemy hits player
function hitByEnemy ()
{
    smashsound.play();
    particleBurstHit(player, emitter3);
    
    playerDamage += 10;
    playerDamageText.text = playerDamage + '%';
    setDamageColor(playerDamage, playerDamageText);
    
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
    isAttacking = false

}

// what happens when enemy is hit
function hitBox1Enemy ()
{
    punchsound.play();
    particleBurstHit(enemy, emitter2);
    enemyDamage += 10;
    enemyDamageText.text = enemyDamage + '%';
    setDamageColor(enemyDamage, enemyDamageText);
    
    enemyHitStun = true
    
    //calculates knockback
    knockback = ((enemyDamage / 100) * 1000 + 300);
    enemy.body.velocity.y = -1 * knockback;
    enemy.body.velocity.x = knockback;
    this.time.events.add(400, disableEnemyHitStun);
}

function hitBox2Enemy ()
{
    punchsound.play();
    particleBurstHit(enemy, emitter2);
    enemyDamage += 10;
    enemyDamageText.text = enemyDamage + '%';
    setDamageColor(enemyDamage, enemyDamageText);
    enemyHitStun = true
    
    //calculates knockback
    knockback = -1 * ((enemyDamage / 100) * 1000 + 300);
    enemy.body.velocity.y = knockback;
    enemy.body.velocity.x = knockback;
    this.time.events.add(400, disableEnemyHitStun);
}

function hitBox3Enemy ()
{
    punchsound.play();
    particleBurstHit(enemy, emitter2);
    enemyDamage += 10;
    enemyDamageText.text = enemyDamage + '%';
    setDamageColor(enemyDamage, enemyDamageText);
    enemyHitStun = true
    
    //calculates knockback
    knockback = -1 * ((enemyDamage / 100) * 1000 + 300);
    enemy.body.velocity.y = knockback;
    this.time.events.add(400, disableEnemyHitStun);
}

function hitBox4Enemy ()
{
    punchsound.play();
    particleBurstHit(enemy, emitter2);
    enemyDamage += 10;
    enemyDamageText.text = enemyDamage + '%';
    setDamageColor(enemyDamage, enemyDamageText);
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

function particleBurst(emitter)
{
    emitter.x = enemy.body.x;
    emitter.y = enemy.body.y;
    
    emitter.start(true, 3000, null, 50);
}

function particleBurstHit(target, emitter)
{
        emitter.x = target.body.x;
        emitter.y = target.body.y;
        emitter.start(true, 500, null, 20);
    
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
    
    timeText.text = '' + min + ':' + sec;
}

function displayTitleScreen()
{
    if (!instantRestart)
    {
        gameover = true;
        titleScreen = game.add.image(0, 0, 'titlescreen');
        canTutorial = true;
    }
    else
    {
        music.play();
        gameover = false;
    }
}

function hideTitleScreen() 
{

    titleScreen.kill();
    gameover = false;
    canTutorial = false;
//    startCountdown();
    game.time.reset();
}

function toggleTutorial() 
{
    if (canTutorial)
    {
        tutorialScreen = game.add.image(0, 0, 'tutorial');
        canTutorial = false
    }
    else
    {
        tutorialScreen.kill();
        canTutorial = true;
    }
}

function enemyFieldGoal()
{   
    
    if(canScore)
    {
        whistlesound.play()
        emitter4.start(true, 1000, null, 20);
        score = score + 1;
        canScore = false;
        scoreText.text = 'Score: ' + score;
        
        if (score % 5 == 0)
        {
            heal();
        }
    }
}

function heal()
{
    emitter5.start(true, 1000, null, 20);
    playerDamage -= 20;
    playerDamageText.text = playerDamage + '%';
}

function setDamageColor(damage, damageText)
{
    if (damage < 10)
        damageText.fill = '#FFFFFF';
    else if (damage < 20)
        damageText.fill = '#FFf5f5';
    else if (damage < 30)
        damageText.fill = '#FFdede';
    else if (damage < 40)
        damageText.fill = '#FFc9c9';
    else if (damage < 50)
        damageText.fill = '#FFb8b8';
    else if (damage < 60)
        damageText.fill = '#FFa1a1';
    else if (damage < 70)
        damageText.fill = '#FF8a8a';
    else if (damage < 80)
        damageText.fill = '#FF7070';
    else if (damage < 90)
        damageText.fill = '#FF5454';
    else if (damage < 100)
        damageText.fill = '#FF3030';
    else if (damage < 110)
        damageText.fill = '#c70000';
    else if (damage < 120)
        damageText.fill = '#850000';
    else
        damageText.fill = '#520000';
       
}
