import Phaser from "phaser";
import menuScreen from './menuScreen.js';
import gameOverScreen from './gameOverScreen.js';
import cameraScreen from './cameraScreen.js';
import winScreen from './winScreen.js';
import Animatronic from './animatronic.js';
import timer from './timer.js';

const { Rectangle, Circle, Point } = Phaser.Geom; 
const { Intersects } = Phaser.Geom;

const debug = true; // CHANGE HERE
const web = false; // always change this for web builds
let maskonPlayed = false;
let monitoropenPlayed = false;
let batterymilliseconds;
let batterynum = 4;
let width = 1024;
let height = 768;
let fullscreenWidth;
let fullscreenHeight;
let flashlightstate = 0;
    // 0: off
    // 1: main
    // 2: left
    // 3: right
let pause = false;
let cameraX = 0;
let cameraY = 0;
let oldcameraX = 0;
let oldcameraY = 0;
let updateframe = 0;
let tableframe = 0;
let freddymaskframe = 0;
let maskbuttonactive = 0;
let camerabuttonactive = 0;
let cameraframe = 0;
let timers = [];
let maskCooldown;
let camCooldown;
let nightTimer;
let hournum = 0; // 12 = 0, 6 = 6,
let nightnum = 2; // night 1-6
let screenState = 3; // 0: game, 1: camera 2: jumpscare 3: main menu 4: game over 5: win screen
let triangleflash = 0;
let musicTimer;
let jumpscareID;
let musicMilliseconds = 60000;
let jumpscareScale = 0;
    // 6 am
let clockchimefade = 0;
let nightendframe = 0;
let nightendframesplayed = false;
let leftvent;
let rightvent;
let maskrect;
let camerarect;
const animatronics = [];
export default class gameScreen extends Phaser.Scene {
  // The three methods currently empty
  
  preload() {
        leftvent = new Rectangle(-cameraX - 160, -cameraY + 350, 60, 90);
        rightvent = new Rectangle(-cameraX + width+150, -cameraY + 350, 60, 90);
        maskrect = new Rectangle(10, height-40, 500, 40);
        camerarect = new Rectangle(510, height-40, 500, 40);
        animatronics[0] = new Animatronic(this, "Misa"); // Misa animatronic
        animatronics[1] = new Animatronic(this, "Juan"); // Juan animatronic
        animatronics[2] = new Animatronic(this, "Ramiro"); // Ramiro animatronic 
        animatronics[3] = new Animatronic(this, "Gustavo");
        animatronics[4] = new Animatronic(this, "Carlos");
        animatronics[5] = new Animatronic(this, "Nasir");
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
  }
  create() {
    this.add.image(width - (1024/2), height - (768/2), 'office');
  }
  update(time, delta) {
            // mask
                if (maskCooldown != null)
                {
                    maskCooldown.Update(delta);
                }

                if (maskCooldown != null && maskCooldown.IsFinished())
                {
                        maskbuttonactive = 0;
                        maskCooldown = null;
                        maskonPlayed = false;
                }
                // cam
                if (camCooldown != null)
                {
                    camCooldown.Update(delta);
                }

                if (camCooldown != null && camCooldown.IsFinished())
                {
                        camerabuttonactive = 0;
                        camCooldown = null;
                        monitoropenPlayed = false;
                        if (animatronics[3].location == 14) // gustavo 5% jumpscare code
                        {
                            console.log("5% jumpscare");
                            const random = rng.Next(0, 21);
                            if (random == 20)
                            {
                                jumpscareID = 6;
                                switchScreenState(2);
                            }
                        }
                }
                // Unpaused/main game
                if (pause == false) {
                    for (let i = 0; i < animatronics.length; i++)
                    {
                        animatronics[i].Update(delta);
                        switch (animatronics[i].location) { // play scary ambience when animatronic is nearby
                            case 14:
                                gameScreen.danger+= 0.001;
                            break;
                            case 15:
                                gameScreen.danger+= 0.001;
                            break;
                            case 16:
                                gameScreen.danger+= 0.001;
                            break;
                            case 4:
                                gameScreen.danger+= 0.001;
                            break;
                            case 5:
                                gameScreen.danger+= 0.001;
                            break;
                            case 12:
                                gameScreen.danger+= 0.001;
                            break;
                            case 13:
                                gameScreen.danger+= 0.001;
                            break;
                        }
                    }
                }
                var elapsed = nightTimer.ElapsedTime.TotalSeconds; // optimization i guess
                if      (elapsed < 70)  hournum = 0;
                else if (elapsed < 140) hournum = 1;
                else if (elapsed < 210) hournum = 2;
                else if (elapsed < 280) hournum = 3;
                else if (elapsed < 350) hournum = 4;
                else if (elapsed < 420) hournum = 5;
                else                    hournum = 6;
                for (let i = 0; i < timers.length; i++) {
                    timers[i].Update(delta);
                }
        // different flashlights in main hallway + vents
        if (flashlightstate > 0 && screenState == 0)
        {
            PlaySound(flashlightbuzz, false);
            batterymilliseconds -= delta;
            switch (flashlightstate)
            {
                case 1:
                office = officeflash;
                let animatronicsIDcount = 0;
                let animatronicscount = 0;
                for (let i = 0; i < animatronics.Length; i++)
                {
                    if (animatronics[i].location == 15) // right vent with misa
                    {
                        if (animatronics[i].Name == "Nasir" || animatronics[i].Name == "Gustavo")animatronicsIDcount += animatronics[i].ID;
                        animatronicscount++;

                        if (animatronics[i].Name == "Juan") office = officeflashjuan;
                        if (animatronics[i].Name == "Ramiro") office = officeflashram;
                        if (animatronics[i].Name == "Gustavo") office = officeflashgooch;
                        if (animatronics[i].Name == "Nasir") office = officeflashnas; // ALWAYS MAKE SURE HE GOES LAST
                        if (animatronicscount > 2 && animatronicsIDcount == 11) office = officeflashnasgooch; // unless they're both in the office lol
                    }
                    if (animatronics[i].location == 16)
                    {
                        if (animatronics[i].Name == "Ramiro") office = officeflashramdoor;
                    }
                }
                break;
                case 2:
                office = officeleft;
                for (let i = 0; i < animatronics.length; i++)
                {
                    if (animatronics[i].location == 13) // right vent with misa
                    {
                        if (animatronics[i].Name == "Juan") office = officeleftjuan;
                        if (animatronics[i].Name == "Carlos") office = officeleftcarlos;
                    }
                }
                break;
                case 3:
                office = officeright;
                for (let i = 0; i < animatronics.Length; i++)
                {
                    if (animatronics[i].location == 12) // right vent with misa
                    {
                        if (animatronics[i].Name == "Misa") office = officerightmisa;
                        if (animatronics[i].Name == "Gustavo") office = officerightgooch;
                    }
                }
                
                break;
            }

            // battery indicator
            switch (true)
            {
                case (nightnum == 1):
                batteryNumCheck(127000);
                break;
                case (nightnum == 2):
                batteryNumCheck(110000);
                break;
                case (nightnum == 3):
                batteryNumCheck(84000);
                break;
                case (nightnum == 4):
                batteryNumCheck(68000);
                break;
                case (nightnum >= 5):
                batteryNumCheck(51000);
                break;
            }
        }
        else
        {
            office = officemain;
            StopSound(flashlightbuzz);
        }
        // original behaviour: integer division of delta by 16.  this
        // means `updateframe` increases by 1 for every ~16ms of elapsed time.
        // it can temporarily fall behind when frame rate spikes, but that’s fine
        // for the simple animations here.
        // accumulate time in units of ~16ms (one frame at 60fps).  the
        // old integer division threw away any remainder, so on fast updates
        // `updateframe` would stay at 0 for hundreds of cycles and animations
        // appeared frozen unless something (like the camera switch timer)
        // produced a big spike.  now we keep the fractional part and subtract
        // exactly two units when the animation step runs.
        updateframe += delta / 16.0;

        if (tableframe == 3)
        {
            tableframe = 0;
        }
        if (updateframe >= 2.0)
        {
            // consume the two units we just used and keep any leftover
            updateframe -= 2.0;
            tableframe++;
            // camera and mask frames are updated separately below so that the
            // very first hover/interact is responsive; we used to piggyback them
            // on the updateframe threshold which meant they could stall for one
            // or two ticks when you opened the game.

            if (screenState == 1) // camera animations (static noise etc)
            {
                if (cameraScreen.staticanimationframe >= 5)
                {
                    cameraScreen.staticanimationframe = 0;
                }
                else if (cameraScreen.staticanimationframe < 5)
                {
                    cameraScreen.staticanimationframe++;
                }

                if (cameraScreen.switchstaticframe >= 5)
                {
                    cameraScreen.switchstaticframe = 0;
                    cameraScreen.switchStatic = false;
                }
                else if (cameraScreen.switchstaticframe < 5)
                {
                    cameraScreen.switchstaticframe++;
                }
            } 
            if (nightTimer != null)
            {
                if (nightTimer.IsFinished() && clockchimefade >= 1 && nightendframesplayed == false)
                    {
                        if (nightendframe >= 11)
                        {
                            nightendframesplayed = true;
                        }
                        else if (nightendframe < 11)
                        {
                            nightendframe++;
                        }
                    }    
            }
        }

        // throttle interactive animations using separate accumulator
        interactionAccumulator += delta;
        if (interactionAccumulator >= interactionInterval)
        {
            interactionAccumulator -= interactionInterval;
            if (freddymaskframe <= 8)
            {
                if (maskbuttonactive == 1 || maskbuttonactive == 2) // put on mask + mask on
                {
                    if (freddymaskframe < 8)
                    {
                        freddymaskframe++;
                    }
                }
                else if (maskbuttonactive == 3 || maskbuttonactive == 0) // mask off
                {
                    if (freddymaskframe >= 0)
                    {
                        freddymaskframe--;
                    }
                }
            }
            if (cameraframe <= 8)
            {
                if (camerabuttonactive == 1 || camerabuttonactive == 2) // hovering/opening
                {
                    if (cameraframe < 8)
                    {
                        cameraframe++;
                    }
                    if (cameraframe == 8 && screenState == 0) switchScreenState(1);
                }
                else if (camerabuttonactive == 3 || camerabuttonactive == 0) // closing/idle
                {
                    if (cameraframe >= 0 && screenState == 0)
                    {
                        cameraframe--;
                    }
                }
            }
        }   
        // Night finished
        if (nightTimer.IsFinished())
        {
            pause = true;
            if (clockChimePlayed == false)
            {
                PlaySound(clockchime, false);
                clockChimePlayed = true;
                if (yayPlayed == false)
                {
                    yayPlayed = true;
                    let yayTimer = new Timer(TimeSpan.FromSeconds(3));
                    yayTimer.playWhenPaused = true;
                    yayTimer.finishCallback = async () =>
                    {
                        PlaySound(yay, false);
                        yayTimer.Stop();
                        StopSound(flashlightbuzz);
                        let changeTimer = new Timer(TimeSpan.FromSeconds(20));
                        changeTimer.playWhenPaused = true;
                        changeTimer.finishCallback = async () => {
                            gameScreen.phoneHasPlayed = false;
                            if (nightnum == 2) switchScreenState(5); // win screen
                            if (nightnum == 1)
                            {
                               
                                switchScreenState(3);
                            }
                        };
                        changeTimer.Start();
                        timers.Add(changeTimer);
                    };
                    yayTimer.Start();
                    timers.Add(yayTimer);
                }
                
            }
        }
        
        // for timers that play when the game is paused
        if (pause == true)
        {
            timers.ForEach(t =>
            {
                if (t.playWhenPaused == true)
                {
                    t.Update(delta);
                }
            });
        }

        if (musicTimer.IsFinished())
        {
            if (jackPlayed == false)
            {
                jackPlayed = true;
                let jackTimer = new Timer(TimeSpan.FromSeconds(2));
                let jackTimer2 = new Timer(TimeSpan.FromSeconds(rng.Next(2, 3)));
                jackTimer2.finishCallback = async () =>
                {
                        jumpscareID = 4;
                        StopSound(jackinthebox);
                        switchScreenState(2);
                };
                timers.Add(jackTimer2);
                    
                jackTimer.Start();
                jackTimer.finishCallback = async () => {
                    PlaySound(jackinthebox, false);
                    jackTimer2.Start();
                };
                timers.Add(jackTimer);
                }
                }
    }
}