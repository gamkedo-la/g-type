//CutScene1- Use between Level 1 & Level 2, between Levels and for Game End animation
function CutScene2Screen() {
	const MENU_BG_COLOR = "#010119";

    let starfield;
    let playerSprite;
    let thrusterSprite;
    let thrusterSize = {};
    let thrusterPosition = {x:0, y:0};
    let PLAYER_SCALE = 1.2;
    let planetSprite;
    let playerSpriteDeltaX = 0;
    let playerSpriteDeltaY = 0;
    let planetScale = 5;

    const DISPLAY_TIME = 6000;//6000 = 6 second display time
    const INTRO_STORY_SCROLL_SPEED_Y = 0.001;

    let delayTime = 0;

    this.transitionIn = function() {
        delayTime = 0;
        
        starfield = new Starfield();
        playerSprite = new AnimatedSprite(player1Sheet, 8, 52, 32, false, true, {min:0, max:0}, 0, {min:0, max:0}, Number.MAX_VALUE, {min:5, max:7}, 128);
		thrusterSprite = new AnimatedSprite(playerThruster, 3, 33, 32, false, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);

		thrusterSize = {width:thrusterSprite.width, height:thrusterSprite.height};
		
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
        currentBackgroundMusic.pause();
    };
    this.run = function gamePlayFinishedScreenRun(deltaTime) {
	    delayTime += deltaTime;

	    if(delayTime >= DISPLAY_TIME) {
		    ScreenStates.setState(GAME_SCREEN, this.properties);
	    }

	    update(deltaTime);

	    draw(deltaTime);
    };
    this.control = function gamePlayFinishedScreenControl(keyCode, pressed){
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }

        if (this.keysPressed(KEY_ENTER) || this.keysPressed(KEY_SPACE)) {
	        menuSelect.play();
            ScreenStates.setState(GAME_SCREEN, this.properties);
            return true;
        } else if (this.keysPressed(KEY_M)) {
            toggleMute();
            return true;
        }

        return false;
    };

	const update = function(deltaTime) {
		starfield.update(deltaTime);

		if(delayTime > 0.05 * DISPLAY_TIME) {
			playerSpriteDeltaX += (6 * delayTime / DISPLAY_TIME);
			playerSpriteDeltaY += (4 * delayTime / DISPLAY_TIME);
			PLAYER_SCALE -= (0.01 * delayTime / DISPLAY_TIME);
		}

		playerSprite.update(deltaTime);
		thrusterSprite.update(deltaTime);
		planetSprite.update(deltaTime);
		planetScale += (delayTime / DISPLAY_TIME);
	};

	const draw = function(deltaTime) {
		// render the menu background
        drawBG();

        starfield.draw();

        planetSprite.drawAt((GameField.midX - (planetScale * planetSprite.width / 2)), (GameField.bottom - ((GameField.height / 12) * (delayTime / DISPLAY_TIME)) - (planetScale * planetSprite.height / 4)), (planetScale * planetSprite.width), (planetScale * planetSprite.height));

		const spritePos = {x:GameField.x + GameField.width / 8 + playerSpriteDeltaX, y: GameField.y + 2 * GameField.height / 3 + playerSpriteDeltaY};
		let thrusterMod = timer.getCurrentTime() % 16 < 8 ? 0 : 3;
		thrusterPosition.x = spritePos.x - (28 + thrusterMod) * PLAYER_SCALE;
		thrusterPosition.y = spritePos.y;

		thrusterSprite.drawAt(thrusterPosition.x, thrusterPosition.y, (PLAYER_SCALE * thrusterSprite.width), (PLAYER_SCALE * thrusterSprite.height));
		
        playerSprite.drawAt(spritePos.x, spritePos.y, (PLAYER_SCALE * playerSprite.width), (PLAYER_SCALE * playerSprite.height));
        
        gameFont.printTextAt(textStrings.CutScene2_1, {x:GameField.midX, y:GameField.bottom - 300}, 16, textAlignment.Center);//, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		gameFont.printTextAt(textStrings.CutScene2_2, {x:GameField.midX, y: GameField.bottom - 90}, 16, textAlignment.Center, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		gameFont.printTextAt(textStrings.CutScene2_3, {x:GameField.midX, y: GameField.bottom - 60}, 16, textAlignment.Center, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		gameFont.printTextAt(textStrings.CutScene2_4, {x:GameField.midX, y: GameField.bottom - 30}, 16, textAlignment.Center, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		gameFont.printTextAt(textStrings.CutScene2_5, {x:GameField.midX, y: GameField.bottom + 0}, 16, textAlignment.Center, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		gameFont.printTextAt(textStrings.SkipCutScene, {x:GameField.right - 70, y: GameField.bottom + 60}, 12, textAlignment.Right, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});

        canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);

    };

	const drawBG = function menuScreenDrawBG() {
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);
    }
}