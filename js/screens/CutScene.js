//CutScene - Use between Title Screen & Level 1, between Levels and for Game End animation
function CutSceneScreen() {
	const MENU_BG_COLOR = "#010119";

    let starfield;
    let playerSprite;
    const PLAYER_SCALE = 2;
    let planetSprite;
    let playerSpriteDeltaX = 0;
    let playerSpriteDeltaY = 0;
    let planetScale = 0.5;
    
    const DISPLAY_TIME = 6000;//6000 = 6 second display time
    let delayTime = 0;

    this.transitionIn = function() {
        starfield = new Starfield();
        playerSprite = new AnimatedSprite(player1Sheet, 6, 60, 38, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
        planetSprite = new AnimatedSprite(planetSheet, 3, 128, 128, false, true, {min:0, max:0}, 0, {min:0, max:2}, 512, {min:2, max:2}, 0);
 
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
                ScreenStates.setState(GAME_SCREEN);
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
		}
		
		playerSprite.update(deltaTime);
		planetSprite.update(deltaTime);
		planetScale = 0.5 + delayTime / DISPLAY_TIME;
	};

	const draw = function() {
		// render the menu background
        drawBG();
        
        starfield.draw();
        
        colorText(textStrings.CutScene1_1, canvas.width / 2, canvas.height - 100, Color.White, Fonts.ButtonTitle, textAlignment.Center, 1);
        colorText(textStrings.CutScene1_2, canvas.width / 2, canvas.height - 70, Color.White, Fonts.ButtonTitle, textAlignment.Center, 1);
        colorText(textStrings.SkipCutScene, canvas.width - 50, canvas.height - 30, Color.Aqua, Fonts.CreditsText, textAlignment.Right, 1);
        
        playerSprite.drawAt({x:canvas.width / 8 + playerSpriteDeltaX, y: 2 * canvas.height / 3 + playerSpriteDeltaY}, {width:PLAYER_SCALE * playerSprite.width, height:PLAYER_SCALE * playerSprite.height});
        planetSprite.drawAt({x:4 * canvas.width / 5, y:canvas.height / 5}, {width:planetScale * planetSprite.width, height:planetScale * planetSprite.height});
	};
	
	const drawBG = function menuScreenDrawBG() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, MENU_BG_COLOR);
    }
}
