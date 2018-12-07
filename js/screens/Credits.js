//CreditsScreen
function CreditsScreen() {
	const MENU_BG_COLOR = "#010119";

	this.selectorPositionsIndex = 0;
	let selectorPosition = {x:0, y:0};
	let starfield;
	this.selections = [
	    {screen: GAME_SCREEN, title: textStrings.Play},
	    {screen: MENU_SCREEN, title: textStrings.Main},
	   ];

    this.scrollLimit = -4400;
    this.currentY = 0;
    this.scrollSpeed = 5 / 50;
    this.totalTime = 0;
    this.contributors = textStrings.Contributors;
    let creditsText;

    this.transitionIn = function () {
        scene = new CreditsScene();

        this.skipBump = 0;
        this.currentY = GameField.bottom - 300;

        starfield = new Starfield(180, 120, 80, -16, -32, -64);

        currentBackgroundMusic.setCurrentTrack(AudioTracks.Credits);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();
        } else {
            currentBackgroundMusic.play();
        }

        creditsText = new CreditFont(fontImage, darkFontImage, {width:16, height:16}, canvasContext);
        this.buildContributors();
    };

    this.transitionOut = function() {
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
            textY += height * 1.4;
            for (let j = 0; j < contributor.works.length; j++) {
	            creditsText.addCreditsString(contributor.works[j], {x:nameX + 20, y: (this.currentY + textY)}, textAlignment.Left, {width:20, height:20});
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

        let arrowAdjustedScrollSpeed;

        if(holdKey[KEY_UP]) {
            arrowAdjustedScrollSpeed = -this.scrollSpeed * 3.0;
        } else if(holdKey[KEY_DOWN]) {
            arrowAdjustedScrollSpeed = this.scrollSpeed * 6.0;
        } else if(holdKey[KEY_RIGHT]) {
            arrowAdjustedScrollSpeed = this.scrollSpeed * 0.3;
        } else if(holdKey[KEY_LEFT]) {
            arrowAdjustedScrollSpeed = 0.0;
        } else {
            arrowAdjustedScrollSpeed = this.scrollSpeed;
        }

        this.currentY -= deltaTime*arrowAdjustedScrollSpeed;

        // console.log(this.currentY);
        if (this.currentY < this.scrollLimit) {
            ScreenStates.setState(MENU_SCREEN);
        }

        canvasContext.drawImage(backgroundColorLookup, 150, 0, 16, 100, 0, 0, canvas.width, canvas.height);
        starfield.draw();

		starfield.update(deltaTime);

        creditsText.update(deltaTime, {x:0, y:arrowAdjustedScrollSpeed});
		creditsText.draw();

		gameFont.printTextAt(textStrings.Credits, {x:GameField.midX, y:GameField.y - 135}, 30, textAlignment.Center);

        gameFont.printTextAt("[X] to Pause/Unpause Scroll", {x:GameField.x + 30, y:GameField.bottom + 30}, 14, textAlignment.Left);
		gameFont.printTextAt("[Backspace] to Main Menu", {x:GameField.x + 450, y:GameField.bottom + 30}, 14, textAlignment.Left);

		scene.update(deltaTime);
		scene.draw();
    };

    this.control = function creditsScreenControl() {
        // SHIP CONTROLS START
        holdKey[KEY_UP] = this.keysPressed(KEY_UP) || this.keysPressed(KEY_W);
        holdKey[KEY_DOWN] = this.keysPressed(KEY_DOWN) || this.keysPressed(KEY_S);
        holdKey[KEY_LEFT] = this.keysPressed(KEY_LEFT) || this.keysPressed(KEY_A);
        holdKey[KEY_RIGHT] = this.keysPressed(KEY_RIGHT) || this.keysPressed(KEY_D);
        holdKey[KEY_X] = this.keysPressed(KEY_X);
        // SHIP CONTROLS END

        if (holdKey[KEY_X]) {
            if(this.scrollSpeed !== 0) {
                this.scrollSpeed = 0;
            } else {
                this.scrollSpeed = 4/50;
            }
            return true;
        }

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
