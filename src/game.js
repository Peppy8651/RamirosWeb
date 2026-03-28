import Phaser from 'phaser'; 
import gameScreen from './gameScreen.js';
import menuScreen from './menuScreen.js';
import gameOverScreen from './gameOverScreen.js';
import cameraScreen from './cameraScreen.js';
import winScreen from './winScreen.js';

const screens = [new gameScreen(), new cameraScreen(), new menuScreen(), new gameOverScreen(), new winScreen()];
for (const screen of screens) {
    screen.screens = screens;
}
new Phaser.Game({
  width: 1024, // Width of the game in pixels
  height: 768, // Height of the game in pixels
  backgroundColor: '#ffffff', // The background color (blue)
  scene: screens, // The name of the scene we created
  physics: { default: 'arcade' }, // The physics engine to use
  parent: 'game', // Create the game inside the <div id="game"> 
  type: Phaser.AUTO
});