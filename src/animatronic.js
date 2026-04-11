import timer from './timer.js';

export default class Animatronic {
    constructor(gameScreen, name) {
    //   this.active; // difference from movementActive is that if this is false it won't do anything at all
      this.Name;
      this.location;
      this.movementPath;
      this.AInum;
      this.customNightAInum = 0;
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
      this.sergioFlashState = 0;
      this.sergioFlashCounter;
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
                this.nasirJumpscareTimer = new timer(10000);
                this.nasirJumpscareTimer.finishCallback = () =>
                    {
                        if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                            this.gameScreen.jumpscareID = 5;
                            this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                        }
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
            case 'Sergio':
                this.ID = 10;
                this.movementPath = [7, 6, 15, 0, 4, 18, 14]; // 18 is left vent queue
                this.sergioFlashCounter = 0;
                this.sergioFlashState = 1; // 0 is not available, 1 is flash can be activated, 2 is flash actviated, 3 is flash ended
                this.sergioFlashTimer = new timer(3000);
                this.sergioFlashTimer.finishCallback = () => {
                    this.sergioFlashState = 3;
                    this.sergioFlashCounter++;
                    this.sergioFlashTimer.Reset();
                };
                this.sergioFlashTimer.Start();
            break;
            case 'Eric':
                this.ID = 11;
                this.movementPath = [19, 16, 14]; // 19 is just a random spot it doesn't really matter
            break;
        }
        this.location = this.movementPath[0];
        this.camTimer = new timer(750);
        this.cameraLookingTimer = new timer(10000); // you can't stare at the cameras for more than 10 seconds or you get jumpscared
        this.cameraLookingTimer.finishCallback = () =>
        {
            if (this.Name != "Carlos" && this.Name != "Gustavo") // Gooch only jumpscares you if you exit the cameras
            {
                if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                this.gameScreen.jumpscareID = this.ID;
                this.gameScreen.switchScreenState(2);
                }
            }
            if (this.Name == "Gustavo" && this.location == 14)
            {
                if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                this.gameScreen.jumpscareID = this.ID;
                this.gameScreen.switchScreenState(2);
                }
            }
        };
        this.cameraLookingTimer.Start();
        this.movementTimer = new timer(this.movementOpportunityTime);
        this.movementTimer.finishCallback =
        () => {
            if (this.gameScreen.pause == false)
            {
                if (this.Name == "Nasir" && this.gameScreen.nightnum < 3 && this.AInum == 0) // in Night 2, Nas can't move until 1 am
                {
                    if (this.gameScreen.debug) console.log("Nasir movement failed, night 2 rule");
                    if (this.nasirValue3 > 12) this.nasirValue3 = 0;
                    if (this.nasirValue3 > 0) this.nasirValue3++;
                    this.movementActive = false;
                }
                else
                {
                    this.movementOpportunity();
                }
            }
        }
        this.movedTimer = new timer(500);
        this.movedTimer.finishCallback = () => { this.moved = false; this.cameraScreen.animatronicForceOff = false;};
    }
    Activate() {
        this.active = true;
        this.cameraScreen = this.gameScreen.scene.get('cameraScreen');
        switch (this.gameScreen.nightnum)
        {
            case 1:
                if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Ramiro") this.AInum = 0;
                break;
            case 2:
                if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Ramiro" || this.Name == "Carlos" || this.Name == "Gustavo" || this.Name == "Nasir") this.AInum = 0;
                break;
            case 3:
            //  Gustavo is not active here btw
                if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Ramiro" || this.Name == "Gustavo" || this.Name == "Marlon") this.AInum = 0;
                if (this.Name == "Carlos" || this.Name == "Darien" || this.Name == "Sergio") this.AInum = 1;
                if (this.Name == "Nasir") this.AInum = 2;
                break;
            case 4:
                if (this.Name == 'Misa' || this.Name == 'Ramiro' || this.Name == 'Marlon' || this.Name == 'Juan' || this.Name == 'Darien') this.AInum = 0;
                if (this.Name == 'Sergio') this.AInum = 1;
                if (this.Name == 'Carlos') this.AInum = 3;
                if (this.Name == 'Gustavo') this.AInum = 5;
                if (this.Name == 'Nasir') this.AInum = 7;
                break;
            case 5:
                if (this.Name == "Misa" || this.Name == "Juan" || this.Name == 'Marlon' || this.Name == 'Darien' || this.Name == 'Sergio') this.AInum = 2;
                if (this.Name == 'Carlos' || this.Name == 'Nasir') this.AInum = 5;
                if (this.Name == 'Gustavo') this.AInum = 1;
                if (this.Name == "Ramiro") this.AInum = 5;
                break;
            case 6:
                if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Ramiro") this.AInum = 0;
                if (this.Name == 'Gustavo') this.AInum = 3;
                if (this.Name == 'Carlos' || this.Name == 'Marlon' || this.Name == 'Darien' || this.Name == 'Sergio') this.AInum = 5;
                if (this.Name == 'Nasir') this.AInum = 10;
                if (this.Name == 'Eric') this.AInum = 2;
                break;
            case 7:
                this.customNightAInum = this.AInum;
                break;
        }
        if (this.gameScreen.doubleMovementSpeed) this.movementOpportunityTime = 2500;
    }
    update(delta) {
    if (this.active)
        {
            if (this.Name == "Nasir")
            {
                if (this.AInum > 0)
                {
                    this.millisecondsCounter += delta;
                    this.flashMillisecondsCounter += delta;
                    if (this.millisecondsCounter >= 1000)
                    {
                        if (this.gameScreen.flashlightstate != 1) this.nasirValue1++;
                        this.millisecondsCounter -= 1000;
                    } 
                    if (this.flashMillisecondsCounter >= 2000)
                    {
                        if (this.gameScreen.flashlightstate == 1) this.nasirValue1--;
                        this.flashMillisecondsCounter -= 2000;
                    }
                    if (this.gameScreen.flashlightstate == 1 && this.location == 15)
                    {
                        this.nasirValue1 = 0;
                        this.nasirValue2 += 0.06 * delta;
                        if (this.nasirValue2 > 100 * this.gameScreen.nightnum)
                        {
                            if (this.gameScreen.screenState == 0) this.gameScreen.drawChange = true;
                            this.location = 7;
                            this.gameScreen.danger = 0;
                            this.nasirValue1 = 0;
                            this.nasirValue2 = 0;
                            this.nasirValue3++; // basically makes him stop moving for 12 or 13 opportunities
                            this.millisecondsCounter = 0;
                            this.flashMillisecondsCounter = 0;
                        }
                        if (this.nasirJumpscareTimer._isRunning)
                        {
                            this.nasirJumpscareTimer.AddTime(this.nasirJumpscareTimer.RemainingTime()); // reset jumpscare timer if flashlight is on him, so you have to keep it on him for a while to make him go away, but if you take it off even for a second he gets ready to jumpscare you again
                        }
                        if (this.nasirValue1 < 0) this.nasirValue1 = 0;
                    }
                    if (this.nasirJumpscareTimer._isRunning) this.nasirJumpscareTimer.Update(delta);
                }
            }
            if (this.movementActive == false && this.gameScreen.pause == false)
            {
                this.movementTimer.SetTargetTime(this.movementOpportunityTime);
                this.movementTimer.Reset();
                this.movementTimer.Start();
                this.movementActive = true;
            }
            if (this.movementActive)
            {
                this.movementTimer.Update(delta);
            }
            if (this.moved) // so then cameras disable for a second after moving
            {
                this.movedTimer.Update(delta);
            }
            if (this.attacking == 0) // if not attacking, AI changes based on time
            {
                switch (this.gameScreen.nightnum)
                {
                    case 1:
                        if (this.Name == "Misa" || this.Name == "Juan")
                        {
                            if (this.gameScreen.hournum >= 1 && this.gameScreen.hournum < 2)
                            {
                                this.AInum = 2;
                            }
                        }
                        if (this.Name == "Misa" && this.gameScreen.hournum >= 2) this.AInum = 3; 
                        if (this.Name == "Ramiro" && this.gameScreen.hournum >= 2) this.AInum = 2;
                        break;
                    case 2:
                        if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Carlos" || this.Name == "Gustavo")
                        {
                            if (this.gameScreen.hournum >= 1)
                            {
                                this.AInum = 3;
                            }
                        }
                        if (this.Name == "Ramiro" && this.gameScreen.hournum >= 1) this.AInum = 2;
                        if (this.Name == "Nasir" && this.gameScreen.hournum >= 1) this.AInum = 1;
                        break;
                    case 3:
                        if (this.Name == "Misa" || this.Name == "Juan" || this.Name == "Ramiro")
                        {
                            if (this.gameScreen.hournum >= 1)
                            {
                                this.AInum = 3;
                            }
                        }
                        if (this.Name == "Carlos" || this.Name == "Darien" || this.Name == "Marlon" || this.Name == "Sergio")
                        {
                            if (this.gameScreen.hournum >= 1)
                            {
                                this.AInum = 3;
                            }
                        }
                        if (this.Name == "Nasir" && this.gameScreen.hournum >= 1) this.AInum = 3;
                        break;
                    case 4:
                        if (this.Name == "Juan" || this.Name == "Ramiro") {
                            this.AInum = 3;
                        }
                        if (this.Name == "Misa" || this.Name == "Carlos" || this.Name == "Marlon")
                        {
                            this.AInum = 4;
                        }
                        if (this.Name == "Darien" || this.Name == "Sergio") {
                            this.AInum = 5;
                        }
                        if (this.Name == "Gustavo") this.AInum = 5;
                        if (this.Name == 'Nasir') this.AInum = 7;
                        break;
                    case 5:
                        if (this.Name == 'Ramiro' || this.Name == 'Juan') this.AInum = 3;
                        if (this.Name == 'Misa') this.AInum = 4;
                        if (this.Name == 'Gustavo') this.AInum = 10;
                        if (this.Name == 'Carlos' || this.Name == 'Marlon' || this.Name == 'Darien' || this.Name == 'Sergio') this.AInum = 6;
                        if (this.Name == 'Nasir') this.AInum = 7;
                        break;
                    case 6:
                        if (this.Name == 'Ramiro' || this.Name == 'Misa' || this.Name == 'Juan' || this.Name == 'Eric') this.AInum = 5;
                        if (this.Name == 'Gustavo' || this.Name == 'Marlon' || this.Name == 'Darien' || this.Name == 'Sergio') this.AInum = 10;
                        if (this.Name == 'Carlos') this.AInum = 9;
                        if (this.Name == 'Nasir') this.AInum = 15;
                        break;
                    case 7:
                    if (this.AInum != this.customNightAInum) this.AInum = this.customNightAInum;
                    break;
                }
                if (this.Name == "Carlos" && this.location == 14)
                {
                    if (this.gameScreen.carlos3.isPlaying == false) {
                        this.gameScreen.carlos3.play();
                    } 
                }
            }
            if (this.cameraScreen.camFlashOn && this.location == this.cameraScreen.cameraspot) // reset timer and stuff by flashing
            {
                this.movementOpportunityTime = 6670;
                if (this.gameScreen.doubleMovementSpeed) this.movementOpportunityTime = 3335;
                this.movementActive = false;
            }
            if (this.gameScreen.flashlightstate == 3 && this.location == 12)
            {
                this.movementActive = false;
            }
            else if (this.gameScreen.flashlightstate == 2 && this.location == 13)
            {
                this.movementActive = false;
            }
            else if (this.gameScreen.flashlightstate == 1 && this.location == 15) {
                if (this.Name == "Sergio") {
                    if (this.sergioFlashCounter < this.gameScreen.nightnum) {  
                        if (this.sergioFlashState == 1) {
                            this.sergioFlashState = 2;
                            if (this.sergioFlashTimer._isRunning == false) this.sergioFlashTimer.Start();
                            if (this.gameScreen.sergioflash.isPlaying == false) this.gameScreen.sergioflash.play();
                        }
                    }
                }
                if (this.gameScreen.animatronics[8].sergioFlashState != 2) {
                    this.movementOpportunityTime = 6670;
                    if (this.gameScreen.doubleMovementSpeed) this.movementOpportunityTime = 3335;
                    this.movementActive = false;
                }
            }
            if (this.officeJumpscareTimer != null) {
                if (this.officeJumpscareTimer._isRunning) {
                        this.officeJumpscareTimer.Update(delta);
                        if (this.gameScreen.stare == false) this.gameScreen.stare = true;
                        if ((this.Name == "Darien" || this.Name == 'Marlon' || this.Name == 'Sergio') && (this.gameScreen.maskbuttonactive == 3)) {
                                if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                                this.gameScreen.jumpscareID = this.ID;
                                this.gameScreen.stare = false;
                                this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                            }
                        }
                }
            }
            else {
                if (this.gameScreen.animatronics[1].attacking != 2 && this.gameScreen.stare && this.gameScreen.animatronicsInOffice <= 0) {
                    this.gameScreen.stare = false;
                    if (this.gameScreen.animatronicsInOffice < 0) this.gameScreen.animatronicsInOffice = 0;
                }
            }
            if (this.camTimer != null && this.camTimer._isRunning) {
                this.camTimer.Update(delta);
            }

            if (this.Name == "Sergio" && this.sergioFlashState == 2) {
                this.sergioFlashTimer.Update(delta);
            }

            if (this.attacking == 2) // attacking code
            {
                switch (this.Name) {
                    case "Misa":
                    if (this.gameScreen.maskbuttonactive > 0 && this.gameScreen.maskbuttonactive < 3)
                    {
                        if (this.gameScreen.stare == false) {
                            this.gameScreen.stare = true;
                        }
                        this.gameScreen.drawChange = true;
                        this.x -= (delta * this.scrollspeed);
                        // if (this.gameScree.stare.State != SoundState.Playing)
                        // {
                        //     this.game.stare.play();
                        // }
                        if (this.x < -800)
                        {
                            // console.log(this.gameScreen.stare);
                            this.attacking = 0;
                            this.gameScreen.stare = false;
                            this.location = 2;
                            this.x = 0 + 600;
                            this.movementOpportunityTime = 5000;
                            if (this.gameScreen.doubleMovementSpeed) this.movementOpportunityTime = 2500;
                            this.movementActive = false;
                            this.gameScreen.ventwalk.play();
                            // game.stare.Stop();
                            this.AInum = 0;
                            this.gameScreen.danger = 0;
                            if (this.gameScreen.debug) console.log("Misa attack evaded");
                        }      
                    }
                    else
                    {
                        if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                        this.gameScreen.jumpscareID = 1;
                        this.gameScreen.misa.setVisible(false);
                        //game.stare.Stop();
                        this.gameScreen.stare = false;
                        this.gameScreen.switchScreenState(2);
                        }
                    }
                    break;
                    case "Juan":
                    if (this.gameScreen.maskbuttonactive > 0 && this.gameScreen.maskbuttonactive < 3)
                    {
                        if (this.gameScreen.stare == false) this.gameScreen.stare = true;
                        // I am just lazy  
                        // if (this.gameScreen.stare.State != SoundState.Playing)
                        // {
                        //     this.gameScreen.stare.play();
                        // }
                        this.maskTimer.Update(delta);
                    }
                    else
                    {
                        if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                        this.gameScreen.jumpscareID = 2;
                        this.gameScreen.stare = false;
                       //  this.gameScreen.stare.Stop();
                        this.gameScreen.switchScreenState(2);
                        }
                    }
                    break;
                    case "Carlos":
                    if (this.gameScreen.maskbuttonactive > 0 && this.gameScreen.maskbuttonactive < 3)
                    {
                        this.maskTimer.Update(delta);
                    }
                    else
                    {
                        this.location = 14;
                        this.attacking = 0;
                        this.gameScreen.stare = false;
                        this.active = false; // just freeze him
                        this.AInum = 0;
                        this.gameScreen.batterymilliseconds = 0;
                    }
                    break;
                    case "Gustavo":
                    if (this.gameScreen.maskbuttonactive > 0 && this.gameScreen.maskbuttonactive < 3)
                    {
                        this.maskTimer.Update(delta);
                    }
                    else
                    {
                        this.gameScreen.stare = false;
                        this.location = 14;
                        this.attacking = 0;
                        this.AInum = 0;
                    }
                    break;
                }
                }
                if (this.gameScreen.camerabuttonactive == 3 && this.attacking == 1)
                {
                    if (this.camTimer != null) {
                    if (this.camTimer._isRunning == false)
                    {
                        this.camTimer.finishCallback = () => // give less than 1 second window to put on a mask
                        {
                            if (this.Name != "Carlos" && this.Name != "Gustavo") {
                                if (this.gameScreen.maskbuttonactive == 0)
                                {
                                    if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                                    this.gameScreen.jumpscareID = this.ID;
                                    // this.gameScreen.stare.Stop();
                                    this.gameScreen.stare = false;
                                    this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                                    }
                                }
                                else
                                {
                                    this.camTimer.Stop();
                                    this.gameScreen.stare = false;
                                    // this.game.stare.Stop();
                                    this.camTimer = null;
                                }
                            }
                            else if (this.Name == "Carlos")
                            {
                                if (this.gameScreen.maskbuttonactive == 0)
                                {
                                    this.location = 14;
                                    this.attacking = 0;
                                    this.active = false; // just freeze him
                                    this.AInum = 0;
                                    this.gameScreen.stare = false;
                                    this.gameScreen.batterymilliseconds = 0;
                                    // switch (this.gameScreen.nightnum)
                                    // {
                                    //     case 1:
                                    //     game.batteryNumCheck(127000);
                                    //     break;
                                    //     case 2:
                                    //     game.batteryNumCheck(110000);
                                    //     break;
                                    //     case 3:
                                    //     game.batteryNumCheck(84000);
                                    //     break;
                                    //     case 4:
                                    //     game.batteryNumCheck(68000);
                                    //     break;
                                    //     case >= 5:
                                    //     game.batteryNumCheck(51000);
                                    //     break;
                                    // }
                                }
                                else
                                {
                                    this.camTimer.Stop();
                                    this.gameScreen.stare = false;
                                    this.camTimer = null;
                                }
                            }
                            else if (this.Name == "Gustavo")
                            {
                                if (this.gameScreen.maskbuttonactive == 0)
                                {
                                    this.location = 14;
                                    this.gameScreen.stare = false;
                                    this.attacking = 0;
                                    this.AInum = 0;
                                }
                                else
                                {
                                    this.camTimer.Stop();
                                    this.gameScreen.stare = false;
                                    if (this.gameScreen.garble.isPlaying) this.gameScreen.garble.stop();
                                    this.camTimer = null;
                                }
                            }
                        };
                        
                        
                        this.camTimer.Start();
                    }
                    }
                }

                // lowkey just repeat this code for ramiro
                if (this.Name == "Ramiro" && this.location == 16)
                {
                    if (this.officeAnimatronicsRNGAttemptMade == false && this.gameScreen.camerabuttonactive == 3 && this.gameScreen.animatronics[6].location != 14)
                    {
                        this.officeAnimatronicsRNGAttemptMade = true;
                        this.officeAnimatronicsRNG = Math.random() * 10;
                    }
                    else
                    {
                        if (this.gameScreen.camerabuttonactive == 0) this.officeAnimatronicsRNGAttemptMade = false;
                    }
                    if (this.officeAnimatronicsRNG >= 6 && this.gameScreen.camerabuttonactive == 3) // makes it a bit more unpredictable, waits for darien to leave
                    {
                        // this.gameScreen.stare.play();
                        this.movementActive = true;
                        this.location = 14; // he's about to jumpscare
                        this.gameScreen.stare = true;
                        this.gameScreen.animatronicsInOffice++;
                        this.camTimer = new timer(1000);
                        if (this.camTimer._isRunning == false)
                        {
                            this.camTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 0 || this.gameScreen.maskbuttonactive == 3) {
                                    // this.gameScreen.stare.Stop();
                                    if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                                    this.gameScreen.jumpscareID = this.ID;
                                    this.gameScreen.ramiro.setVisible(false);
                                    this.gameScreen.stare = false;
                                    this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                                    }
                                }
                                else
                                {
                                    this.alphaoverlay = 1;
                                    //this.gameScreen.stare.Stop();
                                    this.camTimer.Stop();
                                    this.gameScreen.ramiro.setVisible(false);
                                    this.gameScreen.stare = false;
                                    this.gameScreen.animatronicsInOffice -= 1;
                                    this.camTimer = null;
                                    this.location = 8;
                                    this.movementActive = false;
                                    this.AInum = 0;
                                    this.gameScreen.danger = 0;
                                    if (this.gameScreen.debug) console.log("Ramiro attack evaded");
                                };
                            };  
                            this.camTimer.Start();
                        }
                    }
                }
                if (this.gameScreen.camerabuttonactive == 3 && this.Name == "Darien" && this.location == 17)
                {
                    if (this.gameScreen.animatronics[6].location != 14)
                    {
                        this.officeAnimatronicsRNGAttemptMade = true;
                        //this.gameScreen.stare.play();
                        this.gameScreen.darienlaugh2.play();
                        this.gameScreen.animatronicsInOffice++;
                        this.movementActive = true;
                        this.gameScreen.stare = true;
                        this.location = 14; // he's about to jumpscare
                        let jumpscareInterval = Math.random() < 0.5 ? 5000 : 8000;
                        this.officeJumpscareTimer = new timer(jumpscareInterval);
                        this.camTimer = new timer(Math.random() < 0.5 ? 500 : 250);
                        if (this.camTimer._isRunning == false)
                        {
                            this.camTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 0 || this.gameScreen.maskbuttonactive == 3) {
                                    // this.gameScreen.stare.Stop();
                                    if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                                    this.gameScreen.stare = false;
                                    this.gameScreen.darien.setVisible(false);
                                    this.gameScreen.jumpscareID = this.ID;
                                    this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                                    }
                                }
                            };  
                            this.camTimer.Start();
                        }
                        if (this.officeJumpscareTimer._isRunning == false)
                        {
                            this.officeJumpscareTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 1 || this.gameScreen.maskbuttonactive == 2) {
                                    this.alphaoverlay = 1;
                                    this.gameScreen.stare = false;
                                    //this.gameScreen.stare.Stop();
                                    this.camTimer.Stop();
                                    this.camTimer = null;
                                    this.gameScreen.animatronicsInOffice -= 1;
                                    this.officeJumpscareTimer.Stop();
                                    this.gameScreen.darien.setVisible(false);
                                    this.officeJumpscareTimer = null;
                                    this.location = Math.random() < 0.5 ? 10 : 3; // either prize corner or party room 4
                                    this.movementActive = false;
                                    this.AInum = 0;
                                    this.gameScreen.danger = 0;
                                    if (this.gameScreen.debug) console.log("Darien attack evaded");
                                }
                            };  
                            this.officeJumpscareTimer.Start();
                        }
                    }
                }
                if (this.Name == "Marlon" && this.location == 16)
                {
                    if (this.officeAnimatronicsRNGAttemptMade == false && this.gameScreen.camerabuttonactive == 3 && this.gameScreen.animatronics[6].location != 14)
                    {
                        this.officeAnimatronicsRNGAttemptMade = true;
                        this.officeAnimatronicsRNG = Math.random() * 10;
                    }
                    else
                    {
                        if (this.gameScreen.camerabuttonactive == 0) this.officeAnimatronicsRNGAttemptMade = false;
                    }
                    if (this.officeAnimatronicsRNG >= 5 && this.gameScreen.camerabuttonactive == 3) // final attack attempt
                    {
                        //this.gameScreen.stare.play();
                        this.movementActive = true;
                        this.gameScreen.animatronicsInOffice++;
                        this.location = 14; // he's about to jumpscare
                        let jumpscareInterval = Math.random() < 0.5 ? 4000 : 9000;
                        this.gameScreen.stare = true;
                        this.officeJumpscareTimer = new timer(jumpscareInterval);
                        this.camTimer = new timer(1250 / (this.marlonBlackoutCounter + 1));
                        if (this.camTimer._isRunning == false)
                        {
                            this.camTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 0 || this.gameScreen.maskbuttonactive == 3) {
                                    // this.gameScreen.stare.Stop();
                                    if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                                    this.gameScreen.stare = false;
                                    this.gameScreen.marlon.setVisible(false);
                                    this.gameScreen.jumpscareID = this.ID;
                                    this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                                    }
                                }
                            };  
                            this.camTimer.Start();
                        }
                        if (this.officeJumpscareTimer._isRunning == false)
                        {
                            this.officeJumpscareTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 1 || this.gameScreen.maskbuttonactive == 2) {
                                    this.marlonBlackoutCounter++;
                                    this.alphaoverlay = 1;
                                    // this.gameScreen.stare.Stop();
                                    this.camTimer.Stop();
                                    this.gameScreen.stare = false;
                                    this.gameScreen.animatronicsInOffice -= 1;
                                    this.camTimer = null;
                                    this.officeJumpscareTimer.Stop();
                                    this.officeJumpscareTimer = null;
                                    if (this.marlonBlackoutCounter == this.gameScreen.nightnum) 
                                    {
                                        this.location = 7;
                                        this.marlonBlackoutCounter = 0;
                                    }
                                    else { 
                                        this.location = 16;
                                    } // repeated attacks
                                    this.movementActive = false;
                                    this.AInum = 0;
                                    this.gameScreen.marlon.setVisible(false);
                                    this.gameScreen.danger = 0;
                                    if (this.gameScreen.debug) console.log("Marlon attack evaded");
                                }
                            };  
                            this.officeJumpscareTimer.Start();
                        }
                    }
                }

                if (this.gameScreen.camerabuttonactive == 3 && this.Name == "Sergio" && this.location == 18)
                {
                    if (this.location != 14)
                    {
                        this.officeAnimatronicsRNGAttemptMade = true;
                        this.movementActive = true;
                        this.gameScreen.animatronicsInOffice++;
                        this.gameScreen.stare = true;
                        this.location = 14; // he's about to jumpscare
                        let jumpscareInterval = Math.random() < 0.5 ? 5000 : 7000;
                        this.officeJumpscareTimer = new timer(jumpscareInterval);
                        this.camTimer = new timer(500);
                        if (this.camTimer._isRunning == false)
                        {
                            this.camTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 0 || this.gameScreen.maskbuttonactive == 3) {
                                    if (this.gameScreen.jumpscareID == 0) { // 0 means haven't jumpscared yet
                                    this.gameScreen.stare = false;
                                    this.gameScreen.sergio.setVisible(false);
                                    this.gameScreen.jumpscareID = this.ID;
                                    this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                                    }
                                }
                            };  
                            this.camTimer.Start();
                        }
                        if (this.officeJumpscareTimer._isRunning == false)
                        {
                            this.officeJumpscareTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 1 || this.gameScreen.maskbuttonactive == 2) {
                                    this.gameScreen.stare = false;
                                    this.gameScreen.sergio.setVisible(false);
                                    this.gameScreen.animatronicsInOffice -= 1;
                                    //this.gameScreen.stare.Stop();
                                    this.camTimer.Stop();
                                    this.camTimer = null; 
                                    this.officeJumpscareTimer.Stop();
                                    this.officeJumpscareTimer = null;
                                    this.location = 6; 
                                    this.movementActive = false;
                                    this.sergioFlashState = 0;
                                    this.AInum = 0;
                                    this.gameScreen.danger = 0;
                                    if (this.gameScreen.debug) console.log("Sergio attack evaded");
                                }
                            };  
                            this.officeJumpscareTimer.Start();
                        }
                    }
                }
                if (this.location == 14 || this.location == 13 || this.location == 12 || this.location == 17 || this.location == 18)
                {
                    if (this.gameScreen.camerabuttonactive == 1 || this.gameScreen.camerabuttonactive == 2)
                    {
                        this.cameraLookingTimer.Update(delta);
                    }
                    if (this.gameScreen.camerabuttonactive == 3)
                    {
                        this.cameraLookingTimer.Reset();
                    }
                    if (this.Name == "Gustavo" && this.gameScreen.garble.isPlaying == false)
                    {
                        this.gameScreen.garble.play();
                    }
                }
        } 
        
  }
movementOpportunity()
    {
        if (this.Name != "Nasir")
        {
            if (this.gameScreen.screenState == 1 && this.cameraScreen.cameraspot == this.location && this.cameraScreen.darieninterrupt == false)
            {
                if (this.gameScreen.debug) console.log(this.Name + " movement failed, on camera");
            }
            else if (this.gameScreen.flashlightstate == 3 && this.location == 12)
            {
                if (this.gameScreen.debug) console.log(this.Name + " movement failed, flashlight on vent");
            }
            else if (this.gameScreen.flashlightstate == 2 && this.location == 13)
            {
                if (this.gameScreen.debug) console.log(this.Name + " movement failed, flashlight on vent");
            }
            else
            {
                let chance = (Math.floor(Math.random() * 23)) + 1;
                if (this.AInum >= chance && this.attacking < 2)
                {
                    if (this.gameScreen.maskbuttonactive > 0 && this.gameScreen.maskbuttonactive < 3 && this.attacking == 1)
                    {
                        this.attacking = 2;
                        this.scrollspeed = 0.20 + (Math.random() / 5); // randomize speed a bit
                        if (this.Name == "Juan")
                        {
                            this.maskTimer = new timer(Math.random() < 0.5 ? 5000 : 7000);
                            this.maskTimer.finishCallback = () => {
                                this.alphaoverlay = 1;
                                this.attacking = 0;
                                this.location = 6;
                                this.gameScreen.stare = false;
                                this.movementActive = false;
                                this.gameScreen.ventwalk.play();
                                //this.gameScreen.stare.Stop();
                                this.AInum = 0;
                                this.gameScreen.danger = 0;
                                if (this.gameScreen.screenState == 0) this.gameScreen.drawChange = true;
                                if (this.gameScreen.debug) console.log("Juan attack evaded");
                            };
                            this.maskTimer.Start();
                        }
                        if (this.Name == "Carlos")
                        {
                            this.maskTimer = new timer(Math.random() < 0.5 ? 5000 : 7000);
                            this.maskTimer.finishCallback = () => {
                                this.attacking = 0;
                                this.location = 9;
                                this.movementActive = false;
                                this.gameScreen.stare = false;
                                this.gameScreen.ventwalk.play();
                                this.AInum = 0;
                                this.gameScreen.danger = 0;
                                if (this.gameScreen.screenState == 0) this.gameScreen.drawChange = true;
                                if (this.gameScreen.debug) console.log("Carlos attack evaded");
                            };
                            this.maskTimer.Start();
                        }
                        if (this.Name == "Gustavo")
                        {
                            this.maskTimer = new timer(Math.random() < 0.5 ? 5000 : 7000);
                            this.maskTimer.finishCallback = () => {
                                this.attacking = 0;
                                this.location = 11;
                                this.movementActive = false;
                                this.gameScreen.stare = false;
                                this.gameScreen.ventwalk.play();
                                this.AInum = 0;
                                this.gameScreen.danger = 0;
                                if (this.gameScreen.screenState == 0) this.gameScreen.drawChange = true;
                                if (this.gameScreen.debug) console.log("Gustavo attack evaded");
                            };
                            this.maskTimer.Start();
                        }
                        if (this.gameScreen.debug) console.log(this.Name + " is attacking!");
                    }

                    let index = this.movementPath.indexOf(this.location);
                    if (index < this.movementPath.length - 2)
                    {
                        if ((this.ID < 3 || this.ID == 7 || this.ID == 6) && index != this.movementPath.length - 2) {
                            this.location = this.movementPath[index + 1];

                            if (this.Name == "Gustavo") // just plays anytime he moves i guess
                            {
                                if (this.location != 4 && this.location != 5 && this.location != 12 && this.location != 13)
                                {
                                    this.gameScreen.metalwalk.play();
                                }
                            }
                            if (this.Name == "Carlos")
                            {
                                switch (Math.floor(Math.random() * 3) + 1)
                                {
                                    case 2:
                                    this.gameScreen.carlos2.play();
                                    break;
                                    case 3:
                                    this.gameScreen.carlos3.play();
                                    break;
                                    default:
                                    this.gameScreen.carlos1.play();
                                    break;
                                }

                            }
                            if (this.location == 4 || this.location == 5)
                            {
                                this.gameScreen.ventwalk.play();
                            }
                            if (this.location == 12 || this.location == 13) // vent locations
                            {
                                this.gameScreen.metalwalk.play();
                            }
                            this.moved = true;
                            if (this.gameScreen.debug) console.log(this.Name + " movement successful");
                            if (this.gameScreen.screenState == 0) this.gameScreen.drawChange = true;
                            this.movedTimer.Reset();
                            this.movedTimer.Start(); // so cameras disable for a second after moving
                        }
                        else if (this.Name != "Misa" && this.Name != "Juan" && this.Name != "Carlos" && this.Name != "Gustavo")
                        {
                            this.location = this.movementPath[index + 1];
                            this.moved = true;
                            if (this.gameScreen.debug) console.log(this.Name + " movement successful");
                            if (this.gameScreen.screenState == 0) this.gameScreen.drawChange = true;
                            if (this.location == 4 || this.location == 5)
                            {
                                this.gameScreen.ventwalk.play();
                            }
                            if (this.location == 12 || this.location == 13) // vent locations
                            {
                                this.gameScreen.metalwalk.play();
                            }
                            this.movedTimer.Reset();
                            this.movedTimer.Start(); // so cameras disable for a second after movin
                            if (this.Name == "Sergio" && this.location == 15 && this.sergioFlashState == 0) {
                                this.sergioFlashState = 1;
                            }
                        }
                        if ((this.ID < 3 || this.ID == 7 || this.ID == 6) && index + 1 == this.movementPath.length - 2)
                        {
                            if (this.attacking == 0) {
                                this.attacking = 1;
                            }
                            this.movementOpportunityTime = 500;
                            this.AInum = 10; // 50 percent chance
                        }
                    }
                }
                else
                {
                    if (this.attacking != 2 && this.gameScreen.debug) console.log(this.Name + " movement failed");
                }
                
            }
            if (this.attacking == 0) {
                this.movementOpportunityTime = 5000;
                if (this.gameScreen.doubleMovementSpeed) this.movementOpportunityTime = 2500;
            }
            if (this.attacking > 0) this.movementOpportunityTime = 500;
            this.movementActive = false;
        }
        else
        {
            if (this.nasirValue3 == 0)
            {
                if (this.AInum >= 21 + Math.floor(Math.random() * 4) - this.nasirValue1)
                {
                    this.nasirValue1 = 0;
                    this.nasirValue2 = 0;
                    this.millisecondsCounter = 0;
                    this.flashMillisecondsCounter = 0;
                    if (this.location == 15)
                    {
                        this.movementActive = true; // so he can't move and crash the game
                        this.nasirJumpscareTimer.Start();
                    }
                    if (this.location == 7) this.location = 15;
                    this.moved = true;
                    if (this.gameScreen.screenState == 0) this.gameScreen.drawChange = true;
                    if (this.gameScreen.debug) console.log(this.Name + " movement successful");
                    this.movedTimer.Reset();
                    this.movedTimer.Start(); // so cameras disable for a second after moving
                } 
                else
                {
                    if (this.gameScreen.debug) console.log(this.Name + " movement failed");
                }
            }
            else
            {
                if (this.gameScreen.debug) console.log(this.Name + " movement failed");
            }
            if (this.nasirValue3 > 12) this.nasirValue3 = 0;
            if (this.nasirValue3 > 0) this.nasirValue3++;
            this.movementActive = false;
        }
    }
}