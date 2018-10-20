function GamePlayScreen () {
	const GAME_BG_COLOR = "#010119";
	this.properties = null;

    this.transitionIn = function gamePlayScreenTransitionIn() {
//	    remainingLives = 2;

//        if(scene === null || scene === undefined) {
            scene = new GameScene(currentLevelIndex, this.properties.player, this.properties.uiManager);
//        } else {
//	        scene.reset();
//        }
        
        if(this.properties.code === true) {
	        scene.activateBasePowerUps();
        }
        
        let backgroundMusicIndex;
        if(currentLevelIndex === 0) {
	        backgroundMusicIndex = AudioTracks.Level1;
        } else if(currentLevelIndex === 1) {
	        backgroundMusicIndex = AudioTracks.Level2;
        } else if(currentLevelIndex === 2) {
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
	    holdSpace = false;
	    holdX = false;
	    holdUp = false;
	    holdW = false;
	    holdDown = false;
	    holdS = false;
	    holdLeft = false;
	    holdA = false;
	    holdRight = false;
	    holdD = false;
    };
    
    this.run = function gamePlayScreenRun(deltaTime) {
        scene.update(deltaTime);
        
        scene.draw();

        if(scene.gameIsOver) {
            currentBackgroundMusic.setCurrentTrack(AudioTracks.GameOver);
            ScreenStates.setState(GAME_OVER_SCREEN);
        } else if(scene.levelIsComplete) {
            this.cutSceneFor(++currentLevelIndex);
        } else if(scene.beatTheGame) {
            currentBackgroundMusic.setCurrentTrack(AudioTracks.GameEnding);
            ScreenStates.setState(ENDING_SCREEN);
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
    
    this.control = function gamePlayScreenControl(keyCode, pressed){
        switch(keyCode) {
	        case KEY_SPACE:
	        	if(!pressed) {
		        	scene.activatePowerUp();
	        	}
	        	return true;
            case KEY_ESCAPE:
                if(!pressed) {
	                setPaused(!ScreenStates.isPaused, PauseCause.PressedPause);
                }
                return true;
            case KEY_X:
                holdX = pressed;//shoot
                return true;
            case KEY_UP:
                holdUp = pressed;//move up
                return true;
            case KEY_W:
                holdW = pressed;//move up
                return true;
            case KEY_DOWN:
                holdDown = pressed;//move down
                return true;
            case KEY_S:
                holdS = pressed;//move down
                return true;
            case KEY_LEFT:
                holdLeft = pressed;//move left
                return true;
            case KEY_A:
                holdA = pressed;//move left
                return true;
            case KEY_RIGHT:
                holdRight = pressed;//move right
                return true;
            case KEY_D:
                holdD = pressed;//move right
                return true;
            case KEY_M:
            	if(!pressed) {
	            	toggleMute();	            	
            	}
                return true;
            case KEY_PLUS:
                if(!pressed) {
                    turnVolumeUp();
                }
                return true;
            case KEY_MINUS:
                if(!pressed) {
                    turnVolumeDown();
                }
                return true;
            case KEY_P:
                if(!pressed) {
	                setPaused(!ScreenStates.isPaused, PauseCause.PressedPause);
                }
                return true;
            case KEY_BACKSPACE:
                if(!pressed) {
	                setPaused(!ScreenStates.isPaused, PauseCause.PressedPause);
                }
                return true;

            // Keys below are used for cheats    
            case KEY_C: //Adding capsules
                if (!pressed && cheats.debugKeysEnabled) {
                    scene.collectedCapsule();
                }
                return true;
            case KEY_L: //Adding lives
                if (!pressed && cheats.debugKeysEnabled) {
                    scene.life();
                }
                return true;
            case KEY_E: //Activating shields
                if (!pressed && cheats.debugKeysEnabled) {
                    scene.activatedShield();
                }
                return true;
			case KEY_J: //Activating missils
                if (!pressed && cheats.debugKeysEnabled) {
                    scene.activatedMissile();
                }
                return true;
			case KEY_K: //Activating double
                if (!pressed && cheats.debugKeysEnabled) {
                    scene.activatedDouble();
                }
                return true;
			case KEY_H: //Activating laser
                if (!pressed && cheats.debugKeysEnabled) {
                    scene.activatedLaser();
                }
                return true;
			case KEY_T: //Activating triple
                if (!pressed && cheats.debugKeysEnabled) {
                    scene.activatedTriple();
                }
                return true;
			case KEY_G: //Activating ghost ship
                if (!pressed && cheats.debugKeysEnabled) {
                    scene.activatedGhost();
                }
                return true;
			case KEY_F: //Activating force
                if (!pressed && cheats.debugKeysEnabled) {
                    scene.activatedForce();
                }
                return true;
            case DIGIT_0:
            	if((!pressed) && cheats.debugKeysEnabled) {
	            	worldSpeed = 0;
            	}
            	return true;
            case DIGIT_1:
            	if((!pressed) && cheats.debugKeysEnabled) {
	            	worldSpeed = 1;
            	}
            	return true;
            case DIGIT_2:
            	if((!pressed) && cheats.debugKeysEnabled) {
	            	worldSpeed = 1.25;
            	}
            	return true;
            case DIGIT_3:
            	if((!pressed) && cheats.debugKeysEnabled) {
	            	worldSpeed = 1.50;
            	}
            	return true;
            case DIGIT_4:
            	if((!pressed) && cheats.debugKeysEnabled) {
	            	worldSpeed = 1.75;
            	}
            	return true;
            case DIGIT_5:
            	if((!pressed) && cheats.debugKeysEnabled) {
	            	worldSpeed = 2.0;
            	}
            	return true;
            case DIGIT_6:
            	if((!pressed) && cheats.debugKeysEnabled) {
	            	worldSpeed = 2.25;
            	}
            	return true;
            case DIGIT_7:
            	if((!pressed) && cheats.debugKeysEnabled) {
	            	worldSpeed = 2.50;
            	}
            	return true;
            case DIGIT_8:
            	if((!pressed) && cheats.debugKeysEnabled) {
	            	worldSpeed = 2.75;
            	}
            	return true;
            case DIGIT_9:
            	if((!pressed) && cheats.debugKeysEnabled) {
	            	worldSpeed = 3.0;
            	}
                return true;
            case KEY_O:
                scene.beatTheGame = true; // final boss defeated!
                return true;
            default:
                return false;
        }
    };
    
    return this;
}
