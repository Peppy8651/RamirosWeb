import timer from './timer.js';

export default class Animatronic {
    constructor(gameScreen, name) {
      this.active; // difference from movementActive is that if this is false it won't do anything at all
      this.Name;
      this.location;
      this.movementPath;
      this.AInum;
      this.scrollspeed = 0.20;
      this.ID;
      this.alphaoverlay = 0.5;
      this.movementTimer;
      this.movedTimer;
      this.attacking = 0;
      this.movementOpportunityTime = 5000;
      this.x = 0+600;
      this.y = 0 + 50;
      this.moved = false;
      this.maskTimer;
      this.camTimer;
      this.officeJumpscareTimer;
      this.cameraLookingTimer;
      this.nasirValue1;
      this.nasirValue2; // flashlight counter so he goes away
      this.nasirValue3; // basically movement opportunity cooldown, just increases everytime he makes an attempt
      this.seenInVent;
      this.millisecondsCounter;
      this.flashMillisecondsCounter;
      this.nasirJumpscareTimer;
      this.marlonBlackoutTimer;
      this.marlonBlackoutCounter;
      this.officeAnimatronicsRNGAttemptMade = false;
      this.officeAnimatronicsRNG = 0;
        this.Name = name;
        this.movementActive = false;
        this.gameScreen = gameScreen;
        switch (name)
        {
            case "Misa":
                this.movementPath = [8, 2, 3, 1, 5, 12, 14]; // 12 is right vent visible from office, 14 is office
                this.ID = 1;
                break;
            case "Juan":
                this.ID = 2;
                this.movementPath = [8, 6, 15, 0, 4, 13, 14]; // 13 is left vent visible from office, 14 is office, 15 is office hall
                break;
            case "Ramiro":
                this.ID = 3;
                this.movementPath = [8, 9, 15, 16, 14]; // 14 is office, 15 is office hall, 16 is office hall door
                break; // ID 4 is Ryan
            case "Nasir":
                this.ID = 5;
                this.movementPath = [7, 15];
                this.nasirValue1 = 0;
                this.nasirValue2 = 0;
                this.nasirValue3 = 0;
                this.millisecondsCounter = 0;
                this.flashMillisecondsCounter = 0;
                this.nasirJumpscareTimer = new timer(10);
                this.nasirJumpscareTimer.finishCallback = () =>
                    {
                        this.gameScreen.jumpscareID = 5;
                        this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                    }
                break;
            case "Gustavo":
                this.ID = 6;
                this.movementPath = [11, 10, 9, 6, 15, 0, 1, 5, 12, 14];
            break;
            case "Carlos":
                this.ID = 7;
                this.movementPath = [9, 6, 2, 0, 4, 13, 14];
            break;
            case "Darien":
                this.ID = 8;
                this.movementPath = [7, 10, 3, 1, 5, 17, 14]; // 17 is right vent queue. If Darien is in 17, he's not in the right vent cam, and will immediately appear in office once cameras are lowered
            break;
            case "Marlon":
                this.ID = 9;
                this.movementPath = [7, 6, 2, 15, 16, 14]; // 16 is office hall door
                this.marlonBlackoutCounter = 0;
                break;
        }
        this.location = this.movementPath[0];
        this.camTimer = new timer(750);
        this.cameraLookingTimer = new timer(10); // you can't stare at the cameras for more than 10 seconds or you get jumpscared
        this.cameraLookingTimer.finishCallback = () =>
        {
            if (this.Name != "Carlos" && this.Name != "Gustavo") // Gooch only jumpscares you if you exit the cameras
            {
                this.gameScreen.jumpscareID = this.ID;
                this.gameScreen.switchScreenState(2);
            }
            if (this.Name == "Gustavo" && this.location == 14)
            {
                this.gameScreen.jumpscareID = this.ID;
                this.gameScreen.switchScreenState(2);
            }
        };
        this.cameraLookingTimer.Start();

    }
    Activate() {
        this.active = true;
        switch (this.gameScreen.nightnum)
        {
            case 1:
                if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Ramiro") this.AInum = 0;
                break;
            case 2:
                if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Ramiro" || this.Name == "Carlos" || this.Name == "Gustavo" || this.Name == "Nasir") this.AInum = 0;
                break;
            case 3:
            // Ramiro and Gustavo are not active here btw
                if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Ramiro" || this.Name == "Gustavo" || this.Name == "Marlon") this.AInum = 0;
                if (this.Name == "Carlos" || this.Name == "Darien") this.AInum = 1;
                if (this.Name == "Nasir") this.AInum = 2;
                break;
            case 4:
            // Juan does not appear on this night
                if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Ramiro") this.AInum = 0;
                break;
            case 5:
                if (this.Name == "Misa" || this.Name == "Juan") this.AInum = 2;
                if (this.Name == "Ramiro") this.AInum = 5;
                break;
            case 6:
                if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Ramiro") this.AInum = 0;
                break;
        }
    }
    update() {
    // This method is called 60 times per second after create() 
    // It will handle all the game's logic, like movements
  }
}