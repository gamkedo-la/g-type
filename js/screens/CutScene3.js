//CutScene3
function CutScene3Screen() {
	const MENU_BG_COLOR = "#010119";

    let playerSprite;
    let thrusterSprite;
    let thrusterSize = {};
    let thrusterPosition = {x:0, y:0};
    let PLAYER_SCALE = 1.5;
    let playerSpriteDeltaX = 0;
    let playerSpriteDeltaY = 0;
    let level2BossSprite;
    let level2Position;
    const LEVEL2_SCALE = 3;
    let level2Size;
    let platform1Sprite;
    const PLTFRM1_SCALE = 3;
    let pltfrm1Size;
    let pltfrm1Position;
    let parallaxOffset2 = 0;
    let parallaxOffset3 = 0;
    let wormholeSprite;
    const WORMHOLE_SCALE = 3;
    let wormholeSize;
    let wormholePosition;

    const DISPLAY_TIME = 6000;//6000 = 6 second display time
    const INTRO_STORY_SCROLL_SPEED_Y = 0.001;

    let delayTime = 0;

    this.transitionIn = function() {
        playerSprite = new AnimatedSprite(player1Sheet, 8, 52, 32, false, true, {min:0, max:0}, 0, {min:0, max:0}, Number.MAX_VALUE, {min:5, max:7}, 128);
        
		thrusterSprite = new AnimatedSprite(playerThruster, 3, 33, 32, false, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
		thrusterSize = {width:thrusterSprite.width, height:thrusterSprite.height};
		
		level2BossSprite = new AnimatedSprite(level2BossSheet, 30, 150, 84, false, true, {min:0, max:0}, 0, {min:0, max:29}, 128, {min:29, max:29}, 0);
		level2Size = {width:LEVEL2_SCALE * level2BossSprite.width, height:LEVEL2_SCALE * level2BossSprite.height};
		level2Position = {x:GameField.midX - level2Size.width/2, y:GameField.midY + 15};
		
		platform1Sprite = new AnimatedSprite(platform1, 5, 76, 38, false, true, {min:0, max:0}, 0, {min:0, max:4}, 512, {min:4, max:4}, 0);
		pltfrm1Size = {width:PLTFRM1_SCALE * platform1Sprite.width, height:PLTFRM1_SCALE * platform1Sprite.height};
		pltfrm1Position = {x:GameField.midX - pltfrm1Size.width * 1.0, y:GameField.bottom - 35};
		
		wormholeSprite = new AnimatedSprite(wormHole, 16, 60, 63, false, true, {min:0, max:6}, 128, {min:6, max:6}, 256, {min:7, max:15}, 128);
		wormholeSize = {width:WORMHOLE_SCALE * wormholeSprite.width, height:WORMHOLE_SCALE * wormholeSprite.height};
		wormholePosition = {x:GameField.midX - wormholeSize.width/2, y:GameField.midY - 30};
		
		// the distant planets in midground
		parallaxOffset2 = -1 * (22404 * BG_PARALLAX_RATIO_2[1] % backgroundParallaxLayer2.width);//hard coded for Level 2
		// things overlaid above the gameplay (girders)
		parallaxOffset3 = -1 * (22404 * BG_PARALLAX_RATIO_3[1] % foregroundParallaxLayer2.width);//hard coded for Level 2
		
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

        switch (keyCode) {
            case KEY_ENTER:
		        menuSelect.play();
                ScreenStates.setState(GAME_SCREEN, this.properties);
                return true;
            case KEY_M:
            	toggleMute();
                return true;
        }

        return false;
    };

	const update = function(deltaTime) {
		if(delayTime < 0.1 * DISPLAY_TIME) {
			//do nothing
		} else if((delayTime >= 0.1 * DISPLAY_TIME) && (delayTime < 0.40 * DISPLAY_TIME)) {
			playerSpriteDeltaX += (9.5 * delayTime / DISPLAY_TIME);
		} else if((delayTime >= 0.40 * DISPLAY_TIME) && (delayTime < 0.6 * DISPLAY_TIME)) {
			playerSpriteDeltaY += (7.5 * delayTime / DISPLAY_TIME);
		} else if((delayTime >= 0.60 * DISPLAY_TIME) && (delayTime < 0.75 * DISPLAY_TIME)){
			PLAYER_SCALE -= (0.025 * delayTime / DISPLAY_TIME);
			if(PLAYER_SCALE < 0.0) {
				PLAYER_SCALE = 0.0;
			}
		} else {
			PLAYER_SCALE -= (0.025 * delayTime / DISPLAY_TIME);
			if(PLAYER_SCALE < 0.0) {
				PLAYER_SCALE = 0.0;
			}
			
			if(!wormholeSprite.isDying) {
				wormholeSprite.wasBorn = true;
				wormholeSprite.isDying = true;
			}
		}

		playerSprite.update(deltaTime);
		thrusterSprite.update(deltaTime);
		
		level2BossSprite.update(deltaTime);
		wormholeSprite.update(deltaTime);
		platform1Sprite.update(deltaTime);
	};

	const draw = function(deltaTime) {
		// render the menu background
        drawBG();

		const spritePos = {x:10 + GameField.x + GameField.width / 8 + playerSpriteDeltaX, y: GameField.y + 65 + playerSpriteDeltaY};
		let thrusterMod = timer.getCurrentTime() % 16 < 8 ? 0 : 3;
		thrusterPosition.x = spritePos.x - (28 + thrusterMod) * PLAYER_SCALE;
		thrusterPosition.y = spritePos.y;
		
		wormholeSprite.drawAt(wormholePosition.x, wormholePosition.y, wormholeSize.width, wormholeSize.height);
        playerSprite.drawAt(spritePos.x, spritePos.y, (PLAYER_SCALE * playerSprite.width), (PLAYER_SCALE * playerSprite.height));
        thrusterSprite.drawAt(thrusterPosition.x, thrusterPosition.y, (PLAYER_SCALE * thrusterSprite.width), (PLAYER_SCALE * thrusterSprite.height));
        platform1Sprite.drawAt(pltfrm1Position.x, pltfrm1Position.y, pltfrm1Size.width, pltfrm1Size.height);
        platform1Sprite.drawAt((pltfrm1Position.x + pltfrm1Size.width), (pltfrm1Position.y), pltfrm1Size.width, pltfrm1Size.height);
        platform1Sprite.drawAt((pltfrm1Position.x - pltfrm1Size.width), (pltfrm1Position.y), pltfrm1Size.width, pltfrm1Size.height);
        level2BossSprite.drawAt(level2Position.x, level2Position.y, level2Size.width, level2Size.height);
        
        gameFont.printTextAt(textStrings.CutScene3_1, {x:GameField.midX, y:GameField.midY - 200}, 16, textAlignment.Center);
		gameFont.printTextAt(textStrings.CutScene3_2, {x:GameField.midX, y: GameField.midY - 170}, 16, textAlignment.Center);
		gameFont.printTextAt(textStrings.CutScene3_3, {x:GameField.midX, y: GameField.midY - 140}, 16, textAlignment.Center);
		gameFont.printTextAt(textStrings.CutScene3_4, {x:GameField.midX, y: GameField.midY - 110}, 16, textAlignment.Center);
		gameFont.printTextAt(textStrings.CutScene3_5, {x:GameField.midX, y: GameField.midY - 80}, 16, textAlignment.Center);
		gameFont.printTextAt(textStrings.SkipCutScene, {x:GameField.right - 70, y: GameField.bottom + 60}, 12, textAlignment.Right);

        canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);

    };

	const drawBG = function menuScreenDrawBG() {		
        canvasContext.drawImage(backgroundColorLookup2, 150, 0, 16, 100, 0, 0, canvas.width, canvas.height);
        
        // distant planets and nebulae
		canvasContext.drawImage(backgroundParallaxLayer2, parallaxOffset2, 238);//238 is bgOffset -> based on background image & hard coded for Level 2
		canvasContext.drawImage(backgroundParallaxLayer2, parallaxOffset2 + backgroundParallaxLayer2.width,+ 238);//238 is bgOffset -> based on background image & hard coded for Level 2
    }
}