//Options Screen
function OptionsScreen() {
	const MENU_BG_COLOR = "#010119";
	const MAX_SPEED = 25;

    const DEFAULT_OPTIONS = {
        ISMUTED: false,
        MUSIC: 0.5,
        SFX: 0.5,
        GAMESPEED: 1.5,
        AUTOFIRING: "Off",
    }

	const selectionPosition = {
		Music:{x:GameField.midX + 90, y:(GameField.y + 60 + GameField.height / 4)},
		SFX:{x:GameField.midX + 90, y:(GameField.y + 120 + GameField.height / 4)},
		Speed:{x:GameField.midX + 90, y:(GameField.y + 180 + GameField.height / 4)},
        AutoFiring:{x:GameField.midX + 90, y:(GameField.y + 240 + GameField.height / 4)},
        ResetOptions:{x:GameField.midX + 90, y:(GameField.y + 300 + GameField.height / 4)},
        Menu:{x:GameField.midX + 90, y:(GameField.y + 360 + GameField.height / 4)}
	};

    let autoFiring;
    let selectorPositionIndex = 0;
    let selectorPosition = {x:selectionPosition.Music.x + 35, y:selectionPosition.Music.y};
    let selectorSprite;
    let thrusterSprite;
    let thrusterSize = {};
    let thrusterPosition = {x:0, y:0};
    let starfield;
	this.selections = [
//	    {screen: GAME_SCREEN, title: textStrings.Play},
	    {screen: MENU_SCREEN, title: textStrings.Main},
	   ];
    this.transitionIn = function () {
	    autoFiring = localStorageHelper.getObject("autoFiring");
	    if(autoFiring === null) {
		    autoFiring = "off";
		    localStorageHelper.setObject("autoFiring", "off");
	    }
	    let tmpSpeed = localStorageHelper.getFloat("gameSpeed");
	    if(tmpSpeed === null) {
		    localStorageHelper.setFloat("gameSpeed", gameSpeed);
	    } else {
		    gameSpeed = tmpSpeed;
	    }
        selectorPositionIndex = 0;
        selectorPosition = {x:selectionPosition.Music.x + 35, y:selectionPosition.Music.y};

        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 8, 52, 32, false, true, {min:0, max:0}, 0, {min:0, max:0}, Math.MAX_VALUE, {min:5, max:7}, 128);
        thrusterSprite = new AnimatedSprite(playerThruster, 3, 33, 32, false, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);

		thrusterSize = {width:thrusterSprite.width, height:thrusterSprite.height};

        currentBackgroundMusic.setCurrentTrack(AudioTracks.Options);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();
        }
        else {
            currentBackgroundMusic.play();
        }
    };

    this.transitionOut = function () {
//        uiSelect.play();
		currentBackgroundMusic.pause();
    };

    this.run = function helpScreenRun(deltaTime) {
	    update(deltaTime);

	    draw(this.selections, selectorPositionIndex);
    };

	const update = function(deltaTime) {
		selectorSprite.update(deltaTime);
		thrusterSprite.update(deltaTime);

		starfield.update(deltaTime);
	};

    this.modifySelectedOption = function (selectorPositionIndex, direction = 1) {
        direction = direction == 1 ? 1 : -1;
        menuMove.play();
        // OPTION 0: Music Volume
        if(selectorPositionIndex === 0) {
            const currentVolume = MusicVolumeManager.getVolume();
            MusicVolumeManager.setVolume(currentVolume + 0.1 * direction);
        // OPTION 1: Sfx Volume
        } else if(selectorPositionIndex === 1) {
            const currentVolume = SFXVolumeManager.getVolume();
            SFXVolumeManager.setVolume(currentVolume + 0.1 * direction);
        // OPTION 2: Game Speed
        } else if(selectorPositionIndex === 2) {
            gameSpeed += (direction/2);
            if(direction == 1 && gameSpeed > MAX_SPEED) {
                gameSpeed = 1;
            }
            else if(direction != 1 && gameSpeed < 1) {
                gameSpeed = MAX_SPEED;
            }
            localStorageHelper.setFloat("gameSpeed", gameSpeed);
        // OPTION 3: Auto-Firing
        } else if(selectorPositionIndex === 3) {
            if(autoFiring === "Off") {
                autoFiring = "On";
                localStorageHelper.setObject("autoFiring", "On");
            } else {
                autoFiring = "Off";
                localStorageHelper.setObject("autoFiring", "Off");
            }
            
            holdKey[KEY_X] = false;
        // OPTION 4: Reset to Defaults
        } else if (selectorPositionIndex === 4) {
            isMuted = DEFAULT_OPTIONS.ISMUTED;
            localStorageHelper.setBoolean('isMuted', isMuted);

            MusicVolumeManager.setVolume(DEFAULT_OPTIONS.MUSIC);
            SFXVolumeManager.setVolume(DEFAULT_OPTIONS.SFX);

            gameSpeed = DEFAULT_OPTIONS.GAMESPEED;
            localStorageHelper.setFloat("gameSpeed", gameSpeed);
            
            autoFiring = DEFAULT_OPTIONS.AUTOFIRING;
            localStorageHelper.setObject("autoFiring", DEFAULT_OPTIONS.AUTOFIRING);
        // OPTION 5: Return to Main Menu
        } else if (selectorPositionIndex === 5) {
            menuSelect.play();
            ScreenStates.setState(this.selections[0].screen);
        }
    };

    this.control = function gamePlayFinishedScreenControl(keydownMap, pressed){
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }

        if (this.keysPressed(KEY_UP) || this.keysPressed(KEY_W)) {
	        menuMove.play();
            selectorPositionIndex--;
            if (selectorPositionIndex < 0) {
                selectorPositionIndex += Object.keys(selectionPosition).length;
            }
            adjustSelectorPosition();
            return true;
        } else if (this.keysPressed(KEY_DOWN) || this.keysPressed(KEY_S)) {
	        menuMove.play();
            selectorPositionIndex++;
            if (selectorPositionIndex === Object.keys(selectionPosition).length) {
                selectorPositionIndex = 0;
            }
            adjustSelectorPosition();
            return true;
        } else if (this.keysPressed(KEY_RIGHT) || this.keysPressed(KEY_D)) {
            if (selectorPositionIndex < 4) {    // so that left/right, A/D keys don't affect "Reset to Defaults" and "Main Menu"
                this.modifySelectedOption(selectorPositionIndex);
            }
            return true;
        } else if (this.keysPressed(KEY_LEFT) || this.keysPressed(KEY_A)) {
            if (selectorPositionIndex < 4) {    // so that left/right, A/D keys don't affect "Reset to Defaults" and "Main Menu"
                this.modifySelectedOption(selectorPositionIndex, 0);
            }
            return true;
        } else if (this.keysPressed(KEY_PLUS) || this.keysPressed(KEY_NUMPAD_ADD)) {
            menuMove.play();
            if (selectorPositionIndex < 4) {    // so that left/right, A/D keys don't affect "Reset to Defaults" and "Main Menu"
                this.modifySelectedOption(selectorPositionIndex);
            }
            return true;
        } else if (this.keysPressed(KEY_MINUS) || this.keysPressed(KEY_NUMPAD_SUBTRACT)) {
            menuMove.play();
            if (selectorPositionIndex < 4) {    // so that left/right, A/D keys don't affect "Reset to Defaults" and "Main Menu"
                this.modifySelectedOption(selectorPositionIndex, 0);
            }
            return true;
        } else if (this.keysPressed(KEY_SHIFT, KEY_ENTER) || this.keysPressed(KEY_SHIFT, KEY_SPACE)) {
            this.modifySelectedOption(selectorPositionIndex, 0);
            return true;
        } else if (this.keysPressed(KEY_ENTER) || this.keysPressed(KEY_SPACE)) {
            this.modifySelectedOption(selectorPositionIndex);            
            return true;
        } else if (this.keysPressed(KEY_M)) {
            toggleMute();
            return true;
        }

        return false;
    };

    const adjustSelectorPosition = function() {
	    if(selectorPositionIndex === 0) {
		    selectorPosition.x = selectionPosition.Music.x + 35;
		    selectorPosition.y = selectionPosition.Music.y;
	    } else if(selectorPositionIndex === 1) {
		    selectorPosition.x = selectionPosition.SFX.x + 35;
		    selectorPosition.y = selectionPosition.SFX.y;
		} else if(selectorPositionIndex === 2) {
		    selectorPosition.x = selectionPosition.Speed.x + 35;
		    selectorPosition.y = selectionPosition.Speed.y;
		} else if(selectorPositionIndex === 3) {
		    selectorPosition.x = selectionPosition.AutoFiring.x + 35;
		    selectorPosition.y = selectionPosition.AutoFiring.y;
		} else if(selectorPositionIndex === 4) {
		    selectorPosition.x = selectionPosition.ResetOptions.x + 35;
		    selectorPosition.y = selectionPosition.ResetOptions.y;
		} else if(selectorPositionIndex === 5) {
		    selectorPosition.x = selectionPosition.Menu.x + 35;
		    selectorPosition.y = selectionPosition.Menu.y;
		}
    }

	const draw = function(selections, selectorPositionIndex) {
		// render the menu background
        drawBG();

        starfield.draw();

        // render the logo overlay
        // drawLogo();

		//draw the game title at the top of the screen
		drawTitle();

		//draw the actual help info
		drawOptions();
		
		//draw the thruster
		let thrusterMod = timer.getCurrentTime() % 16 < 8 ? 0 : 3;
		thrusterPosition.x = selectorPosition.x - 28 + thrusterMod;
		thrusterPosition.y = selectorPosition.y;
		//this.thrusterSize.width = thrusterSprite.width * thrusterMod;
		thrusterSprite.drawAt(thrusterPosition.x, thrusterPosition.y, thrusterSize.width, thrusterSize.height);
		
        //draw selector sprite
        selectorSprite.drawAt(selectorPosition.x, selectorPosition.y, 52, 32);

		canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);
	};

	const drawBG = function menuScreenDrawBG() {
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);
    };

    const drawTitle = function() {
	    gameFont.printTextAt(gameTitle.Main, {x:GameField.midX, y:(GameField.y + 60)}, 30, textAlignment.Center);
	    gameFont.printTextAt(gameTitle.Subtitle, {x:GameField.midX, y:(GameField.y + 120)}, 30, textAlignment.Center);
    };

    const drawOptions = function() {
	    gameFont.printTextAt("music volume - " + (Math.round(MusicVolumeManager.getVolume() * 10)).toString(), selectionPosition.Music, 25, textAlignment.Right);
	    gameFont.printTextAt("SFX volume - " + (Math.round(SFXVolumeManager.getVolume() * 10)).toString(), selectionPosition.SFX, 25, textAlignment.Right);
	    gameFont.printTextAt("Game Speed - " + (gameSpeed.toString()), selectionPosition.Speed, 25, textAlignment.Right);
        gameFont.printTextAt("Auto-firing - " + (autoFiring), selectionPosition.AutoFiring, 25, textAlignment.Right);
        gameFont.printTextAt("Reset to Defaults", selectionPosition.ResetOptions, 25, textAlignment.Right);
	    gameFont.printTextAt(textStrings.Main, selectionPosition.Menu, 25, textAlignment.Right);
    };

    return this;
}
