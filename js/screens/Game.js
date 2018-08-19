function GamePlayScreen () {
	const GAME_BG_COLOR = "#010119";

    this.transitionIn = function gamePlayScreenTransitionIn() {
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
/*        currentBackgroundMusic.pause();
        allSFX.stop();*/
    };
    
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
            	holdM = pressed;//toggle mute
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
                    ScreenStates.setState(PAUSE_SCREEN);
                }
                return true;
            case KEY_BACKSPACE:
                if(!pressed) {
                    ScreenStates.setState(PAUSE_SCREEN);
                }
                return true;
            default:
                return false;
        }
    };
    
    return this;
}