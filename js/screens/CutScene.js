//CutScene - Use between Title Screen & Level 1, between Levels and for Game End animation
function CutSceneScreen() {
	const MENU_BG_COLOR = "#010119";

    let starfield;
    let playerSprite;
    let PLAYER_SCALE = 1.2;
    let planetSprite;
    let playerSpriteDeltaX = 0;
    let playerSpriteDeltaY = 0;
    let planetScale = 0.5;
    
    const DISPLAY_TIME = 6000;//6000 = 6 second display time
    let delayTime = 0;

    this.transitionIn = function() {
        starfield = new Starfield();
        playerSprite = new AnimatedSprite(player1Sheet, 6, 120, 76, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
        planetSprite = new AnimatedSprite(planetSheet, 3, 192, 192, false, true, {min:0, max:0}, 0, {min:0, max:2}, 512, {min:2, max:2}, 0);
 
        currentBackgroundMusic.setCurrentTrack(AudioTracks.GameOver);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();    
        }
        else {
            currentBackgroundMusic.play();
        }
    };
    this.transitionOut = function() {
//        uiSelect.play();
        currentBackgroundMusic.pause();
    };
    this.run = function gamePlayFinishedScreenRun(deltaTime) {
	    delayTime += deltaTime;
	    
	    if(delayTime >= DISPLAY_TIME) {
		    ScreenStates.setState(GAME_SCREEN);
	    }
	    
	    update(deltaTime);
	    
	    draw();
    };
    this.control = function gamePlayFinishedScreenControl(keyCode, pressed){
       if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }
        
        switch (keyCode) {
            case KEY_ENTER:
                ScreenStates.setState(GAME_SCREEN, this.properties);
                return true;
            case KEY_M:
            	toggleMute();	            	
                return true;
        }

        return false;
    };
    
	const update = function(deltaTime) {
		starfield.update(deltaTime);
		
		if(delayTime > 0.25 * DISPLAY_TIME) {
			playerSpriteDeltaX += (16 * delayTime / DISPLAY_TIME);
			playerSpriteDeltaY -= (4 * delayTime / DISPLAY_TIME);
			PLAYER_SCALE -= (0.01 * delayTime / DISPLAY_TIME);
		}
		
		playerSprite.update(deltaTime);
		planetSprite.update(deltaTime);
		planetScale = 0.25 + delayTime / DISPLAY_TIME;
	};

	const draw = function() {
		// render the menu background
        drawBG();
        
        starfield.draw();
        
        gameFont.printTextAt(textStrings.CutScene1_1, {x:GameField.midX, y:GameField.bottom - 120}, 16, textAlignment.Center);
		gameFont.printTextAt(textStrings.CutScene1_2, {x:GameField.midX, y: GameField.bottom - 90}, 16, textAlignment.Center);
		gameFont.printTextAt(textStrings.CutScene1_3, {x:GameField.midX, y: GameField.bottom - 60}, 16, textAlignment.Center);
		gameFont.printTextAt(textStrings.SkipCutScene, {x:GameField.right - 70, y: GameField.bottom - 30}, 12, textAlignment.Right);
        
        playerSprite.drawAt({x:GameField.x + GameField.width / 8 + playerSpriteDeltaX, y: GameField.y + 2 * GameField.height / 3 + playerSpriteDeltaY}, {width:PLAYER_SCALE * playerSprite.width, height:PLAYER_SCALE * playerSprite.height});
        
		canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);
        
        planetSprite.drawAt({x:GameField.x + 5 * GameField.width / 6, y:GameField.y + GameField.height / 7}, {width:planetScale * planetSprite.width, height:planetScale * planetSprite.height});
	};
	
	const drawBG = function menuScreenDrawBG() {
        // fill the background since there is no image for now
        drawRect(GameField.x, GameField.y - GameField.bgOffset, GameField.width, GameField.height + GameField.bgOffset, MENU_BG_COLOR);
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);
    }
}
