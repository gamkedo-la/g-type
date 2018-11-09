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

    let autoFiring = "Off";
    let selectorPositionIndex = 0;
    let selectorPosition = {x:selectionPosition.Music.x + 35, y:selectionPosition.Music.y};
    let selectorSprite;
    let starfield;
	this.selections = [
//	    {screen: GAME_SCREEN, title: textStrings.Play},
	    {screen: MENU_SCREEN, title: textStrings.Main},
	   ];
    this.transitionIn = function () {
        selectorPositionIndex = 0;
        selectorPosition = {x:selectionPosition.Music.x + 35, y:selectionPosition.Music.y};
        
        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 6, 62, 27, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
        
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
		
		starfield.update(deltaTime);
	};
    
    this.control = function gamePlayFinishedScreenControl(keydownMap, pressed){
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }
        
        if (this.keysPressed(KEY_UP) || this.keysPressed(KEY_W)) {
            selectorPositionIndex--;
            if (selectorPositionIndex < 0) {
                selectorPositionIndex += Object.keys(selectionPosition).length;
            }
            adjustSelectorPosition();
            return true;
        } else if (this.keysPressed(KEY_DOWN) || this.keysPressed(KEY_S)) {
            selectorPositionIndex++;
            if (selectorPositionIndex === Object.keys(selectionPosition).length) {
                selectorPositionIndex = 0;
            }
            adjustSelectorPosition();
            return true;
        } else if (this.keysPressed(KEY_RIGHT) || this.keysPressed(KEY_D)) {
            if(selectorPositionIndex === 0) {
                const currentVolume = MusicVolumeManager.getVolume();
                MusicVolumeManager.setVolume(currentVolume + 0.1);
            } else if(selectorPositionIndex === 1) {
                const currentVolume = SFXVolumeManager.getVolume();
                SFXVolumeManager.setVolume(currentVolume + 0.1);
            }
            if(selectorPositionIndex === 3 && autoFiring !== "On") {
                autoFiring = "On";
                holdKey[KEY_X] = true;
            }
            return true;
        } else if (this.keysPressed(KEY_LEFT) || this.keysPressed(KEY_A)) {
            if(selectorPositionIndex === 0) {
                const currentVolume = MusicVolumeManager.getVolume();
                MusicVolumeManager.setVolume(currentVolume - 0.1);
            } else if(selectorPositionIndex === 1) {
                const currentVolume = SFXVolumeManager.getVolume();
                SFXVolumeManager.setVolume(currentVolume - 0.1);
            }        
            if(selectorPositionIndex === 3 && autoFiring !== "Off") {
                autoFiring = "Off";
                holdKey[KEY_X] = false;
            }
            return true;
        } else if (this.keysPressed(KEY_PLUS)) {
            if(selectorPositionIndex === 0) {
                const currentVolume = MusicVolumeManager.getVolume();
                MusicVolumeManager.setVolume(currentVolume + 0.1);
            } else if(selectorPositionIndex === 1) {
                const currentVolume = SFXVolumeManager.getVolume();
                SFXVolumeManager.setVolume(currentVolume + 0.1);
            }
            return true;
        } else if (this.keysPressed(KEY_MINUS)) {
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
        
        //draw selector sprite
        selectorSprite.drawAt(selectorPosition, {width:62, height:27});

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
	    gameFont.printTextAt("Game Speed - " + ("1"), selectionPosition.Speed, 25, textAlignment.Right);
	    gameFont.printTextAt("Auto-firing - " + (autoFiring), selectionPosition.AutoFiring, 25, textAlignment.Right);
	    gameFont.printTextAt(textStrings.Main, selectionPosition.Menu, 25, textAlignment.Right);
    };
        
    return this;
}
