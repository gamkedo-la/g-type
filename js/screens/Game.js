function GamePlayScreen () {
	const GAME_BG_COLOR = "#010119";
	this.properties = null;
	let currentLevelComplete = false;

    this.transitionIn = function gamePlayScreenTransitionIn(index = currentLevelIndex) {
        scene = new GameScene(index, this.properties.player, this.properties.uiManager);
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
	        backgroundMusicIndex = AudioTracks.Level3;
        }
        
        currentBackgroundMusic.setCurrentTrack(backgroundMusicIndex);
        if(currentBackgroundMusic.getTime() > 0) {
            currentBackgroundMusic.resume();    
        }
        else {
            currentBackgroundMusic.play();
        }

    };
    
    this.transitionOut = function gamePlayScreenTransitionOut() {
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
	            ScreenStates.setState(GAME_SCREEN, {code: false, player: scene.getPlayerObject(), uiManager:scene.getUIManagerObject()});
	        } else if(currentLevelIndex	=== WARP_INDEX) {
		        currentLevelIndex = 2;//warp only allows you to skip level 2 => next level must be level 3
		        this.cutSceneFor(currentLevelIndex);
	        } else {
		        this.cutSceneFor(++currentLevelIndex);
	        }           
        } else if(scene.beatTheGame) {
            currentBackgroundMusic.setCurrentTrack(AudioTracks.GameEnding);
            ScreenStates.setState(ENDING_SCREEN);
        }
        
		if(currentBackgroundMusic.getTime() > currentBackgroundMusic.getDuration()) {	
			currentBackgroundMusic.play();
		}
    };
    
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
                ScreenStates.setState(CUT_SCENE2_SCREEN, {code: false, player: scene.getPlayerObject(), uiManager:scene.getUIManagerObject()});//TODO: Get right cut scene
                break;
        }
    };
    
    this.control = function gamePlayScreenControl(keydownMap, pressed){ // TO-DO: prevent multiple changes on single press
        // SHIP CONTROLS START        
        holdKey[KEY_UP] = this.keysPressed(KEY_UP) || this.keysPressed(KEY_W);
        holdKey[KEY_DOWN] = this.keysPressed(KEY_DOWN) || this.keysPressed(KEY_S);
        holdKey[KEY_LEFT] = this.keysPressed(KEY_LEFT) || this.keysPressed(KEY_A);
        holdKey[KEY_RIGHT] = this.keysPressed(KEY_RIGHT) || this.keysPressed(KEY_D);
        holdKey[KEY_X] = this.keysPressed(KEY_X);
        // SHIP CONTROLS END

        // CHEAT KEYS START
        if (this.keysPressed(KEY_SHIFT, KEY_LEFT)) {
            if (!pressed) {
                currentLevelIndex--; // TODO: Take into account level that does not exist.
                console.log("Loaded Level " + currentLevelIndex + "!");
                this.transitionOut();
                this.transitionIn(currentLevelIndex); 
            }
            return true;
        } else if (this.keysPressed(KEY_SHIFT, KEY_RIGHT)) {
            if (!pressed) {
                currentLevelIndex++; // TODO: Take into account level that does not exist.
                console.log("Loaded Level " + currentLevelIndex + "!");
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
            scene.beatTheGame = true; // final boss defeated!
            return true;        
        // CHEAT KEYS END
        
        } else if (this.keysPressed(KEY_SPACE)) {
            if(!pressed) {
                scene.activatePowerUp();
            }
            return true;
        } else if (this.keysPressed(KEY_ESCAPE)) {
            if(!pressed) {
                setPaused(!ScreenStates.isPaused, PauseCause.PressedPause);
            }
            return true;        
        } else if (this.keysPressed(KEY_M)) {
            if(!pressed) {
                toggleMute();	            	
            }
            return true;
        } else if (this.keysPressed(KEY_PLUS)) {
            if(!pressed) {
                turnVolumeUp();
            }
            return true;
        } else if (this.keysPressed(KEY_MINUS)) {
            if(!pressed) {
                turnVolumeDown();
            }
            return true;
        } else if (this.keysPressed(KEY_P)) {
            if(!pressed) {
                setPaused(!ScreenStates.isPaused, PauseCause.PressedPause);
            }
            return true;
        } else if (this.keysPressed(KEY_BACKSPACE)) {
            if(!pressed) {
                setPaused(!ScreenStates.isPaused, PauseCause.PressedPause);
            }
            return true;            
        } else {
            return false;
        }
    };
    
    return this;
}
