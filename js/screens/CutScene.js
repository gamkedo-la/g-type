//CutScene - Use between Title Screen & Level 1, between Levels and for Game End animation
function CutScene1Screen() {
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
    let planetScale = 0.5;

    const DISPLAY_TIME = 7000;//6000 = 6 second display time
    const INTRO_STORY_SCROLL_SPEED_Y = 0.001; //default is 0.001

    let delayTime = 0;

    this.transitionIn = function() {
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
//        uiSelect.play();
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
    this.control = function gamePlayFinishedScreenControl(keydownMap, pressed){
       if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }

        if (this.keysPressed(KEY_ENTER)) {
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

		if(delayTime > 0.25 * DISPLAY_TIME) {
			playerSpriteDeltaX += (18 * delayTime / DISPLAY_TIME); //16
			playerSpriteDeltaY -= (6 * delayTime / DISPLAY_TIME); //8
			PLAYER_SCALE -= (0.01 * delayTime / DISPLAY_TIME);
		}

		playerSprite.update(deltaTime);
		thrusterSprite.update(deltaTime);
		planetSprite.update(deltaTime);
		planetScale = 0.5 + delayTime / DISPLAY_TIME; //.25
	};

	const draw = function(deltaTime) {
		// render the menu background
        drawBG();

        starfield.draw();
        
        planetSprite.drawAt({x:GameField.x + 5 * GameField.width / 6, y:GameField.y + GameField.height / 7}, {width:planetScale * planetSprite.width, height:planetScale * planetSprite.height});

//{deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}}

        gameFont.printTextAt(textStrings.CutScene1_1, {x:GameField.midX, y:GameField.bottom - 300}, 16, textAlignment.Center);//, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		gameFont.printTextAt(textStrings.CutScene1_2, {x:GameField.midX, y: GameField.bottom - 90}, 16, textAlignment.Center, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		gameFont.printTextAt(textStrings.CutScene1_3, {x:GameField.midX, y: GameField.bottom - 60}, 16, textAlignment.Center, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		gameFont.printTextAt(textStrings.CutScene1_4, {x:GameField.midX, y: GameField.bottom - 30}, 16, textAlignment.Center, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		gameFont.printTextAt(textStrings.CutScene1_5, {x:GameField.midX, y: GameField.bottom + 0}, 16, textAlignment.Center, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		gameFont.printTextAt(textStrings.SkipCutScene, {x:GameField.right - 70, y: GameField.bottom + 60}, 12, textAlignment.Right, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
		
		const spritePos = {x:GameField.x + GameField.width / 8 + playerSpriteDeltaX, y: GameField.y + 2 * GameField.height / 3 + playerSpriteDeltaY};
		let thrusterMod = timer.getCurrentTime() % 16 < 8 ? 0 : 3;
		thrusterPosition.x = spritePos.x - (28 + thrusterMod) * PLAYER_SCALE;
		thrusterPosition.y = spritePos.y;

		thrusterSprite.drawAt(thrusterPosition, {width:PLAYER_SCALE * thrusterSprite.width, height:PLAYER_SCALE * thrusterSprite.height});
		
        playerSprite.drawAt(spritePos, {width:PLAYER_SCALE * playerSprite.width, height:PLAYER_SCALE * playerSprite.height});
 
        canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);

    };

	const drawBG = function menuScreenDrawBG() {
        // fill the background since there is no image for now
        drawRect(GameField.x, GameField.y - GameField.bgOffset, GameField.width, GameField.height + GameField.bgOffset, MENU_BG_COLOR);
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);
    }
}
