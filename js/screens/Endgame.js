// Endgame Scroller Screen

// needs to be triggered via ScreenStates.setState(ENDING_SCREEN);
// which currently happens in Game.js when scene.beatTheGame==true

function EndgameScreen() {
	const MENU_BG_COLOR = "#010119";

	let selectorSprite;
	let starfield;
	let planetSprite;
	let PLANET_SCALE = 7.0;
	let planetPos = {x:GameField.x - 350, y:GameField.y - 350};

    this.scrollLimit = -1200;
    this.currentY = 0;
    this.scrollSpeed = 4 / 50;
    this.totalTime = 0;
    
    this.endgameScript = textStrings.endgameScriptBad;
    let EndgameText;

    this.transitionIn = function () {
	    if(activatedAnyGhosts) {
		    this.endgameScript = textStrings.endgameScriptGood;
	    }
        scene = new EndgameScene(this.properties.player);

        this.skipBump = 0;
        this.currentY = GameField.bottom - 300;

        starfield = new Starfield(180, 120, 80, -16, -32, -64);
        selectorSprite = new AnimatedSprite(player1Sheet, 8, 52, 32, false, true, {min:0, max:0}, 0, {min:0, max:0}, 9999999, {min:5, max:7}, 128);
        planetSprite = new AnimatedSprite(planetSheet, 3, 192, 192, false, true, {min:0, max:0}, 0, {min:0, max:2}, 512, {min:2, max:2}, 0);

        currentBackgroundMusic.setCurrentTrack(AudioTracks.GameEnding);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();
        } else {
            currentBackgroundMusic.play();
        }

        EndgameText = new CreditFont(fontImage, darkFontImage, {width:16, height:16}, canvasContext);
        this.buildendgameScript();
    };

    this.transitionOut = function() {
		currentBackgroundMusic.pause();
    };

    this.buildendgameScript = function() {
	    let nameX = GameField.midX - 145;
        let textSkip = 20;
        let height = 24;
        let textY = 150;
        for (let i = 0; i < this.endgameScript.length; i++) {
            EndgameText.addCreditsString(this.endgameScript[i], {x: nameX, y: (this.currentY + textY)}, textAlignment.Left, {width:26, height:26});
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
            ScreenStates.setState(CREDITS_SCREEN);
        }

        canvasContext.drawImage(backgroundColorLookup, 150, 0, 16, 100, 0, 0, canvas.width, canvas.height);

        selectorSprite.update(deltaTime);
        PLANET_SCALE *= 0.9975;
        planetSprite.update(deltaTime);
        planetPos.x -= 0.15625;
        planetPos.y += 0.75;
		planetSprite.drawAt(planetPos.x, planetPos.y, planetSprite.width * PLANET_SCALE, planetSprite.height * PLANET_SCALE);

		starfield.update(deltaTime);
		starfield.draw();

		gameFont.printTextAt(textStrings.Endgame, {x:GameField.midX, y:20}, 32, textAlignment.Center);

        gameFont.printTextAt("[+] to Scroll Faster", {x:GameField.x - 43, y:GameField.bottom - 40}, 12, textAlignment.Left);
		gameFont.printTextAt("[-] to Scroll Slower", {x:GameField.x - 43, y:GameField.bottom - 20}, 12, textAlignment.Left);
		gameFont.printTextAt("[Space] to Pause", {x:GameField.x - 43, y:GameField.bottom}, 12, textAlignment.Left);
		gameFont.printTextAt("[Backspace] or [Esc] to Main Menu", {x:GameField.x - 43, y:GameField.bottom + 20}, 12, textAlignment.Left);

		scene.update(deltaTime);
		scene.draw();

		EndgameText.update(deltaTime, {x:0, y:this.scrollSpeed});
		EndgameText.draw();
    };

    this.control = function endgameScreenControl() {
		if (this.keysPressed(KEY_SPACE)) {
            if(this.scrollSpeed !== 0) {
                this.scrollSpeed = 0;
            } else {
                this.scrollSpeed = 4/50;
            }
            return true;
        }

        // SHIP CONTROLS START
        holdKey[KEY_UP] = this.keysPressed(KEY_UP) || this.keysPressed(KEY_W);
        holdKey[KEY_DOWN] = this.keysPressed(KEY_DOWN) || this.keysPressed(KEY_S);
        holdKey[KEY_LEFT] = this.keysPressed(KEY_LEFT) || this.keysPressed(KEY_A);
        holdKey[KEY_RIGHT] = this.keysPressed(KEY_RIGHT) || this.keysPressed(KEY_D);
        holdKey[KEY_X] = this.keysPressed(KEY_X);
        // SHIP CONTROLS END

        let skipAmt = 150;
        if (this.keysPressed(KEY_MINUS) || this.keysPressed(KEY_NUMPAD_SUBTRACT)) {
            this.scrollSpeed -= 2/50;
            return true;
        } else if (this.keysPressed(KEY_PLUS) || this.keysPressed(KEY_NUMPAD_ADD)) {
            this.scrollSpeed += 2/50;
            return true;
        } else if (this.keysPressed(KEY_ENTER) || this.keysPressed(KEY_ESCAPE) || this.keysPressed(KEY_BACKSPACE)) {
            ScreenStates.setState(MENU_SCREEN);
            return true;
        } else if (this.keysPressed(KEY_M)) {
            toggleMute();
            return true;
        }

        return true;
    };
}
