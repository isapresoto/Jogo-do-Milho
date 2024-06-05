var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

let player;
let corns;
let cursors;
let score = 0;
let missedCorns = 0;
let scoreText;
let missedText;

function preload() {
    this.load.spritesheet('player', 'IMG/bentinho.png', {
        frameWidth: 60,
        frameHeight: 100
    });
    this.load.image('corn', 'IMG/pixil-frame-0 (26).png');
    this.load.image('background', 'IMG/fundojogo.png');
}

function create() {
    // Adicionando a imagem de fundo
    this.add.image(0, 0, 'background').setOrigin(0);

    // Criando o jogador
    player = this.physics.add.sprite(400, 400, 'player');
    player.setCollideWorldBounds(true);
    

    // Configurando animações
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'player', frame: 3 }],
        frameRate: 10
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    // Criando um grupo de milhos
    corns = this.physics.add.group({
        defaultKey: 'corn',
        maxSize: 40
    });

    // Adicionando a colisão entre o jogador e os milhos
    this.physics.add.collider(player, corns, catchCorn, null, this);

    // Configurando os controles do teclado
    cursors = this.input.keyboard.createCursorKeys();

    // Adicionando o texto de pontuação e milhos perdidos
    scoreText = this.add.text(1200, 16, 'Pontuação: 0', { fontSize: '25px', fill: 'white' });
    missedText = this.add.text(1200, 50, 'Perdidos: 0', { fontSize: '25px', fill: 'white' });
   

    // Criando um evento para gerar milhos
    this.time.addEvent({
        delay: 1000,
        callback: dropCorn,
        callbackScope: this,
        loop: true
    });
}

function update() {
    // Movendo o jogador
    if (cursors.left.isDown) {
        player.setVelocityX(-650);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(650);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    corns.getChildren().forEach(corn => {
        if (corn.y > 600) {
            corn.disableBody(true, true);
            missedCorns += 1;
            missedText.setText('Perdidos: ' + missedCorns);
            if (missedCorns >= 1) {
                this.physics.pause();
                alert('Você perdeu!');
                this.scene.restart();
            }
        }
    });
}

function dropCorn() {
    let x = Phaser.Math.Between(200, 800);
    let corn = corns.get(x, 10);
    if (corn) {
        corn.setActive(true);
        corn.setVisible(true);
        corn.setVelocityY(200);
        corn.body.setVelocityY(400);
        corn.body.setGravityY(-160);
    }
}

function catchCorn(player, corn) {
    corn.disableBody(true, true);
    score += 1;
    scoreText.setText('Pontuação: ' + score);
    if (score >= 25) {
        this.physics.pause();
        alert('Você ganhou!');
        this.scene.restart();
        missedCorns = 0;
        score = 0;
    }
}
