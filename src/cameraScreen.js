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
    this.oldcameraspot = 8;
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
  }
  preload() {
    this.gameScreen = this.screens[0];
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
        this.winding = false;
        // this.cameraAmbience = this.gameScreen.GetId("cameras.mp3");
        this.waitTimer = new timer(1500);
        this.waitTimer.Start();
  }
  create() {
    this.background = this.add.image(this.gameScreen.width/2, this.gameScreen.height/2, 'stage');
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
    this.night = this.add.image(this.gameScreen.width - 150, 50, "night");
    // this.numberUI = this.add.image("", width - 65, 25);
    this.am = this.add.image(this.gameScreen.width - 60, 90, "am");
    this.camerause = this.add.image(760, this.gameScreen.height - this.gameScreen.camerarect.height, "camerause");
    // This method is called once, just after preload()
    // It will initialize our scene, like the positions of the sprites
    this.map = this.add.image(this.gameScreen.camerarect.x + 225, this.gameScreen.height - this.gameScreen.camerarect.height - 220, 'map');
    for (let i = 0; i < this.maplocationbuttons.length; i++)
    {
      if (i == 8)
      {
           this.maplocationtextures[i] = this.add.image(this.maplocationbuttons[i].x, this.maplocationbuttons[i].y, 'locationspot');
      }
      else
      {
          this.maplocationtextures[i] = this.add.image(this.maplocationbuttons[i].x, this.maplocationbuttons[i].y, 'locationbox');
      }
        this.camNameTextures[i] = this.add.image(this.maplocationbuttons[i].x, this.maplocationbuttons[i].y, `cam${i+1}`);
        this.locationNameTextures[i] = this.add.image(this.gameScreen.camerarect.x + 55, this.gameScreen.height - this.gameScreen.camerarect.height - 390, `camName${i+1}`);
        this.locationNameTextures[i].setVisible(false);
    }
    this.border = this.add.image(1024 /2, 768 /2, 'border');
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

    //     // check for animatronic movement
    //     for (int i = 0; i < this.gameScreen.animatronics.Length; i++)
    //     {
    //         if (this.gameScreen.animatronics[i].moved)
    //         {
    //             animatronicForceOff = true;
    //             switchstaticframe = 0;
    //             switchStatic = true;
    //             break;
    //         }
    //     }

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

    //     if (camFlashOn)
    //     {
    //         this.gameScreen.batterymilliseconds -= elapsedMs;
    //         // battery indicator
    //         switch (this.gameScreen.nightnum)
    //         {
    //             case 1:
    //             this.gameScreen.batteryNumCheck(117000);
    //             break;
    //             case 2:
    //             this.gameScreen.batteryNumCheck(100000);
    //             break;
    //             case 3:
    //             this.gameScreen.batteryNumCheck(83000);
    //             break;
    //             case 4:
    //             this.gameScreen.batteryNumCheck(67000);
    //             break;
    //             case >= 5:
    //             this.gameScreen.batteryNumCheck(50000);
    //             break;
    //         }
    //     }        

        // exit cameras

         if (this.gameScreen.camerarect.contains(mouse.x, mouse.y))
            {
                if (this.gameScreen.camerabuttonactive == 2)
                {
                        this.gameScreen.monitorclosed.play();
                        this.gameScreen.camerabuttonactive = 3;
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
                          // this.gameScreen.PlaySound(this.gameScreen.blip);
                          // if (this.cameraspot == 10 && this.gameScreen.musicTimer.ElapsedTime > TimeSpan.Zero) this.gameScreen.PlaySound(this.gameScreen.windsound, true);
                          this.switchStatic = true;
                          this.switchstatic.anims.play('switchstatic', true);
                          this.drawChange = true;
                      }
                  }
              }
          }
    //     // music box
    //     if (cameraspot == 10)
    //     {
    //         if (this.gameScreen.CurrentMouse.LeftButtonDown) {
    //             if (mouse.X >= musicboxbutton.X  && mouse.X <= musicboxbutton.X + musicboxbutton.Width && mouse.Y >= musicboxbutton.Y && mouse.Y <= musicboxbutton.Y + musicboxbutton.Height)
    //             {
    //                 winding = true;
    //                 if (this.gameScreen.musicTimer.ElapsedTime > TimeSpan.Zero) {
    //                     this.gameScreen.musicTimer.RemoveTime(TimeSpan.FromMilliseconds(elapsedMs * 5.9));
    //                     this.gameScreen.PlaySound(this.gameScreen.windup);
    //                 }
    //                 else {
    //                     this.gameScreen.StopSound(this.gameScreen.windsound);
    //                 }
    //                 // i know it says remove time, but it adds time to the music box timer
    //             }
    //         }
    //         else
    //         {
    //             winding = false;
    //         }
    //     }
    //     else
    //     {
    //         if (winding)
    //         {
    //             this.gameScreen.StopSound(this.gameScreen.windup);
    //         }
    //         this.gameScreen.PauseSoundAsync(this.gameScreen.windsound);
    //         winding = false;
    //     }
    //     if (this.gameScreen.musicTimer.IsFinished())
    //     {
    //         this.gameScreen.musicTimer.Stop();
    //         this.gameScreen.musicTimer.SetTargetTime(TimeSpan.Zero);
    //         this.gameScreen.StopSound(this.gameScreen.windsound);
    //         winding = false;
    //     }
        
    //         if (this.gameScreen.animatronics[3].location == cameraspot) {
    //             // I'm lazy so I'm just going to add this sound code here

    //             if (this.gameScreen.animatronics[3].garblePlaying == false) {
    //                 this.gameScreen.PlaySound(this.gameScreen.garble);
    //                 this.gameScreen.animatronics[3].garblePlaying = true;
    //                 garbleTimer = new RamirosWeb.Timer(TimeSpan.FromMilliseconds(3100));
    //                 garbleTimer.finishCallback = () =>
    //                 {
    //                     this.gameScreen.animatronics[3].garblePlaying = false;
    //                     garbleTimer = null;
    //                 };
    //                 garbleTimer.Start();
    //             }
    //             else
    //             {
    //                 if (garbleTimer != null && garbleTimer.IsRunning)
    //                 {
    //                     garbleTimer.Update(elapsedMs);
    //                 }
    //             }
    //         }
    //         else
    //         {
    //             if (this.gameScreen.animatronics[3].garblePlaying == true)
    //             {
    //                 this.gameScreen.StopSound(this.gameScreen.garble);
    //                 this.gameScreen.animatronics[3].garblePlaying = false;
    //                 garbleTimer = null;
    //             }
    //         }
        if (this.drawChange == true) this.drawUpdate();
  }
  drawUpdate() {
    if (this.cameraspot > 5) this.background.setPosition(-this.gameScreen.cameraX + this.gameScreen.width/2, -this.gameScreen.cameraY +  this.gameScreen.height/2);
    if (this.cameraspot <= 5) this.background.setPosition(1024/2, 768/2);
    this.background.setTexture(this.getBackground());
    this.maplocationtextures[this.cameraspot].setTexture('locationspot');
    this.maplocationtextures[this.oldcameraspot].setTexture('locationbox');
      if (this.static.anims.isPlaying == false) {
          this.static.anims.play("static");
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
            // for (let i = 0; i < this.gameScreen.animatronics.length; i++)
            // {
            //     if (this.gameScreen.animatronics[i].location == cameraspot)
            //         {
            //             animatronicsIDcount += this.gameScreen.animatronics[i].ID;
            //             animatronicscount++;
            //             switch(cameraspot)
            //             {
            //                 case 0:
            //                 if (this.gameScreen.animatronics[i].Name == "Juan") background = this.gameScreen.partyroom1juan;
            //                 break;
            //                 case 1:
            //                 if (this.gameScreen.animatronics[i].Name == "Misa") background = this.gameScreen.partyroom2misa;
            //                 break;
            //                 case 2:
            //                 if (this.gameScreen.animatronics[i].Name == "Misa") background = this.gameScreen.partyroom3misa;
            //                 break;
            //                 case 3:
            //                 if (this.gameScreen.animatronics[i].Name == "Misa") background = this.gameScreen.partyroom4misaflash;
            //                 break;
            //                 case 4: 
            //                 if (this.gameScreen.animatronics[i].Name == "Juan") background = this.gameScreen.leftventjuan;
            //                 if (this.gameScreen.animatronics[i].Name == "Carlos") background = this.gameScreen.leftventcarlos; // it kinda doesn't matter in the original game, plus I'm lazy
            //                 break;
            //                 case 5: 
            //                 if (this.gameScreen.animatronics[i].Name == "Misa") background = this.gameScreen.rightventmisa;
            //                 if (this.gameScreen.animatronics[i].Name == "Gustavo") background = this.gameScreen.rightventgooch;
            //                 break;
            //                 case 6:
            //                 if (this.gameScreen.animatronics[i].Name == "Juan") background = this.gameScreen.mainhalljuanflash;
            //                 break;
            //                 case 7:
            //                 if (this.gameScreen.animatronics[i].Name == "Nasir") background = this.gameScreen.partsflashnas;
            //                 break;
            //                 case 8: 
            //                 if (animatronicsIDcount == 1) background = this.gameScreen.stagemisa;
            //                 if (animatronicsIDcount == 2) background = this.gameScreen.stagejuan;
            //                 if (animatronicsIDcount == 3 && animatronicscount == 2) background = this.gameScreen.stagemisajuan;
            //                 if (animatronicsIDcount == 3 && animatronicscount == 1) background = this.gameScreen.stageramiro;
            //                 if (animatronicsIDcount == 4) background = this.gameScreen.stagemisaramiro;
            //                 if (animatronicsIDcount == 5) background = this.gameScreen.stagejuanramiro;
            //                 if (animatronicsIDcount == 6) background = this.gameScreen.stagefull;
            //                 break;
            //                 case 9:
            //                 if (animatronicsIDcount == 3 || animatronicsIDcount == 9) background = this.gameScreen.gamescornerram;
            //                 if (animatronicsIDcount == 10 || animatronicsIDcount == 16) background = this.gameScreen.gamescornercarlosram;
            //                 if (animatronicsIDcount == 7 || animatronicsIDcount == 13) background = this.gameScreen.gamescornercarlosflash;
            //                 break;
            //                 case 11:
            //                 background = this.gameScreen.kidscovegooch;
            //                 break;
            //             }
            //         }
            // }
        }
        else
        {
            background = this.backgrounds[this.cameraspot];
            let animatronicsIDcount = 0;
            let animatronicscount = 0;
            // for (let i = 0; i < this.gameScreen.animatronics.Length; i++)
            // {
            //     if (this.gameScreen.animatronics[i].location == cameraspot)
            //         {
            //             animatronicsIDcount += this.gameScreen.animatronics[i].ID;
            //             animatronicscount++;
            //             if (cameraspot == 8) // stage with animatronic
            //             {
            //                 if (animatronicsIDcount == 1) background = this.gameScreen.stagemisa;
            //                 if (animatronicsIDcount == 2) background = this.gameScreen.stagejuan;
            //                 if (animatronicsIDcount == 3 && animatronicscount == 2) background = this.gameScreen.stagemisajuan;
            //                 if (animatronicsIDcount == 3 && animatronicscount == 1) background = this.gameScreen.stageramiro;
            //                 if (animatronicsIDcount == 4) background = this.gameScreen.stagemisaramiro;
            //                 if (animatronicsIDcount == 5) background = this.gameScreen.stagejuanramiro;
            //                 if (animatronicsIDcount == 6) background = this.gameScreen.stagefull;
            //             }
            //             if (cameraspot == 3) // partyroom4 with animatronic
            //             {
            //                 if (this.gameScreen.animatronics[i].Name == "Misa") background = this.gameScreen.partyroom4misa;
            //             }
            //             if (cameraspot == 6) // mainhall with animatronic
            //             {
            //                 if (this.gameScreen.animatronics[i].Name == "Juan") background = this.gameScreen.mainhalljuan;
            //             }
            //             if (cameraspot == 9)
            //             {
            //                 if (this.gameScreen.animatronics[i].Name == "Carlos") background = this.gameScreen.gamescornercarlos;
            //             }
            //         }
            // }
        }
        return background;
      }
}