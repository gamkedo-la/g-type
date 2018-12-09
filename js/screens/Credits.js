//CreditsScreen
function CreditsScreen() {
    const MENU_BG_COLOR = "#010119";
    const SCROLL_START_Y_SPEED = 5 / 50;

	this.selectorPositionsIndex = 0;
	let selectorPosition = {x:0, y:0};
	let starfield;
	this.selections = [
	    {screen: GAME_SCREEN, title: textStrings.Play},
	    {screen: MENU_SCREEN, title: textStrings.Main},
	   ];

    this.scrollLimit = -4600;
    this.currentY = 0;
    this.scrollSpeed = SCROLL_START_Y_SPEED;
    this.totalTime = 0;
    this.contributors = textStrings.Contributors;
    let creditsText;

    let arrowAdjustedScrollSpeed = this.scrollSpeed;

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

        this.scrollSpeed = SCROLL_START_Y_SPEED;
    };

    this.transitionOut = function() {
		currentBackgroundMusic.pause();
    };

    this.buildContributors = function() {
	    let nameX = GameField.midX * 0.2;
        let textSkip = 20;
        let height = 24;
        let textY = 150;

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

        this.currentY -= deltaTime*arrowAdjustedScrollSpeed;

        // console.log(this.currentY);
        // if (this.currentY < this.scrollLimit) {
        //     creditsText.resetScrollY(200);
        // }

        canvasContext.drawImage(backgroundColorLookup, 150, 0, 16, 100, 0, 0, canvas.width, canvas.height);
        starfield.draw();

		starfield.update(deltaTime);

        creditsText.update(deltaTime, {x:0, y:arrowAdjustedScrollSpeed});
		creditsText.draw();

		gameFont.printTextAt(textStrings.Credits, {x:GameField.midX, y:GameField.y - 135}, 30, textAlignment.Center);

        gameFont.printTextAt("[P] Pause/Unpause", {x:GameField.x - 50, y:GameField.bottom + 30}, 14, textAlignment.Left);
        gameFont.printTextAt("[Space]/[Shift+Space] Scroll", {x:GameField.x + 222, y:GameField.bottom + 30}, 14, textAlignment.Left);
        gameFont.printTextAt("[Esc] Main Menu", {x:GameField.x + 636, y:GameField.bottom + 30}, 14, textAlignment.Left);
        
        let offsetCharX = 16;
        let offsetCharY = 20;
        let offsetCharKeyY = 15;
        
        let offsetXScrollSpeed = -50;        
        let offsetYScrollSpeed1 = -20;
        let offsetYScrollSpeed2 = 120;
        let offsetCharScrollSpeedY = 650;

        gameFont.printTextAt("[-]", {x:GameField.x + offsetXScrollSpeed, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed1 - offsetCharKeyY }, 14, textAlignment.Left);
        gameFont.printTextAt("S", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed1 + offsetCharY }, 14, textAlignment.Left);
        gameFont.printTextAt("c", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed1 + offsetCharY * 2 }, 14, textAlignment.Left);
        gameFont.printTextAt("r", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed1 + offsetCharY * 3 }, 14, textAlignment.Left);
        gameFont.printTextAt("o", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed1 + offsetCharY * 4 }, 14, textAlignment.Left);
        gameFont.printTextAt("l", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed1 + offsetCharY * 5 }, 14, textAlignment.Left);
        gameFont.printTextAt("l", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed1 + offsetCharY * 6 }, 14, textAlignment.Left);

        gameFont.printTextAt("S", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed2 + offsetCharY }, 14, textAlignment.Left);
        gameFont.printTextAt("p", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed2 + offsetCharY * 2 }, 14, textAlignment.Left);
        gameFont.printTextAt("e", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed2 + offsetCharY * 3 }, 14, textAlignment.Left);
        gameFont.printTextAt("e", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed2 + offsetCharY * 4 }, 14, textAlignment.Left);
        gameFont.printTextAt("d", {x:GameField.x + offsetXScrollSpeed + offsetCharX, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed2 + offsetCharY * 5 }, 14, textAlignment.Left);
        gameFont.printTextAt("[+]", {x:GameField.x + offsetXScrollSpeed, y:GameField.bottom - offsetCharScrollSpeedY + offsetYScrollSpeed2 + offsetCharY * 6 + offsetCharKeyY }, 14, textAlignment.Left);

        let offsetXResetScroll = -50;
        let offSetYResetScroll1 = 330;
        let offSetYResetScroll2 = 470;
        let offsetCharResetScrollY = 630;

        gameFont.printTextAt("[R]", {x:GameField.x + offsetXResetScroll, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll1 - offsetCharKeyY }, 14, textAlignment.Left);
        gameFont.printTextAt("R", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll1 + offsetCharY }, 14, textAlignment.Left);
        gameFont.printTextAt("e", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll1 + offsetCharY * 2 }, 14, textAlignment.Left);
        gameFont.printTextAt("s", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll1 + offsetCharY * 3 }, 14, textAlignment.Left);
        gameFont.printTextAt("e", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll1 + offsetCharY * 4 }, 14, textAlignment.Left);
        gameFont.printTextAt("t", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll1 + offsetCharY * 5 }, 14, textAlignment.Left);

        gameFont.printTextAt("S", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll2 }, 14, textAlignment.Left);
        gameFont.printTextAt("c", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll2 + offsetCharY }, 14, textAlignment.Left);
        gameFont.printTextAt("r", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll2 + offsetCharY * 2 }, 14, textAlignment.Left);
        gameFont.printTextAt("o", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll2 + offsetCharY * 3 }, 14, textAlignment.Left);
        gameFont.printTextAt("l", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll2 + offsetCharY * 4 }, 14, textAlignment.Left);
        gameFont.printTextAt("l", {x:GameField.x + offsetXResetScroll + offsetCharX, y:GameField.bottom - offsetCharResetScrollY + offSetYResetScroll2 + offsetCharY * 5 }, 14, textAlignment.Left);

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

        if(this.keysPressed(KEY_SHIFT, KEY_SPACE)) {
            arrowAdjustedScrollSpeed = -this.scrollSpeed * 3.0;
            if (this.scrollSpeed == 0) {
                this.scrollSpeed = 4/50;
            }
            return true;
        } else if(this.keysPressed(KEY_SPACE)) {
            arrowAdjustedScrollSpeed = this.scrollSpeed * 6.0;
            if (this.scrollSpeed == 0) {
                this.scrollSpeed = 4/50;
            }
            return true;
        } else if (this.keysPressed(KEY_P) || this.keysPressed(KEY_BACKSPACE)) {
            if(this.scrollSpeed !== 0) {
                this.scrollSpeed = 0;
            } else {
                this.scrollSpeed = 4/50;
            }
            return true;
        } else if (this.keysPressed(KEY_MINUS) || this.keysPressed(KEY_NUMPAD_SUBTRACT)) {
            this.scrollSpeed -= 2/50;
            return true;
        } else if (this.keysPressed(KEY_PLUS) || this.keysPressed(KEY_NUMPAD_ADD)) {
            this.scrollSpeed += 2/50;
            return true;
        } else if (this.keysPressed(KEY_R)) {
            creditsText.resetScrollY();     
            this.scrollSpeed = SCROLL_START_Y_SPEED;   
        } else if (this.keysPressed(KEY_ESCAPE)) {
            ScreenStates.setState(MENU_SCREEN);
            return true;
        } else if (this.keysPressed(KEY_M)) {
            toggleMute();
            return true;
        } else {
            arrowAdjustedScrollSpeed = this.scrollSpeed;
        }

        return true;
    };
}
