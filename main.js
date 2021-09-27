var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() 
{
    game.load.image('deathscreen', 'assets/deathscreen.png');
    game.load.image('winscreen', 'assets/winscreen.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('sky', 'assets/sky.png');
    game.load.image('gem', 'assets/diamond.png');
    game.load.spritesheet('wizard', 'assets/wizard.png', 16, 28);

}

var player;
var platforms;
var cursors;

var gems;
var score = 0;
var scoreText;
var gameover = false;
var timeSinceLastIncrement = 0;

function create() 
{

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');

    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(1.5, 4);
    ground.anchor.set(0.5);
    ground.x = game.world.centerX;
    ground.body.immovable = true;
    
    var ledge = platforms.create(450, 350, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.4, 0.5)

    
    ledge = platforms.create(175, 350, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.4, 0.5)
    
    ledge = platforms.create(315, 250, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.4, 0.5)

    player = game.add.sprite(game.world.centerX, game.world.height - 200, 'wizard');
    player.scale.setTo(2, 2);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 300;
    //player.body.collideWorldBounds = true;
    //player.setCollideWorldBounds(true);
    //player.body.onWorldBounds = true;
    //player.body.world.on('worldbounds',  )


    gems = game.add.group();
    gems.enableBody = true;
    for (var i = 0; i < 10; i++)
    {
        var gem = gems.create(i * 80, -1000 + Math.random() * 1000, 'gem');
        gem.body.gravity.y = 200;
        gem.body.bounce.y = 0.4+ Math.random() * 0.4;
    }
    
    
    
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ff0000' });
    cursors = game.input.keyboard.createCursorKeys();
    
}

function update() 
{
    
    if (gameover == false)
    {
 
        var hitPlatform = game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(gems, platforms);

        game.physics.arcade.overlap(player, gems, collectGem, null, this);        
        
        player.body.velocity.x = 0;
        

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -350;
        }
        
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 350;
        }

        if (cursors.up.isDown && player.body.touching.down && hitPlatform)
        {
            player.body.velocity.y = -350;
        }
        
        if (cursors.down.isDown)
        {
            player.body.velocity.y = 350;
        }
    }

}

function collectGem (player, gem) 
{
    gem.kill();
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
    this.add.image(0, 0, 'deathscreen');
    game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#ff0000' });
  
}

//function outOfBounds ()
//{
//    if (player.gameObject === this)
        
//}


