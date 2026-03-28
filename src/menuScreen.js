export default class menuScreen extends Phaser.Scene {
  // The three methods currently empty
  constructor() {
    super({key: 'menuScreen'});
  }
  preload() {
    // This method is called once at the beginning
    // It will load all the assets, like sprites and sounds  
  }
  create() {
    // This method is called once, just after preload()
    // It will initialize our scene, like the positions of the sprites
  }
  update() {
    // This method is called 60 times per second after create() 
    // It will handle all the game's logic, like movements
  }
}