function GamePlayScreen () {
	const GAME_BG_COLOR = "#010119";

    this.transitionIn = function gamePlayScreenTransitionIn() {
	    remainingLives = 2;
//        if(this.properties === "restart") {
//            scene = null;
//        }
        if(scene === null || scene === undefined){
            scene = new GameScene(currentLevelIndex);
        }
/*        if(currentBackgroundMusic.getTime() > 0) {
            currentBackgroundMusic.resume();    
        }
        else {
            currentBackgroundMusic.play();
        }*/

    };
    
    this.transitionOut = function gamePlayScreenTransitionOut() {
	    clearKeyboardInput();
	    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
/*        currentBackgroundMusic.pause();
        allSFX.stop();*/
    };
    
    const clearKeyboardInput = function() {
	    holdSpace = false;
	    holdUp = false;
	    holdW = false;
	    holdDown = false;
	    holdS = false;
	    holdLeft = false;
	    holdA = false;
	    holdRight = false;
	    holdD = false;
    }
    
    this.run = function gamePlayScreenRun(deltaTime) {
        scene.update(deltaTime);
        
        scene.draw();

        if(scene.gameIsOver){
//	        currentBackgroundMusic.setCurrentTrack(6);
            ScreenStates.setState(GAME_OVER_SCREEN);
        }
    };
    
    this.control = function gamePlayScreenControl(keyCode, pressed){
        switch(keyCode) {
            case KEY_ESCAPE:
                if(!pressed){
                    ScreenStates.setState(PAUSE_SCREEN);
                }
                break;
            case KEY_SPACE:
                holdSpace = pressed;//shoot
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
	                setPaused(!ScreenStates.isPaused);
//                    ScreenStates.setState(PAUSE_SCREEN);//TODO: restore once the pause screen has been implemented
                }
                return true;
            case KEY_BACKSPACE:
                if(!pressed) {
	                setPaused(!ScreenStates.isPaused);
//                    ScreenStates.setState(PAUSE_SCREEN);//TODO: restore once the pause screen has been implemented
                }
                return true;
            case DIGIT_0:
            	if((!pressed) && (DEBUG)) {
	            	worldSpeed = 0;
            	}
            	return true;
            case DIGIT_1:
            	if((!pressed) && (DEBUG)) {
	            	worldSpeed = 1;
            	}
            	return true;
            case DIGIT_2:
            	if((!pressed) && (DEBUG)) {
	            	worldSpeed = 2;
            	}
            	return true;
            case DIGIT_3:
            	if((!pressed) && (DEBUG)) {
	            	worldSpeed = 3;
            	}
            	return true;
            case DIGIT_4:
            	if((!pressed) && (DEBUG)) {
	            	worldSpeed = 4;
            	}
            	return true;
            case DIGIT_5:
            	if((!pressed) && (DEBUG)) {
	            	worldSpeed = 5;
            	}
            	return true;
            case DIGIT_6:
            	if((!pressed) && (DEBUG)) {
	            	worldSpeed = 6;
            	}
            	return true;
            case DIGIT_7:
            	if((!pressed) && (DEBUG)) {
	            	worldSpeed = 7;
            	}
            	return true;
            case DIGIT_8:
            	if((!pressed) && (DEBUG)) {
	            	worldSpeed = 8;
            	}
            	return true;
            case DIGIT_9:
            	if((!pressed) && (DEBUG)) {
	            	worldSpeed = 9;
            	}
            	return true;
            default:
                return false;
        }
    };
    
    return this;
}