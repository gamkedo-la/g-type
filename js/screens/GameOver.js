//GameOver - Continue Screen
function GameOverScreen() {
	const MENU_BG_COLOR = "#010119";

    this.selectorPositionsIndex = 0;
    let selectorPosition = {x:0, y:0};
    let selectorSprite;
    let starfield;
    this.selections = [
	    { screen: GAME_SCREEN, title: textStrings.Play },
	    { screen: MENU_SCREEN, title: textStrings.Main },
//        { screen: LEVEL_SELECT_SCREEN, title: textStrings.Play },
//        { screen: HELP_SCREEN, title: textStrings.Help },
//        { screen: OPTIONS_SCREEN, title: textStrings.Options },
//        { screen: CREDITS_SCREEN, title: textStrings.Credits },
    ];
    this.transitionIn = function(){
        this.selectorPositionsIndex = 0;
        if (scene !== null) {
            scene = null;
        }
        
        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 3, 30, 19, 128, {min:0, max:2});
        
 /*       if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();    
        }
        else {
            currentBackgroundMusic.play();
        }*/
    };
    this.transitionOut = function(){
//        uiSelect.play();
//        currentBackgroundMusic.pause();
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
            case KEY_E:
                ScreenStates.setState(EDITOR_SCREEN);
                return true;
        }
        return false;
    };
    
    const printMenu = function(menuItems, selected, yOffset = null) {
	    let mainMenuX = canvas.width / 2 - 45;
	    let mainMenuY = (yOffset == null ? 2 * canvas.height / 3 : yOffset);

	    let selectorXOffset = 60;
	    let selectorYOffset = 30;

	    let buttonsXOffset = mainMenuX + 70;

	    for (let i = 0; i < menuItems.length; i++){
		    colorText(menuItems[i].title, mainMenuX, mainMenuY + selectorYOffset * i, Color.White, Fonts.ButtonTitle, textAlignment.Left);
		    if(i == selected) {
			    selectorPosition.x = mainMenuX - 35;
			    selectorPosition.y = mainMenuY + selectorYOffset * i - 15;
		    }
	    }
	}
    
	const update = function(deltaTime) {
		selectorSprite.update(deltaTime);
		
		starfield.update(deltaTime);
	}

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
	}
	
	const drawBG = function menuScreenDrawBG() {
        // fill the background since there is no image for now
        drawRect(0, 0, canvas.width, canvas.height, MENU_BG_COLOR);
    }
    
    const drawTitle = function() {
	    colorText(gameTitle.Main, canvas.width / 2, canvas.height / 3, Color.White, Fonts.MainTitle, textAlignment.Center);
	    colorText(gameTitle.Subtitle, canvas.width / 2, canvas.height / 3 + 40, Color.White, Fonts.Subtitle, textAlignment.Center);
    }
}