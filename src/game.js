import Phaser from 'phaser'; 
import gameScreen from './gameScreen.js';
import menuScreen from './menuScreen.js';
import gameOverScreen from './gameOverScreen.js';
import cameraScreen from './cameraScreen.js';
import winScreen from './winScreen.js';
import newspaperScreen from './newspaperScreen.js';
import loadingScreen from './loadingScreen.js';
import customNightScreen from './customNightScreen.js';

const screens = [new menuScreen(), new cameraScreen(), new gameScreen(), new gameOverScreen(), new winScreen(), new newspaperScreen(), new loadingScreen(), new customNightScreen()];
for (const screen of screens) {
    screen.screens = screens;
} 
new Phaser.Game({
  width: 1024, // Width of the game in pixels
  height: 768, // Height of the game in pixels
  backgroundColor: '#000000', // The background color (blue)
  scene: screens, // The name of the scene we created
  physics: { default: 'arcade' }, // The physics engine to use
  parent: 'game', // Create the game inside the <div id="game"> 
  type: Phaser.AUTO,
  smoothStep: true,
  pixelArt: true,
  roundPixels: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
});
