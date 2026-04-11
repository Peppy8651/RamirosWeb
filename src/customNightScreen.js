import timer from "./timer.js";

const { Rectangle } = Phaser.Geom; 


export default class customNightScreen extends Phaser.Scene {
    constructor() {
        super({key: 'customNightScreen'});
    }
    preload() {
        // each image is 154 * 200 pixels
        // 154 / 2 = 77
        // 200 /2 = 100 obv
        this.load.baseURL = '/RamirosWeb/';
        this.load.image('customnightpressenter','/images/customnight/pressenter.png');
        this.load.image('customnightmisa','/images/customnight/misa.png');
        this.load.image('customnightjuan','/images/customnight/juan.png');
        this.load.image('customnightram','/images/customnight/ram.png');
        this.load.image('customnightcarlos','/images/customnight/carlos.png');
        this.load.image('customnightnas','/images/customnight/nas.png');
        this.load.image('customnightgooch','/images/customnight/gooch.png');
        this.load.image('customnightdarien','/images/customnight/darien.png');
        this.load.image('customnightmarlon','/images/customnight/marlon.png');
        this.load.image('customnightsergio','/images/customnight/sergio.png');
        this.load.image('customnighteric','/images/customnight/eric.png');
        this.load.image('check', '/images/customnight/check.png');
        this.load.image('doublemovementspeed', '/images/customnight/doublemovementspeed.png');
    }
    create() {
        this.AInums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // misa, juan, ram, carlos, gooch, nas, darien, marlon, sergio, eric
        this.arrowsLeft = [];
        this.arrowsRight = [];
        this.menuScreen = this.scene.get('menuScreen');
        this.gameScreen = this.scene.get('gameScreen');
        this.background = this.add.image(1024/2, 768/2, 'customnightbackground');
        this.misa = this.add.image(53 +77, 95 + 100, 'customnightmisa');
        this.juan = this.add.image(240 +77, 95 + 100, 'customnightjuan');
        this.ram = this.add.image(431 +77, 95 + 100, 'customnightram');
        this.carlos = this.add.image(624 +77, 95 + 100, 'customnightcarlos');
        this.gooch = this.add.image(817 +77, 95 + 100, 'customnightgooch');
        this.nas = this.add.image(53 +77, 400 + 100, 'customnightnas');
        this.darien = this.add.image(240 +77, 400 + 100, 'customnightdarien');
        this.marlon = this.add.image(431 +77, 400 + 100, 'customnightmarlon');
        this.sergio = this.add.image(624 +77, 400 + 100, 'customnightsergio');
        this.eric = this.add.image(817 +77, 400 + 100, 'customnighteric');
        this.pressenter = this.add.image(390 + 279, 714 + 15, 'customnightpressenter').setAlpha(1);
        this.switchstatic = this.add.sprite(1024/2, 768/2, 'staticSwitch1').setAlpha(0.50);
        this.switchstatic.anims.create({
            key: "switchstatic",
            frameRate: 35,
            frames: [
            { key: 'staticSwitch1' },
            { key: 'staticSwitch2' },
            { key: 'staticSwitch3' },
            { key: 'staticSwitch4' },
            { key: 'staticSwitch5' },
            { key: 'staticSwitch6' },
            ],
        });
        this.switchstatic.anims.play('switchstatic');
        this.pressenterCounter = 0;
        
        // arrows idk how to automate this
        // left on top
        this.add.image(75, 368, 'arrowup').setScale(0.3).setRotation(-0.5 * Math.PI);
        this.arrowsLeft.push(new Rectangle(75 - 15, 368 - 15, 30, 30));
        this.add.image(75 + 190, 368, 'arrowup').setScale(0.3).setRotation(-0.5 * Math.PI);
        this.arrowsLeft.push(new Rectangle(75 + 190 - 15, 368 - 15, 30, 30));
        this.add.image(75 + 190 * 2, 368, 'arrowup').setScale(0.3).setRotation(-0.5 * Math.PI);
        this.arrowsLeft.push(new Rectangle(75 + 190 * 2 - 15, 368 - 15, 30, 30));
        this.add.image(75 + 190 * 3, 368, 'arrowup').setScale(0.3).setRotation(-0.5 * Math.PI);
        this.arrowsLeft.push(new Rectangle(75 + 190 * 3 - 15, 368 - 15, 30, 30));
        this.add.image(75 + 190 * 4, 368, 'arrowup').setScale(0.3).setRotation(-0.5 * Math.PI);
        this.arrowsLeft.push(new Rectangle(75 + 190 * 4 - 15, 368 - 15, 30, 30));
        //right on top
        this.add.image(185, 368, 'arrowup').setScale(0.3).setRotation(0.5 * Math.PI);
        this.arrowsRight.push(new Rectangle(185 - 15, 368 - 15, 30, 30));
        this.add.image(185 + 190, 368, 'arrowup').setScale(0.3).setRotation(0.5 * Math.PI);
        this.arrowsRight.push(new Rectangle(185 + 190 - 15, 368 - 15, 30, 30));
        this.add.image(185 + 190 * 2, 368, 'arrowup').setScale(0.3).setRotation(0.5 * Math.PI);
        this.arrowsRight.push(new Rectangle(185 + 190 * 2 - 15, 368 - 15, 30, 30));
        this.add.image(185 + 190 * 3, 368, 'arrowup').setScale(0.3).setRotation(0.5 * Math.PI);
        this.arrowsRight.push(new Rectangle(185 + 190 * 3 - 15, 368 - 15, 30, 30));
        this.add.image(185 + 190 * 4, 368, 'arrowup').setScale(0.3).setRotation(0.5 * Math.PI);
        this.arrowsRight.push(new Rectangle(185 + 190 * 4 - 15, 368 - 15, 30, 30));
        // left on bottom
        this.add.image(75, 668, 'arrowup').setScale(0.3).setRotation(-0.5 * Math.PI);
        this.arrowsLeft.push(new Rectangle(75 - 15, 668 - 15, 30, 30));
        this.add.image(75 + 190, 668, 'arrowup').setScale(0.3).setRotation(-0.5 * Math.PI);
        this.arrowsLeft.push(new Rectangle(75 + 190 - 15, 668 - 15, 30, 30));
        this.add.image(75 + 190 * 2, 668, 'arrowup').setScale(0.3).setRotation(-0.5 * Math.PI);
        this.arrowsLeft.push(new Rectangle(75 + 190 * 2 - 15, 668 - 15, 30, 30));
        this.add.image(75 + 190 * 3, 668, 'arrowup').setScale(0.3).setRotation(-0.5 * Math.PI);
        this.arrowsLeft.push(new Rectangle(75 + 190 * 3 - 15, 668 - 15, 30, 30));
        this.add.image(75 + 190 * 4, 668, 'arrowup').setScale(0.3).setRotation(-0.5 * Math.PI);
        this.arrowsLeft.push(new Rectangle(75 + 190 * 4 - 15, 668 - 15, 30, 30));
        //right on bottom
        this.add.image(185, 668, 'arrowup').setScale(0.3).setRotation(0.5 * Math.PI);
        this.arrowsRight.push(new Rectangle(185 - 15, 668 - 15, 30, 30));
        this.add.image(185 + 190, 668, 'arrowup').setScale(0.3).setRotation(0.5 * Math.PI);
        this.arrowsRight.push(new Rectangle(185 + 190 - 15, 668 - 15, 30, 30));
        this.add.image(185 + 190 * 2, 668, 'arrowup').setScale(0.3).setRotation(0.5 * Math.PI);
        this.arrowsRight.push(new Rectangle(185 + 190 * 2 - 15, 668 - 15, 30, 30));
        this.add.image(185 + 190 * 3, 668, 'arrowup').setScale(0.3).setRotation(0.5 * Math.PI);
        this.arrowsRight.push(new Rectangle(185 + 190 * 3 - 15, 668 - 15, 30, 30));
        this.add.image(185 + 190 * 4, 668, 'arrowup').setScale(0.3).setRotation(0.5 * Math.PI);
        this.arrowsRight.push(new Rectangle(185 + 190 * 4 - 15, 668 - 15, 30, 30));
        // AInum text
        this.AInumTexts = [];
        this.AInumTexts[0] = this.add.text(53 +77, 368, this.AInums[0], { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.AInumTexts[1] = this.add.text(240 +77, 368, this.AInums[1], { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.AInumTexts[2] = this.add.text(431 +77, 368, this.AInums[2], { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.AInumTexts[3] = this.add.text(624 +77, 368, this.AInums[3], { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.AInumTexts[4] = this.add.text(817 +77, 368, this.AInums[4], { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.AInumTexts[5] = this.add.text(53 +77, 668, this.AInums[5], { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.AInumTexts[6] = this.add.text(240 +77, 668, this.AInums[6], { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.AInumTexts[7] = this.add.text(431 +77, 668, this.AInums[7], { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.AInumTexts[8] = this.add.text(624 +77, 668, this.AInums[8], { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        this.AInumTexts[9] = this.add.text(817 +77, 668, this.AInums[9], { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        this.buttonCooldown = new timer(100);
        this.buttonCooldown.Start(); // i'm lazy so just start it early
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.whiteRectangle = this.add.rectangle(1024/2 - 150, 50, 40, 40, 0xFFFFFF);
        this.whiteRectangleBounds = new Rectangle(1024/2 - 150 - 20, 50 - 20, 40, 40);
        this.doubleMovementSpeedCheck = this.add.image(1024/2 - 150, 50, 'check').setVisible(false);
        this.doubleMovementSpeedText = this.add.image(1024/2 + 40, 52, 'doublemovementspeed');
        this.gameoverMusic = this.sound.add('feralangelwaltz');
        this.gameoverMusic.play();
    }
    update(time, delta) {
        let mouse = this.input.activePointer;
        if (this.pressenterCounter < 1) this.pressenterCounter += delta * 0.0020;
        if (this.pressenterCounter >= 1) {
            this.pressenterCounter -= 1;
            switch (this.pressenter.alpha) {
                case 1:
                this.pressenter.alpha = 0;
                break;
                case 0:
                this.pressenter.alpha = 1;
                break;
            }
        }
        if (mouse.leftButtonDown()) {
            for (let i = 0; i < this.arrowsLeft.length; i++) {
                if (this.arrowsLeft[i].contains(mouse.x, mouse.y)) {
                    // lowkey just add a single button cooldown that works across all arrows
                    if (this.buttonCooldown.IsFinished()) {
                        if (this.AInums[i] > 0) {
                            this.AInums[i]--; // idk why this is required
                            this.AInumTexts[i].setText(this.AInums[i]);
                            this.buttonCooldown.Reset();
                            this.buttonCooldown.Start();
                        }
                    }

                }
                for (let i = 0; i < this.arrowsRight.length; i++) {
                if (this.arrowsRight[i].contains(mouse.x, mouse.y)) {
                    if (this.buttonCooldown.IsFinished()) {
                        if (this.AInums[i] < 20) {
                            this.AInums[i]++;
                            this.AInumTexts[i].setText(this.AInums[i]);
                            this.buttonCooldown.Reset();
                            this.buttonCooldown.Start();
                        }
                    }
                }
            }
            }
        }
        if (this.buttonCooldown._isRunning) {
            this.buttonCooldown.Update(delta);
        }
        if (this.keyEnter.isDown && this.buttonCooldown.IsFinished()) {
            this.menuScreen.buttonCooldown = null;
            this.menuScreen.nightSelection = false;
            this.gameScreen.nightnum = 7;
            if (this.menuScreen.menuMusic.isPlaying == true) this.menuScreen.menuMusic.stop();
            if (this.gameoverMusic.isPlaying) this.gameoverMusic.stop();
            if (this.menuScreen.blip.isPlaying == false) this.menuScreen.blip.play();
            this.menuScreen.nightOpen = true;
            this.menuScreen.drawChange = true;
            this.menuScreen.switchstatic.play('switchstatic');
            // again not automating because I'm an idiot
            // misa, juan, ram, carlos, gooch, nas, darien, marlon, sergio, eric
            this.gameScreen.animatronics[0].AInum = this.AInums[0];
            this.gameScreen.animatronics[1].AInum = this.AInums[1];
            this.gameScreen.animatronics[2].AInum = this.AInums[2];
            this.gameScreen.animatronics[3].AInum = this.AInums[4];
            this.gameScreen.animatronics[4].AInum = this.AInums[3];
            this.gameScreen.animatronics[5].AInum = this.AInums[5];
            this.gameScreen.animatronics[6].AInum = this.AInums[6];
            this.gameScreen.animatronics[7].AInum = this.AInums[7];
            this.gameScreen.animatronics[8].AInum = this.AInums[8];
            this.gameScreen.animatronics[8].AInum = this.AInums[8];
            this.gameScreen.animatronics[9].AInum = this.AInums[9];
            this.menuScreen.nightOpenTimer.Start();
            this.scene.switch('menuScreen');
        } 
        if (this.whiteRectangleBounds.contains(mouse.x, mouse.y) && mouse.leftButtonDown()) {
            if (this.doubleMovementSpeedCheck.visible == true) {
                if (this.buttonCooldown.IsFinished()) {
                    this.doubleMovementSpeedCheck.setVisible(false);
                    this.gameScreen.doubleMovementSpeed = false;
                    this.buttonCooldown.Reset();
                    this.buttonCooldown.Start();
                }
            }
            else {
                if (this.buttonCooldown.IsFinished()) {
                    this.doubleMovementSpeedCheck.setVisible(true);
                    this.gameScreen.doubleMovementSpeed = true;
                    this.buttonCooldown.Reset();
                    this.buttonCooldown.Start();
                }
            }
        }
    }
}