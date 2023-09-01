let claroLogo;
let buttonStart;
let resize = true;
let servsMove = true;
let score = 0; 
let displayScore;
let mContext;

let servsSprites = ['serv1', 'serv2', 'serv3', 'serv4', 'serv5', 'serv6', 'serv7'];
let servs = [];

class MainScene extends Phaser.Scene {
    constructor(){
        super('gameScene');
    } 

    preload(){ 
        this.load.image('background', './assets/img/CLARO_EMPRESAS_FONDO.jpg');
        this.load.image('marcadorFinal', './assets/img/MARCADOR_FINAL.png');
        this.load.image('CLARO_EMPRESAS', './assets/img/CLARO_EMPRESAS_CIRCULO CLARO.png'); 
        this.load.image('serv1', './assets/img/serv1.png');
        this.load.image('serv2', './assets/img/serv2.png');
        this.load.image('serv3', './assets/img/serv3.png');
        this.load.image('serv4', './assets/img/serv4.png');
        this.load.image('serv5', './assets/img/serv5.png');
        this.load.image('serv6', './assets/img/serv6.png');
        this.load.image('serv7', './assets/img/serv7.png');
        this.load.image('serv8', './assets/img/serv8.png');
        this.load.image('marcador', './assets/img/CLARO_EMPRESAS_MARCADOR.png');
        this.load.image('play', './assets/img/PLAY.png');
    }
 
    create(){
        mContext = this;
        this.add.image((mContext.game.config.width/2), (mContext.game.config.height/2), 'background').setScale(.395, .455);
        claroLogo = this.add.image((mContext.game.config.width/2), (mContext.game.config.height/2), 'CLARO_EMPRESAS').setScale(.22);
        claroLogo.setDepth(1);
        this.add.image(450, 850, 'marcador').setScale(.2);
        displayScore = this.add.text(448, 846, score, { font: '32px Courier', fill: '#ff0000' });
        buttonStart = this.add.sprite(256, 800, 'play').setScale(.2).setInteractive();

        // Start
        buttonStart.on('pointerdown', function (pointer){   
            buttonStart.setScale(.45) 
            mContext.generateServ();
            buttonStart.destroy();                  
        });
 
        buttonStart.on('pointerover', function (pointer){   
            buttonStart.setScale(.25)         
        });

        buttonStart.on('pointerout', function (pointer){   
            buttonStart.setScale(.2)         
        });
    }    

    generateServ(){
        let intervalServs = setInterval(function (){
            servs.push(
                mContext.physics.add.sprite((mContext.game.config.width/2), (mContext.game.config.height/2), servsSprites[mContext.getRandomServ()])
                .setScale(.2)
                .setInteractive()
                .setVelocityX(mContext.getRandomVelocity())
                .setVelocityY(mContext.getRandomVelocity())
                .on('pointerdown', function (pointer){   
                    mContext.tweens.add({
                        targets: this,
                        alpha: 0,
                        duration: 150,
                        ease: 'Power2'
                    }, this);
                    // this.destroy();
                    mContext.addScore();
                })
            );
        }, 300);

        let gameInterval = setInterval(() => {
            clearInterval(intervalServs);
            clearInterval(gameInterval);
            claroLogo.destroy();
            
            this.add.image((mContext.game.config.width/2), (mContext.game.config.height/2), 'marcadorFinal').setScale(.395, .455);           
            this.add.text((mContext.game.config.width/2), (mContext.game.config.height/2) - 23, score, { font: '64px Courier', fill: '#ff0000' });


        }, 30000);
    }

    getRandomVelocity(){
        let min = -250;
        let max = 250;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getRandomServ(){
        let min = 0;
        let max = servsSprites.length - 1;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    addScore(){
        score += 1;
        displayScore.setText(score);
    }

    update(){
        if (resize){
            claroLogo.scale += .0009;
            resize = claroLogo.scale >= .26 ? !resize : resize;
        }else if (!resize) {
            claroLogo.scale -= .0009;
            resize = claroLogo.scale <= .22 ? !resize : resize;            
        }        

        if (servsMove){
            servs.forEach((elem) => {
                elem.y += .1
                elem.x += .1
                elem.angle += .2;

                servsMove = elem.angle >= 10 ? !servsMove : servsMove;            
            });
        }else if (!servsMove){
            servs.forEach((elem) => {
                elem.y -= .1
                elem.x -= .1
                elem.angle -= .2;

                servsMove = elem.angle <= -10 ? !servsMove : servsMove;   
            });
        }

        this.deleteServs();
    }

    deleteServs(){
        servs.forEach((elem, key, obj) => {
            if (elem.x > ((mContext.game.config.width/2) + elem.width) || elem.x < (-1 * elem.width)){
                elem.destroy();
                obj.splice(key, 1);
            }

            if (elem.y > ((mContext.game.config.height/2) + elem.height) || elem.y < (-1 * elem.width)){
                elem.destroy();
                obj.splice(key, 1);
            }
        });
    }
} 

const config = {
    type: Phaser.AUTO,
    width: 512,
    height: 1024,
    // pixelArt: true,
    // roundPixels: true,
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT
    },
    dom: {
        createContainer: true
    },
    input :{
		activePointers: 3,
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            // gravity: { y: 350 }
        }
    }
}

game = new Phaser.Game(config)