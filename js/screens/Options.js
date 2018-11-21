//Options Screen
function OptionsScreen() {
	const MENU_BG_COLOR = "#010119";

	const selectionPosition = {
		Music:{x:GameField.midX + 90, y:(GameField.y + 60 + GameField.height / 4)},
		SFX:{x:GameField.midX + 90, y:(GameField.y + 120 + GameField.height / 4)},
		Speed:{x:GameField.midX + 90, y:(GameField.y + 180 + GameField.height / 4)},
		AutoFiring:{x:GameField.midX + 90, y:(GameField.y + 240 + GameField.height / 4)},
		Menu:{x:GameField.midX + 90, y:(GameField.y + 300 + GameField.height / 4)}
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
	    let tmpSpeed = localStorageHelper.getInt("gameSpeed");
	    if(tmpSpeed === null) {
		    localStorageHelper.setInt("gameSpeed", gameSpeed);
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
	        menuMove.play();
            if(selectorPositionIndex === 0) {
                const currentVolume = MusicVolumeManager.getVolume();
                MusicVolumeManager.setVolume(currentVolume + 0.1);
            } else if(selectorPositionIndex === 1) {
                const currentVolume = SFXVolumeManager.getVolume();
                SFXVolumeManager.setVolume(currentVolume + 0.1);
            } else if(selectorPositionIndex === 2) {
	            gameSpeed++;
	            localStorageHelper.setInt("gameSpeed", gameSpeed);
            } else if(selectorPositionIndex === 3) {
	            if(autoFiring === "Off") {
		            autoFiring = "On";
					localStorageHelper.setObject("autoFiring", "On");
	            } else {
					autoFiring = "Off";
					localStorageHelper.setObject("autoFiring", "Off");
	            }
                
                holdKey[KEY_X] = false;
            }
            return true;
        } else if (this.keysPressed(KEY_LEFT) || this.keysPressed(KEY_A)) {
	        menuMove.play();
            if(selectorPositionIndex === 0) {
                const currentVolume = MusicVolumeManager.getVolume();
                MusicVolumeManager.setVolume(currentVolume - 0.1);
            } else if(selectorPositionIndex === 1) {
                const currentVolume = SFXVolumeManager.getVolume();
                SFXVolumeManager.setVolume(currentVolume - 0.1);
            } else if(selectorPositionIndex === 2) {
	            gameSpeed--;
	            if(gameSpeed < 1) {
		            gameSpeed = 1;
	            }
	            localStorageHelper.setInt("gameSpeed", gameSpeed);
            } else if(selectorPositionIndex === 3) {
	            if(autoFiring === "Off") {
		            autoFiring = "On";
					localStorageHelper.setObject("autoFiring", "On");
	            } else {
					autoFiring = "Off";
					localStorageHelper.setObject("autoFiring", "Off");
	            }
                
                holdKey[KEY_X] = false;
            }
            return true;
        } else if (this.keysPressed(KEY_PLUS)) {
	        menuMove.play();
            if(selectorPositionIndex === 0) {
                const currentVolume = MusicVolumeManager.getVolume();
                MusicVolumeManager.setVolume(currentVolume + 0.1);
            } else if(selectorPositionIndex === 1) {
                const currentVolume = SFXVolumeManager.getVolume();
                SFXVolumeManager.setVolume(currentVolume + 0.1);
            }
            return true;
        } else if (this.keysPressed(KEY_MINUS)) {
	        menuMove.play();
            if(selectorPositionIndex === 0) {
                const currentVolume = MusicVolumeManager.getVolume();
                MusicVolumeManager.setVolume(currentVolume - 0.1);
            } else if(selectorPositionIndex === 1) {
                const currentVolume = SFXVolumeManager.getVolume();
                SFXVolumeManager.setVolume(currentVolume - 0.1);
            }
            return true;
        } else if (this.keysPressed(KEY_ENTER)) {
            if (selectorPositionIndex === 4) {
	            menuSelect.play();
                ScreenStates.setState(this.selections[0].screen);
            }
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
		    selectorPosition.x = selectionPosition.Menu.x + 35;
		    selectorPosition.y = selectionPosition.Menu.y;
		}
    }

	const draw = function(selections, selectorPositionIndex) {
		// render the menu background
        drawBG();

        starfield.draw();

        // render the logo overlay
//        drawLogo();

		//draw the game title at the top of the screen
		drawTitle();

		//draw the actual help info
		drawOptions();
		
		//draw the thruster
		let thrusterMod = timer.getCurrentTime() % 16 < 8 ? 0 : 3;
		thrusterPosition.x = selectorPosition.x - 28 + thrusterMod;
		thrusterPosition.y = selectorPosition.y;
		//this.thrusterSize.width = thrusterSprite.width * thrusterMod;
		thrusterSprite.drawAt(thrusterPosition, thrusterSize);
		
        //draw selector sprite
        selectorSprite.drawAt(selectorPosition, {width:52, height:32});

		canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);
	};

	const drawBG = function menuScreenDrawBG() {
        // fill the background since there is no image for now
        drawRect(GameField.x, GameField.y - GameField.bgOffset, GameField.width, GameField.height + GameField.bgOffset, MENU_BG_COLOR);
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
	    gameFont.printTextAt(textStrings.Main, selectionPosition.Menu, 25, textAlignment.Right);
    };

    return this;
}
