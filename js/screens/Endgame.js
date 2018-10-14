// Endgame Scroller Screen

// needs to be triggered via ScreenStates.setState(ENDING_SCREEN);

function EndgameScreen() {
	const MENU_BG_COLOR = "#010119";

	this.selectorPositionsIndex = 0;
	let selectorPosition = {x:0, y:0};
	let selectorSprite;
	let starfield;
	this.selections = [
	    {screen: GAME_SCREEN, title: textStrings.Play},
	    {screen: MENU_SCREEN, title: textStrings.Main},
	   ];

    this.scrollLimit = -3200;
    this.currentY = 0;
    this.scrollSpeed = 4 / 50;
    this.totalTime = 0;
    this.endgameScript = textStrings.endgameScript;
    let EndgameText;
    
    this.transitionIn = function () {
        console.log("Endgame.transitionIn starting...");
        scene = new EndgameScene();
        
        this.skipBump = 0;
        this.currentY = GameField.bottom - 300;
        
        this.selectorPositionsIndex = 0;        
        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 6, 62, 27, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
        
        currentBackgroundMusic.setCurrentTrack(AudioTracks.Help);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();    
        } else {
            currentBackgroundMusic.play();
        }
        
        EndgameText = new CreditFont(fontImage, darkFontImage, {width:16, height:16}, canvasContext);
        this.buildendgameScript();
    };
    
    this.transitionOut = function() {
//        uiSelect.play();
		currentBackgroundMusic.pause();
    };
    
    this.buildendgameScript = function() {
	    let nameX = GameField.midX - 50 - 80;
        let textSkip = 20;
        let height = 24;
        var textY = 150;
        for (let i = 0; i < this.endgameScript.length; i++) {
            EndgameText.addCreditsString(this.endgameScript[i], {x: nameX, y: (this.currentY + textY)}, textAlignment.Left, {width:20, height:20});
//            gameFont.printTextAt(contributor.name, {x: nameX, y: (this.currentY + textY)}, 20, textAlignment.Left);
            textY += height * 1.4;
            textY += textSkip;
        }
    };
    
    this.drawendgameScript = function() {
        let nameX = GameField.midX - 350 - 80;
        let textSkip = 20;
        let height = 24;
        var textY = 150;
        for (let i = 0; i < this.endgameScript.length; i++) {
            gameFont.printTextAt(this.endgameScript[i], {x: nameX, y: (this.currentY + textY)}, 20, textAlignment.Left);
            textY += height * 1.4;
            textY += textSkip;
        }
    };

    this.run = function EndgameScreenRun(deltaTime) {
	    this.totalTime += deltaTime;

        let buttonsX = GameField.midX - 72;
        let selectorXOffset = 40;

        this.currentY -= Math.floor((deltaTime) * this.scrollSpeed);

        if (this.currentY < this.scrollLimit) {
            ScreenStates.setState(MENU_SCREEN);
        }
        
        drawRect(GameField.x, GameField.y - GameField.bgOffset, GameField.width, GameField.height + GameField.bgOffset, MENU_BG_COLOR);
        
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);        
        starfield.draw();
        
//        this.drawendgameScript();
        
        selectorSprite.update(deltaTime);
		
		starfield.update(deltaTime);

		canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);
		
		gameFont.printTextAt(textStrings.Endgame, {x:GameField.midX, y:GameField.y}, 30, textAlignment.Center);

        gameFont.printTextAt("[^] to Scroll Faster", {x:GameField.x + 20, y:GameField.bottom - 80}, 12, textAlignment.Left);
		gameFont.printTextAt("[|] to Scroll Slower", {x:GameField.x + 20, y:GameField.bottom - 60}, 12, textAlignment.Left);
		gameFont.printTextAt("[Space] to Pause", {x:GameField.x + 20, y:GameField.bottom - 40}, 12, textAlignment.Left);
		gameFont.printTextAt("[Backspace] to Main Menu", {x:GameField.x + 20, y:GameField.bottom - 20}, 12, textAlignment.Left);
		
		scene.update(deltaTime);
		scene.draw();
		
		EndgameText.update(deltaTime, {x:0, y:this.scrollSpeed});
		EndgameText.draw();
    };
    
    this.control = function EndgameScreenControl(keyCode, pressed) {
		if((pressed) && (keyCode === KEY_SPACE)) {
			if(this.scrollSpeed !== 0) {
				this.scrollSpeed = 0;
			} else {
				this.scrollSpeed = 4/50;
			}

			return true;
	    }
                    
        switch(keyCode) {
			case KEY_UP:
                holdUp = pressed;//move up
                return true;
            case KEY_DOWN:
                holdDown = pressed;//move down
                return true;
            case KEY_LEFT:
                holdLeft = pressed;//move left
                return true;
            case KEY_RIGHT:
                holdRight = pressed;//move right
                return true;
			case KEY_X:
				holdX = pressed;//shoot
                return true;
	    }
        
        let skipAmt = 150;
        switch (keyCode) {
            case KEY_MINUS:
                this.scrollSpeed -= 2/50;
                return true;
            case KEY_PLUS:
                this.scrollSpeed += 2/50;
                return true;
            case KEY_ENTER:
            case KEY_ESCAPE:
            case KEY_BACKSPACE:
                ScreenStates.setState(MENU_SCREEN);
                return true;
            case KEY_M:
            	toggleMute();	            	
                return true;
        }
        
        return true;
    };
}
