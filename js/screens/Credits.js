//CreditsScreen
function CreditsScreen() {
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
    this.contributors = textStrings.Contributors;
    let creditsText;

    this.transitionIn = function () {
        scene = new CreditsScene();

        this.skipBump = 0;
        this.currentY = GameField.bottom - 300;

        this.selectorPositionsIndex = 0;
        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 8, 52, 32, false, true, {min:0, max:0}, 0, {min:0, max:0}, 9999999, {min:5, max:7}, 128);

        currentBackgroundMusic.setCurrentTrack(AudioTracks.Help);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();
        } else {
            currentBackgroundMusic.play();
        }

        creditsText = new CreditFont(fontImage, darkFontImage, {width:16, height:16}, canvasContext);
        this.buildContributors();
    };

    this.transitionOut = function() {
//        uiSelect.play();
		currentBackgroundMusic.pause();
    };

    this.buildContributors = function() {
	    let nameX = GameField.midX * 0.2;
        let textSkip = 20;
        let height = 24;
        var textY = 150;
        for (let i = 0; i < this.contributors.length; i++) {
            let contributor = this.contributors[i];
            creditsText.addCreditsString(contributor.name, {x: nameX, y: (this.currentY + textY)}, textAlignment.Left, {width:20, height:20});
//            gameFont.printTextAt(contributor.name, {x: nameX, y: (this.currentY + textY)}, 20, textAlignment.Left);
            textY += height * 1.4;
            for (let j = 0; j < contributor.works.length; j++) {
	            creditsText.addCreditsString(contributor.works[j], {x:nameX + 20, y: (this.currentY + textY)}, textAlignment.Left, {width:20, height:20});
//	            gameFont.printTextAt(contributor.works[j], {x:nameX + 20, y: (this.currentY + textY)}, 20, textAlignment.Left);
                textY += height;
            }
            textY += textSkip;
        }
    };

    this.drawContributors = function() {
        let nameX = GameField.midX - 370;
        let textSkip = 20;
        let height = 24;
        var textY = 150;
        for (let i = 0; i < this.contributors.length; i++) {
            let contributor = this.contributors[i];
            gameFont.printTextAt(contributor.name, {x: nameX, y: (this.currentY + textY)}, 20, textAlignment.Left);
            textY += height * 1.4;
            for (let j = 0; j < contributor.works.length; j++) {
	            gameFont.printTextAt(contributor.works[j], {x:nameX + 20, y: (this.currentY + textY)}, 20, textAlignment.Left);
                textY += height;
            }
            textY += textSkip;
        }
    };

    this.run = function creditsScreenRun(deltaTime) {
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

//        this.drawContributors();

        selectorSprite.update(deltaTime);

		starfield.update(deltaTime);

        creditsText.update(deltaTime, {x:0, y:this.scrollSpeed});
		creditsText.draw();

		// canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);

		gameFont.printTextAt(textStrings.Credits, {x:GameField.midX, y:GameField.y-105}, 30, textAlignment.Center);

        /*gameFont.printTextAt("[^] to Scroll Faster", {x:GameField.x + 20, y:GameField.bottom - 80}, 12, textAlignment.Left);
		gameFont.printTextAt("[|] to Scroll Slower", {x:GameField.x + 20, y:GameField.bottom - 60}, 12, textAlignment.Left);
		gameFont.printTextAt("[Space] to Pause", {x:GameField.x + 20, y:GameField.bottom - 40}, 12, textAlignment.Left);*/
		gameFont.printTextAt("[Backspace] to Main Menu", {x:GameField.x + 450, y:GameField.bottom + 30}, 14, textAlignment.Left);

		scene.update(deltaTime);
		scene.draw();
    };

    this.control = function creditsScreenControl() {
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
        if (this.keysPressed(KEY_MINUS)) {
            this.scrollSpeed -= 2/50;
            return true;
        } else if (this.keysPressed(KEY_PLUS)) {
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
