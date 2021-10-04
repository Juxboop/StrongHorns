var game = new Phaser.Game(1600, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });

// preload assets
function preload() 
{
    game.load.image('deathscreen', 'assets/deathscreen.png');
    game.load.image('winscreen', 'assets/winscreen.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('tower', 'assets/utTower1.png');
    game.load.image('football', 'assets/football.png');
    game.load.spritesheet('hookem', 'assets/fullruncycle.png', 64, 64);
    game.load.image('wizard', 'assets/wizard.png');

}

// defined variables
var player;
var enemy;
var platforms;
var stages;
var cursors;
var bounds;
var footballs;
var score = 0;
var scoreText;
var gameover = false;
var lastLeft = true;
var jumpCounter = 0;
var isJumping;
var hitboxes;
var spacebar;

function create() 
{
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'tower');
    
    bounds = game.add.group();
    bounds.enableBody = true;
    
    //top blast zone
    var bound = bounds.create(0, game.world.height - 1000, 'ground');
    bound.scale.setTo(5,0.01)
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
    enemy = game.add.sprite(game.world.centerX + 200, game.world.height - 300, 'wizard');
    enemy.scale.setTo(3, 3);
    game.physics.arcade.enable(enemy);
    enemy.body.gravity.y = 2000;
    enemy.body.collideWorldBounds = false;
    
    //player keyboard controls
    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


    //player animations
    player.animations.add('right', [0, 1, 2, 3, 4], 10, true);
    player.animations.add('left', [5, 6, 7, 8, 9], 10, true);

    //placeholder footballs
    footballs = game.add.group();
    footballs.enableBody = true;
    for (var i = 0; i < 10; i++)
    {
        var football = footballs.create(300 + i * 80, -1000 + Math.random() * 1000, 'football');
        football.body.gravity.y = 200;
        football.body.bounce.y = 0.4+ Math.random() * 0.4;
        football.scale.setTo(2,2);
    }
    
    
    //hitboxes
    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    player.addChild(hitboxes);
    
    //right hitbox
    var hitbox1 = hitboxes.create(100, 0, 'football');
    hitbox1.scale.setTo(2,3)
    hitbox1.name = 'attack1'
    
    //left hitbox
    var hitbox2 = hitboxes.create(-100, 0, 'football');
    hitbox2.scale.setTo(2,3)
    hitbox2.name = 'attack2'
    
    disableHitboxes()
    
    scoreText = game.add.text(16, 16, 'Score: ', { fontSize: '32px', fill: '#ff0000' });
    
    
}

function update() 
{
    
    if (gameover == false)
    {
        //collision
        var hitStage = game.physics.arcade.collide(player, stages);
        var hitStage1 = game.physics.arcade.collide(enemy, stages);
        
        var hitPlatform = game.physics.arcade.collide(player, platforms);
        
        game.physics.arcade.collide(footballs, platforms);
        
        //checks overlap of out of bounds and footballs
        game.physics.arcade.overlap(player, footballs, collectFootball, null, this);        
        game.physics.arcade.overlap(player, bounds, gotKilled, null);  
        game.physics.arcade.overlap(hitboxes, footballs, collectFootball, null, this);
        
        //if no input, stay still
        player.body.velocity.x = 0;
        
        //move left
        if (cursors.left.isDown)
        {
            lastLeft = true;
            player.body.velocity.x = -450;
            player.animations.play('left');
        }
        
        //move right
        else if (cursors.right.isDown)
        {
            lastLeft = false
            player.body.velocity.x = 450;
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
        if (player.body.touching.down && (hitPlatform || hitStage) && jumpCounter > 1)
        {
            jumpCounter = 0;
        }
        
        //jumping from platform or stage
        if (cursors.up.isDown && player.body.touching.down && (hitPlatform || hitStage))
        {
            player.body.velocity.y = -50;
            jumpCounter += 1;
            game.add.text(16, 16, 'Score: ' + jumpCounter, { fontSize: '32px', fill: '#ff0000' });
            
        }
        
        //checks if player jumped
        if (cursors.up.isDown)
        {
            isJumping = true;
        }
        
        //double jump
        if (cursors.up.isDown && jumpCounter <= 10)
        {
            player.body.velocity.y = -850;
            jumpCounter += 1;   
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
            //player.body.velocity.y = 650;
        }
        
        //checks if player is not jumping
        if (player.body.touching.down && (hitPlatform || hitStage))
        {
            isJumping = false;
        }
        
        //right attack
        if (spacebar.isDown && cursors.right.isDown)
        {
            enableHitbox('attack1');
            hitboxes.position.x = 100
            this.time.events.add(1000, disableHitboxes);

        }
        
        //left attack
        if (spacebar.isDown && cursors.left.isDown)
        {
            enableHitbox('attack2');
            hitboxes.position.x = -100
            this.time.events.add(1000, disableHitboxes);

        }
        
        //jump through platforms.
        if (hitPlatform && isJumping == true)
        {
            player.position.y = player.position.y - 5;
            //player.body.velocity.y = -650;
        }
    }

}

// collect football 
function collectFootball (player, football) 
{
    football.kill();
    score += 100;
    scoreText.text = 'Score: ' + score;
    if (score == 1000)
    {
        gameover = true;
        this.add.image(0, 0, 'winscreen');
        game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#ff0000' });
    }
}

// ends game and kills player
function gotKilled () 
{
    gameover = true;
    player.kill();
    game.add.image(0, 0, 'deathscreen');
    //game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#ff0000' });
  
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
/*
function upInputReleased ()
{
    var released = false;

    released = this.input.keyboard.upDuration(Phaser.Keyboard.UP);
    released |= this.game.input.activePointer.justReleased();

    return released;
}
*/

