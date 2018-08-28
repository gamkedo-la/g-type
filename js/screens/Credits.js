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
    
    this.transitionIn = function () {
        this.skipBump = 0;
        this.currentY = canvas.height - 300;
        
        this.selectorPositionsIndex = 0;        
        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 3, 60, 38, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
    };
    
    this.transitionOut = function () {
//        uiSelect.play();
    };
    
    this.drawContributors = function () {
        let nameX = canvas.width / 2 - 350;
        let textSkip = 20;
        let height = 24;
        var textY = 150;
        for (let i = 0; i < this.contributors.length; i++) {
            let contributor = this.contributors[i];
            colorText(contributor.name, nameX, this.currentY + textY, Color.White, Fonts.CreditsText, textAlignment.Left);
            textY += height * 1.4;
            for (let j = 0; j < contributor.works.length; j++) {
                colorText(contributor.works[j], nameX + 20, this.currentY + textY, Color.White, Fonts.CreditsText, textAlignment.Left);
                textY += height;
            }
            textY += textSkip;
        }
    };

    this.run = function creditsScreenRun(deltaTime) {
	    this.totalTime += deltaTime;

        let buttonsX = canvas.width / 2 - 72;
        let selectorXOffset = 40;

        this.currentY -= Math.floor((deltaTime) * this.scrollSpeed);

        if (this.currentY < this.scrollLimit) {
            ScreenStates.setState(MENU_SCREEN);
        }
        
        drawRect(0, 0, canvas.width, canvas.height, MENU_BG_COLOR);
        
        starfield.draw();
        
        this.drawContributors();
        
        selectorSprite.update(deltaTime);
		
		starfield.update(deltaTime);
		
        colorText(textStrings.Credits, canvas.width / 2 - 72, 60, Color.White, Fonts.Subtitle, textAlignment.Left);

        colorText("Up Arrow To Scroll Faster", 550, 500, Color.Aqua, Fonts.CreditsText, textAlignment.Left);
        colorText("Down Arrow To Scroll Slower", 550, 530, Color.Aqua, Fonts.CreditsText, textAlignment.Left);
        colorText("Space To Pause", 550, 560, Color.Aqua, Fonts.CreditsText, textAlignment.Left);
        colorText("Backspace to Main Menu", 550, 590, Color.Aqua, Fonts.CreditsText, textAlignment.Left)
    };
    this.control = function creditsScreenControl(keyCode, pressed) {
        if (pressed) {
	        if(keyCode == KEY_SPACE) {
		        this.scrollSpeed = 0;
	        }
            return true;
        }
        let skipAmt = 150;
        switch (keyCode) {
            case KEY_DOWN:
                this.scrollSpeed -= 2/50;
                return true;
            case KEY_UP:
                this.scrollSpeed += 2/50;
                return true;
            case KEY_SPACE:
            	this.scrollSpeed = 4 / 50;
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
    }
}