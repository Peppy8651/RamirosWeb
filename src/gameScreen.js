import Phaser from "phaser";
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
    this.screenState = 3; // 0: game, 1: camera 2: jumpscare 3: main menu 4: game over 5: win screen
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
    this.clockChimePlayed = false;
    this.yayPlayed = false;
    this.jackPlayed = false;
    this.stare = false;
    this.dangerSoundTimer;
    this.animatronics[0] = new Animatronic(this, "Misa"); // Misa animatronic
    this.animatronics[1] = new Animatronic(this, "Juan"); // Juan animatronic
    this.animatronics[2] = new Animatronic(this, "Ramiro"); // Ramiro animatronic 
    this.animatronics[3] = new Animatronic(this, "Gustavo");
    this.animatronics[4] = new Animatronic(this, "Carlos");
    this.animatronics[5] = new Animatronic(this, "Nasir");
    this.animatronics[6] = new Animatronic(this, "Darien");
    this.animatronics[7] = new Animatronic(this, "Marlon");
  }
  preload() {
        this.leftvent = new Rectangle(-this.cameraX + 75, -this.cameraY + 385, 60, 90);
        this.rightvent = new Rectangle(-this.cameraX + this.width - 160, -this.cameraY + 385, 60, 90);
        this.maskrect = new Rectangle(10, this.height-60, 500, 40);
        this.camerarect = new Rectangle(510, this.height-60, 500, 40);
        this.musicTimer = new timer(this.musicMilliseconds);   
        this.musicTimer.Start();
        this.timers.push(this.musicTimer);

        this.load.setBaseURL('');
        this.load.setPath('');
        this.load.image("office", "/images/office.png");
        this.load.image("officeflash", "/images/officeflash.png");
        this.load.image("officeleft", "/images/officeleft.png");
        this.load.image("officeleftcarlos", "/images/officeleftcarlos.png");
        this.load.image("officeright", "/images/officeright.png");

        const sounds = [
            "buzzlight", "fansound", "clockchime", "yay", "open", 
            "close", "wind", "windup", "jackinthebox", 
            "jumpscare", "stare", "garble", "carlos1", "carlos2", "carlos3",
            "maskon", "ventwalk", "metalwalk", "maskoff", 'cameras'
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
        this.load.image('flashlighttex', '/images/cameras/flashlighttex.png');

        for (let i = 1; i <= 4; i++) this.load.image(`table${i}`, `/images/table/${i}.png`);
        for (let i = 1; i <= 4; i++) this.load.image(`vents${i}`, `/images/ventlights/${i}.png`);
        for (let i = 1; i <6; i++) this.load.image(`battery${i}`, `/images/battery/${i}.png`);
        for (let i = 1; i < 10; i++) this.load.image(`freddymask${i}`, `/images/freddymask/${i}.png`);
        for (let i = 0; i <= 9; i++) this.load.image(`num${i}`, `/images/clock/numbers/${i}.png`);
        for (let i = 1; i <= 9; i++) this.load.image(`monitor${i}`, `/images/monitoropen/${i}.png`);
        for (let i = 1; i <= 21; i++) this.load.image(`box${i}`, `/images/cameras/box/${i}.png`);

        for (let i = 1; i <= 12; i++) {
            this.load.image(`cam${i}`, `/images/cameras/cam${i}.png`);
            this.load.image(`camName${i}`, `/images/cameras/names/${i}.png`);
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


        for (let i = 1; i <= 6; i++) {
            this.load.image(`darienstatic${i}`, `/images/cameras/darienstatic/${i}.png`);
        }

        this.load.image("stagefull", "/images/cameras/locations/stagefull.png");
        this.load.image("partyroom3misa", "/images/cameras/locations/flashlight/partyroom3misa.png");
        this.load.image('partyroom3marlonflash', "/images/cameras/locations/flashlight/partyroom3marlon.png");
        this.load.image('partyroom3marlon', "/images/cameras/locations/partyroom3marlon.png");
        this.load.image("partyroom2misa", "/images/cameras/locations/flashlight/partyroom2misa.png");
        this.load.image("partyroom4misa", "/images/cameras/locations/partyroom4misa.png");
        this.load.image("partyroom4misaflash", "/images/cameras/locations/flashlight/partyroom4misa.png");
        this.load.image('partyroom4darienflash', "/images/cameras/locations/flashlight/partyroom4darien.png");
        this.load.image('partyroom2darienflash', "/images/cameras/locations/flashlight/partyroom2darien.png");
        this.load.image('partyroom4darien', "/images/cameras/locations/partyroom4darien.png");
        this.load.image('partyroom2darien', "/images/cameras/locations/partyroom2darien.png");
        this.load.image("rightventmisa", "/images/cameras/locations/flashlight/rightventmisa.png");
        this.load.image('rightventdarien', "/images/cameras/locations/flashlight/rightventdarien.png");
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
        this.load.image('mainhallmarlonflash', "/images/cameras/locations/flashlight/mainhallmarlon.png");
        this.load.image("officeflashjuan", "/images/officeflashjuan.png");
        this.load.image("officeflashram", "/images/officeflashram.png");
        this.load.image("officeflashnas", "/images/officeflashnas.png");
        this.load.image("officeflashmarlon", '/images/officeflashmarlon.png');
        this.load.image("officeflashmarlondoor", '/images/officeflashmarlondoor.png');
        this.load.image("officeflashnasgooch", "/images/officeflashnasgooch.png");
        this.load.image("officeflashramdoor", "/images/officeflashramdoor.png");
        this.load.image("partsflashnas", "/images/cameras/locations/flashlight/partsnas.png");
        this.load.image('partsflashdarien', "/images/cameras/locations/flashlight/partsdarien.png");
        this.load.image('partsflashdarienmarlon', "/images/cameras/locations/flashlight/partsdarienmarlon.png");
        this.load.image('partsflashmarlon', "/images/cameras/locations/flashlight/partsmarlon.png");
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
        this.load.image("marlonoffice", '/images/marlonoffice.png');
        this.load.image("marlonjump", '/images/marlonjump.png');
        this.load.image("darien", '/images/darien.png');
        this.load.image("dariensoftjump", '/images/cameras/darien.png');
        this.load.image("darienaura", '/images/darienaura.png');
        this.load.image("darienjump", '/images/darienjump.png');
        this.load.image('darienprizecorner', '/images/cameras/darienprizecorner.png');
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
    this.carlos = this.add.image(-this.cameraX + 100 + 190, -this.cameraY + 225 + 221, 'carlos').setVisible(false);
    this.marlon = this.add.image(-this.cameraX + 350, -this.cameraY + 250, 'marlonoffice').setVisible(false);
    this.darien = this.add.image(-this.cameraX + 400 + 123, -this.cameraY + 200 + 265, 'darien').setVisible(false);
    this.darienaura = this.add.image(-this.cameraX + 400 - 140, -this.cameraY + 200 - 140, 'darienaura').setVisible(false);
    this.darienaura.setAlpha(0.25);
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
    this.ramiro = this.add.image(-this.cameraX + 250 + 219, -this.cameraY + 170 + 369, 'ramiro').setVisible(false);
    this.gooch = this.add.image(-this.cameraX + 250 + 135, -this.cameraY - 120 + 159, 'goochdesk').setVisible(false);
    this.misa = this.add.image(this.animatronics[0].x, this.animatronics[0].y, 'misaoffice').setVisible(false);
    this.stareRectangle = this.add.graphics({ fillStyle: { color: 0x000000 } });
    this.stareRectangle.setAlpha(0); // Start fully transparent
    let coverScreen = new Phaser.Geom.Rectangle(0, 0, this.game.config.width, this.game.config.height);
    this.stareRectangle.fillRectShape(coverScreen);
    this.battery = this.add.image(80, 60, "battery5");
    this.night = this.add.image(this.width - 125, 50, "night");
    this.nightNumShow = this.add.image(this.width - 50, 50, "num" + this.nightnum);
    // this.numberUI = this.add.image("", width - 65, 25);
    this.am = this.add.image(this.width - 60, 90, "am");
    this.hourNumShow = this.add.image(this.width - 120, 90, "num" + 1);
    this.hourNumShow2 = this.add.image(this.width - 100, 90, "num" + 2);
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
    this.dangerSound = this.sound.add("scaryambience");
    this.fanSound = this.sound.add("fansound");
    this.stareSound = this.sound.add("stare");
    this.clockchime = this.sound.add('clockchime');
    this.yay = this.sound.add('yay');
    this.jackinthebox = this.sound.add('jackinthebox');
    this.jumpscare = this.sound.add('jumpscare');
    this.metalwalk = this.sound.add('metalwalk');
    this.garble = this.sound.add('garble');
    this.ventwalk = this.sound.add('ventwalk');
    this.carlos1 = this.sound.add('carlos1');
    this.carlos2 = this.sound.add('carlos2');
    this.carlos3 = this.sound.add('carlos3');

    // phone guy
    this.phoneguy1 = this.sound.add('misael');
    this.phoneguy2 = this.sound.add('misael2');
    this.mutecall = this.add.image(this.muteCallButton.x + 45, this.muteCallButton.y + 10, "mutecall");

    this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.keyPlus = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS);
    this.cursorKeys = this.input.keyboard.createCursorKeys(); // Helper for arrow keys, space, and shift
     // for fade out
    this.blackRectangle = this.add.graphics({ fillStyle: { color: 0x000000 } });
    this.blackRectangle.setAlpha(0); // Start fully transparent
    this.blackRectangle.fillRectShape(coverScreen);
    this.sixamnum = this.add.sprite(1024/2 - 120, 768/2, 'nightEnd1');
    this.sixamnum.anims.create({
        key: "sixam",
        frameRate: 5,
        frames: [
        { key: 'nightEnd1' },
        { key: 'nightEnd2' },
        { key: 'nightEnd3' },
        { key: 'nightEnd4' },
        { key: 'nightEnd5' },
        { key: 'nightEnd6' },
        { key: 'nightEnd7' },
        { key: 'nightEnd8' },
        { key: 'nightEnd9' },
        { key: 'nightEnd10' },
        { key: 'nightEnd11' },
        ],
    });
    this.sixamnum.setVisible(false);
    this.sixamletters = this.add.image(1024/2 + 60, 768/2, 'sixam');
    this.sixamletters.setVisible(false);
    this.yellowtriangle = this.add.image(1024 - 75, 768 - 110, "yellowtriangle");
    this.yellowtriangle.setVisible(false);
    this.yellowtriangle.setAlpha(0);
    this.jumpscaretex = this.add.image(0, 0, 'ryan').setVisible(false);
    this.fpsText = document.getElementById("fps");

  }
  update(time, delta) {
        this.fpsText.innerHTML = 'FPS: ' + Math.floor(this.game.loop.actualFps);
        var mouse = this.input.activePointer;
        this.drawChange = false;
        if (this.keyPlus.isDown) {
            this.nightTimer.AddTime(10000);
        }
//                 // Unpaused/main game
        if (this.pause == false) {
            // sounds
            if (this.fanSound.isPlaying == false) {
                this.fanSound.play();
            }

            if (this.screenState == 2) {
                if (this.jumpscaretex.visible == false) this.jumpscaretex.setVisible(true);
                switch (this.jumpscareID) {
                    case 1:
                    if (this.jumpscaretex.texture.key != 'misaoffice') this.jumpscaretex.setTexture('misaoffice');
                    if (this.jumpscareScale < 1) this.jumpscareScale += 0.2;
                    this.jumpscaretex.setPosition(50 + (this.jumpscaretex.width/2), 50 + (this.jumpscaretex.height/2));
                    this.jumpscaretex.setDisplaySize(this.jumpscaretex.width * this.jumpscareScale, this.jumpscaretex.height * this.jumpscareScale);
                    break;
                    case 2:
                    if (this.jumpscaretex.texture.key != 'juanjumpscare') this.jumpscaretex.setTexture('juanjumpscare');
                    if (this.jumpscareScale < 1) this.jumpscareScale += 0.15;
                    this.jumpscaretex.setPosition(-100 + (this.jumpscaretex.width/2), -250 + (this.jumpscaretex.height/2));
                    this.jumpscaretex.setDisplaySize(this.jumpscaretex.width * this.jumpscareScale, this.jumpscaretex.height * this.jumpscareScale);
                    break;
                    case 3:
                        // it's not actually yoltzin it's ramiro
                    if (this.jumpscaretex.texture.key != 'yoltzin') this.jumpscaretex.setTexture('yoltzin');
                    if (this.jumpscareScale < 1.3) this.jumpscareScale += 0.2;
                    this.jumpscaretex.setPosition(100 + (this.jumpscaretex.width/2), 0 + (this.jumpscaretex.height/2));
                    this.jumpscaretex.setDisplaySize(this.jumpscaretex.width * this.jumpscareScale, this.jumpscaretex.height * this.jumpscareScale);
                    break;
                    case 4:
                    if (this.jumpscaretex.texture.key != 'ryan') this.jumpscaretex.setTexture('ryan');
                    if (this.jumpscareScale < 1.3) this.jumpscareScale += 0.2;
                    this.jumpscaretex.setPosition(100 + (this.jumpscaretex.width/2), 0 + (this.jumpscaretex.height/2));
                    this.jumpscaretex.setDisplaySize(this.jumpscaretex.width * this.jumpscareScale, this.jumpscaretex.height * this.jumpscareScale);
                    break;
                    case 5:
                    if (this.jumpscaretex.texture.key != 'nasir') this.jumpscaretex.setTexture('nasir');
                    if (this.jumpscareScale < 2) this.jumpscareScale += 0.3;
                    this.jumpscaretex.setPosition(300 + (this.jumpscaretex.width/2), 50 + (this.jumpscaretex.height/2));
                    this.jumpscaretex.setDisplaySize(this.jumpscaretex.width * this.jumpscareScale, this.jumpscaretex.height * this.jumpscareScale);
                    break;
                    case 6:
                    if (this.jumpscaretex.texture.key != 'spookygooch') this.jumpscaretex.setTexture('spookygooch');
                    if (this.jumpscareScale < 0.75) this.jumpscareScale += 0.2;
                    this.jumpscaretex.setPosition(50 + (this.jumpscaretex.width/2), -600 + (this.jumpscaretex.height/2));
                    this.jumpscaretex.setDisplaySize(this.jumpscaretex.width * this.jumpscareScale, this.jumpscaretex.height * this.jumpscareScale);
                    break;
                    case 8:
                    if (this.jumpscaretex.texture.key != 'darienjump') this.jumpscaretex.setTexture('darienjump');
                    if (this.jumpscareScale < 1) this.jumpscareScale += 0.2;
                    this.jumpscaretex.setPosition(50 + (this.jumpscaretex.width/2), -200 + (this.jumpscaretex.height/2));
                    this.jumpscaretex.setDisplaySize(this.jumpscaretex.width * this.jumpscareScale, this.jumpscaretex.height * this.jumpscareScale);
                    break;
                    case 9:
                    if (this.jumpscaretex.texture.key != 'marlonjump') this.jumpscaretex.setTexture('marlonjump');
                    if (this.jumpscareScale < 1) this.jumpscareScale += 0.2;
                    this.jumpscaretex.setPosition(100 + (this.jumpscaretex.width/2), 0 + (this.jumpscaretex.height/2));
                    this.jumpscaretex.setDisplaySize(this.jumpscaretex.width * this.jumpscareScale, this.jumpscaretex.height * this.jumpscareScale);
                    break;
                }
                
            }
            
            if (this.screens[1].darienInterruptWait != null && this.screens[1].darienInterruptWait.IsFinished() == false) {
                        this.screens[1].darienInterruptWait.Update(delta);
                    }
            if (this.danger > 0)
                    {
                        if (this.dangerSound.isPlaying == false) {
                            console.log('danger played');
                            this.dangerSound.play();
                        }
                    }
                    else
                    {
                        if (this.dangerSound.isPlaying) {
                            console.log('danger stopped');
                            this.dangerSound.stop();
                        }
                    }
            if (this.phoneHasPlayed == false) {
                this.phoneHasPlayed = true;
                console.log('phone played');
                switch (this.nightnum) {
                    case 1:
                        this.phoneguy1.play();
                    break;
                    case 2:
                        this.phoneguy2.play();
                    break;
                }
            }
            else {
                if (this.muteCallButton.contains(mouse.x + 15, mouse.y) && mouse.leftButtonDown()) {
                    switch (this.nightnum) {
                        case 1:
                            if (this.phoneguy1.isPlaying) this.phoneguy1.stop();
                        break;
                        case 2:
                            if (this.phoneguy2.isPlaying) this.phoneguy2.stop();
                        break;
                    }

                }
            }
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
                if (this.camCooldown != null && this.camerarect.contains(mouse.x,mouse.y) == false)
                {
                        this.camCooldown.Update(delta);
                }
                    
                if (this.camCooldown != null && this.camCooldown.IsFinished())
                {
                        this.cameraopen.setVisible(false);
                        this.camerabuttonactive = 0;
                        this.camCooldown = null;
                        this.monitoropenPlayed = false;
                        if (this.animatronics[3].location == 14) // gustavo 5% jumpscare code
                        {
                            console.log("5% jumpscare");
                            const random = Math.random() * 20;
                            if (random <= 1)
                            {
                                this.jumpscareID = 6;
                                this.switchScreenState(2);
                            }
                        }
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
                    if (this.stare) {
                        if (this.stareRectangle.alpha >= 1) this.stareRectangle.alpha -= 1;
                        this.stareRectangle.alpha += delta * 0.008;
                        if (this.stareSound.isPlaying == false) {
                            console.log('stare played');
                             this.stareSound.play();
                        }
                    }
                    else {
                        if (this.stareRectangle.alpha != 0) this.stareRectangle.alpha = 0;
                        if (this.stareSound.isPlaying) this.stareSound.stop();
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
                    if (this.animatronics[3].location == 14) {
                        if (this.gooch.visible == false) {
                            this.gooch.setVisible(true);
                            this.drawChange = true;
                        }
                    }
                    else {
                        if (this.gooch.visible) {
                            this.gooch.setVisible(false);
                            this.drawChange = true;
                        }
                    }
                    
                    if (this.animatronics[4].location == 14) {
                        if (this.carlos.visible == false) {
                            this.carlos.setVisible(true);
                            this.drawChange = true;
                        }
                    }
                    else {
                        if (this.carlos.visible) {
                            this.carlos.setVisible(false);
                            this.drawChange = true;
                        }
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
                                if (this.screens[1].darienInterruptWait != null && this.screens[1].darienInterruptWait.IsFinished()) this.screens[1].darieninterrupt = false;
                                if (this.screens[1].darienInterruptTimer != null && this.screens[1].darienInterruptTimer.IsFinished()) {
                                    this.screens[1].darienInterruptTimer = null;
                                }
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
                    }
                    if (this.camerabuttonactive == 3) {
                        if (this.camCooldown == null)
                        {
                            this.cameraopen.anims.playReverse('camerabuttonactive', true);
                            this.drawChange = true;
                            this.camCooldown = new timer(250);
                            this.camCooldown.Start();
                        }
                    }
                            // different flashlights in main hallway + vents
                if (this.flashlightstate > 0 && this.screenState == 0)
                {
                    //PlaySound(flashlightbuzz, false);
                    this.batterymilliseconds -= delta;
                }
                else
                {
                    // StopSound(flashlightbuzz);
                }
            }
             for (let i = 0; i < this.timers.length; i++) {
                     this.timers[i].Update(delta);
                 }
            for (let i = 0; i < this.animatronics.length; i++)
                    {
                        this.animatronics[i].update(delta);
                        switch (this.animatronics[i].location) { // play scary ambience when animatronic is nearby
                            case 14:
                                this.danger+= 0.001;
                            break;
                            case 15:
                                this.danger+= 0.001;
                            break;
                            case 16:
                                this.danger+= 0.001;
                            break;
                            case 4:
                                this.danger+= 0.001;
                            break;
                            case 5:
                                this.danger+= 0.001;
                            break;
                            case 12:
                                this.danger+= 0.001;
                            break;
                            case 13:
                                this.danger+= 0.001;
                            break;
                        }
                    }
        }
        var remainingTime = this.musicTimer.RemainingTime();
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
        if (this.nightTimer.IsFinished())
            {
                this.pause = true;
                if (this.clockChimePlayed == false)
                {
                    if (this.screenState == 1) this.scene.bringToTop();
                    this.sixamnum.setAlpha(0);
                    this.sixamnum.setVisible(true);
                    this.sixamletters.setAlpha(0);
                    this.sixamletters.setVisible(true);
                    this.sixamnum.anims.play('sixam');
                    this.clockchime.play();
                    this.clockChimePlayed = true;
                    if (this.yayPlayed == false)
                    {
                        this.yayPlayed = true;
                        let yayTimer = new timer(3000);
                        yayTimer.playWhenPaused = true;
                        yayTimer.finishCallback = async () =>
                        {
                            this.yay.play();
                            yayTimer.Stop();
                            // StopSound(flashlightbuzz);
                            let changeTimer = new timer(10000);
                            changeTimer.playWhenPaused = true;
                            changeTimer.finishCallback = async () => {
                                this.phoneHasPlayed = false;
                                if (this.nightnum == 3) this.switchScreenState(5); // win screen
                                if (this.nightnum == 1 || this.nightnum == 2)
                                {
                                    this.switchScreenState(3);
                                }
                            };
                            changeTimer.Start();
                            this.timers.push(changeTimer);
                        };
                        yayTimer.Start();
                        this.timers.push(yayTimer);
                    }
                    
                }
                if (this.sixamnum.alpha < 1)this.sixamnum.alpha += 0.001 * delta;
                if (this.sixamletters.alpha < 1) this.sixamletters.alpha += 0.001 * delta;
                if (this.blackRectangle.alpha < 1) this.blackRectangle.alpha += 0.001 * delta;

                
            }
                
                    
                var elapsed = this.nightTimer._elapsedTime; // optimization i guess
                if      (elapsed < 70000) this.hournum = 0;
                else if (elapsed < 140000) this.hournum = 1;
                else if (elapsed < 210000) this.hournum = 2;
                else if (elapsed < 280000) this.hournum = 3;
                else if (elapsed < 350000) this.hournum = 4;
                else if (elapsed < 420000) this.hournum = 5;
                else                    this.hournum = 6;
                
//   
            // battery indicator
            switch (true)
            {
                case (this.nightnum == 1):
                this.batteryNumCheck(127000);
                break;
                case (this.nightnum == 2):
                this.batteryNumCheck(110000);
                break;
                case (this.nightnum == 3):
                this.batteryNumCheck(84000);
                break;
                case (this.nightnum == 4):
                this.batteryNumCheck(68000);
                break;
                case (this.nightnum >= 5):
                this.batteryNumCheck(51000);
                break;
            }
//         
//
        
//         // for timers that play when the game is paused
            if (this.pause == true)
            {
                this.timers.forEach(t =>
                {
                    if (t.playWhenPaused == true)
                    {
                        t.Update(delta);
                    }
                });
            }

        if (this.musicTimer.IsFinished())
        {
            if (this.jackPlayed == false)
            {
                this.jackPlayed = true;
                if (this.yellowtriangle.visible) this.yellowtriangle.setVisible(false);
                let jackTimer = new timer(2000);
                let jackTimer2 = new timer(Math.random() < 0.5 ? 2000 : 3000);
                jackTimer2.finishCallback = () =>
                {
                        if (this.jackinthebox.isPlaying) {
                            this.jackinthebox.stop();
                            if (this.jumpscareID == 0) {
                            this.jumpscareID = 4;
                            this.switchScreenState(2);
                            }
                        } 

                };
                jackTimer.Start();
                jackTimer.finishCallback = async () => {
                    if (this.jackinthebox.isPlaying == false) {
                        this.jackinthebox.play();
                        jackTimer = null;
                        jackTimer2.Start();
                        this.timers.push(jackTimer2);
                    }

                };
                this.timers.push(jackTimer);
                }
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
        if (this.animatronics[2].location == 14) {
            if (this.ramiro.visible == false) this.ramiro.setVisible(true);
            this.ramiro.setPosition(-this.cameraX + 250 + 219, -this.cameraY + 170 + 369);
        }
        else {
            if (this.ramiro.visible) this.ramiro.setVisible(false);
        }

        if (this.animatronics[6].location == 14) {
            if (this.darien.visible == false) this.darien.setVisible(true);
            if (this.darienaura.visible == false) this.darienaura.setVisible(true);
            this.darien.setPosition(-this.cameraX + 400 + 123, -this.cameraY + 200 + 265);
            this.darienaura.setPosition(-this.cameraX + 400 - 140 + 261, -this.cameraY + 200 - 140 + 337);
        }
        else {
            if (this.darien.visible) this.darien.setVisible(false);
            if (this.darienaura.visible) this.darienaura.setVisible(false);
        }

        if (this.animatronics[7].location == 14) {
            if (this.marlon.visible == false) this.marlon.setVisible(true);
            this.marlon.setPosition(-this.cameraX + 350 + 100, -this.cameraY + 250 + 263);
        }
        else {
            if (this.marlon.visible) this.marlon.setVisible(false);
        }
        switch (this.flashlightstate) {
            case 0:
            this.rightventtex.setTexture('vents3');
            this.leftventtex.setTexture('vents1');
            this.office.setTexture('office');
            break;
            case 1:
            let animatronicsIDcount = 0;
            let animatronicscount = 0;
            this.office.setTexture('officeflash');
            for (let i = 0; i < this.animatronics.length; i++)
            {
                if (this.animatronics[i].location == 15) // right vent with misa
                {
                    if (this.animatronics[i].Name == "Nasir" || this.animatronics[i].Name == "Gustavo") animatronicsIDcount += this.animatronics[i].ID;
                    animatronicscount++;
                    if (this.animatronics[i].Name == "Juan") this.office.setTexture('officeflashjuan');
                    if (this.animatronics[i].Name == "Ramiro") this.office.setTexture('officeflashram');
                    if (this.animatronics[i].Name == "Gustavo") this.office.setTexture('officeflashgooch');
                    if (this.animatronics[i].Name == "Nasir") this.office.setTexture('officeflashnas'); // ALWAYS MAKE SURE HE GOES LAST
                    if (animatronicscount > 2 && animatronicsIDcount == 11) this.office.setTexture('officeflashnasgooch'); // unless they're both in the office lol
                    if (this.animatronics[i].Name == "Marlon") this.office.setTexture('officeflashmarlon');
                }
                if (this.animatronics[i].location == 16)
                {
                    if (this.animatronics[i].Name == "Ramiro") this.office.setTexture('officeflashramdoor');
                    if (this.animatronics[i].Name == "Marlon") this.office.setTexture('officeflashmarlondoor');
                }
            }
            break;
            case 2:
            this.office.setTexture('officeleft');
            this.leftventtex.setTexture('vents2');
            for (let i = 0; i < this.animatronics.length; i++)
            {
                if (this.animatronics[i].location == 13) // right vent with misa
                {
                    if (this.animatronics[i].Name == "Juan") this.office.setTexture('officeleftjuan');
                    if (this.animatronics[i].Name == "Carlos") this.office.setTexture('officeleftcarlos');
                }
            }
            break;
            case 3:
            this.rightventtex.setTexture('vents4');
            this.office.setTexture('officeright');
            for (let i = 0; i < this.animatronics.length; i++)
            {
                if (this.animatronics[i].location == 12) // right vent with misa
                {
                    if (this.animatronics[i].Name == "Misa") this.office.setTexture('officerightmisa');
                    if (this.animatronics[i].Name == "Gustavo") this.office.setTexture('officerightgooch');
                }
            }
            break;
        }

        if (this.maskbuttonactive > 0 && this.maskbuttonactive < 3 && this.animatronics[0].attacking == 2)
        {
            if (this.misa.visible == false) this.misa.setVisible(true);
            this.misa.setPosition(this.animatronics[0].x + 668, this.animatronics[0].y + 796);
        }
        else {
            if (this.misa.visible) this.misa.setVisible(false);
        }
        this.gooch.setPosition(-this.cameraX + 250 + 135, -this.cameraY - 120 + 159);
        this.carlos.setPosition(-this.cameraX + 100 + 190, -this.cameraY + 225 + 221);
        if (this.battery.texture.key != 'battery' + (this.batterynum+1)) this.battery.setTexture('battery' + (this.batterynum+1));
        if (this.nightNumShow.texture.key != 'num' + (this.nightnum)) this.nightNumShow.setTexture('num' + (this.nightnum));
        if (this.hournum != 0) {
            if (this.hourNumShow.visible) this.hourNumShow.setVisible(false);
            if (this.hourNumShow2.texture.key != 'num' + (this.hournum)) this.hourNumShow2.setTexture('num' + (this.hournum));
        }
        else {
            if (this.hourNumShow.visible == false) this.hourNumShow.setVisible(true);
            if (this.hourNumShow.texture.key != 'num' + (1)) this.hourNumShow.setTexture('num' + (1));
            if (this.hourNumShow2.texture.key != 'num' + (2)) this.hourNumShow2.setTexture('num' + (2));
        }
       if (this.phoneguy1.isPlaying || this.phoneguy2.isPlaying) {
         if (this.mutecall.visible == false) this.mutecall.setVisible(true);
       }
       else {
        if (this.mutecall.visible) this.mutecall.setVisible(false);
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
            let cameraScreen = this.scene.get('cameraScreen');
            this.cameraX = this.oldcameraX;
            this.cameraY = this.oldcameraY;
            cameraScreen.animatronicForceOff = false;
            if (cameraScreen.musicsound != null && cameraScreen.musicsound.isPlaying) cameraScreen.musicsound.stop();
            if (cameraScreen.cameraambience != null && cameraScreen.cameraambience.isPlaying) cameraScreen.cameraambience.stop();
            if (cameraScreen.garble != null && cameraScreen.garble.isPlaying) cameraScreen.garble.stop();
            console.log('switch to gamescreen');
            if (this.screenState == 3) this.screens[0].scene.switch('gameScreen');
            if (this.screenState == 1) this.scene.sleep('cameraScreen');
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
            if (this.scene.isActive('cameraScreen') || this.scene.isSleeping('cameraScreen')) {
                    this.scene.wake('cameraScreen');
                } else {
                    this.scene.launch('cameraScreen');
                }            
            this.scene.bringToTop('cameraScreen');
            break;
            case 2:
            if (this.screenState == 1) this.scene.sleep('cameraScreen');
            console.log("Jumpscared by: "+ this.jumpscareID);
            if (this.jumpscare.isPlaying == false) this.jumpscare.play();
            this.blackRectangle.setAlpha(1);
            // this.jumpscareimg.setVisible(true);
            switch (this.nightnum) {
                case 1:
                    if (this.phoneguy1.isPlaying) this.phoneguy1.stop();
                break;
                case 2:
                    if (this.phoneguy2.isPlaying) this.phoneguy2.stop();
                break;
            }
            let newtimer = new timer(2000);
            newtimer.playWhenPaused = true;
            newtimer.finishCallback = async () =>
            {
                // StopSound(jumpscaresound);
                this.switchScreenState(4);
            };
            newtimer.Start();
            this.timers.push(newtimer);
            let cameraScreen2 = this.scene.get('cameraScreen');
            if (cameraScreen2.musicsound != null && cameraScreen2.musicsound.isPlaying) cameraScreen2.musicsound.stop();
            if (cameraScreen2.cameraambience != null && cameraScreen2.cameraambience.isPlaying) cameraScreen2.cameraambience.stop();
            if (cameraScreen2.garble != null && cameraScreen2.garble.isPlaying) cameraScreen2.garble.stop();
            if (this.stareSound != null && this.stareSound.isPlaying) this.stareSound.stop();
            // StopSound(windsound);
            break;
            case 3:
            let menuScreen = this.scene.get('menuScreen');
            menuScreen.nightOpen = false;
            menuScreen.nightOpenTimer = new timer(3000);
            menuScreen.nightOpenTimer.finishCallback = () => { // start night
               // StopSound(blip);
                this.nightTimer = new timer(420000); // 7 minute night
                this.nightTimer.Start();
                this.timers.push(this.nightTimer);
                menuScreen.nightOpenTimer = null;

                // set up code
                for (let i = 0; i < this.animatronics.length; i++)
                {
                    switch (this.nightnum)
                    {
                        case 1:
                        if (i < 3) {
                        this.animatronics[i].Activate();
                        }
                        break;
                        case 2:
                        if (i < 6)
                        {
                            this.animatronics[i].Activate();
                        }
                        break;
                        case 3:
                        if (this.animatronics[i].Name != "Gustavo") this.animatronics[i].Activate();
                        // make sure to change this here and in setup game after done with night 3
                        break;
                    }
                }

                // set battery milliseconds based on night

                switch (true)
                {
                    case (this.nightnum == 1):
                        this.batterymilliseconds = 127000;
                        break;
                        case (this.nightnum == 2):
                        this.batterymilliseconds = 110000;
                        break;
                        case (this.nightnum == 3):
                        this.batterymilliseconds = 84000;
                        break;
                        case (this.nightnum == 4):
                        this.batterymilliseconds = 68000;
                        break;
                        case (this.gameScreen.nightnum >= 5):
                        this.batterymilliseconds = 51000;
                        break;
                }
                this.switchScreenState(0);
            };
            // PlaySound(menuScreen.menuMusic, true);
            this.setUpGame();
            if (this.screenState == 5) this.screens[4].scene.switch('menuScreen');
            if (this.screenState == 4) this.screens[3].scene.switch('menuScreen');
            if (this.screenState == 0) this.scene.switch('menuScreen');
            break;
            case 4:
            // StopSound(jackinthebox);
            // PlaySound(menuScreen.menuMusic, false);
            let gameOverScreen = this.scene.get('gameOverScreen');
            gameOverScreen.changeTimer = new timer(7000);
            gameOverScreen.changeTimer.finishCallback = async () => {
                    this.switchScreenState(3);
                }; 
            gameOverScreen.changeTimer.Start();
            this.scene.switch('gameOverScreen');
            break;
            case 5:
            // StopSound(garble);
            // StopSound(fannoise);
            // StopSound(flashlightbuzz);
            // StopSound(cameraScreen.cameraAmbience);
            // StopSound(jackinthebox);
            // StopSound(gameScreen.hallwaydanger);
            // StopSound(gameScreen.deepbreaths);
            let winScreen = this.scene.get('winScreen');
            winScreen.changeTimer = new timer(11500);
            winScreen.changeTimer.finishCallback = async () => {
                    winScreen.partyrock.stop();
                    winScreen.blackRectangle.setAlpha(1);
                    this.switchScreenState(3);
                }; 
            winScreen.changeTimer.Start();
            if (this.screenState == 1) {
                let cameraScreen2 = this.scene.get('cameraScreen');
                if (cameraScreen2.musicsound != null && cameraScreen2.musicsound.isPlaying) cameraScreen2.musicsound.stop();
                if (cameraScreen2.cameraambience != null && cameraScreen2.cameraambience.isPlaying) cameraScreen2.cameraambience.stop();
                if (cameraScreen2.garble != null && cameraScreen2.garble.isPlaying) cameraScreen2.garble.stop();
                this.scene.sleep('cameraScreen');
            } 
            this.scene.switch('winScreen');
            break;
        }
        this.screenState = num;
    }
    batteryNumCheck(initialbattery)
    {
                if (this.batterymilliseconds <= (initialbattery * (0.2)))
                {
                        this.batterynum = 0; // invisible bar but there's still battery
                }
                else if (this.batterymilliseconds <= (initialbattery * (0.4)))
                {
                        this.batterynum = 1; // 1 bars left
                }
                else if (this.batterymilliseconds <= (initialbattery * (0.6)))
                {
                        this.batterynum = 2; // 2 bars left
                }
                else if (this.batterymilliseconds <= (initialbattery * (0.8)))
                {
                        this.batterynum = 3; // 3 bars left
                }
    }
    setUpGame()
    {
        this.pause = false;
        this.office.setTexture('office');
        this.leftventtex.setTexture("vents1");
        this.rightventtex.setTexture("vents3");
        this.table.setTexture("table1");
        this.table.anims.stop();
        this.battery.setTexture("battery4");
        this.nightNumShow.setTexture(this.nightnum);
        this.hourNumShow.setTexture("num" + 1);
        this.hourNumShow2.setTexture("num" + 2);
        this.freddymask.setTexture("freddymask1");
        this.freddymask.anims.stop();
        this.gooch.setVisible(false);
        this.ramiro.setVisible(false);
        this.darien.setVisible(false);
        this.darienaura.setVisible(false);
        this.marlon.setVisible(false);
        this.misa.setVisible(false);
        this.cameraopen.setTexture("monitor1");
        this.cameraopen.anims.stop();
        this.freddymask.setVisible(false);
        this.cameraopen.setVisible(false);
        this.blackRectangle.setAlpha(0); // Start fully transparent
        this.sixamnum.setTexture('nightEnd1');
        this.sixamnum.anims.stop();
        this.sixamnum.setAlpha(0);
        this.sixamnum.setVisible(false);
        this.sixamletters.setTexture('sixam');
        this.sixamletters.setAlpha(0);
        this.sixamletters.setVisible(false);
        this.yellowtriangle.setVisible(false);
        this.stareRectangle.setAlpha(0);
        this.animatronics.splice(0, this.animatronics.length);
        this.jumpscaretex.setVisible(false);
        this.animatronics[0] = new Animatronic(this, "Misa"); // Misa animatronic
        this.animatronics[1] = new Animatronic(this, "Juan"); // Juan animatronic
        this.animatronics[2] = new Animatronic(this, "Ramiro"); // Ramiro animatronic 
        this.animatronics[3] = new Animatronic(this, "Gustavo");
        this.animatronics[4] = new Animatronic(this, "Carlos");
        this.animatronics[5] = new Animatronic(this, "Nasir");
        this.animatronics[6] = new Animatronic(this, "Darien");
        this.animatronics[7] = new Animatronic(this, "Marlon");

        this.maskonPlayed = false;
        this.monitoropenPlayed = false;
        this.clockChimePlayed = false;
        this.jackPlayed = false;
        this.phoneHasPlayed = false;
        this.yayPlayed = false;
        this.batterynum = 4;
        this.flashlightstate = 0;
        this.oldcameraX = 0;
        this.oldcameraY = 0;
        this.tableframe = 0;
        this.freddymaskframe = 0;
        this.maskbuttonactive = 0;
        this.stare = false;
        this.camerabuttonactive = 0;
        this.cameraframe =0;
        this.hournum = 0;
        this.jumpscareID = 0;
        this.musicMilliseconds = 60000;
        this.clockchimefade = 0;
        this.nightendframe = 0;
        this.nightendframesplayed = false;
        this.jumpscareScale = 0;
        this.danger = 0;
        this.drawChange = true;
        // menuscreen
        let menuScreen = this.scene.get('menuScreen');
        menuScreen.logo.setVisible(true);
        menuScreen.firstnight.setVisible(false);
        menuScreen.secondnight.setVisible(false);
        menuScreen.newgame.setVisible(true);
        menuScreen.titlepic.setVisible(true);
        menuScreen.static.setVisible(true);
        menuScreen.arrow.setVisible(true);
        menuScreen.arrow.setPosition(1024 / 2 - 450, 768/2 + 50);
        menuScreen.nightPreview.setVisible(false);
        menuScreen.nightOpen = false;
        menuScreen.nightSelection = false;
        menuScreen.fullScreenSelection = false;
        menuScreen.nightSelected = 1;
        menuScreen.optionSelected = 1;
        
        // camera screen
        let cameraScreen = this.scene.get('cameraScreen');
        cameraScreen.drawChange = true;
        cameraScreen.cameraspot = 8;
        // cameraScreen.darienstaticanimationframe = 0;
        cameraScreen.darieninterrupt = false;
        cameraScreen.switchStatic = true;
        cameraScreen.camDir = 1;
        cameraScreen.camFlashOn = false;
        cameraScreen.animatronicForceOff = false;
        cameraScreen.winding = false;
        for (let i = 0; i < cameraScreen.maplocationtextures.length; i++) {
            if (i != 8) {
                if (cameraScreen.maplocationtextures[i].texture.key == 'locationspot') cameraScreen.maplocationtextures[i].setTexture('locationbox');
                if (cameraScreen.locationNameTextures[i].visible) cameraScreen.locationNameTextures[i].setVisible(false);
            }
        }
        if (cameraScreen.maplocationtextures.length != 0) {
            cameraScreen.maplocationtextures[8].setTexture('locationspot');
            cameraScreen.locationNameTextures[8].setVisible(true);
        }

        // reset timers
        this.timers.splice(0, this.timers.length); // clear timers
        menuScreen.nightOpenTimer.Reset();
        // gameOverScreen.changeTimer.Reset();
        this.nightTimer.Reset();
        if (this.camCooldown != null) this.camCooldown.Reset();
        if (this.maskCooldown != null) this.maskCooldown.Reset();
        if (this.maskOnCooldown != null) this.maskOnCooldown.Reset();
        this.musicTimer = new timer(this.musicMilliseconds);
        this.musicTimer.Start();
        this.timers.push(this.musicTimer);
    }
}