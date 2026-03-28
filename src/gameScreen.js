import Phaser from "phaser";
import menuScreen from './menuScreen.js';
import gameOverScreen from './gameOverScreen.js';
import cameraScreen from './cameraScreen.js';
import winScreen from './winScreen.js';
import Animatronic from './animatronic.js';
import timer from './timer.js';

const { Rectangle, Circle, Point } = Phaser.Geom; 
const { Intersects } = Phaser.Geom;

export default class gameScreen extends Phaser.Scene {
  // The three methods currently empty
  constructor() {
    super({key: 'gameScreen'});
    this.debug = true; // CHANGE HERE
    this.web = false; // always change this for web builds
    this.maskonPlayed = false;
    this.monitoropenPlayed = false;
    this.batterymilliseconds = 500000;
    this.batterynum = 4;
    this.width = 1024;
    this.height = 768;
    this.fullscreenWidth;
    this.fullscreenHeight;
    this.flashlightstate = 0;
        // 0: off
        // 1: main
        // 2: left
        // 3: right
    this.pause = false;
    this.cameraX = 0;
    this.cameraY = 0;
    this.oldcameraX = 0;
    this.oldcameraY = 0;
    this.updateframe = 0;
    this.tableframe = 0;
    this.freddymaskframe = 0;
    this.maskbuttonactive = 0;
    this.camerabuttonactive = 0;
    this.cameraframe = 0;
    this.timers = [];
    this.maskCooldown;
    this.camCooldown;
    this.nightTimer;
    this.hournum = 0; // 12 = 0, 6 = 6,
    this.nightnum = 2; // night 1-6
    this.screenState = 0; // 0: game, 1: camera 2: jumpscare 3: main menu 4: game over 5: win screen
    this.triangleflash = 0;
    this.musicTimer;
    this.jumpscareID = 0;
    this.musicMilliseconds = 60000;
    this.jumpscareScale = 0;
        // 6 am
    this.clockchimefade = 0;
    this.nightendframe = 0;
    this.nightendframesplayed = false;
    this.leftvent;
    this.rightvent;
    this.maskrect;
    this.camerarect;
    this.drawChange = false;
    this.animatronics = [];
    // from old gameScreen.cs
    this.danger = 0;
    this.maskOffPlayed = false;
    this.maskOnCooldown;
    this.muteCallButton;
    this.phoneHasPlayed = false;
    this.phonePlaying = false;
    this.dangerSoundPlayed = false;
    this.dangerSoundTimer;
  }
  preload() {
        this.leftvent = new Rectangle(-this.cameraX + 75, -this.cameraY + 385, 60, 90);
        this.rightvent = new Rectangle(-this.cameraX + this.width - 160, -this.cameraY + 385, 60, 90);
        this.maskrect = new Rectangle(10, this.height-60, 500, 40);
        this.camerarect = new Rectangle(510, this.height-60, 500, 40);
        this.animatronics[0] = new Animatronic(this, "Misa"); // Misa animatronic
        this.animatronics[1] = new Animatronic(this, "Juan"); // Juan animatronic
        this.animatronics[2] = new Animatronic(this, "Ramiro"); // Ramiro animatronic 
        this.animatronics[3] = new Animatronic(this, "Gustavo");
        this.animatronics[4] = new Animatronic(this, "Carlos");
        this.animatronics[5] = new Animatronic(this, "Nasir");
        // musicTimer = new Timer(musicMilliseconds);   
        // musicTimer.Start();
        // timers.Add(musicTimer);

        this.load.setBaseURL('');
        this.load.setPath('');
        this.load.image("office", "/images/office.png");
        this.load.image("officeflash", "/images/officeflash.png");
        this.load.image("officeleft", "/images/officeleft.png");
        this.load.image("officeleftcarlos", "/images/officeleftcarlos.png");
        this.load.image("officeright", "/images/officeright.png");

        const sounds = [
            "buzzlight", "fansound", "clockchime", "yay", "open", 
            "close", "blip", "wind", "windup", "jackinthebox", 
            "jumpscare", "stare", "garble", "carlos1", "carlos2", "carlos3",
            "maskon", "ventwalk", "metalwalk", "maskoff"
        ];
        sounds.forEach(s => this.load.audio(s, `audio/${s}.mp3`));

        this.load.image("maskuse", "/images/maskuse.png");
        this.load.image("camerause", "/images/camerause.png");
        this.load.image("night", "/images/clock/night.png");
        this.load.image("am", "/images/clock/am.png");
        this.load.image("map", "/images/cameras/map.png");
        this.load.image("locationbox", "/images/cameras/locationbox.png");
        this.load.image("locationspot", "/images/cameras/locationspot.png");
        this.load.image("boxbutton", "/images/cameras/boxbutton.png");
        this.load.image("boxbuttonhover", "/images/cameras/boxbuttonhover.png");
        this.load.image("wind", "/images/cameras/wind.png");
        this.load.image("border", "/images/cameras/border.png");

        for (let i = 1; i <= 4; i++) this.load.image(`table${i}`, `/images/table/${i}.png`);
        for (let i = 1; i <= 4; i++) this.load.image(`vents${i}`, `/images/ventlights/${i}.png`);
        for (let i = 1; i <= 5; i++) this.load.image(`battery${i}`, `/images/battery/${i}.png`);
        for (let i = 1; i < 10; i++) this.load.image(`freddymask${i}`, `/images/freddymask/${i}.png`);
        for (let i = 0; i <= 9; i++) this.load.image(`num${i}`, `/images/clock/numbers/${i}.png`);
        for (let i = 1; i <= 9; i++) this.load.image(`monitor${i}`, `/images/monitoropen/${i}.png`);
        for (let i = 1; i <= 21; i++) this.load.image(`box${i}`, `/images/cameras/box/${i}.png`);

        for (let i = 1; i <= 12; i++) {
            this.load.image(`cam${i}`, `/images/cameras/cam${i}.png`);
            this.load.image(`camName${i}`, `/images/cameras/names/${i}.png`);
        }
        for (let i = 1; i <= 6; i++) {
            this.load.image(`static${i}`, `/images/cameras/static/${i}.png`);
            this.load.image(`staticSwitch${i}`, `/images/cameras/staticswitch/${i}.png`);
        }
        for (let i = 1; i <= 11; i++) this.load.image(`nightEnd${i}`, `/images/nightbeat/${i}.png`);

        const locs = [
            "gamescorner", "kidscove", "leftvent", "mainhall", "parts", 
            "partyroom1", "partyroom2", "partyroom3", "partyroom4", 
            "prizecorner", "rightvent", "stage"
        ];
        locs.forEach(l => {
            this.load.image(l, `/images/cameras/locations/${l}.png`);
            if (l != "stage") this.load.image(`${l}flash`, `/images/cameras/locations/flashlight/${l}.png`);
        });

        this.load.image("stagefull", "/images/cameras/locations/stagefull.png");
        this.load.image("partyroom3misa", "/images/cameras/locations/flashlight/partyroom3misa.png");
        this.load.image("partyroom2misa", "/images/cameras/locations/flashlight/partyroom2misa.png");
        this.load.image("partyroom4misa", "/images/cameras/locations/partyroom4misa.png");
        this.load.image("partyroom4misaflash", "/images/cameras/locations/flashlight/partyroom4misa.png");
        this.load.image("rightventmisa", "/images/cameras/locations/flashlight/rightventmisa.png");
        this.load.image("rightventgooch", "/images/cameras/locations/flashlight/rightventgooch.png");
        this.load.image("officerightmisa", "/images/officerightmisa.png");
        this.load.image("officerightgooch", "/images/officerightgooch.png");
        this.load.image("goochdesk", "/images/goochdesk.png");
        this.load.image("stagemisa", "/images/cameras/locations/stagemisa.png");
        this.load.image("stagejuan", "/images/cameras/locations/stagejuan.png");
        this.load.image("stageramiro", "/images/cameras/locations/stageramiro.png");
        this.load.image("stagemisajuan", "/images/cameras/locations/stagemisajuan.png");
        this.load.image("stagemisaramiro", "/images/cameras/locations/stagemisaramiro.png");
        this.load.image("stagejuanramiro", "/images/cameras/locations/stagejuanramiro.png");
        this.load.image("mainhalljuan", "/images/cameras/locations/mainhalljuan.png");
        this.load.image("mainhalljuanflash", "/images/cameras/locations/flashlight/mainhalljuan.png");
        this.load.image("officeflashjuan", "/images/officeflashjuan.png");
        this.load.image("officeflashram", "/images/officeflashram.png");
        this.load.image("officeflashnas", "/images/officeflashnas.png");
        this.load.image("officeflashnasgooch", "/images/officeflashnasgooch.png");
        this.load.image("officeflashramdoor", "/images/officeflashramdoor.png");
        this.load.image("partsflashnas", "/images/cameras/locations/flashlight/partsnas.png");
        this.load.image("partyroom1juan", "/images/cameras/locations/flashlight/partyroom1juan.png");
        this.load.image("leftventjuan", "/images/cameras/locations/flashlight/leftventjuan.png");
        this.load.image("leftventcarlos", "/images/cameras/locations/flashlight/leftventcarlos.png");
        this.load.image("officeleftjuan", "/images/officeleftjuan.png");
        this.load.image("gamescornerram", "/images/cameras/locations/flashlight/gamescornerram.png");
        this.load.image("gamescornercarlosflash", "/images/cameras/locations/flashlight/gamescornercarlos.png");
        this.load.image("gamescornercarlos", "/images/cameras/locations/gamescornercarlos.png");
        this.load.image("gamescornercarlosram", "/images/cameras/locations/flashlight/gamescornercarlosram.png");
        this.load.image("misaoffice", "/images/misaoffice.png");
        this.load.image("yoltzin", "/images/yoltzin.png");
        this.load.image("juanjumpscare", "/images/juanjumpscare.png");
        this.load.image("ryan", "/images/ryan.png");
        this.load.image("ramiro", "/images/ramiro.png");
        this.load.image("nasir", "/images/nasir.png");
        this.load.image("carlos", "/images/carlos.png");
        this.load.image("spookygooch", "/images/spookygooch.png");
        this.load.image("yellowtriangle", "/images/yellowtriangle.png");
        this.load.image("redtriangle", "/images/redtriangle.png");
        this.load.image("officeflashgooch", "/images/officeflashgooch.png");
        this.load.image("kidscovegooch", "/images/cameras/locations/flashlight/kidscovegooch.png");
        this.load.image("mainhallgooch", "/images/cameras/gooch/mainhall.png");
        this.load.image("prizecornergooch", "/images/cameras/gooch/prizecorner.png");
        this.load.image("gamescornergooch", "/images/cameras/gooch/gamescorner.png");
        this.load.image("partyroom2gooch", "/images/cameras/gooch/partyroom2.png");
        this.load.image("sixam", "/images/nightbeat/am.png");

        // old gameScreen.cs
        this.load.audio("scaryambience", "/audio/scaryambience.mp3");
        this.load.audio("deepbreaths", "/audio/deepbreaths.mp3");
        this.load.audio("misael", "/audio/misael.mp3");
        this.load.audio("misael2", "/audio/misael2.mp3");
        // deepbreaths.Volume = 0.25f;
        // deepbreaths.IsLooped = false;
        this.load.image("mutecall", "/images/mutecall.png");
        this.muteCallButton = new Rectangle(40 + 120, 40 + 8, 121, 31);
        
  }
  create() {
    this.office = this.add.image(-this.cameraX + this.width/2, -this.cameraY + this.height/2, 'office');
    this.leftventtex = this.add.image(-this.cameraX - 150, -this.cameraY + 430, "vents1");
    this.rightventtex = this.add.image(-this.cameraX + this.width + 150, -this.cameraY + 430, "vents3");
    this.table = this.add.sprite(-this.cameraX + 610, -this.cameraY + 570, "table1");
    this.table.anims.create({
        key: "fanmove",
        frameRate: 45,
        frames: [
        { key: 'table1' },
        { key: 'table2' },
        { key: 'table3' },
        { key: 'table4' }
        ],
        repeat: -1     // -1 makes it loop infinitely
    });
    this.battery = this.add.image(80, 60, "battery1");
    this.night = this.add.image(this.width - 150, 50, "night");
    // this.numberUI = this.add.image("", width - 65, 25);
    this.am = this.add.image(this.width - 60, 90, "am");
    this.camerause = this.add.image(760, this.height - this.camerarect.height, "camerause");

    this.freddymask = this.add.sprite(0 + this.width/2, 0 + this.height/2, "freddymask1");
    this.freddymask.anims.create({
        key: "freddymaskactive",
        frameRate: 35,
        frames: [
        { key: 'freddymask1' },
        { key: 'freddymask2' },
        { key: 'freddymask3' },
        { key: 'freddymask4' },
        { key: 'freddymask5' },
        { key: 'freddymask6' },
        { key: 'freddymask7' },
        { key: 'freddymask8' },
        { key: 'freddymask9' },
        ],
    });
    this.cameraopen = this.add.sprite(0 + this.width/2, 0 + this.height/2, "monitor1");
    this.cameraopen.anims.create({
        key: "camerabuttonactive",
        frameRate: 35,
        frames: [
        { key: 'monitor1' },
        { key: 'monitor2' },
        { key: 'monitor3' },
        { key: 'monitor4' },
        { key: 'monitor5' },
        { key: 'monitor6' },
        { key: 'monitor7' },
        { key: 'monitor8' },
        { key: 'monitor9' },
        ],
    });
    this.freddymask.setVisible(false);
    this.cameraopen.setVisible(false);
    this.maskuse = this.add.image(260, this.height - this.maskrect.height, "maskuse");
    this.maskon = this.sound.add("maskon");
    this.maskoff = this.sound.add("maskoff");
    this.deepbreaths = this.sound.add("deepbreaths");
    this.monitoropen = this.sound.add("open");
    this.monitorclosed = this.sound.add("close");

    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.cursorKeys = this.input.keyboard.createCursorKeys(); // Helper for arrow keys, space, and shift
    
  }
  update(time, delta) {
        var mouse = this.input.activePointer;
        this.drawChange = false;
//                 // Unpaused/main game
            if (this.pause == false) {
                    // mask
                if (this.screenState == 0) {
                    if (this.maskCooldown != null)
                    {
                        this.maskCooldown.Update(delta);
                    }

                if (this.maskCooldown != null && this.maskCooldown.IsFinished())
                {
                        this.maskbuttonactive = 0;
                        this.maskCooldown = null;
                        this.maskonPlayed = false;
                        this.maskOffPlayed = false;
                        this.freddymask.setVisible(false);
                }
                   // cam
                if (this.camCooldown != null)
                {
                        this.camCooldown.Update(delta);
                }
                //     if (dangerSoundTimer != null && dangerSoundTimer.IsRunning)
                //     {
                //         dangerSoundTimer.Update(elapsedMs);
                //     }
                //     if (danger > 0 && dangerSoundPlayed == false)
                //     {
                //         PlaySound(hallwaydanger, false);
                //         dangerSoundTimer = new RamirosWeb.Timer(TimeSpan.FromMilliseconds(7000));
                //         dangerSoundTimer.finishCallback = () =>
                //         {
                //             dangerSoundPlayed = false;
                //             dangerSoundTimer = null;
                //         };
                //         dangerSoundTimer.Start();
                //         dangerSoundPlayed = true;
                //     }
                //     else
                //     {
                //         StopSound(hallwaydanger);
                //         dangerSoundTimer = null;
                //         dangerSoundPlayed = false;
                //     }
                if (this.camCooldown != null && this.camCooldown.IsFinished())
                {
                        this.cameraopen.setVisible(false);
                        this.camerabuttonactive = 0;
                        this.camCooldown = null;
                        this.monitoropenPlayed = false;
                        // if (animatronics[3].location == 14) // gustavo 5% jumpscare code
                        // {
                        //     console.log("5% jumpscare");
                        //     const random = rng.Next(0, 21);
                        //     if (random == 20)
                        //     {
                        //         jumpscareID = 6;
                        //         switchScreenState(2);
                        //     }
                        // }
                }
                    //Move left or right
                    if (mouse.x > this.width - this.width/3)
                    {
                        if (this.cameraX < 20 + this.width/4 && this.maskbuttonactive == 0) {
                            this.cameraX += delta * 0.70;
                            this.drawChange = true;
                        }
                    }
                    if (mouse.x < this.width/3)
                    {
                        if (this.cameraX > 0 - this.width/4 && this.maskbuttonactive == 0) {
                            this.cameraX -= delta * 0.70;
                            this.drawChange = true;
                        }
                    }
                    // Flashlight control
                    if (this.maskbuttonactive == 0 && this.camerabuttonactive == 0 && this.batterymilliseconds > 0) // only if not using mask and cameras
                    {
                        if (this.keyShift.isDown && this.flashlightstate == 0)
                        {
                            // main hallway
                            this.flashlightstate = 1;
                            this.drawChange = true;
                        }
                        
                        if (mouse.leftButtonDown() && this.flashlightstate == 0) {
                            if (this.rightvent.contains(mouse.x, mouse.y))
                            {
                                this.flashlightstate = 3;
                                this.drawChange = true;
                            }
                            if (this.leftvent.contains(mouse.x, mouse.y))
                            {
                                this.flashlightstate = 2;
                                this.drawChange = true;
                            }
                        }
                        if (mouse.leftButtonDown() == false && this.keyShift.isUp && this.flashlightstate != 0)
                        {
                            this.flashlightstate = 0;
                            this.drawChange = true;
                        }
                    }
                    else if (this.flashlightstate != 0)
                    {
                        this.flashlightstate = 0;
                        this.drawChange = true;
                    }
                    // freddy mask
                    if (this.camerabuttonactive == 0 || this.camerabuttonactive == 3 )
                    {
                        if (this.maskOnCooldown != null) this.maskOnCooldown.Update(delta);
                        if (this.maskrect.contains(mouse.x, mouse.y))
                        {
                            if (this.maskbuttonactive == 0) {
                                this.maskbuttonactive = 1; // initial hover
                                this.freddymask.setVisible(true);
                            }
                            if (this.maskbuttonactive == 1)
                            {
                                if (this.maskonPlayed == false)
                                {
                                    this.maskonPlayed = true;
                                    this.maskon.play();
                                    this.freddymask.anims.play("freddymaskactive", true);
                                    this.maskOnCooldown = new timer(400);
                                    this.maskOnCooldown.Start();
                                }
                            }
                            else if (this.maskbuttonactive == 2)
                            {
                                if (this.maskOffPlayed == false) {
                                    this.maskOffPlayed = true;
                                    this.maskoff.play();
                                    this.freddymask.anims.playReverse("freddymaskactive", true);
                                }
                                this.deepbreaths.stop();
                                this.maskbuttonactive = 3;
                            }
                        }
                        else
                        {
                            if (this.maskbuttonactive == 1)
                            {   
                                if (this.maskOnCooldown.IsFinished())
                                {
                                    this.maskbuttonactive = 2;
                                    this.maskOnCooldown.Reset();
                                }
                                this.deepbreaths.play();
                            }
                            if (this.maskbuttonactive == 3)
                            {
                                if (this.maskCooldown == null)
                                {
                                    this.maskCooldown = new timer(250);
                                    this.maskCooldown.Start();
                                }
                            }
                        }
                    }

                    if (this.maskbuttonactive == 0)
                    {
                            if (this.camerarect.contains(mouse.x, mouse.y))
                            {
                            if (this.camerabuttonactive == 0) {
                                this.camerabuttonactive = 1;
                                this.cameraopen.setVisible(true);
                                this.cameraopen.anims.play('camerabuttonactive', true);
                                this.monitoropen.play();
                                const cameraSwitch = new timer(500);
                                cameraSwitch.finishCallback = () =>
                                {
                                    console.log('switch to cameras');
                                    this.switchScreenState(1);
                                    cameraSwitch.Stop();
                                };
                                cameraSwitch.Start(); // in case the animation fucks up
                                this.timers.push(cameraSwitch);
                            } // initial hover
                            if (this.camerabuttonactive == 1)
                            {
                                if (this.monitoropenPlayed == false)
                                {
                                    if (this.maskOnCooldown != null) this.maskOnCooldown.Stop();
                                    if (this.maskCooldown != null) this.maskCooldown = null;
                                    this.monitoropen.play();
                                    this.monitoropenPlayed = true;
                                }
                            }
                        }
                        else
                        {
                            if (this.camerabuttonactive == 3)
                            {
                                this.cameraopen.anims.playReverse('camerabuttonactive', true);
                                if (this.camCooldown == null)
                                {
                                    this.camCooldown = new timer(250);
                                    this.camCooldown.Start();
                                }
                            }
                        }
                    }
                            // different flashlights in main hallway + vents
        //         if (flashlightstate > 0 && screenState == 0)
        //         {
        //             PlaySound(flashlightbuzz, false);
        //             batterymilliseconds -= delta;
        //             switch (flashlightstate)
        //             {
        //                 case 1:
        //                 office = officeflash;
        //                 let animatronicsIDcount = 0;
        //                 let animatronicscount = 0;
        //                 for (let i = 0; i < animatronics.Length; i++)
        //                 {
        //                     if (animatronics[i].location == 15) // right vent with misa
        //                     {
        //                         if (animatronics[i].Name == "Nasir" || animatronics[i].Name == "Gustavo")animatronicsIDcount += animatronics[i].ID;
        //                         animatronicscount++;

        //                         if (animatronics[i].Name == "Juan") office = officeflashjuan;
        //                         if (animatronics[i].Name == "Ramiro") office = officeflashram;
        //                         if (animatronics[i].Name == "Gustavo") office = officeflashgooch;
        //                         if (animatronics[i].Name == "Nasir") office = officeflashnas; // ALWAYS MAKE SURE HE GOES LAST
        //                         if (animatronicscount > 2 && animatronicsIDcount == 11) office = officeflashnasgooch; // unless they're both in the office lol
        //                     }
        //                     if (animatronics[i].location == 16)
        //                     {
        //                         if (animatronics[i].Name == "Ramiro") office = officeflashramdoor;
        //                     }
        //                 }
        //                 break;
        //                 case 2:
        //                 office = officeleft;
        //                 for (let i = 0; i < animatronics.length; i++)
        //                 {
        //                     if (animatronics[i].location == 13) // right vent with misa
        //                     {
        //                         if (animatronics[i].Name == "Juan") office = officeleftjuan;
        //                         if (animatronics[i].Name == "Carlos") office = officeleftcarlos;
        //                     }
        //                 }
        //                 break;
        //                 case 3:
        //                 office = officeright;
        //                 for (let i = 0; i < animatronics.Length; i++)
        //                 {
        //                     if (animatronics[i].location == 12) // right vent with misa
        //                     {
        //                         if (animatronics[i].Name == "Misa") office = officerightmisa;
        //                         if (animatronics[i].Name == "Gustavo") office = officerightgooch;
        //                     }
        //                 }
                        
        //                 break;
        //             }
            //     }
        //         else
        //         {
        //             office = officemain;
        //             StopSound(flashlightbuzz);
        //         }
        
//         // Night finished
//         if (nightTimer.IsFinished())
//         {
//             pause = true;
//             if (clockChimePlayed == false)
//             {
//                 PlaySound(clockchime, false);
//                 clockChimePlayed = true;
//                 if (yayPlayed == false)
//                 {
//                     yayPlayed = true;
//                     let yayTimer = new Timer(TimeSpan.FromSeconds(3));
//                     yayTimer.playWhenPaused = true;
//                     yayTimer.finishCallback = async () =>
//                     {
//                         PlaySound(yay, false);
//                         yayTimer.Stop();
//                         StopSound(flashlightbuzz);
//                         let changeTimer = new Timer(TimeSpan.FromSeconds(20));
//                         changeTimer.playWhenPaused = true;
//                         changeTimer.finishCallback = async () => {
//                             gameScreen.phoneHasPlayed = false;
//                             if (nightnum == 2) switchScreenState(5); // win screen
//                             if (nightnum == 1)
//                             {
                               
//                                 switchScreenState(3);
//                             }
//                         };
//                         changeTimer.Start();
//                         timers.Add(changeTimer);
//                     };
//                     yayTimer.Start();
//                     timers.Add(yayTimer);
//                 }
                
//             }
//         }
                }
                
//                     for (let i = 0; i < animatronics.length; i++)
//                     {
//                         animatronics[i].Update(delta);
//                         switch (animatronics[i].location) { // play scary ambience when animatronic is nearby
//                             case 14:
//                                 gameScreen.danger+= 0.001;
//                             break;
//                             case 15:
//                                 gameScreen.danger+= 0.001;
//                             break;
//                             case 16:
//                                 gameScreen.danger+= 0.001;
//                             break;
//                             case 4:
//                                 gameScreen.danger+= 0.001;
//                             break;
//                             case 5:
//                                 gameScreen.danger+= 0.001;
//                             break;
//                             case 12:
//                                 gameScreen.danger+= 0.001;
//                             break;
//                             case 13:
//                                 gameScreen.danger+= 0.001;
//                             break;
//                         }
//                     }
//                 }
                // var elapsed = this.nightTimer.ElapsedTime.TotalSeconds; // optimization i guess
                // if      (elapsed < 70)  this.hournum = 0;
                // else if (elapsed < 140) this.hournum = 1;
                // else if (elapsed < 210) this.hournum = 2;
                // else if (elapsed < 280) this.hournum = 3;
                // else if (elapsed < 350) this.hournum = 4;
                // else if (elapsed < 420) this.hournum = 5;
                // else                    this.hournum = 6;
                 for (let i = 0; i < this.timers.length; i++) {
                     this.timers[i].Update(delta);
                 }
//   
//             // battery indicator
//             switch (true)
//             {
//                 case (nightnum == 1):
//                 batteryNumCheck(127000);
//                 break;
//                 case (nightnum == 2):
//                 batteryNumCheck(110000);
//                 break;
//                 case (nightnum == 3):
//                 batteryNumCheck(84000);
//                 break;
//                 case (nightnum == 4):
//                 batteryNumCheck(68000);
//                 break;
//                 case (nightnum >= 5):
//                 batteryNumCheck(51000);
//                 break;
//             }
//         
//
        
//         // for timers that play when the game is paused
//         if (pause == true)
//         {
//             timers.ForEach(t =>
//             {
//                 if (t.playWhenPaused == true)
//                 {
//                     t.Update(delta);
//                 }
//             });
//         }

//         if (musicTimer.IsFinished())
//         {
//             if (jackPlayed == false)
//             {
//                 jackPlayed = true;
//                 let jackTimer = new Timer(TimeSpan.FromSeconds(2));
//                 let jackTimer2 = new Timer(TimeSpan.FromSeconds(rng.Next(2, 3)));
//                 jackTimer2.finishCallback = async () =>
//                 {
//                         jumpscareID = 4;
//                         StopSound(jackinthebox);
//                         switchScreenState(2);
//                 };
//                 timers.Add(jackTimer2);
                    
//                 jackTimer.Start();
//                 jackTimer.finishCallback = async () => {
//                     PlaySound(jackinthebox, false);
//                     jackTimer2.Start();
//                 };
//                 timers.Add(jackTimer);
//                 }
           }
        if (this.drawChange) this.updateDraw();
       }
       updateDraw() {

        this.office.setPosition(-this.cameraX + this.width/2, -this.cameraY + this.height/2);
        this.leftventtex.setPosition(-this.cameraX - 150, -this.cameraY + 430);
        this.rightventtex.setPosition(-this.cameraX + this.width + 150, -this.cameraY + 430);
        this.table.setPosition(-this.cameraX + 610, -this.cameraY + 570);
        if (this.table.anims.isPlaying == false) {
            this.table.anims.play("fanmove");
        }
        switch (this.flashlightstate) {
            case 0:
            this.rightventtex.setTexture('vents3');
            this.leftventtex.setTexture('vents1');
            this.office.setTexture('office');
            break;
            case 1:
            this.office.setTexture('officeflash');
            break;
            case 2:
            this.leftventtex.setTexture('vents2');
            this.office.setTexture('officeleft')
            break;
            case 3:
            this.rightventtex.setTexture('vents4');
            this.office.setTexture('officeright')
            break;
        }
       }
       switchScreenState(num)
        {
        switch (num)
        {
            case 0:
            // if (phoneHasPlayed == false)
            // {
            //     switch(nightnum)
            //         {
            //             case 1:
            //             PlaySound(gameScreen.phoneguy);
            //             break;
            //             case 2:
            //             PlaySound(gameScreen.phoneguy2);
            //             break;
            //         }
            //        gameScreen.phoneHasPlayed = true; 
            //        gameScreen.phonePlaying = true;
            // } 
            this.cameraX = this.oldcameraX;
            this.cameraY = this.oldcameraY;
            this.screens[1].animatronicForceOff = false;
            // if (screenState != 3) PauseSoundAsync(windsound);
            // if (screenState != 3) StopSound(cameraScreen.cameraAmbience);
            // if (screenState != 3) StopSound(garble);
            // PlaySound(fannoise, true);
            console.log('switch to gamescreen');
            this.screens[1].scene.switch('gameScreen');
            break;
            case 1:
            this.cameraX = this.oldcameraX;
            this.cameraY = this.oldcameraY;
            this.cameraX = 0;
            this.cameraY = 0;
            this.screens[1].switchStatic = true;
            // this.screens[1].background = stage;
            // PlaySound(fannoise, true);
            // PlaySound(cameraScreen.cameraAmbience, true);
            // if (cameraScreen.cameraspot == 10 && musicTimer.ElapsedTime > TimeSpan.Zero) PlaySound(windsound, true);
            this.screens[1].scene.start();
            break;
            case 2:
            // Console.WriteLine("Jumpscared by: "+ jumpscareID);
            // StopSound(garble);
            // StopSound(fannoise);
            // StopSound(cameraScreen.cameraAmbience);
            // StopSound(gameScreen.hallwaydanger);
            // StopSound(gameScreen.deepbreaths);
            // PlaySound(jumpscaresound, false);
            // if (gameScreen.phonePlaying)
            // {
            //     switch (nightnum)
            //         {
            //             case 1:
            //             StopSound(gameScreen.phoneguy);
            //             break;
            //             case 2:
            //             StopSound(gameScreen.phoneguy2);
            //             break;
            //         }
            // }
            // gameScreen.phoneHasPlayed = false;
            // Timer timer = new Timer(TimeSpan.FromSeconds(2));
            // timer.playWhenPaused = true;
            // timer.finishCallback = async () =>
            // {
            //     StopSound(jumpscaresound);
            //     switchScreenState(4);
            // };
            // timer.Start();
            // timers.Add(timer);
            // StopSound(windsound);
            break;
            case 3:
            // menuScreen.nightOpen = false;
            // menuScreen.switchStatic = 16;
            // menuScreen.nightOpenTimer = new RamirosWeb.Timer(TimeSpan.FromSeconds(3));
            // menuScreen.nightOpenTimer.finishCallback = () => { // start night
            //     StopSound(blip);
            //     nightTimer = new RamirosWeb.Timer(TimeSpan.FromSeconds(420)); // 7 minute night
            //     nightTimer.Start();
            //     timers.Add(nightTimer);
            //     menuScreen.nightOpenTimer = null;
            //     switchScreenState(0);
            // };
            
            // PlaySound(menuScreen.menuMusic, true);
            // setUpGame();
            break;
            case 4:
            // StopSound(jackinthebox);
            // PlaySound(menuScreen.menuMusic, false);
            // gameOverScreen.changeTimer = new RamirosWeb.Timer(TimeSpan.FromSeconds(7));
            // gameOverScreen.changeTimer.finishCallback = async () => {
            //     switchScreenState(3);
            // }; 
            // gameOverScreen.changeTimer.Start();
            break;
            case 5:
            // StopSound(garble);
            // StopSound(fannoise);
            // StopSound(flashlightbuzz);
            // StopSound(cameraScreen.cameraAmbience);
            // StopSound(jackinthebox);
            // StopSound(gameScreen.hallwaydanger);
            // StopSound(gameScreen.deepbreaths);
            // PlaySound(winScreen.winmusic, false);
            // winScreen.changeTimer = new RamirosWeb.Timer(TimeSpan.FromMilliseconds(11500));
            // winScreen.changeTimer.finishCallback = async () => {
            //     StopSound(winScreen.winmusic);
            //     switchScreenState(3);
            // }; 
            // winScreen.changeTimer.Start();
            break;
        }
        this.screenState = num;
    }
}