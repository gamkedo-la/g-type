function MenuScreen() {
	const MENU_BG_COLOR = "#010119";
	let timeSinceKey = 0;

    this.selectorPositionsIndex = 0;
    let selectorPosition = {x:0, y:0};
    let selectorSprite;
    let starfield;
    const keyStrokes = [];
    const cheatCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    
    this.selections = [
	    { screen: GAME_SCREEN, title: textStrings.Play },
//        { screen: LEVEL_SELECT_SCREEN, title: textStrings.Play },
        { screen: HELP_SCREEN, title: textStrings.Help },
        { screen: OPTIONS_SCREEN, title: textStrings.Options },
        { screen: CREDITS_SCREEN, title: textStrings.Credits },
    ];
    this.transitionIn = function menuScreenTransitionIn() {
        this.selectorPositionsIndex = 0;
        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 6, 120, 76, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
        
        currentBackgroundMusic.setCurrentTrack(AudioTracks.MainMenu);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();    
        }
        else {
            currentBackgroundMusic.play();
        }
    };
    this.transitionOut = function menuScreenTransitionOut() {
//        uiSelect.play();
        currentBackgroundMusic.pause();
    };

    this.run = function menuScreenRun(deltaTime) {
	    update(deltaTime);
	    
	    draw(this.selections, this.selectorPositionsIndex);
    };

    this.control = function menuScreenControl(keyCode, pressed) {
	    timeSinceKey = 0;
	    
        if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }
        
		if(keyCode != KEY_ENTER) {
        	keyStrokes.push(keyCode);
    	}
        
        //actual navigation logic
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
            	if(this.selectorPositionsIndex === 0) {
	            	scene = null;
	            	ScreenStates.setState(CUT_SCENE_SCREEN, this.getDidEnterCode());
            	} else {
	            	ScreenStates.setState(this.selections[this.selectorPositionsIndex].screen);
            	}
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
    
    this.getDidEnterCode = function() {
	    if(keyStrokes.length != cheatCode.length) {return false;}
	    
	    for(let i = 0; i < cheatCode.length; i++) {
		    if(keyStrokes[i] != cheatCode[i]) {return false;}
	    }
	    
	    return true;
    };
    
    this.addKeyToCode = function(key) {
	    keyStrokes.push(key);
	    if(keyStrokes.length > cheatCode.length) {
		    keyStrokes.splice(0, 1);
	    }
    }
    
    const printMenu = function(menuItems, selected, yOffset = null) {
	    let mainMenuX = GameField.midX - 90;
	    let mainMenuY = (yOffset == null ? 15 + GameField.y + 2 * GameField.height / 3 : yOffset);

	    const selectorXOffset = 65;
	    const selectorYOffset = 45;

	    for (let i = 0; i < menuItems.length; i++){
		    gameFont.printTextAt(menuItems[i].title, {x:mainMenuX, y:(mainMenuY + selectorYOffset * i)}, 30, textAlignment.Left);
		    if(i === selected) {
			    selectorPosition.x = mainMenuX - selectorXOffset;
			    selectorPosition.y = mainMenuY + selectorYOffset * i - 5;
		    }
	    }
	    
	    starPosition = {x:GameField.midX, y:GameField.midY};
	};
	
	const update = function(deltaTime) {
		timeSinceKey += deltaTime;
		
		if(timeSinceKey > 3000) {
			timeSinceKey = 0;
			ScreenStates.setState(DEMO_SCENE_SCREEN, 1);
		}
		
		selectorSprite.update(deltaTime);
		
		starfield.update(deltaTime);
	};
	
	const draw = function(selections, selectorPositionIndex) {
		// render the menu background
        drawBG();
        
        starfield.draw();
        
        // render the logo overlay
        drawLogo();

        canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);

//		drawTitle();

        // render menu
        printMenu(selections, selectorPositionIndex);
        
        //draw selector sprite
        selectorSprite.drawAt(selectorPosition, {width:60, height:38});
	};
	
	const drawLogo = function() {
		const logoX = GameField.midX - (1.25 *titleLogo.width / 2);
		const logoY = GameField.midY - (1.25 *titleLogo.height / 2) - 75;
		canvasContext.drawImage(titleLogo, logoX, logoY, 1.25 * titleLogo.width, 1.25 * titleLogo.height);
		
	};
	
	const drawBG = function menuScreenDrawBG() {
        // fill the background since there is no image for now
        drawRect(GameField.x, GameField.y - GameField.bgOffset, GameField.width, GameField.height + GameField.bgOffset, MENU_BG_COLOR);
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);
    };
    
    const drawTitle = function() {
	    gameFont.printTextAt(gameTitle.Main, {x:GameField.midX, y:(GameField.y - 10)}, 40, textAlignment.Center);
		gameFont.printTextAt(gameTitle.Subtitle, {x:GameField.midX, y:(GameField.y + 75)}, 30, textAlignment.Center);
    };
        
    return this;
}
