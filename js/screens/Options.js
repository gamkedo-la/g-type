//Options Screen
function OptionsScreen() {
	const MENU_BG_COLOR = "#010119";

    this.selectorPositionsIndex = 0;
    let selectorPosition = {x:0, y:0};
    let selectorSprite;
    let starfield;
	this.selections = [
	    {screen: GAME_SCREEN, title: textStrings.Play},
	    {screen: MENU_SCREEN, title: textStrings.Main},
	   ];
    this.transitionIn = function () {
        this.selectorPositionsIndex = 0;
        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 6, 120, 76, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
        
        currentBackgroundMusic.setCurrentTrack(AudioTracks.Options);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();    
        }
        else {
            currentBackgroundMusic.play();
        }
    };
    
    this.transitionOut = function () {
//        uiSelect.play();
		currentBackgroundMusic.pause();
    };

    this.run = function helpScreenRun(deltaTime) {
	    update(deltaTime);
	    
	    draw(this.selections, this.selectorPositionsIndex);
    };
    
	const update = function(deltaTime) {
		selectorSprite.update(deltaTime);
		
		starfield.update(deltaTime);
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
            case KEY_E:
                ScreenStates.setState(EDITOR_SCREEN);
                return true;
            case KEY_M:
    	        toggleMute();
                return true;
        }

        return false;
    };
    
	const printMenu = function(menuItems, selected, yOffset = null) {
	    let mainMenuX = GameField.midX - 45;
	    let mainMenuY = (yOffset == null ? GameField.bottom - 120 : yOffset);

	    let selectorXOffset = 60;
	    let selectorYOffset = 30;

	    let buttonsXOffset = mainMenuX + 70;

	    for (let i = 0; i < menuItems.length; i++) {
		    gameFont.printTextAt(menuItems[i].title, {x:mainMenuX, y:mainMenuY + selectorYOffset * i}, 20, textAlignment.Left);
//		    colorText(menuItems[i].title, mainMenuX, mainMenuY + selectorYOffset * i, Color.White, Fonts.ButtonTitle, textAlignment.Left);
		    if(i === selected) {
			    selectorPosition.x = mainMenuX - 35;
			    selectorPosition.y = mainMenuY + selectorYOffset * i;
		    }
	    }
	    
	    starPosition = {x:GameField.midX, y:GameField.midY};
	};

	const draw = function(selections, selectorPositionIndex) {
		// render the menu background
        drawBG();
        
        starfield.draw();
        
        // render the logo overlay
//        drawLogo();

		//draw the game title at the top of the screen
		drawTitle();
		
		//draw the actual help info
		drawHelp();

        // render menu
        printMenu(selections, selectorPositionIndex);
        
        //draw selector sprite
        selectorSprite.drawAt(selectorPosition, {width:30, height:19});

		canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);
	};
	
	const drawBG = function menuScreenDrawBG() {
        // fill the background since there is no image for now
        drawRect(GameField.x, GameField.y - GameField.bgOffset, GameField.width, GameField.height + GameField.bgOffset, MENU_BG_COLOR);
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);
    };
    
    const drawTitle = function() {
	    gameFont.printTextAt(gameTitle.Main, {x:GameField.midX, y:(GameField.y + 60)}, 30, textAlignment.Center);
	    gameFont.printTextAt(gameTitle.Subtitle, {x:GameField.midX, y:(GameField.y + 120)}, 30, textAlignment.Center);
    };
    
    const drawHelp = function() {
	    gameFont.printTextAt("volume", {x:GameField.midX, y:(GameField.y + 60 + GameField.height / 4)}, 25, textAlignment.Center);
	    gameFont.printTextAt("music", {x:GameField.midX, y:(GameField.y + 120 + GameField.height / 4)}, 25, textAlignment.Center);
	    gameFont.printTextAt("SFX", {x:GameField.midX, y:(GameField.y + 180 + GameField.height / 4)}, 25, textAlignment.Center);
    };
        
    return this;
}
