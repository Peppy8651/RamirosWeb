
import timer from './timer.js';

export default class winScreen extends Phaser.Scene {
  // The three methods currently empty
  constructor() {
    super({key: 'winScreen'});
    
  }
  preload() {
    // This method is called once at the beginning
    // It will load all the assets, like sprites and sounds 
    this.load.baseURL = '/RamirosWeb/';
    this.load.image('win', '/images/menu/win.png');
    this.load.audio('partyrock', '/audio/partyrock.mp3');
    
  }
  create() {
    // This method is called once, just after preload()
    this.wintex = this.add.image(1024/2, 768/2, 'win');
    this.partyrock = this.sound.add('partyrock'); 
    this.partyrock.play();
    this.blackRectangle = this.add.graphics({ fillStyle: { color: 0x000000 } });
        this.blackRectangle.setAlpha(1); // Start fully transparent
        let coverScreen = new Phaser.Geom.Rectangle(0, 0, this.game.config.width, this.game.config.height);
        this.blackRectangle.fillRectShape(coverScreen);
    
    // It will initialize our scene, like the positions of the sprites
  }
  update(time, delta) {
    // This method is called 60 times per second after create() 
    // It will handle all the game's logic, like movements
    if (this.partyrock.isPlaying == false) {
      this.partyrock.play();
    }
    if (this.blackRectangle.alpha > 0) this.blackRectangle.alpha -= 0.001 * delta;
    this.changeTimer.Update(delta);
  }
}