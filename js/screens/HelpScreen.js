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
	        menuSelect.play();
            ScreenStates.setState(this.selections[this.selectorPositionsIndex].screen);
            return true;
        } else if (this.keysPressed(KEY_H)) {
	        menuSelect.play();
            ScreenStates.setState(HELP_SCREEN);
            return true;
        } else if (this.keysPressed(KEY_C)) {
	        menuSelect.play();
            ScreenStates.setState(CREDITS_SCREEN);
            return true;
        } else if (this.keysPressed(KEY_E)) {
	        menuSelect.play();
            ScreenStates.setState(EDITOR_SCREEN);
            return true;
        } else if (this.keysPressed(KEY_M)) {
            toggleMute();
            return true;
        }

        return false;
    };

	const printMenu = function(menuItems, selected, yOffset = null) {
	    let mainMenuX = GameField.midX;
	    let mainMenuY = (yOffset == null ? GameField.bottom - 70 : yOffset);

	    let selectorXOffset = 60;
	    let selectorYOffset = 40;

	    for (let i = 0; i < menuItems.length; i++){
		    gameFont.printTextAt(menuItems[i].title, {x: GameField.midX, y: mainMenuY + selectorYOffset * i}, 30, textAlignment.Center);
		    if(i === selected) {
			    selectorPosition.x = mainMenuX - 200; //adjust spacing between selector sprite and menu option name
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
	    const baseX = GameField.x + 125;
	    const baseY = GameField.y + 60;
	    const deltaY = 30;
	    const helpFontSize = 20;
	    const deltaFontSize = 4;
	    const indent = 42;
	    gameFont.printTextAt("WASD or ^ | < > to move", {x:baseX, y:baseY + deltaY}, helpFontSize, textAlignment.Left);
	    gameFont.printTextAt("[X] to shoot", {x:baseX, y:baseY + (2 * deltaY)}, helpFontSize, textAlignment.Left);
	    gameFont.printTextAt("[SPACE] to activate Power Up", {x:baseX, y:baseY + (3 * deltaY)}, helpFontSize, textAlignment.Left);
	    //leaving a blank space for readability
	    gameFont.printTextAt("Collect capsules to cycle", {x:baseX, y:baseY + (5 * deltaY)}, helpFontSize, textAlignment.Left);
	    gameFont.printTextAt("through Power Up options.", {x:baseX, y:baseY + (6 * deltaY)}, helpFontSize, textAlignment.Left);
	    gameFont.printTextAt("Speed = Fly/Shoot faster", {x:baseX + indent, y:baseY + (7 * deltaY)}, helpFontSize - deltaFontSize, textAlignment.Left);
	    gameFont.printTextAt("Missiles = Add missile weapon", {x:baseX + indent, y:baseY + (8 * deltaY)}, helpFontSize - deltaFontSize, textAlignment.Left);
	    gameFont.printTextAt("Double = Double shot", {x:baseX + indent, y:baseY + (9 * deltaY)}, helpFontSize - deltaFontSize, textAlignment.Left);
	    gameFont.printTextAt("Laser = Laser shot", {x:baseX + indent, y:baseY + (10 * deltaY)}, helpFontSize - deltaFontSize, textAlignment.Left);
	    gameFont.printTextAt("Triple = Triple shot", {x:baseX + indent, y:baseY + (11 * deltaY)}, helpFontSize - deltaFontSize, textAlignment.Left);
	    gameFont.printTextAt("Shield = Protect from alien shots", {x:baseX + indent, y:baseY + (12 * deltaY)}, helpFontSize - deltaFontSize, textAlignment.Left);
	    gameFont.printTextAt("Ghost = Add a G.H.O.S.T. Ship", {x:baseX + indent, y:baseY + (13 * deltaY)}, helpFontSize - deltaFontSize, textAlignment.Left);
	    gameFont.printTextAt("Force = ????", {x:baseX + indent, y:baseY + (14 * deltaY)}, helpFontSize - deltaFontSize, textAlignment.Left);
    };

    return this;
}
