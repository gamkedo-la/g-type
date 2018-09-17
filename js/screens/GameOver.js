//GameOver - Continue Screen
function GameOverScreen() {
	const MENU_BG_COLOR = "#010119";

    this.selectorPositionsIndex = 0;
    let selectorPosition = {x:0, y:0};
    let selectorSprite;
    let starfield;
    this.selections = [
	    { screen: GAME_SCREEN, title: textStrings.Continue },
	    { screen: GAME_SCREEN, title: textStrings.Restart },
	    { screen: MENU_SCREEN, title: textStrings.Quit },
//        { screen: LEVEL_SELECT_SCREEN, title: textStrings.Play },
//        { screen: HELP_SCREEN, title: textStrings.Help },
//        { screen: OPTIONS_SCREEN, title: textStrings.Options },
//        { screen: CREDITS_SCREEN, title: textStrings.Credits },
    ];
    this.transitionIn = function(){
        this.selectorPositionsIndex = 0;        
        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 6, 120, 76, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
        currentBackgroundMusic.setCurrentTrack(AudioTracks.GameOver);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();    
        }
        else {
            currentBackgroundMusic.play();
        }
    };
    this.transitionOut = function() {
	    if(this.selectorPositionsIndex !== 0) {
		    scene = null;
	    }
//        uiSelect.play();
        currentBackgroundMusic.pause();
    };
    this.run = function gamePlayFinishedScreenRun(deltaTime) {
	    update(deltaTime);
	    
	    draw(this.selections, this.selectorPositionsIndex);
    };
    this.control = function gamePlayFinishedScreenControl(keyCode, pressed){
       if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }
        
        switch (keyCode) {
            case KEY_UP:
                this.selectorPositionsIndex--;
                if (this.selectorPositionsIndex < 0) {
                    this.selectorPositionsIndex += this.selections.length;
                }
                return true;
            case KEY_DOWN:
                this.selectorPositionsIndex = (this.selectorPositionsIndex + 1) % this.selections.length;
                if (this.selectorPositionsIndex > this.selections.length - 1) {
                    this.selectorPositionsIndex = 0;
                }
                return true;
            case KEY_ENTER:
                ScreenStates.setState(this.selections[this.selectorPositionsIndex].screen);
                return true;
            case KEY_H:
                ScreenStates.setState(HELP_SCREEN);
                return true;
            case KEY_C:
                ScreenStates.setState(CREDITS_SCREEN);
                return true;
            case KEY_M:
            	toggleMute();	            	
                return true;
        }

        return false;
    };
    
    const printMenu = function(menuItems, selected, yOffset = null) {
	    let mainMenuX = GameField.midX - 45;
	    let mainMenuY = (yOffset == null ? GameField.y + 2 * GameField.height / 3 : yOffset);

	    let selectorXOffset = 60;
	    let selectorYOffset = 30;

	    let buttonsXOffset = mainMenuX + 70;

	    for (let i = 0; i < menuItems.length; i++){
    	    gameFont.printTextAt(menuItems[i].title, {x:mainMenuX, y: (mainMenuY + selectorYOffset * i)}, 20,  textAlignment.Left);
//		    colorText(menuItems[i].title, mainMenuX, mainMenuY + selectorYOffset * i, Color.White, Fonts.ButtonTitle, textAlignment.Left);
		    if(i === selected) {
			    selectorPosition.x = mainMenuX - 35;
			    selectorPosition.y = mainMenuY + selectorYOffset * i;
		    }
	    }
	};
    
	const update = function(deltaTime) {
		selectorSprite.update(deltaTime);
		
		starfield.update(deltaTime);
	};

	const draw = function(selections, selectorPositionIndex) {
		// render the menu background
        drawBG();
        
        starfield.draw();
        
        // render the logo overlay
//        drawLogo();

		drawTitle();

        // render menu
        printMenu(selections, selectorPositionIndex);
        
        //draw selector sprite
        selectorSprite.drawAt(selectorPosition, {width:30, height:19});

		canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);
		
		gameFont.printTextAt(textStrings.GameOver, {x:GameField.midX, y:GameField.y - 20}, 35, textAlignment.Center);
	};
	
	const drawBG = function menuScreenDrawBG() {
        // fill the background since there is no image for now
        drawRect(GameField.x, GameField.y - GameField.bgOffset, GameField.width, GameField.height + GameField.bgOffset, MENU_BG_COLOR);
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);
    };
    
    const drawTitle = function() {
	    colorText(gameTitle.Main, GameField.midX, GameField.y + GameField.height / 3, Color.White, Fonts.MainTitle, textAlignment.Center);
	    colorText(gameTitle.Subtitle, GameField.midX, GameField.y + GameField.height / 3 + 40, Color.White, Fonts.Subtitle, textAlignment.Center);
    };
}
