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
        //canvasContext.transform(1,0,0,1,0,0);
        this.selectorPositionsIndex = 0;
        starfield = new Starfield(240,120,80,-64,-128,-256);
        selectorSprite = new AnimatedSprite(player1Sheet, 6, 62, 27, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
        
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

    this.control = function menuScreenControl(keydownMap, pressed) { // TO-DO: prevent multiple changes on single press     
        timeSinceKey = 0;
        
        if (this.keysPressed(KEY_A, KEY_X)) {
            console.log("AX");
        }

        if (pressed) {            
            return false;
        }

		if(this.keysPressed(KEY_ENTER)) {
        	keyStrokes.push(KEY_ENTER);
    	}        

        if (this.keysPressed(KEY_UP)) {            
            this.selectorPositionsIndex--;
            if (this.selectorPositionsIndex < 0) {
                this.selectorPositionsIndex += this.selections.length;
            }
            return true;
        } else if (this.keysPressed(KEY_DOWN)) {            
            this.selectorPositionsIndex = (this.selectorPositionsIndex + 1) % this.selections.length;
            if (this.selectorPositionsIndex > this.selections.length - 1) {
                this.selectorPositionsIndex = 0;
            }
            return true;
        } else if (this.keysPressed(KEY_ENTER)) {
            if(this.selectorPositionsIndex === 0) {
                scene = null;
                ScreenStates.setState(CUT_SCENE1_SCREEN, {code: this.getDidEnterCode(), player:null, uiManager:null});
            } else {
                ScreenStates.setState(this.selections[this.selectorPositionsIndex].screen);
            }
            return true;
        } else if (this.keysPressed(KEY_H)) {
            ScreenStates.setState(HELP_SCREEN);
            return true;
        } else if (this.keysPressed(KEY_C)) {
            ScreenStates.setState(CREDITS_SCREEN);
            return true;
        } else if (this.keysPressed(KEY_E)) {
            ScreenStates.setState(EDITOR_SCREEN);
            return true;
        } else if (this.keysPressed(KEY_M)) {
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
	    let mainMenuX = GameField.midX - 80;
	    let mainMenuY = (yOffset == null ? GameField.y + 2 * GameField.height / 3 - 30: yOffset);

	    const selectorXOffset = 80;
	    const selectorYOffset = 60;

	    for (let i = 0; i < menuItems.length; i++){
		    gameFont.printTextAt(menuItems[i].title, {x:mainMenuX, y:(mainMenuY + selectorYOffset * i)}, 35, textAlignment.Left);
		    if(i === selected) {
			    selectorPosition.x = mainMenuX - selectorXOffset;
			    selectorPosition.y = mainMenuY + selectorYOffset * i;
		    }
	    }
	    
	    starPosition = {x:GameField.midX, y:GameField.midY};
	};
	
	const update = function(deltaTime) {
		timeSinceKey += deltaTime;
		
		if(timeSinceKey > 5000) {
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
        //canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);

//		drawTitle();

        // render menu
        printMenu(selections, selectorPositionIndex);
        
        //draw selector sprite
        selectorSprite.drawAt(selectorPosition, {width:62, height:27});
	};
	   
	const drawLogo = function() {
		const logoX = GameField.midX - (1.75 *titleLogo.width / 2) - 5;
		const logoY = GameField.midY - (1.75 *titleLogo.height / 2) - 100;
		canvasContext.drawImage(titleLogo, logoX, logoY, 1.75 * titleLogo.width, 1.75 * titleLogo.height);
		
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
