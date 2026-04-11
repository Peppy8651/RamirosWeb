

export default class loadingScreen extends Phaser.Scene {
    constructor() {
        super({key: 'loadingScreen'});
        this.allLoaded = false;
    }
    preload() {
            let loadingText = this.add.text(1024/2 - 110, 768/2 - 15, 'Loading...', {  fontFamily: 'Arial', 
    fontSize: '32px', 
    color: '#ffffff' });

            this.load.on('progress', (value) => {
                loadingText.setText('Loading...' + Math.floor(value * 100) + '%');
            });
            this.load.maxRetries = 3; 
            this.load.setBaseURL('/RamirosWeb/');
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
                "maskon", "ventwalk", "metalwalk", "maskoff", 'cameras', 'darienlaugh', 'darienlaugh2',
                'sergioflash'
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
            for (let i = 1; i < 6; i++) this.load.image(`battery${i}`, `/images/battery/${i}.png`);
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
            this.load.image("mainhallsergioflash", "/images/cameras/locations/flashlight/mainhallsergio.png");
            this.load.image('mainhallmarlonflash', "/images/cameras/locations/flashlight/mainhallmarlon.png");
            this.load.image("officeflashjuan", "/images/officeflashjuan.png");
            this.load.image("officeflashram", "/images/officeflashram.png");
            this.load.image("officeflashnas", "/images/officeflashnas.png");
            this.load.image("officeflashsergio", "/images/officeflashsergio.png");
            this.load.image("officeflashnassergio", "/images/officeflashnassergio.png");
            this.load.image("officeflashmarlon", '/images/officeflashmarlon.png');
            this.load.image("officeflashmarlondoor", '/images/officeflashmarlondoor.png');
            this.load.image("officeflashnasgooch", "/images/officeflashnasgooch.png");
            this.load.image("officeflashramdoor", "/images/officeflashramdoor.png");
            this.load.image("partsflashnas", "/images/cameras/locations/flashlight/partsnas.png");
            this.load.image('partsflashdarien', "/images/cameras/locations/flashlight/partsdarien.png");
            this.load.image('partsflashdarienmarlon', "/images/cameras/locations/flashlight/partsdarienmarlon.png");
            this.load.image('partsflashdariensergio', "/images/cameras/locations/flashlight/partsdariensergio.png");
            this.load.image('partsflashdarienmarlonsergio', "/images/cameras/locations/flashlight/partsdarienmarlonsergio.png");
            this.load.image('partsflashmarlonsergio', "/images/cameras/locations/flashlight/partsmarlonsergio.png");
            this.load.image('partsflashmarlon', "/images/cameras/locations/flashlight/partsmarlon.png");
            this.load.image('partsflashsergio', "/images/cameras/locations/flashlight/partssergio.png");
            this.load.image("partyroom1juan", "/images/cameras/locations/flashlight/partyroom1juan.png");
            this.load.image("partyroom1sergio", "/images/cameras/locations/flashlight/partyroom1sergio.png");
            this.load.image("leftventjuan", "/images/cameras/locations/flashlight/leftventjuan.png");
            this.load.image("leftventsergio", "/images/cameras/locations/flashlight/leftventsergio.png");
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
            this.load.image("sergio", "/images/sergio.png");
            this.load.image('sergiojump', '/images/sergiojump.png');
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
            this.load.audio("misael3", "/audio/misael3.mp3");
            // deepbreaths.Volume = 0.25f;
    // deepbreaths.IsLooped = false;
    this.load.image("mutecall", "/images/mutecall.png");
    // newspaperScreen
    this.load.image('newspaper', '/images/newspaper.png');

    this.load.on('complete', () => {
        console.log('All assets loaded!');
        // Set your own loaded boolean here if needed
        this.allLoaded = true;
    });
    }
    create() {
        this.gameScreen = this.scene.get('gameScreen');
        if (this.gameScreen.nightnum == 1) {
            this.gameScreen.switchScreenState(7);
        }
        else {
            this.gameScreen.switchScreenState(0);
        }
    }
    update() {

    }
}