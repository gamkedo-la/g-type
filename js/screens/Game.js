function GamePlayScreen () {
	const GAME_BG_COLOR = "#010119";
	this.properties = null;
    let currentLevelComplete = false;
    
    const selectionPosition = {
		Resume:{x:GameField.midX - 60, y:(GameField.y + 120 + GameField.height / 4)},
		MainMenu:{x:GameField.midX + 180, y:(GameField.y + 120 + GameField.height / 4)}
	};
    
    let pausedPosition = {x:GameField.midX - 100, y:GameField.midY - 80};
    let selectorPositionIndex = 0;
    let selectorPositionOffset = {x:16, y:3};
    let selectorPosition = {x:selectionPosition.Resume.x + selectorPositionOffset.x, y:selectionPosition.Resume.y + selectorPositionOffset.y};
    let selectorSprite;
    let thrusterSprite;
    let thrusterSize = {};
    let thrusterPosition = {x:0, y:0};

    this.transitionIn = function gamePlayScreenTransitionIn(index = currentLevelIndex) {
        scene = new GameScene(index, this.properties.player, this.properties.uiManager, this.properties.bgTime);
        currentLevelComplete = false;

        if(this.properties.code === true) {
	        scene.activateBasePowerUps();
        }
        
        let backgroundMusicIndex;
        if(index === 0) {
	        backgroundMusicIndex = AudioTracks.Level1;
        } else if(index === 1) {
	        backgroundMusicIndex = AudioTracks.Level2;
        } else if(index === 2) {
	        backgroundMusicIndex = AudioTracks.Level3;
        } else if(index === 3) {
	        backgroundMusicIndex = AudioTracks.WarpLevel;
        }
        
        currentBackgroundMusic.setCurrentTrack(backgroundMusicIndex);
        if(currentBackgroundMusic.getTime() > 0) {
            currentBackgroundMusic.resume();    
        }
        else {
            currentBackgroundMusic.play();
        }

        selectorSprite = new AnimatedSprite(player1Sheet, 8, 52, 32, false, true, {min:0, max:0}, 0, {min:0, max:0}, Math.MAX_VALUE, {min:5, max:7}, 128);
        thrusterSprite = new AnimatedSprite(playerThruster, 3, 33, 32, false, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);

		thrusterSize = {width:thrusterSprite.width, height:thrusterSprite.height};
    };
    
    this.transitionOut = function gamePlayScreenTransitionOut() {
        selectorPositionIndex = 0;
        selectorPosition = {x:selectionPosition.Resume.x + selectorPositionOffset.x, y:selectionPosition.Resume.y + selectorPositionOffset.y};
	    clearKeyboardInput();
	    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        currentBackgroundMusic.pause();
        allSFX.stop();
    };
    
    const clearKeyboardInput = function() {
	    holdKey[KEY_SPACE] = false;
	    holdKey[KEY_X] = false;
	    holdKey[KEY_UP] = false;
	    holdKey[KEY_W] = false;
	    holdKey[KEY_DOWN] = false;
	    holdKey[KEY_S] = false;
	    holdKey[KEY_LEFT] = false;
	    holdKey[KEY_A] = false;
	    holdKey[KEY_RIGHT] = false;
	    holdKey[KEY_D] = false;
    };
    
    this.run = function gamePlayScreenRun(deltaTime) {
        scene.update(deltaTime);
        
        scene.draw();

        if(scene.gameIsOver) {
            currentBackgroundMusic.setCurrentTrack(AudioTracks.GameOver);
            ScreenStates.setState(GAME_OVER_SCREEN);
        } else if((scene.levelIsComplete) && (!currentLevelComplete)) {
	        currentLevelComplete = true;
            if((currentLevelIndex === 0) && (scene.didCompleteWarpChallenge)) {
	            currentLevelIndex = WARP_INDEX;
	            ScreenStates.setState(GAME_SCREEN, {code: false, player: scene.getPlayerObject(), uiManager:scene.getUIManagerObject(), bgTime:scene.bgTime});
	        } else if(currentLevelIndex	=== WARP_INDEX) {
		        currentLevelIndex = 2;//warp only allows you to skip level 2 => next level must be level 3
		        this.cutSceneFor(currentLevelIndex);
	        } else {
		        this.cutSceneFor(++currentLevelIndex);
	        }           
        } else if(scene.beatTheGame) {
            currentBackgroundMusic.setCurrentTrack(AudioTracks.GameEnding);
            ScreenStates.setState(ENDING_SCREEN, {player: scene.getPlayerObject()});
        }
        
		if(currentBackgroundMusic.getTime() > currentBackgroundMusic.getDuration()) {
			currentBackgroundMusic.play();
		}
    };

    this.runPausedOptions = function (deltaTime) {
        this.drawPausedOptions(deltaTime);
        selectorSprite.update(deltaTime);
        thrusterSprite.update(deltaTime);
    };

    this.drawPausedOptions = function(deltaTime) {
        scene.draw();

        gameFont.printTextAt("[PAUSED]", pausedPosition, 24, textAlignment.Left);
	    gameFont.printTextAt("Resume", selectionPosition.Resume, 18, textAlignment.Right);
        gameFont.printTextAt("Main Menu", selectionPosition.MainMenu, 18, textAlignment.Right);

        //draw the thruster
		let thrusterMod = timer.getCurrentTime() % 16 < 8 ? 0 : 3;
		thrusterPosition.x = selectorPosition.x - 15 + thrusterMod;
		thrusterPosition.y = selectorPosition.y;
		thrusterSprite.drawAt(thrusterPosition.x, thrusterPosition.y, thrusterSize.width - 17, thrusterSize.height - 14);
		
        //draw selector sprite
        selectorSprite.drawAt(selectorPosition.x, selectorPosition.y, 32, 20);
    };
    
    this.adjustSelectorPosition = function() {
	    if(selectorPositionIndex === 0) {
		    selectorPosition.x = selectionPosition.Resume.x + selectorPositionOffset.x;
		    selectorPosition.y = selectionPosition.Resume.y + selectorPositionOffset.y;
	    } else if(selectorPositionIndex === 1) {
		    selectorPosition.x = selectionPosition.MainMenu.x + selectorPositionOffset.x;
		    selectorPosition.y = selectionPosition.MainMenu.y + selectorPositionOffset.y;
        }
    };

    this.modifySelectedOption = function (selectorPositionIndex, direction = 1) {
        direction = direction == 1 ? 1 : -1;
        menuMove.play();
        // OPTION 0: Resume
        if(selectorPositionIndex === 0) {
            menuSelect.play();            
            setPaused(false, ScreenStates.pauseCause);        
        // OPTION 1: Main Menu
        } else if(selectorPositionIndex === 1) {
            allHighScores.push(currentScore);
            allHighScores.sort((a, b) => b - a);
            if (allHighScores.length > 3){
                allHighScores.pop()
            }
            for(let i=0; i<allHighScores.length; i++){
                localStorageHelper.setFloat("highScore" + i, allHighScores[i]);
            }

            ScreenStates.setState(MENU_SCREEN);
            setPaused(false, ScreenStates.pauseCause);
            menuSelect.play();
        }
    }

    this.cutSceneFor = function(newCurrentLevel) {
        let newCutScene;
        switch(newCurrentLevel) {
            case 1:
                ScreenStates.setState(CUT_SCENE2_SCREEN, {code: false, player: scene.getPlayerObject(), uiManager:scene.getUIManagerObject()});
                break;
            case 2:
                ScreenStates.setState(CUT_SCENE3_SCREEN, {code: false, player: scene.getPlayerObject(), uiManager:scene.getUIManagerObject()});
                break;
            case 3:
                ScreenStates.setState(ENDING_SCREEN, {code: false, player: scene.getPlayerObject(), uiManager:scene.getUIManagerObject()});
                break;
        }
    };
    
    this.control = function gamePlayScreenControl(keydownMap, pressed){ // TO-DO: prevent multiple changes on single press
        // SHIP CONTROLS START        
        holdKey[KEY_UP] = this.keysPressed(KEY_UP) || this.keysPressed(KEY_W);
        holdKey[KEY_DOWN] = this.keysPressed(KEY_DOWN) || this.keysPressed(KEY_S);
        holdKey[KEY_LEFT] = this.keysPressed(KEY_LEFT) || this.keysPressed(KEY_A);
        holdKey[KEY_RIGHT] = this.keysPressed(KEY_RIGHT) || this.keysPressed(KEY_D);

        let autoFiring = localStorageHelper.getObject("autoFiring");
        holdKey[KEY_X] = this.keysPressed(KEY_X) || autoFiring === "On";
        // SHIP CONTROLS END

        if (ScreenStates.isPaused) {
            if (this.keysPressed(KEY_A) || this.keysPressed(KEY_LEFT)) {
                menuMove.play();
                selectorPositionIndex--;
                if (selectorPositionIndex < 0) {
                    selectorPositionIndex += Object.keys(selectionPosition).length;
                }
                this.adjustSelectorPosition();
                return true;
            } else if (this.keysPressed(KEY_D) || this.keysPressed(KEY_RIGHT)) {
                menuMove.play();
                selectorPositionIndex++;
                if (selectorPositionIndex === Object.keys(selectionPosition).length) {
                    selectorPositionIndex = 0;
                }
                this.adjustSelectorPosition();
                return true;
            } else if (this.keysPressed(KEY_ENTER) || this.keysPressed(KEY_SPACE)) {
                this.modifySelectedOption(selectorPositionIndex);
                return true;
            }
        }

        // CHEAT KEYS START
        if ((this.keysPressed(KEY_SHIFT, KEY_LEFT)) && (cheats.debugKeysEnabled)) {
            if (!pressed) {
                currentLevelIndex--; // TODO: Take into account level that does not exist.
                if(currentLevelIndex < 0) {
	                currentLevelIndex = (LevelData.length - 1);
                }
                this.transitionOut();
                this.transitionIn(currentLevelIndex); 
            }
            return true;
        } else if ((this.keysPressed(KEY_SHIFT, KEY_RIGHT)) && (cheats.debugKeysEnabled)) {
            if (!pressed) {
                currentLevelIndex++; // TODO: Take into account level that does not exist.
                if(currentLevelIndex === LevelData.length) {
	                currentLevelIndex = 0;
                }
                this.transitionOut();
                this.transitionIn(currentLevelIndex);
            }
            return true;
        }  else if (this.keysPressed(KEY_C)) { //Adding capsules
            if (!pressed && cheats.debugKeysEnabled) {
                scene.collectedCapsule();
            }
            return true;        
        } else if (this.keysPressed(KEY_L)) { //Adding lives
            if (!pressed && cheats.debugKeysEnabled) {
                scene.life();
            }
            return true;
        } else if (this.keysPressed(KEY_E)) { //Activating shields
            if (!pressed && cheats.debugKeysEnabled) {
                scene.activatedShield();
            }
            return true;
        } else if (this.keysPressed(KEY_J)) { //Activating missiles
            if (!pressed && cheats.debugKeysEnabled) {
                scene.activatedMissile();
            }
            return true;
        } else if (this.keysPressed(KEY_K)) { //Activating double
            if (!pressed && cheats.debugKeysEnabled) {
                scene.activatedDouble();
            }
            return true;
        } else if (this.keysPressed(KEY_H)) { //Activating laser
            if (!pressed && cheats.debugKeysEnabled) {
                scene.activatedLaser();
            }
            return true;
        } else if (this.keysPressed(KEY_T)) { //Activating triple
            if (!pressed && cheats.debugKeysEnabled) {
                scene.activatedTriple();
            }
            return true;
        } else if (this.keysPressed(KEY_G)) { //Activating ghost ship
            if (!pressed && cheats.debugKeysEnabled) {
                scene.activatedGhost();
            }
            return true;
        } else if (this.keysPressed(KEY_F)) { //Activating force
            if (!pressed && cheats.debugKeysEnabled) {
                scene.activatedForce();
            }
            return true;
        } else if (this.keysPressed(DIGIT_0)) {
            if((!pressed) && cheats.debugKeysEnabled) {
                worldSpeed = 0;
            }
            return true;
        } else if (this.keysPressed(DIGIT_1)) {
            if((!pressed) && cheats.debugKeysEnabled) {
                worldSpeed = 1;
            }
            return true;
        } else if (this.keysPressed(DIGIT_2)) {
            if((!pressed) && cheats.debugKeysEnabled) {
                worldSpeed = 1.25;
            }
            return true;
        } else if (this.keysPressed(DIGIT_3)) {
            if((!pressed) && cheats.debugKeysEnabled) {
                worldSpeed = 1.50;
            }
            return true;
        } else if (this.keysPressed(DIGIT_4)) {
            if((!pressed) && cheats.debugKeysEnabled) {
                worldSpeed = 1.75;
            }
            return true;
        } else if (this.keysPressed(DIGIT_5)) {
            if((!pressed) && cheats.debugKeysEnabled) {
                worldSpeed = 2.0;
            }
            return true;
        } else if (this.keysPressed(DIGIT_6)) {
            if((!pressed) && cheats.debugKeysEnabled) {
                worldSpeed = 2.25;
            }
            return true;
        } else if (this.keysPressed(DIGIT_7)) {
            if((!pressed) && cheats.debugKeysEnabled) {
                worldSpeed = 2.50;
            }
            return true;
        } else if (this.keysPressed(DIGIT_8)) {
            if((!pressed) && cheats.debugKeysEnabled) {
                worldSpeed = 2.75;
            }
            return true;
        } else if (this.keysPressed(DIGIT_9)) {
            if((!pressed) && cheats.debugKeysEnabled) {
                worldSpeed = 3.0;
            }
            return true;
        } else if (this.keysPressed(KEY_O)) {
            if((!pressed) && cheats.debugKeysEnabled) {
            scene.beatTheGame = true; // final boss defeated!
            }
            return true;        
        // CHEAT KEYS END
        
        } else if (this.keysPressed(KEY_X)) {
            showXtoFire = false;
            return true;
        } else if (this.keysPressed(KEY_SPACE)) {
            if(!pressed) {
                scene.activatePowerUp();
            }
            return true;
        } else if (this.keysPressed(KEY_ESCAPE) || this.keysPressed(KEY_BACKSPACE)) {
            if(!pressed) {
                setPaused(!ScreenStates.isPaused, PauseCause.PressedPause);
            }
            return true;        
        } else if (this.keysPressed(KEY_M)) {
            if(!pressed) {
                toggleMute();	            	
            }
            return true;
        } else if (this.keysPressed(KEY_PLUS) || this.keysPressed(KEY_NUMPAD_ADD)) {
            if(!pressed) {
                turnVolumeUp();
            }
            return true;
        } else if (this.keysPressed(KEY_MINUS) || this.keysPressed(KEY_NUMPAD_SUBTRACT)) {
            if(!pressed) {
                turnVolumeDown();
            }
            return true;
        } else if (this.keysPressed(KEY_P)) {
            if(!pressed) {
                if (ScreenStates.pauseCause === PauseCause.LostFocus) {
                    setPaused(!ScreenStates.isPaused, PauseCause.LostFocus);
                } else {
                    setPaused(!ScreenStates.isPaused, PauseCause.PressedPause);
                }
                selectorPositionIndex = 0;
                selectorPosition = {x:selectionPosition.Resume.x + selectorPositionOffset.x, y:selectionPosition.Resume.y + selectorPositionOffset.y};
            }
            return true;
        } else {
            return false;
        }
    };
    
    return this;
}
