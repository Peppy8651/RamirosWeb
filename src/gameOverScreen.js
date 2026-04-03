import timer from './timer.js';

export default class gameOverScreen extends Phaser.Scene {
  // The three methods currently empty
  constructor() {
    super({key: 'gameOverScreen'});
  }
  preload() {
    // This method is called once at the beginning
    // It will load all the assets, like sprites and sounds  
    this.load.image('gameover', '/images/menu/gameover.png');
  }
  create() {
    // This method is called once, just after preload()
  this.gameovertex = this.add.image(1024/2, 768/2, 'gameover');
  this.static = this.add.sprite(1024/2, 768/2, 'static1').setAlpha(0.25);
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
    this.gameoverMusic = this.sound.add('feralangelwaltz');
        this.static.anims.play("static");
    // It will initialize our scene, like the positions of the sprites
  }
  update(time, delta) {
    // This method is called 60 times per second after create() 
    // It will handle all the game's logic, like movements
    if (this.gameoverMusic.isPlaying == false) {
      this.gameoverMusic.play();
    }
    this.changeTimer.Update(delta);
  }
}