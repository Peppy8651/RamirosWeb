import Phaser from "phaser";
import menuScreen from './menuScreen.js';
import gameOverScreen from './gameOverScreen.js';
import winScreen from './winScreen.js';
import Animatronic from './animatronic.js';
import timer from './timer.js';

const { Rectangle, Circle, Point } = Phaser.Geom; 
const { Intersects } = Phaser.Geom;

export default class cameraScreen extends Phaser.Scene {
  // The three methods currently empty
  
  constructor() {
    super({key: 'cameraScreen'});
    this.cameraspot=8;
    this.oldcameraspot = null;
    this.maplocationbuttons = null;
    this.maplocationtextures = [];
    this.camNameTextures = [];
    this.locationNameTextures = [];
    this.switchStatic = true;
    this.camDir = 1; // 0: wait // 1: left // 2: right
    this.camFlashOn = false;
    this.animatronicForceOff = false;
    this.musicboxbutton;
    this.winding = false;
    this.garbleTimer; // cancel after like 30 seconds or if cameras are closed
    this.waitTimer;
    this.triangleflash = 0;
    this.drawChange = false;
    this.flashlightbackgrounds = [
            'partyroom1flash',
            'partyroom2flash',
            'partyroom3flash',
            'partyroom4flash',
            'leftventflash',
            'rightventflash',
            'mainhallflash',
            'partsflash',
            'stage',
            'gamescornerflash',
            'prizecornerflash',
            'kidscoveflash'
    ];
    this.backgrounds = [
            'partyroom1',
            'partyroom2',
            'partyroom3',
            'partyroom4',
            'leftvent',
            'rightvent',
            'mainhall',
            'parts',
            'stage',
            'gamescorner', 
            'prizecorner',
            'kidscove'
    ];
    this.darieninterrupt = false;
  }
  preload() {
        this.winding = false;
        this.waitTimer = new timer(1500);
        this.waitTimer.Start();
  }
  create() {
    console.log('cameraScreen created');
    this.gameScreen = this.scene.get('gameScreen');
    this.maplocationbuttons = [
            // map is located this.gameScreen.camerarect.x + 50
            new Rectangle(this.gameScreen.camerarect.x + 50 + 28, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 190, 60, 40),// in order of 1-12
            new Rectangle(this.gameScreen.camerarect.x + 50 + 155, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 190, 60 ,40),
            new Rectangle(this.gameScreen.camerarect.x + 50 + 28, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 125, 60 ,40),
            new Rectangle(this.gameScreen.camerarect.x + 50 + 160, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 125, 60 ,40),
            new Rectangle(this.gameScreen.camerarect.x + 50 + 37, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 288, 60 ,40),
            new Rectangle(this.gameScreen.camerarect.x + 50 + 145, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 288, 60 ,40),
            new Rectangle(this.gameScreen.camerarect.x + 50 + 179, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 69, 60 ,40),
            new Rectangle(this.gameScreen.camerarect.x + 50 + 28, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 49, 60, 40),
            new Rectangle(this.gameScreen.camerarect.x + 50 + 340, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 23, 60 ,40),
            new Rectangle(this.gameScreen.camerarect.x + 50 + 270, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 140, 60 ,40),
            new Rectangle(this.gameScreen.camerarect.x + 50 + 372, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 95, 60 ,40),
            new Rectangle(this.gameScreen.camerarect.x + 50 + 357, this.gameScreen.height - this.gameScreen.camerarect.height - 350 + 190, 60 ,40),
        ];
        this.musicboxbutton = new Rectangle(this.gameScreen.camerarect.x - 150, this.gameScreen.height - this.gameScreen.camerarect.height - 150, 156, 65);


    this.background = this.add.image(this.gameScreen.width/2, this.gameScreen.height/2, 'stage');
    this.gooch = this.add.image(-this.gameScreen.cameraX + 800 +297, -this.gameScreen.cameraY + 400 +226, 'prizecornergooch').setVisible(false);
    this.stageFlash = this.add.image(-this.gameScreen.cameraX +500, -this.gameScreen.cameraY + 500, 'flashlighttex').setDisplaySize(966,963);
    this.stageFlash.setVisible(false);
    this.stageFlash.setAlpha(0.5);
    this.darienprizecorner = this.add.image(-this.gameScreen.cameraX - 200, -this.gameScreen.cameraY + 100, 'darienprizecorner').setVisible(false);
    this.darienSoftJump = this.add.image(1024/2, 768/2, 'dariensoftjump').setVisible(false);
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

    this.darienstatic = this.add.sprite(this.gameScreen.width/2, this.gameScreen.height/2, 'darienstatic1').setAlpha(0.45);
    this.darienstatic.setVisible(false);
    this.darienstatic.anims.create({
        key: "darienstatic",
        frameRate: 55,
        frames: [
        { key: 'darienstatic1' },
        { key: 'darienstatic2' },
        { key: 'darienstatic3' },
        { key: 'darienstatic4' },
        { key: 'darienstatic5' },
        { key: 'darienstatic6' },
        ],
        repeat: -1     // -1 makes it loop infinitely
    });
    this.darienstatic.setTint(0xff0000);

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
    this.battery = this.add.image(80, 60, "battery1");
    this.night = this.add.image(this.gameScreen.width - 125, 50, "night");
    this.nightNumShow = this.add.image(this.gameScreen.width - 50, 50, "num" + this.nightnum);
    // this.numberUI = this.add.image("", width - 65, 25);
    this.am = this.add.image(this.gameScreen.width - 60, 90, "am");
    this.hourNumShow = this.add.image(this.gameScreen.width - 120, 90, "num" + 1);
    this.hourNumShow2 = this.add.image(this.gameScreen.width - 100, 90, "num" + 2);
    this.camerause = this.add.image(760, this.gameScreen.height - this.gameScreen.camerarect.height, "camerause");
    // This method is called once, just after preload()
    // It will initialize our scene, like the positions of the sprites
    this.map = this.add.image(this.gameScreen.camerarect.x + 225, this.gameScreen.height - this.gameScreen.camerarect.height - 220, 'map');
    for (let i = 0; i < this.maplocationbuttons.length; i++)
    {
      if (i == 8)
      {
           this.maplocationtextures[i] = this.add.image(this.maplocationbuttons[i].x + 5,  this.maplocationbuttons[i].y, 'locationspot');
      }
      else
      {
          this.maplocationtextures[i] = this.add.image(this.maplocationbuttons[i].x + 5, this.maplocationbuttons[i].y, 'locationbox');
      }
        this.camNameTextures[i] = this.add.image(this.maplocationbuttons[i].x, this.maplocationbuttons[i].y, `cam${i+1}`);
        this.locationNameTextures[i] = this.add.image(this.gameScreen.camerarect.x + 55, this.gameScreen.height - this.gameScreen.camerarect.height - 390, `camName${i+1}`);
        this.locationNameTextures[i].setVisible(false);
    }
    this.blip = this.sound.add("blip");
    this.cameraambience = this.sound.add("cameras");
    this.musicsound = this.sound.add("wind");
    this.windup = this.sound.add("windup");
    this.garble = this.sound.add("garble");
    this.musicboxbuttontexture = this.add.image(this.musicboxbutton.x + 78, this.musicboxbutton.y + 32, 'boxbutton').setVisible(false);
    this.musicboxtext = this.add.image(this.musicboxbutton.x + 78, this.musicboxbutton.y + 25, 'wind').setVisible(false);
    this.border = this.add.image(1024 /2, 768 /2, 'border');
    this.boxTimeLeft = this.add.image(this.musicboxbutton.x - 40, this.musicboxbutton.y + 20, 'box1').setVisible(false);
    
    this.yellowtriangle = this.add.image(1024- 105, 768 - 110, "yellowtriangle");
    this.yellowtriangle.setAlpha(0);
    this.yellowtriangle.setVisible(false);
    
  }
  update(time, delta) {
    var mouse = this.input.activePointer;
    this.drawChange = false;
    if (this.switchstatic.anims.isPlaying == false) {
      this.switchStatic = true;
      this.switchstatic.visible = true;
    }
    else {
      this.switchStatic = false;
      this.switchstatic.visible = true;
    }
    if (this.cameraambience.isPlaying == false) {
        console.log('camera ambience played');
                this.cameraambience.play();
    }
    // getBackground();
    //     // cameramovement
         if (this.cameraspot > 5)
         {
            if (this.waitTimer._isRunning) this.waitTimer.Update(delta); // add this at the top
            if (this.gameScreen.cameraX + this.gameScreen.width +300 >= 1600)
            {
                if (this.camDir == 2)
                {
                    this.camDir = 0;
                    this.waitTimer.finishCallback = () =>
                    {
                        this.camDir = 1; 
                    };
                    this.waitTimer.Reset();
                    this.waitTimer.Start();
                }
            }
            if (this.gameScreen.cameraX + (this.gameScreen.width /4) <= 0)
            {
                if (this.camDir == 1)
                {
                    this.camDir = 0;
                    this.waitTimer.finishCallback = () =>
                    {
                        this.camDir = 2;
                    };
                    this.waitTimer.Reset();
                    this.waitTimer.Start();
                }
            }
            switch (this.camDir)
            {
                case 1:
                this.gameScreen.cameraX -= delta/8;
                this.drawChange = true;
                break;
                case 2:
                this.gameScreen.cameraX += delta/8;
                this.drawChange = true;
                break;
            }

          }

        // check for animatronic movement
        for (let i = 0; i < this.gameScreen.animatronics.length; i++)
        {
            if (this.gameScreen.animatronics[i].moved)
            {
                this.animatronicForceOff = true;
                if (this.darieninterrupt == false)
                {
                    this.switchstatic.anims.play('switchstatic', true);
                    this.switchStatic = true;
                    this.drawChange = true;
                }
                break;
            }
        }

        // flashlight in cams
        if (this.gameScreen.keyShift.isDown && this.gameScreen.batterymilliseconds > 0)
        {
            // main hallway
            this.camFlashOn = true; 
            this.drawChange = true;
        }
        else
        {
            this.camFlashOn = false;
            this.drawChange = true;
        }

        if (this.camFlashOn)
        {
            this.gameScreen.batterymilliseconds -= delta;
        }        

        // exit cameras

         if (this.gameScreen.camerarect.contains(mouse.x, mouse.y))
            {
                if (this.gameScreen.camerabuttonactive == 2)
                {
                        this.gameScreen.monitorclosed.play();
                        this.gameScreen.camerabuttonactive = 3;
                        if (this.musicsound.isPlaying) this.musicsound.stop();
                        if (this.cameraambience.isPlaying) this.cameraambience.stop();
                        if (this.garble.isPlaying) this.garble.stop();
                }
                if (this.gameScreen.camerabuttonactive == 3)
                {
                    this.gameScreen.switchScreenState(0);
                }
            }
            else
            {
                if (this.gameScreen.camerabuttonactive <= 1)
                {
                    this.gameScreen.camerabuttonactive = 2;
                }

            }
    //     //click on camera
          if (mouse.leftButtonDown())
          {
              for (let i = 0; i < this.maplocationbuttons.length; i++) {
                  if (this.maplocationbuttons[i].contains(mouse.x + 30, mouse.y + 20))
                  {
                      if (this.cameraspot != i)
                      {
                          this.oldcameraspot = this.cameraspot;
                          this.cameraspot = i;
                          if (this.blip.isPlaying == false) this.blip.play();
                          if (this.cameraspot == 10 && this.gameScreen.musicTimer._elapsedTime > 0 && this.musicsound.isPlaying == false) this.musicsound.play();
                          this.switchStatic = true;
                          this.switchstatic.anims.play('switchstatic', true);
                          this.drawChange = true;
                      }
                  }
              }
          }
        if (this.gameScreen.animatronics[6].location == this.cameraspot) 
        {
            if (this.darienInterruptTimer == null)
            {
                this.darienInterruptTimer = new timer(6000);
                this.darienInterruptTimer.finishCallback = () =>
                {
                    console.log('darien spooked the cameras');
                    // darienLaugh.Play();
                    this.switchstatic.anims.play('switchstatic', true);
                    this.switchStatic = true;
                    this.darieninterrupt = true;
                    this.darienInterruptWait = new timer(2000);
                    this.darienInterruptWait.Start();
                };
                this.darienInterruptTimer.Start();
            }
            else if (this.darienInterruptTimer.IsFinished() == false)
            {
                this.darienInterruptTimer.Update(delta);
            }
        }
        if (this.darieninterrupt) {
            if (this.darienstatic.visible == false) {
                console.log('switch to darien static');
                this.darienSoftJump.setVisible(true);
                this.darienstatic.setVisible(true);
                this.static.setVisible(false);
                this.darienstatic.anims.play('darienstatic');
                this.static.anims.stop();
            }
        }
        else {
            if (this.static.visible == false) {
                console.log('back to normal');
                this.static.setVisible(true);
                this.darienSoftJump.setVisible(false);
                this.darienstatic.setVisible(false);
                this.darienstatic.anims.stop();
                this.static.anims.play('static');
            }
        }

        // music box
        if (this.cameraspot == 10)
        {
            if (this.gameScreen.camerabuttonactive > 1 && this.gameScreen.camerabuttonactive < 3 && this.gameScreen.musicTimer._elapsedTime > 0 && this.musicsound.isPlaying == false) this.musicsound.play();
            if (mouse.leftButtonDown() && this.darieninterrupt == false) {
                if (this.musicboxbutton.contains(mouse.x, mouse.y))
                {
                    this.winding = true;
                    if (this.gameScreen.musicTimer._elapsedTime > 200) {
                        this.gameScreen.musicTimer.RemoveTime(delta * 5.9);
                        this.drawChange = true;
                        if (this.windup.isPlaying == false) this.windup.play();
                    }
                    else {
                        // if (this.musicsound.isPlaying) this.musicsound.stop();
                    }
                    // i know it says remove time, but it adds time to the music box timer
                }
            }
            else
            {
                this.winding = false;
            }
        }
        else
        {
            if (this.winding)
            {
                if (this.windup.isPlaying == false) this.windup.stop();
            }
            if (this.musicsound.isPlaying) this.musicsound.pause();
            this.winding = false;
        }
        if (this.gameScreen.musicTimer.IsFinished())
        {
            this.gameScreen.musicTimer.Stop();
            if (this.yellowtriangle.visible) this.yellowtriangle.setVisible(false);
            this.gameScreen.musicTimer.SetTargetTime(0);
            if (this.musicsound.isPlaying) this.musicsound.stop();
            this.winding = false;
        }
        var remainingTime = this.gameScreen.musicTimer.RemainingTime();
                switch (true)
                        {

                            case (remainingTime > 0 && remainingTime < 5000):
                            if (this.yellowtriangle.alpha >= 1) this.yellowtriangle.alpha -= 1;
                            this.yellowtriangle.alpha += delta * 0.008;
                            if (this.yellowtriangle.texture.key == 'yellowtriangle') this.yellowtriangle.setTexture('redtriangle');
                            break;
                            case (remainingTime > 5000 && remainingTime < 12500):
                            this.yellowtriangle.alpha += delta * 0.003;
                            if (this.yellowtriangle.alpha >= 1) this.yellowtriangle.alpha -= 1;
                            if (this.yellowtriangle.visible == false) this.yellowtriangle.setVisible(true);
                            if (this.yellowtriangle.texture.key != 'yellowtriangle') this.yellowtriangle.setTexture('yellowtriangle');
                            break;
                            default:
                            if (this.yellowtriangle.visible) this.yellowtriangle.setVisible(false);
                            break;
                        }
        
            if (this.gameScreen.screenState == 1 && this.gameScreen.animatronics[3].location == this.cameraspot) {
                if (this.garble.isPlaying == false) {
                    console.log('gooch garble playing');
                    this.garble.play();
                } 
            }
            else {
                if (this.garble.isPlaying) this.garble.stop();
            }
        if (this.drawChange == true) this.drawUpdate();
  }
  drawUpdate() {
    if (this.cameraspot > 5) this.background.setPosition(-this.gameScreen.cameraX + this.gameScreen.width/2, -this.gameScreen.cameraY +  this.gameScreen.height/2);
    if (this.cameraspot <= 5) this.background.setPosition(1024/2, 768/2);
    this.background.setTexture(this.getBackground());
    if (this.cameraspot == 8 && this.camFlashOn){
      this.stageFlash.setVisible(true);
      this.stageFlash.setPosition(-this.gameScreen.cameraX +500, -this.gameScreen.cameraY + 500);
    }
    else {this.stageFlash.setVisible(false);}
    if (this.gameScreen.animatronics[3].location == this.cameraspot && this.cameraspot != 11 && this.cameraspot != 5) {
        if (this.gooch.visible == false) this.gooch.setVisible(true);
        switch (this.cameraspot)
        {
            case 10:
            if (this.gooch.texture.key != 'prizecornergooch') {
                this.gooch.setTexture('prizecornergooch');
            }
            this.gooch.setPosition(-this.gameScreen.cameraX + 800 +297, -this.gameScreen.cameraY + 400 +226);
            break;
            case 9:
            if (this.gooch.texture.key != 'gamescornergooch') {
                this.gooch.setTexture('gamescornergooch');
            }
            this.gooch.setPosition(-this.gameScreen.cameraX - 300 + 200, -this.gameScreen.cameraY - 200 + 197);
            break;
            case 6:
            if (this.gooch.texture.key != 'mainhallgooch') {
                this.gooch.setTexture('mainhallgooch');
            }
            this.gooch.setPosition(-this.gameScreen.cameraX + 750 +242, -this.gameScreen.cameraY + 400 + 210);
            break;
            case 0:
            if (this.gooch.texture.key != 'mainhallgooch') {
                this.gooch.setTexture('mainhallgooch');
            }
            this.gooch.setPosition(-this.gameScreen.cameraX + 750 + 242, -this.gameScreen.cameraY + 400 + 210);
            break;
            case 1:
            if (this.gooch.texture.key != 'partyroom2gooch') {
                this.gooch.setTexture('partyroom2gooch');
            } 
            this.gooch.setPosition(-this.gameScreen.cameraX + 150 + 121, -this.gameScreen.cameraY + 200 + 278);
            break;
        }
    }
    else {
        if (this.gooch.visible) this.gooch.setVisible(false);
    }

    if (this.cameraspot == 10) {
        if (this.musicboxbuttontexture.visible == false) this.musicboxbuttontexture.setVisible(true);
        if (this.musicboxtext.visible == false) this.musicboxtext.setVisible(true);
        if (this.boxTimeLeft.visible == false) this.boxTimeLeft.setVisible(true);
        if (this.gameScreen.musicTimer.IsFinished() == false) {
            this.boxTimeLeft.setTexture('box' + (21 - Math.floor((this.gameScreen.musicTimer._targetTime - this.gameScreen.musicTimer._elapsedTime) / 2857)));
        }
        else {
            if (this.boxTimeLeft.visible) this.boxTimeLeft.setVisible(false);
        }
        if (this.musicboxbuttontexture.texture.key != (this.winding ? 'boxbuttonhover' : 'boxbutton')) this.musicboxbuttontexture.setTexture(this.winding ? 'boxbuttonhover' : 'boxbutton');
        if (this.gameScreen.animatronics[6].location == 10) {
            if (this.darienprizecorner.visible == false) this.darienprizecorner.setVisible(true);
            this.darienprizecorner.setPosition(-this.gameScreen.cameraX - 200 + 406, -this.gameScreen.cameraY + 100 + 350);
        }
        else {
            if (this.darienprizecorner.visible) this.darienprizecorner.setVisible(false);
        }
    }
    else {
        if (this.musicboxbuttontexture.visible) this.musicboxbuttontexture.setVisible(false);
        if (this.musicboxtext.visible) this.musicboxtext.setVisible(false);
        if (this.boxTimeLeft.visible) this.boxTimeLeft.setVisible(false);
        if (this.darienprizecorner.visible) this.darienprizecorner.setVisible(false);
    }
    if (this.battery.texture.key != 'battery' + (this.gameScreen.batterynum+1)) this.battery.setTexture('battery' + (this.gameScreen.batterynum+1));
    this.maplocationtextures[this.cameraspot].setTexture('locationspot');
    if (this.oldcameraspot != null) this.maplocationtextures[this.oldcameraspot].setTexture('locationbox');
    if (this.locationNameTextures[this.cameraspot].visible == false) this.locationNameTextures[this.cameraspot].setVisible(true);
    if (this.oldcameraspot != null && this.locationNameTextures[this.oldcameraspot].visible) this.locationNameTextures[this.oldcameraspot].setVisible(false);
      if (this.static.anims.isPlaying == false) {
          this.static.anims.play("static");
      }
      if (this.battery.texture.key != 'battery' + (this.gameScreen.batterynum+1)) this.battery.setTexture('battery' + (this.gameScreen.batterynum+1));
        if (this.nightNumShow.texture.key != 'num' + (this.gameScreen.nightnum)) this.nightNumShow.setTexture('num' + (this.gameScreen.nightnum));
        if (this.gameScreen.hournum != 0) {
            if (this.hourNumShow.visible) this.hourNumShow.setVisible(false);
            if (this.hourNumShow2.texture.key != 'num' + (this.gameScreen.hournum)) this.hourNumShow2.setTexture('num' + (this.gameScreen.hournum));
        }
        else {
            if (this.hourNumShow.visible == false) this.hourNumShow.setVisible(true);
            if (this.hourNumShow.texture.key != 'num' + (1)) this.hourNumShow.setTexture('num' + (1));
            if (this.hourNumShow2.texture.key != 'num' + (2)) this.hourNumShow2.setTexture('num' + (2));
        }
    }
    
    getBackground()
    {
        let background;
        if (this.camFlashOn)
        {
            background = this.flashlightbackgrounds[this.cameraspot];
            let animatronicsIDcount = 0;
            let animatronicscount = 0;
            for (let i = 0; i < this.gameScreen.animatronics.length; i++)
            {
                if (this.gameScreen.animatronics[i].location == this.cameraspot)
                    {
                        animatronicsIDcount += this.gameScreen.animatronics[i].ID;
                        animatronicscount++;
                        switch(this.cameraspot)
                        {
                            case 0:
                            if (this.gameScreen.animatronics[i].Name == "Juan") background = 'partyroom1juan';
                            break;
                            case 1:
                            if (this.gameScreen.animatronics[i].Name == "Misa") background = 'partyroom2misa';
                            if (this.gameScreen.animatronics[i].Name == "Darien") background = 'partyroom2darienflash';
                            break;
                            case 2:
                            if (this.gameScreen.animatronics[i].Name == "Misa") background = 'partyroom3misa';
                            if (this.gameScreen.animatronics[i].Name == "Marlon") background = 'partyroom3marlonflash';
                            break;
                            case 3:
                            if (this.gameScreen.animatronics[i].Name == "Misa") background = 'partyroom4misaflash';
                            if (this.gameScreen.animatronics[i].Name == "Darien") background = 'partyroom4darienflash';
                            break;
                            case 4: 
                            if (this.gameScreen.animatronics[i].Name == "Juan") background = 'leftventjuan';
                            if (this.gameScreen.animatronics[i].Name == "Carlos") background = 'leftventcarlos'; // it kinda doesn't matter in the original game, plus I'm lazy
                            break;
                            case 5: 
                            if (this.gameScreen.animatronics[i].Name == "Misa") background = 'rightventmisa';
                            if (this.gameScreen.animatronics[i].Name == "Gustavo") background = 'rightventgooch';
                            if (this.gameScreen.animatronics[i].Name == "Darien") background = 'rightventdarien';
                            break;
                            case 6:
                            if (this.gameScreen.animatronics[i].Name == "Juan") background = 'mainhalljuanflash';
                            if (this.gameScreen.animatronics[i].Name == "Marlon") background = 'mainhallmarlonflash';
                            break;
                            case 7:
                            if (this.gameScreen.animatronics[i].Name == "Nasir") {
                                animatronicscount--;
                                animatronicsIDcount -= 5; // don't include nas until he's alone
                                background = 'partsflashnas';
                            }
                            if (animatronicsIDcount == 8) background = 'partsflashdarien';
                            if (animatronicsIDcount == 9) background = 'partsflashmarlon';
                            if (animatronicsIDcount == 17 && animatronicscount == 2) background = 'partsflashdarienmarlon';
                            break;
                            case 8: 
                            if (animatronicsIDcount == 1) background = 'stagemisa';
                            if (animatronicsIDcount == 2) background = 'stagejuan';
                            if (animatronicsIDcount == 3 && animatronicscount == 2) background = 'stagemisajuan';
                            if (animatronicsIDcount == 3 && animatronicscount == 1) background = 'stageramiro';
                            if (animatronicsIDcount == 4) background = 'stagemisaramiro';
                            if (animatronicsIDcount == 5) background = 'stagejuanramiro';
                            if (animatronicsIDcount == 6) background = 'stagefull';
                            break;
                            case 9:
                            if (animatronicsIDcount == 3 || animatronicsIDcount == 9) background = 'gamescornerram';
                            if (animatronicsIDcount == 10 || animatronicsIDcount == 16) background = 'gamescornercarlosram';
                            if (animatronicsIDcount == 7 || animatronicsIDcount == 13) background = 'gamescornercarlosflash';
                            break;
                            case 11:
                            background = 'kidscovegooch';
                            break;
                        }
                    }
            }
        }
        else
        {
            background = this.backgrounds[this.cameraspot];
            let animatronicsIDcount = 0;
            let animatronicscount = 0;
            for (let i = 0; i < this.gameScreen.animatronics.length; i++)
            {
                if (this.gameScreen.animatronics[i].location == this.cameraspot)
                    {
                        animatronicsIDcount += this.gameScreen.animatronics[i].ID;
                        animatronicscount++;
                        switch (this.cameraspot) // stage with animatronic
                        {
                            case 8:
                            if (animatronicsIDcount == 1) background = 'stagemisa';
                            if (animatronicsIDcount == 2) background = 'stagejuan';
                            if (animatronicsIDcount == 3 && animatronicscount == 2) background = 'stagemisajuan';
                            if (animatronicsIDcount == 3 && animatronicscount == 1) background = 'stageramiro';
                            if (animatronicsIDcount == 4) background = 'stagemisaramiro';
                            if (animatronicsIDcount == 5) background = 'stagejuanramiro';
                            if (animatronicsIDcount == 6) background = 'stagefull';
                            break;
                            case 1:
                            if (this.gameScreen.animatronics[i].Name == "Darien") background = 'partyroom2darien';
                            break;
                            case 2:
                            if (this.gameScreen.animatronics[i].Name == "Marlon") background = 'partyroom3marlon';
                            break;
                            case 3:
                            if (this.gameScreen.animatronics[i].Name == "Misa") background = 'partyroom4misa';
                            if (this.gameScreen.animatronics[i].Name == "Darien") background = 'partyroom4darien';
                            break;
                            case 6:
                            if (this.gameScreen.animatronics[i].Name == "Juan") background = 'mainhalljuan';
                            break;
                            case 9:
                            if (this.gameScreen.animatronics[i].Name == "Carlos") background = 'gamescornercarlos';
                            break;
                        }
                    }
            }
        }
        return background;
      }
}