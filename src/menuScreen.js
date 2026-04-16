import Phaser from "phaser";
import cameraScreen from './cameraScreen.js';
import gameOverScreen from './gameOverScreen.js';
import winScreen from './winScreen.js';
import Animatronic from './animatronic.js';
import timer from './timer.js';

const { Rectangle } = Phaser.Geom; 


export default class menuScreen extends Phaser.Scene {
  // The three methods currently empty
  constructor() {
    super({key: 'menuScreen'});
    this.nightOpen = false;
    this.nightOpenTimer;
    this.buttonCooldown; // don't press everything instantly
    this.selectionCooldown; // same as button cooldown but for pressing up and down lol
    this.nightSelection = false;
    this.nightSelected = 1;
    this.optionSelected = 1;
  }
  preload() {
    // This method is called once at the beginning
    // It will load all the assets, like sprites and sounds  
    this.loadingScreen = this.scene.get('loadingScreen');
    this.customNightScreen = this.scene.get('customNightScreen');
    this.load.baseURL = '/RamirosWeb/';
    this.load.image("logo", '/images/logo.png');
    this.load.image("newgame", '/images/newgame.png');
    this.load.image("customnight", '/images/customnight.png');
    // this.load.image("options", '/images/options.png');
    this.load.image("arrow", '/images/arrow.png');
    this.load.image("titlepic", '/images/titlepic.png');
    this.load.image("titlepicblack", '/images/titlepicblack.png');
    this.load.image('firstnight', '/images/menu/nights/firstnight.png');
    this.load.image('secondnight', "/images/menu/nights/secondnight.png");
    this.load.image('thirdnight', "/images/menu/nights/thirdnight.png");
    this.load.image('fourthnight', "/images/menu/nights/fourthnight.png");
    this.load.image('fifthnight', "/images/menu/nights/fifthnight.png");
    this.load.image('sixthnight', '/images/menu/nights/sixthnight.png');
    this.load.image('widescreenoff', '/images/menu/widescreenoff.png');
    this.load.image('widescreenon', '/images/menu/widescreenon.png');
    this.load.image('pressthearrows', '/images/menu/pressthearrows.png');;
    this.load.image('backbutton', '/images/menu/backbutton.png');
    this.load.image('pcdirections', '/images/menu/pcdirections.png');

    // for custom night so it loads a little faster
    this.load.image('customnightbackground', '/images/customnight/background.png');
    this.load.audio('feralangelwaltz', '/audio/feralangelwaltz.mp3');

    this.load.audio('blip', '/audio/blip.mp3');
    this.load.audio('menumusic', '/audio/menutheme.mp3');

    for (let i = 1; i <= 6; i++) {
            this.load.image(`static${i}`, `/images/cameras/static/${i}.png`);
            this.load.image(`staticSwitch${i}`, `/images/cameras/staticswitch/${i}.png`);
        }
        for (let i = 0; i < 7; i++)
        {
            this.load.image('night' + (i+1), "/images/menu/nights/" + (i+1) + ".png");
        }
    // mobile
    this.load.image('arrowup', '/images/mobile/arrowup.png');
    this.load.image('arrowdown', '/images/mobile/arrowdown.png');
  }
  create() {
        this.gameScreen = this.scene.get('gameScreen');
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyBackspace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
        this.keyEscape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.titlepic = this.add.image(1024/2,768/2, "titlepic").setDisplaySize(959, 720);
        this.static = this.add.sprite(this.gameScreen.width/2, this.gameScreen.height/2, 'static1').setAlpha(0.5);
        this.static.anims.create({
          key: "static",
          frameRate: 45,
          frames: [
          { key: 'static1' },
          { key: 'static2' },
          { key: 'static3' },
          { key: 'static4' },
          { key: 'static5' },
          { key: 'static6' },
          ],
          repeat: -1     // -1 makes it loop infinitely
        });
        this.static.anims.play("static");
        this.switchstatic = this.add.sprite(this.gameScreen.width/2, this.gameScreen.height/2, 'staticSwitch1').setAlpha(0.50);
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
        //mobile
        this.arrowup = this.add.image(875, 110, 'arrowup').setVisible(false);
        this.arrowup.setScale(2, 2);
        this.arrowup.setAlpha(0.3);
        this.arrowdown = this.add.image(875, 650, 'arrowdown').setVisible(false);
        this.arrowdown.setScale(2, 2);
        this.arrowup.setScale(2, 2);
        this.arrowdown.setAlpha(0.3);
        this.backbutton = this.add.image(875, 380, 'backbutton').setVisible(false);
        this.backbutton.setScale(1, 1.25);
        this.backbutton.setAlpha(0.4);

        this.buttonCooldown = new timer(300);
        this.buttonCooldown.Start();
        this.arrowupbounds = new Rectangle(775, 10, 925, 210);
        this.arrowdownbounds = new Rectangle(775, 550, 925, 750);
        this.backbuttonbounds = new Rectangle(775, 308, 925, 125);

        this.newgame = this.add.image(1024 / 2 - 275, 768 / 2 + 50, 'newgame');
        this.customnight = this.add.image(1024 / 2 - 225, 768 / 2 + 50 + 46, 'customnight');
        this.widescreenOption = this.add.image(1024 / 2 - 155, 768 / 2 + 50 + 46 + 40, 'widescreenoff');

        this.pressthearrows = this.add.image(0 + 527, 768-15, 'pressthearrows').setScale(0.95, 1);
        if (this.sys.game.device.input.touch || this.gameScreen.mobileDebug) {
            this.scale.displaySize.setAspectRatio(1366 / 768);
            this.gameScreen.wideScreen = true;
            this.widescreenOption.setTexture('widescreenon');
            this.scale.refresh();
            this.arrowup.setVisible(true);
            this.arrowdown.setVisible(true);
            this.backbutton.setVisible(true);
        }
        else {
            this.scale.mode = Phaser.Scale.NONE;
            this.pressthearrows.setTexture('pcdirections');
            this.pressthearrows.setPosition(0 + 520, 768 - 40);
            this.pressthearrows.setScale(0.71);
            this.scale.refresh();
        }
    // this.load.image("options", '/images/options.png');
        this.arrow = this.add.image(1024 / 2 - 450, 768/2 + 50, "arrow");
        this.firstnight = this.add.image(1024/2 - 275, 768 / 2 + 50, 'firstnight').setVisible(false);
        this.secondnight = this.add.image(1024/2 - 275, 768 / 2 + 50 + 42, 'secondnight').setVisible(false);
        this.thirdnight = this.add.image(1024/2 - 275, 768 / 2 + 50 + 42 + 42, 'thirdnight').setVisible(false);
        this.fourthnight = this.add.image(1024/2 - 275, 768 / 2 + 50 + 42 + 42 + 42, 'fourthnight').setVisible(false);
        this.fifthnight = this.add.image(1024/2 - 275, 768 / 2 + 50 + 42 + 42 + 42 + 42, 'fifthnight').setVisible(false);
        this.sixthnight = this.add.image(1024/2 - 275, 768 / 2 + 50 + 42 + 42 + 42 + 42 + 42, 'sixthnight').setVisible(false);
        this.logo = this.add.image(1024 / 2 - 300, 768 / 2 - 260, "logo");
        this.blip = this.sound.add('blip');
        this.menuMusic = this.sound.add('menumusic');
        this.menuMusic.play();
        this.nightOpenTimer = new timer(3000);
        this.nightOpenTimer.finishCallback = () => { // start night
            // if (game.blip.State == SoundState.Playing) game.blip.Stop();
            this.gameScreen.nightTimer = new timer(420000); // 7 minute night
            this.gameScreen.nightTimer.Start();
            this.gameScreen.timers.push(this.gameScreen.nightTimer);
            // set up code
            for (let i = 0; i < this.gameScreen.animatronics.length; i++)
            {
                switch (this.gameScreen.nightnum)
                {
                    case 1:
                    if (i < 3) {
                    this.gameScreen.animatronics[i].Activate();
                    }
                    break;
                    case 2:
                    if (i < 6)
                    {
                        this.gameScreen.animatronics[i].Activate();
                    }
                    break;
                    case 3:
                    if (this.gameScreen.animatronics[i].Name != 'Gustavo' && this.gameScreen.animatronics[i].Name != 'Eric') this.gameScreen.animatronics[i].Activate();
                    break;
                    case 4:
                    if (this.gameScreen.animatronics[i].Name != 'Eric') this.gameScreen.animatronics[i].Activate();
                    break;
                    case 5:
                    if (this.gameScreen.animatronics[i].Name != 'Eric') this.gameScreen.animatronics[i].Activate();
                    break;
                    default:
                    this.gameScreen.animatronics[i].Activate();
                    break;
                }
            }
            // set battery milliseconds based on night

            switch (true)
            {
                case (this.gameScreen.nightnum == 1):
                    this.gameScreen.batterymilliseconds = 127000;
                    break;
                    case (this.gameScreen.nightnum == 2):
                    this.gameScreen.batterymilliseconds = 110000;
                    break;
                    case (this.gameScreen.nightnum == 3):
                    this.gameScreen.batterymilliseconds = 84000;
                    break;
                    case (this.gameScreen.nightnum == 4):
                    this.gameScreen.batterymilliseconds = 68000;
                    break;
                    case (this.gameScreen.nightnum >= 5):
                    this.gameScreen.batterymilliseconds = 51000;
                    break;
            }
            this.gameScreen.switchScreenState(6); // loading screen when first used
          }

  }
  update(time, delta) {
    var mouse = this.input.activePointer;
    if (this.nightOpen == false)
        {
            if (this.keyEnter.isDown || (mouse.wasTouch && mouse.isDown))
            {
                let touchCondition;
                if (mouse.wasTouch) {
                    touchCondition = (!this.arrowupbounds.contains(mouse.x, mouse.y) && !this.arrowdownbounds.contains(mouse.x, mouse.y) && !this.backbuttonbounds.contains(mouse.x, mouse.y)) ? true: false;
                }
                if (touchCondition == null || touchCondition == true) {
                    if (this.nightSelection == true)
                    {
                        if (this.buttonCooldown.IsFinished())
                        {
                            this.buttonCooldown = null;
                            this.nightSelection = false;
                            this.gameScreen.nightnum = this.nightSelected;
                            if (this.menuMusic.isPlaying == true) this.menuMusic.stop();
                            // this.Mouse.SetPosition( (int) (((game.width / 2)) * game.gameScreen.widthStretch), (int) (((game.height / 2)) * game.gameScreen.heightStretch));
                            // menuMusic.Stop();
                            if (this.blip.isPlaying == false) this.blip.play();
                            this.nightOpen = true;
                            this.drawChange = true;
                            this.switchstatic.play('switchstatic');
                            this.nightOpenTimer.Start();
                        }
                    }
                    // else if (fullScreenSelection == true)
                    // {
                    //     if (buttonCooldown.IsFinished())
                    //     {
                    //         game.toggleFullScreen(optionSelected - 1); // technically the logic starts with 0, so we gotta remove 1 from optionSelected
                    //         switchStatic = 16;
                    //         game.blip.Play();
                    //         buttonCooldown = new Timer(TimeSpan.FromMilliseconds(400));
                    //         buttonCooldown.Start();
                    //     }
                    // }
                    else
                    {
                        this.drawChange = true;
                        
                        if (this.optionSelected == 2)
                        {
                            this.switchstatic.play('switchstatic');
                            if (this.customNightScreen.switchstatic != null) this.customNightScreen.switchstatic.anims.play('switchstatic');
                            if (this.menuMusic.isPlaying) this.menuMusic.stop();
                            if (this.customNightScreen.gameoverMusic != null) this.customNightScreen.gameoverMusic.play();
                            this.buttonCooldown.Reset();
                            this.buttonCooldown.Start();
                            this.scene.switch('customNightScreen');
                        }
                        else if (this.optionSelected == 3) {
                            if (this.buttonCooldown.IsFinished()) {
                                this.switchstatic.play('switchstatic');
                                if (this.gameScreen.wideScreen) {
                                    this.gameScreen.switchWideScreen(false);
                                }
                                else {
                                    this.gameScreen.switchWideScreen(true);
                                }
                            }
                        }
                        else {
                            this.switchstatic.play('switchstatic');
                            this.nightSelection = true;
                        }
                        // switchStatic = 16;
                        if (this.blip.isPlaying == false) this.blip.play();
                        this.buttonCooldown.Reset();
                        this.buttonCooldown.Start();
                    } 
                }
                
            }
            if (this.keyBackspace.isDown || this.keyEscape.isDown || (mouse.wasTouch && mouse.isDown && this.backbuttonbounds.contains(mouse.x,mouse.y)))
            {
                if (this.buttonCooldown != null && this.buttonCooldown.IsFinished())
                {
                    if (this.nightSelection)
                    {
                        if (this.nightSelection == true) this.nightSelection = false;
                        this.optionSelected = 1;
                        this.nightSelected = 1;
                        this.blip.play();
                        this.switchstatic.play('switchstatic');
                        this.buttonCooldown.Reset();
                        this.buttonCooldown.Start();
                        this.drawChange = true;
                    }
                } 
            }
            if (this.buttonCooldown != null)
            {
                this.buttonCooldown.Update(delta);
            }
            if (this.selectionCooldown != null)
            {
                this.selectionCooldown.Update(delta);
            }
            if (this.keyDown.isDown|| this.keyS.isDown || (mouse.wasTouch && mouse.isDown && this.arrowdownbounds.contains(mouse.x,mouse.y)))
            {
                this.drawChange = true;
                if (this.nightSelection == true)
                {
                    if (this.selectionCooldown == null)
                    {
                        if (this.nightSelected == 5) this.nightSelected = 6; // ALWAYS MAKE SURE TO PUT IT IN REVERSE ORDER
                        if (this.nightSelected == 4) this.nightSelected = 5; // ALWAYS MAKE SURE TO PUT IT IN REVERSE ORDER
                        if (this.nightSelected == 3) this.nightSelected = 4; // ALWAYS MAKE SURE TO PUT IT IN REVERSE ORDER
                        if (this.nightSelected == 2) this.nightSelected = 3; // ALWAYS MAKE SURE TO PUT IT IN REVERSE ORDER
                        if (this.nightSelected == 1) this.nightSelected = 2;
                        this.selectionCooldown = new timer(180);
                        this.selectionCooldown.Start();
                    }
                    if (this.selectionCooldown.IsFinished())
                    {
                        if (this.nightSelected == 5) this.nightSelected = 6; // ALWAYS MAKE SURE TO PUT IT IN REVERSE ORDER
                        if (this.nightSelected == 4) this.nightSelected = 5; // ALWAYS MAKE SURE TO PUT IT IN REVERSE ORDER
                        if (this.nightSelected == 3) this.nightSelected = 4; // ALWAYS MAKE SURE TO PUT IT IN REVERSE ORDER
                        if (this.nightSelected == 2) this.nightSelected = 3; // ALWAYS MAKE SURE TO PUT IT IN REVERSE ORDER
                        if (this.nightSelected == 1) this.nightSelected = 2;
                        this.selectionCooldown.Reset();
                    }
                }
                else
                {
                    // lowkey just future proofing for now, this is to choose between new game and options lol
                    if (this.selectionCooldown == null)
                    {
                        this.selectionCooldown = new timer(180);
                        if (this.optionSelected == 2) this.optionSelected = 3; 
                        if (this.optionSelected == 1) this.optionSelected = 2;
                        this.selectionCooldown.Start();
                    }
                    if (this.selectionCooldown.IsFinished())
                    {
                        if (this.optionSelected == 2) this.optionSelected = 3; 
                        if (this.optionSelected == 1) this.optionSelected = 2; 
                        this.selectionCooldown.Reset();
                    }
                }  
            }
            if (this.keyUp.isDown|| this.keyW.isDown || (mouse.wasTouch && mouse.isDown && this.arrowupbounds.contains(mouse.x,mouse.y)))
            {
                if (this.nightSelection == true)
                {
                    if (this.selectionCooldown == null)
                    {
                        this.drawChange = true;
                        if (this.nightSelected == 2) this.nightSelected = 1;
                        if (this.nightSelected == 3) this.nightSelected = 2; // this is fine though
                        if (this.nightSelected == 4) this.nightSelected = 3
                        if (this.nightSelected == 5) this.nightSelected = 4; // this is fine though
                        if (this.nightSelected == 6) this.nightSelected = 5; // this is fine though
                        this.selectionCooldown = new timer(180);
                        this.selectionCooldown.Start();
                    }
                    if (this.selectionCooldown.IsFinished())
                    {
                        this.drawChange = true;
                        if (this.nightSelected == 2) this.nightSelected = 1;
                        if (this.nightSelected == 3) this.nightSelected = 2; // this is fine though
                        if (this.nightSelected == 4) this.nightSelected = 3
                        if (this.nightSelected == 5) this.nightSelected = 4; // this is fine though
                        if (this.nightSelected == 6) this.nightSelected = 5; // this is fine though
                        this.selectionCooldown.Reset();
                    }
                }
                else
                {
                    if (this.selectionCooldown == null)
                    {
                        this.drawChange = true;
                        this.selectionCooldown = new timer(180);
                        if (this.optionSelected == 2) this.optionSelected = 1;
                        if (this.optionSelected == 3) this.optionSelected = 2;
                        this.selectionCooldown.Start();
                    }
                    if (this.selectionCooldown.IsFinished())
                    {
                        this.drawChange = true;
                        if (this.optionSelected == 2) this.optionSelected = 1;
                        if (this.optionSelected == 3) this.optionSelected = 2;
                        this.selectionCooldown.Reset();
                    }
                }
                
            }
        }
        else
        {
            this.nightOpenTimer.Update(delta);
        }
    if (this.drawChange == true) this.drawUpdate();
    this.drawChange = false;
  }
  drawUpdate() {
    if (this.nightOpen == false) {
      
      if (this.nightSelection == true) {
        if (this.nightSelected == 6) this.arrow.setPosition(1024 / 2 - 450, 768/2 + 50 + 84 + 84 + 42);
        if (this.nightSelected == 5) this.arrow.setPosition(1024 / 2 - 450, 768/2 + 50 + 84 + 84);
        if (this.nightSelected == 4) this.arrow.setPosition(1024 / 2 - 450, 768/2 + 50 + 84 + 42);
        if (this.nightSelected == 3) this.arrow.setPosition(1024 / 2 - 450, 768/2 + 50 + 84);
        if (this.nightSelected == 2) this.arrow.setPosition(1024 / 2 - 450, 768/2 + 50 + 42);
        if (this.nightSelected == 1) this.arrow.setPosition(1024 / 2 - 450, 768/2 + 50);
        if (this.firstnight.visible == false) this.firstnight.setVisible(true);
        if (this.secondnight.visible == false) this.secondnight.setVisible(true);
        if (this.thirdnight.visible == false) this.thirdnight.setVisible(true);
        if (this.fourthnight.visible == false) this.fourthnight.setVisible(true);
        if (this.fifthnight.visible == false) this.fifthnight.setVisible(true);
        if (this.sixthnight.visible == false) this.sixthnight.setVisible(true);
        if (this.newgame.visible == true) this.newgame.setVisible(false);
        if (this.customnight.visible == true) this.customnight.setVisible(false);
        if (this.widescreenOption.visible == true) this.widescreenOption.setVisible(false);
      }
      else {
        if (this.optionSelected == 3) this.arrow.setPosition(1024 / 2 - 450, 768/2 + 50 + 86);
        if (this.optionSelected == 2) this.arrow.setPosition(1024 / 2 - 450, 768/2 + 50 + 42);
        if (this.optionSelected == 1) this.arrow.setPosition(1024 / 2 - 450, 768/2 + 50);
        if (this.newgame.visible == false) this.newgame.setVisible(true);
        if (this.customnight.visible == false) this.customnight.setVisible(true);
        if (this.gameScreen.wideScreen == true) this.widescreenOption.setTexture('widescreenon');
        if (this.gameScreen.wideScreen == false) this.widescreenOption.setTexture('widescreenoff');
        if (this.widescreenOption.visible == false) this.widescreenOption.setVisible(true);
        if (this.firstnight.visible == true)this.firstnight.setVisible(false);
        if (this.secondnight.visible == true) this.secondnight.setVisible(false);
        if (this.thirdnight.visible == true) this.thirdnight.setVisible(false);
        if (this.fourthnight.visible == true) this.fourthnight.setVisible(false);
        if (this.fifthnight.visible == true) this.fifthnight.setVisible(false);
        if (this.sixthnight.visible == true) this.sixthnight.setVisible(false);
      }
    }
    else {
      this.logo.setVisible(false);
      this.firstnight.setVisible(false);
      this.secondnight.setVisible(false);
      this.thirdnight.setVisible(false);
      this.fourthnight.setVisible(false);
      this.fifthnight.setVisible(false);
      this.sixthnight.setVisible(false);
      this.newgame.setVisible(false);
      this.customnight.setVisible(false);
      this.widescreenOption.setVisible(false);
      this.pressthearrows.setVisible(false);
      this.backbutton.setVisible(false);
      this.titlepic.setVisible(false);
      this.static.setVisible(false);
      this.arrow.setVisible(false);
      this.arrowdown.setVisible(false);
      this.arrowup.setVisible(false);
      if (this.nightPreview == null) {
        this.nightPreview = this.add.image(1024/2, 768/2, 'night' + (this.gameScreen.nightnum));
      }
      else {
        if (this.nightPreview.texture.key != 'night' + (this.gameScreen.nightnum)) this.nightPreview.setTexture('night' + (this.gameScreen.nightnum));
        if (this.nightPreview.visible == false) this.nightPreview.setVisible(true);
      }
    }
  }
}
