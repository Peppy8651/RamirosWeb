import timer from './timer.js';

export default class Animatronic {
    constructor(gameScreen, name) {
    //   this.active; // difference from movementActive is that if this is false it won't do anything at all
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
                        this.nasirValue2 += 0.04 * delta;
                        if (this.nasirValue2 > 100 * this.gameScreen.nightnum)
                        {
                            this.location = 7;
                            this.nasirValue1 = 0;
                            this.nasirValue2 = 0;
                            this.nasirValue3++; // basically makes him stop moving for 12 or 13 opportunities
                            this.millisecondsCounter = 0;
                            this.flashMillisecondsCounter = 0;
                        }
                        if (this.nasirJumpscareTimer._isRunning)
                        {
                            this.nasirJumpscareTimer.AddTime(this.nasirJumpscareTimer._targetTime - this.nasirJumpscareTimer._elapsedTime); // reset jumpscare timer if flashlight is on him, so you have to keep it on him for a while to make him go away, but if you take it off even for a second he gets ready to jumpscare you again
                        }
                        if (this.nasirValue1 < 0) this.nasirValue1 = 0;
                    }
                    if (this.nasirJumpscareTimer._isRunning) this.nasirJumpscareTimer.Update(delta);
                }
            }
            if (this.movementActive == false && this.gameScreen.pause == false)
            {
                this.movementTimer = new timer(this.movementOpportunityTime);
                this.movementTimer.finishCallback =
                        () => {
                            if (this.gameScreen.pause == false)
                            {
                                if (this.Name == "Nasir" && this.gameScreen.nightnum < 3 && this.AInum == 0) // in Night 2, Nas can't move until 1 am
                                {
                                    console.log("Nasir movement failed, night 2 rule");
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
                        if (this.Name == "Misa" || this.Name == "Juan")
                        {
                            if (this.gameScreen.hournum >= 1)
                            {
                                this.AInum = 1;
                            }
                        }
                        if (this.Name == "Carlos" || this.Name == "Darien" || this.Name == "Marlon")
                        {
                            if (this.gameScreen.hournum >= 1)
                            {
                                this.AInum = 2;
                            }
                        }
                        if (this.Name == "Nasir" && this.gameScreen.hournum >= 1) this.AInum = 3;
                        break;
                    case 4:
                        break;
                    case 5:
                        break;
                    case 6:
                        break;
                }
                // if (this.Name == "Carlos" && this.location == 14)
                // {
                //     if (this.game.carlos3.State != SoundState.Playing) this.game.carlos3.Play();
                // }
            }
            // if (this.game.cameraScreen.camFlashOn && this.location == this.game.cameraScreen.cameraspot) // reset timer and stuff by flashing
            // {
            //     this.movementOpportunityTime = 6670;
            //     this.movementActive = false;
            // }
            if (this.gameScreen.flashlightstate == 3 && this.location == 12)
            {
                this.movementActive = false;
            }
            else if (this.gameScreen.flashlightstate == 2 && this.location == 13)
            {
                this.movementActive = false;
            }
            else if (this.gameScreen.flashlightstate == 1 && this.location == 15) {
                this.movementOpportunityTime = 6670;
                this.movementActive = false;
            }

            if (this.attacking == 2) // attacking code
            {
                switch (this.Name) {
                    case "Misa":
                    if (this.gameScreen.maskbuttonactive > 0 && this.gameScreen.maskbuttonactive < 3)
                    {
                        this.x -= (delta * scrollspeed);
                        // if (this.gameScree.stare.State != SoundState.Playing)
                        // {
                        //     this.game.stare.Play();
                        // }
                        switch (this.alphaoverlay)
                        {
                            case 0:
                                this.alphaoverlay = 0.25;
                                break;
                            case 0.25:
                                this.alphaoverlay = 0.5;
                                break;
                            case 0.5:
                                this.alphaoverlay = 0.75;
                                break;
                            case 0.75:
                                this.alphaoverlay = 1;
                                break;
                            case 1:
                                this.alphaoverlay = 0;
                                break;
                            default:
                                this.alphaoverlay = 0;
                                break;
                        }
                        if (this.x < -800)
                        {
                            this.attacking = 0;
                            this.location = 2;
                            this.x = 0 + 600;
                            this.movementOpportunityTime = 5000;
                            this.movementActive = false;
                            // game.ventwalk.Play();
                            // game.stare.Stop();
                            this.AInum = 0;
                            this.gameScreen.danger = 0;
                            console.log("Misa attack evaded");
                        }      
                    }
                    else
                    {
                        this.gameScreen.jumpscareID = 1;
                        //game.stare.Stop();
                        this.gameScreen.switchScreenState(2);
                    }
                    break;
                    case "Juan":
                    if (this.gameScreen.maskbuttonactive > 0 && this.gameScreen.maskbuttonactive < 3)
                    {
                        // I am just lazy  
                        // if (this.gameScreen.stare.State != SoundState.Playing)
                        // {
                        //     this.gameScreen.stare.Play();
                        // }
                        this.maskTimer.Update(delta);
                        switch (this.alphaoverlay)
                        {
                            case 0:
                                this.alphaoverlay = 0.25;
                                break;
                            case 0.25:
                                this.alphaoverlay = 0.5;
                                break;
                            case 0.5:
                                this.alphaoverlay = 0.75;
                                break;
                            case 0.75:
                                this.alphaoverlay = 1;
                                break;
                            case 1:
                                this.alphaoverlay = 0;
                                break;
                            default:
                                this.alphaoverlay = 0;
                                break;
                        }
                    }
                    else
                    {
                        this.gameScreen.jumpscareID = 2;
                       //  this.gameScreen.stare.Stop();
                        this.gameScreen.switchScreenState(2);
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
                    if (this.camTimer.IsRunning == false)
                    {
                        this.camTimer.finishCallback = () => // give less than 1 second window to put on a mask
                        {
                            if (this.Name != "Carlos" && this.Name != "Gustavo") {
                                if (this.gameScreen.maskbuttonactive == 0)
                                {
                                    this.gameScreen.jumpscareID = this.ID;
                                    // this.gameScreen.stare.Stop();
                                    this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                                }
                                else
                                {
                                    this.camTimer.Stop();
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
                                    this.camTimer = null;
                                }
                            }
                            else if (this.Name == "Gustavo")
                            {
                                if (this.gameScreen.maskbuttonactive == 0)
                                {
                                    this.location = 14;
                                    this.attacking = 0;
                                    this.AInum = 0;
                                }
                                else
                                {
                                    this.camTimer.Stop();
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
                        // fix  this.officeAnimatronicsRNG = this.gameScreen.rng.Next(1,11);
                    }
                    else
                    {
                        if (this.gameScreen.camerabuttonactive == 0) this.officeAnimatronicsRNGAttemptMade = false;
                    }
                    if (this.officeAnimatronicsRNG >= 8 && this.gameScreen.camerabuttonactive == 3) // makes it a bit more unpredictable, waits for darien to leave
                    {
                        this.gameScreen.stare.Play();
                        this.movementActive = true;
                        this.location = 14; // he's about to jumpscare
                        this.camTimer = new Timer(TimeSpan.FromMilliseconds(1000));
                        if (this.camTimer.IsRunning == false)
                        {
                            this.camTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 0 || this.gameScreen.maskbuttonactive == 3) {
                                    this.gameScreen.stare.Stop();
                                    this.gameScreen.jumpscareID = this.ID;
                                    this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                                }
                                else
                                {
                                    alphaoverlay = 1;
                                    this.gameScreen.stare.Stop();
                                    this.camTimer.Stop();
                                    this.camTimer = null;
                                    this.location = 8;
                                    this.movementActive = false;
                                    this.AInum = 0;
                                    this.gameScreen.danger = 0;
                                    console.log("Ramiro attack evaded");
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
                        this.gameScreen.stare.Play();
                        this.gameScreen.darienlaugh2.Play();
                        this.movementActive = true;
                        this.location = 14; // he's about to jumpscare
                        let jumpscareInterval = this.gameScreen.rng.Next(1, 3) == 2? 5000 : 8000;
                        this.officeJumpscareTimer = new Timer (TimeSpan.FromMilliseconds(jumpscareInterval));
                        this.camTimer = new Timer(TimeSpan.FromMilliseconds(this.gameScreen.rng.Next(1, 3) == 2? 500 : 250));
                        if (this.camTimer.IsRunning == false)
                        {
                            this.camTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 0 || this.gameScreen.maskbuttonactive == 3) {
                                    this.gameScreen.stare.Stop();
                                    this.gameScreen.jumpscareID = this.ID;
                                    this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                                }
                            };  
                            this.camTimer.Start();
                        }
                        if (this.officeJumpscareTimer.IsRunning == false)
                        {
                            this.officeJumpscareTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 1 || this.gameScreen.maskbuttonactive == 2) {
                                    this.alphaoverlay = 1;
                                    this.gameScreen.stare.Stop();
                                    this.camTimer.Stop();
                                    this.camTimer = null;
                                    this.officeJumpscareTimer.Stop();
                                    this.officeJumpscareTimer = null;
                                    this.location = this.gameScreen.rng.Next(0,2) == 0? 10 : 3; // either prize corner or party room 4
                                    this.movementActive = false;
                                    this.AInum = 0;
                                    this.gameScreen.danger = 0;
                                    console.log("Darien attack evaded");
                                }
                            };  
                            this.officeJumpscareTimer.Start();
                        }
                    }
                }
                if (Name == "Marlon" && location == 16)
                {
                    if (this.officeAnimatronicsRNGAttemptMade == false && this.gameScreen.camerabuttonactive == 3 && this.gameScreen.animatronics[6].location != 14 && this.gameScreen.animatronics[2].location != 14)
                    {
                        this.officeAnimatronicsRNGAttemptMade = true;
                        this.officeAnimatronicsRNG = this.gameScreen.rng.Next(1,11);
                    }
                    else
                    {
                        if (this.gameScreen.camerabuttonactive == 0) this.officeAnimatronicsRNGAttemptMade = false;
                    }
                    if (this.officeAnimatronicsRNG >= 7 && this.gameScreen.camerabuttonactive == 3) // final attack attempt
                    {
                        this.gameScreen.stare.Play();
                        this.movementActive = true;
                        this.location = 14; // he's about to jumpscare
                        let jumpscareInterval = this.gameScreen.rng.Next(1, 3) == 2? 4000 : 9000;
                        this.officeJumpscareTimer = new Timer(TimeSpan.FromMilliseconds(jumpscareInterval));
                        this.camTimer = new Timer(TimeSpan.FromMilliseconds(1250 / (this.marlonBlackoutCounter + 1)));
                        if (this.camTimer.IsRunning == false)
                        {
                            this.camTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 0 || this.gameScreen.maskbuttonactive == 3) {
                                    this.gameScreen.stare.Stop();
                                    this.gameScreen.jumpscareID = ID;
                                    this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                                }
                            };  
                            this.camTimer.Start();
                        }
                        if (this.officeJumpscareTimer.IsRunning == false)
                        {
                            this.officeJumpscareTimer.finishCallback = () => // give 1 second window to put on a mask
                            {
                                if (this.gameScreen.maskbuttonactive == 1 || this.gameScreen.maskbuttonactive == 2) {
                                    this.marlonBlackoutCounter++;
                                    this.alphaoverlay = 1;
                                    this.gameScreen.stare.Stop();
                                    this.camTimer.Stop();
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
                                    this.gameScreen.danger = 0;
                                    console.log("Marlon attack evaded");
                                }
                            };  
                            this.officeJumpscareTimer.Start();
                        }
                    }
                }

                if (this.camTimer != null && this.camTimer.IsRunning) {
                    this.camTimer.Update(gameTime);
                    if (this.officeJumpscareTimer != null && this.officeJumpscareTimer.IsRunning) this.officeJumpscareTimer.Update(gameTime);
                    switch (this.alphaoverlay)
                        {
                            case 0:
                                this.alphaoverlay = 0.25;
                                break;
                            case 0.25:
                                this.alphaoverlay = 0.5;
                                break;
                            case 0.5:
                                this.alphaoverlay = 0.75;
                                break;
                            case 0.75:
                                this.alphaoverlay = 1;
                                break;
                            case 1:
                                this.alphaoverlay = 0;
                                break;
                            default:
                                this.alphaoverlay = 0;
                                break;
                        }
                    if (this.Name == "Darien" && (this.gameScreen.maskbuttonactive == 3)) {
                        this.gameScreen.stare.Stop();
                        this.gameScreen.jumpscareID = ID;
                        this.gameScreen.switchScreenState(2); // force jumpscare if leaving cameras
                    }
                }
                if (this.location == 14 || this.location == 13 || this.location == 12 || this.location == 17)
                {
                    if (this.gameScreen.camerabuttonactive == 1 || this.gameScreen.camerabuttonactive == 2)
                    {
                        this.cameraLookingTimer.Update(this.gameTime);
                    }
                    if (this.gameScreen.camerabuttonactive == 3)
                    {
                        this.cameraLookingTimer.Reset();
                    }
                    if (this.Name == "Gustavo" && this.gameScreen.garble.State != SoundState.Playing)
                    {
                        this.gameScreen.garble.Play();
                    }
                }
        } 
        
  }
movementOpportunity()
    {
        if (this.Name != "Nasir")
        {
            if (this.gameScreen.screenState == 1 && this.gameScreen.cameraScreen.cameraspot == this.location && this.gameScreen.cameraScreen.darieninterrupt == false)
            {
                console.log(this.Name + " movement failed, on camera");
            }
            else if (this.gameScreen.flashlightstate == 3 && this.location == 12)
            {
                console.log(this.Name + " movement failed, flashlight on vent");
            }
            else if (this.gameScreen.flashlightstate == 2 && this.location == 13)
            {
                console.log(this.Name + " movement failed, flashlight on vent");
            }
            else
            {
                let chance = this.gameScreen.rng.Next(0, 23) + 1;
                if (this.AInum >= chance && this.attacking < 2)
                {
                    if (this.gameScreen.maskbuttonactive > 0 && this.gameScreen.maskbuttonactive < 3 && this.attacking == 1)
                    {
                        this.attacking = 2;
                        this.scrollspeed = 0.20 + (this.gameScreen.rng.NextDouble() / 5); // randomize speed a bit
                        if (this.Name == "Juan")
                        {
                            this.maskTimer = new Timer(TimeSpan.FromSeconds(this.gameScreen.rng.Next(3, 5)));
                            this.maskTimer.finishCallback = () => {
                                this.alphaoverlay = 1;
                                this.attacking = 0;
                                this.location = 6;
                                this.movementActive = false;
                                this.gameScreen.ventwalk.Play();
                                this.gameScreen.stare.Stop();
                                this.AInum = 0;
                                this.gameScreen.danger = 0;
                                console.log("Juan attack evaded");
                            };
                            this.maskTimer.Start();
                        }
                        if (this.Name == "Carlos")
                        {
                            this.maskTimer = new Timer(TimeSpan.FromSeconds(this.gameScreen.rng.Next(5, 7)));
                            this.maskTimer.finishCallback = () => {
                                this.attacking = 0;
                                this.location = 9;
                                this.movementActive = false;
                                this.gameScreen.ventwalk.Play();
                                this.AInum = 0;
                                this.gameScreen.danger = 0;
                                console.log("Carlos attack evaded");
                            };
                            this.maskTimer.Start();
                        }
                        if (this.Name == "Gustavo")
                        {
                            this.maskTimer = new Timer(TimeSpan.FromSeconds(this.gameScreen.rng.Next(5, 7)));
                            this.maskTimer.finishCallback = () => {
                                this.attacking = 0;
                                this.location = 11;
                                this.movementActive = false;
                                this.gameScreen.ventwalk.Play();
                                this.AInum = 0;
                                this.gameScreen.danger = 0;
                                console.log("Gustavo attack evaded");
                            };
                            this.maskTimer.Start();
                        }
                        console.log(this.Name + " is attacking!");
                    }

                    let index = Array.indexOf(this.movementPath, this.location);
                    if (index < this.movementPath.length - 1)
                    {
                        if ((this.ID < 3 || this.ID == 7 || this.ID == 6) && index != this.movementPath.length - 2) {
                            this.location = this.movementPath[index + 1];

                            if (this.Name == "Gustavo") // just plays anytime he moves i guess
                            {
                                if (this.location != 4 && this.location != 5 && this.location != 12 && this.location != 13)
                                {
                                    this.gameScreen.metalwalk.Play();
                                }
                            }
                            if (this.Name == "Carlos")
                            {
                                switch (this.gameScreen.rng.Next(1, 4))
                                {
                                    case 2:
                                    this.gameScreen.carlos2.Play();
                                    break;
                                    case 3:
                                    this.gameScreen.carlos3.Play();
                                    break;
                                    default:
                                    this.gameScreen.carlos1.Play();
                                    break;
                                }

                            }
                            if (this.location == 4 || this.location == 5)
                            {
                                this.gameScreen.ventwalk.Play();
                            }
                            if (this.location == 12 || this.location == 13) // vent locations
                            {
                                this.gameScreen.metalwalk.Play();
                            }
                            this.moved = true;
                            Console.WriteLine(this.Name + " movement successful");
                            this.movedTimer = new timer(500);
                            this.movedTimer.finishCallback = () => { this.moved = false; this.gameScreen.cameraScreen.animatronicForceOff = false; };
                            this.movedTimer.Start(); // so cameras disable for a second after moving
                        }
                        else if (this.Name != "Misa" && this.Name != "Juan" && this.Name != "Carlos" && this.Name != "Gustavo")
                        {
                            this.location = this.movementPath[index + 1];
                            this.moved = true;
                            Console.WriteLine(this.Name + " movement successful");
                            this.movedTimer = new Timer(TimeSpan.FromMilliseconds(500));
                            this.movedTimer.finishCallback = () => { this.moved = false; this.gameScreen.cameraScreen.animatronicForceOff = false; };
                            this.movedTimer.Start(); // so cameras disable for a second after movin
                        }
                        if ((this.ID < 3 || this.ID == 7 || this.ID == 6) && index + 1 == movementPath.Length - 2)
                        {
                            if (this.attacking == 0) {
                                this.attacking = 1;
                                console.log("mask 0 to 1");
                            }
                            this.movementOpportunityTime = 500;
                            this.AInum = 10; // 50 percent chance
                        }
                    }
                }
                else
                {
                    if (this.attacking != 2) console.log(this.Name + " movement failed");
                }
            }
            if (this.attacking == 0) this.movementOpportunityTime = 5000;
            if (this.attacking > 0) this.movementOpportunityTime = 500;
            this.movementActive = false;
        }
        else
        {
            if (this.nasirValue3 == 0)
            {
                if (this.AInum >= 21 + game.rng.Next(1, 5) - this.nasirValue1)
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
                    console.log(this.Name + " movement successful");
                    this.movedTimer = new Timer(TimeSpan.FromMilliseconds(500));
                    this.movedTimer.finishCallback = () => { this.moved = false; this.gameScreen.cameraScreen.animatronicForceOff = false; };
                    this.movedTimer.Start(); // so cameras disable for a second after moving
                } 
                else
                {
                    console.log(this.Name + " movement failed");
                }
            }
            else
            {
                console.log(this.Name + " movement failed");
            }
            if (this.nasirValue3 > 12) this.nasirValue3 = 0;
            if (this.nasirValue3 > 0) this.nasirValue3++;
            this.movementActive = false;
        }
    }
}