var game = new Phaser.Game(1600, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() 
{
    game.load.image('deathscreen', 'assets/deathscreen.png');
    game.load.image('winscreen', 'assets/winscreen.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('tower', 'assets/utTower.jpg');
    game.load.image('football', 'assets/football.png');
    game.load.spritesheet('hookem', 'assets/fullruncycle.png', 64, 64);

}

var player;
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

function create() 
{
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(-110, 0, 'tower');

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
    
    var ground = stages.create(0, game.world.height - 150, 'ground');
    ground.scale.setTo(2, 4);
    ground.anchor.set(0.5);
    ground.x = game.world.centerX;
    ground.body.immovable = true;
    
    
    platforms = game.add.group();
    platforms.enableBody = true;
    
    var ledge = platforms.create(game.world.centerX - 200, 500, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.4, 0.3)
    ledge.anchor.set(0.5);

    
    ledge = platforms.create(game.world.centerX + 200, 500, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.4, 0.3)
    ledge.anchor.set(0.5);
    
    ledge = platforms.create(game.world.centerX, 350, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.4, 0.3)
    ledge.anchor.set(0.5);
    
    player = game.add.sprite(game.world.centerX, game.world.height - 300, 'hookem');
    player.scale.setTo(1.25, 1.25);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 1000;
    player.body.collideWorldBounds = false;
    
    //game.physics.add.collide(player, platforms);

    
    player.animations.add('right', [0, 1, 2, 3, 4], 10, true);
    player.animations.add('left', [5, 6, 7, 8, 9], 10, true);

    footballs = game.add.group();
    footballs.enableBody = true;
    for (var i = 0; i < 10; i++)
    {
        var football = footballs.create(i * 80, -1000 + Math.random() * 1000, 'football');
        football.body.gravity.y = 200;
        football.body.bounce.y = 0.4+ Math.random() * 0.4;
        football.scale.setTo(2,2);
    }
    
    
    
    scoreText = game.add.text(16, 16, 'Score: ', { fontSize: '32px', fill: '#ff0000' });
    cursors = game.input.keyboard.createCursorKeys();
    
}

function update() 
{
    
    if (gameover == false)
    {
        var hitStage = game.physics.arcade.collide(player, stages);
        var hitPlatform = game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(footballs, platforms);

        game.physics.arcade.overlap(player, footballs, collectFootball, null, this);        
        game.physics.arcade.overlap(player, bounds, gotKilled, null);  
        
        player.body.velocity.x = 0;
        

        if (cursors.left.isDown)
        {
            lastLeft = true;
            player.body.velocity.x = -350;
            player.animations.play('left');
        }
        
        else if (cursors.right.isDown)
        {
            lastLeft = false
            player.body.velocity.x = 350;
            player.animations.play('right');
        }
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
        
        if (player.body.touching.down && (hitPlatform || hitStage) && jumpCounter > 1)
        {
            jumpCounter = 0;
        }
        
        if (cursors.up.isDown && player.body.touching.down && (hitPlatform || hitStage))
        {
            player.body.velocity.y = -650;
            jumpCounter += 1;
            game.add.text(16, 16, 'Score: ' + jumpCounter, { fontSize: '32px', fill: '#ff0000' });
        }
        
        if (cursors.up.isDown && jumpCounter <= 10)
        {
            player.body.velocity.y = -650;
            jumpCounter += 1;   
        }
        
        
        if (cursors.down.isDown)
        {
            player.body.velocity.y = 550;
        }
        
        if (cursors.down.isDown && player.body.touching.down && hitPlatform)
        {
            player.position.y = player.position.y + 15;
            player.body.velocity.y = -650;
        }
        
    }

}

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

function gotKilled () 
{
    gameover = true;
    player.kill();
    game.add.image(0, 0, 'deathscreen');
    //game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#ff0000' });
  
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

