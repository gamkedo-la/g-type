//Help Screen
function HelpScreen() {
	const MENU_BG_COLOR = "#010119";

    this.selectorPositionsIndex = 0;
    let selectorPosition = {x:0, y:0};
    let selectorSprite;
    let thrusterSprite;
    let thrusterSize = {};
    let thrusterPosition = {x:0, y:0};
    let starfield;
	this.selections = [
	    {screen: MENU_SCREEN, title: textStrings.Main},
	   ];
    this.transitionIn = function () {
        this.selectorPositionsIndex = 0;
        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 8, 52, 32, false, true, {min:0, max:0}, 0, {min:0, max:0}, Math.MAX_VALUE, {min:5, max:7}, 128);
        thrusterSprite = new AnimatedSprite(playerThruster, 3, 33, 32, false, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);

		thrusterSize = {width:thrusterSprite.width, height:thrusterSprite.height};

        currentBackgroundMusic.setCurrentTrack(AudioTracks.Help);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();
        } else {
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
		thrusterSprite.update(deltaTime);

		starfield.update(deltaTime);
	};

    this.control = function gamePlayFinishedScreenControl(keydownMap, pressed){
       if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
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
            ScreenStates.setState(this.selections[this.selectorPositionsIndex].screen);
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

	const printMenu = function(menuItems, selected, yOffset = null) {
	    let mainMenuX = GameField.midX - 45;
	    let mainMenuY = (yOffset == null ? GameField.bottom - 120 : yOffset);

	    let selectorXOffset = 60;
	    let selectorYOffset = 40;

	    for (let i = 0; i < menuItems.length; i++){
		    gameFont.printTextAt(menuItems[i].title, {x: mainMenuX - 50, y: mainMenuY + selectorYOffset * i}, 30, textAlignment.Left);
		    if(i === selected) {
			    selectorPosition.x = mainMenuX - 130; //adjust spacing between selector sprite and menu option name
			    selectorPosition.y = mainMenuY + selectorYOffset * i;
		    }
	    }

	    starPosition = {x:GameField.midX, y:GameField.midY};
	};

	const draw = function(selections, selectorPositionIndex) {
		// render the menu background
        drawBG();

        starfield.draw();

		//draw the actual help info
		drawHelp();

        // render menu
        printMenu(selections, selectorPositionIndex);
		
		//draw the thruster
		let thrusterMod = timer.getCurrentTime() % 16 < 8 ? 0 : 3;
		thrusterPosition.x = selectorPosition.x - 28 + thrusterMod;
		thrusterPosition.y = selectorPosition.y;
		//this.thrusterSize.width = thrusterSprite.width * thrusterMod;
		thrusterSprite.drawAt(thrusterPosition, thrusterSize);
		
        //draw selector sprite
        selectorSprite.drawAt(selectorPosition, {width:52, height:32});

		canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);

		gameFont.printTextAt(textStrings.Help, {x:GameField.midX, y:GameField.y}, 30, textAlignment.Center);
	};

	const drawBG = function menuScreenDrawBG() {
        // fill the background since there is no image for now
        drawRect(GameField.x, GameField.y - GameField.bgOffset, GameField.width, GameField.height + GameField.bgOffset, MENU_BG_COLOR);
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);
    };

    const drawHelp = function() {
	    gameFont.printTextAt("^ | < > to move", {x:GameField.midX - 312, y:GameField.midY - 148}, 24, textAlignment.Left);
	    gameFont.printTextAt("[X] to shoot", {x:GameField.midX - 312, y:GameField.midY - 112}, 24, textAlignment.Left);
	    gameFont.printTextAt("[SPACE] to activate Power Up", {x:GameField.midX - 312, y:GameField.midY - 76}, 24, textAlignment.Left);
    };

    return this;
}
