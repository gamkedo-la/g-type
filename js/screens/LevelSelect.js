function LevelSelectScreen() {
    let selectLevelAnimationStartFrame;
    let initialAnimationSpeed = 53;
    
    this.transitionIn = function() {

    };
    
    this.transitionOut = function() {
//        uiSelect.play();
    };
    
    this.run = function levelSelectScreenRun() {
	    
	    
	    
        const previewOffsetY = 280;
        let animationSpeedBackground = clamp((framesFromGameStart-this.selectLevelAnimationStartFrame)*this.initialAnimationSpeed, 0, canvas.width/2);
        let animationSpeedForeground = animationSpeedBackground;
        drawLogo();
        if(animationSpeedBackground > canvas.width/2 - 10) {
            animationSpeedBackground -= (framesFromGameStart-this.selectLevelAnimationStartFrame)/14;
            animationSpeedForeground -= (framesFromGameStart-this.selectLevelAnimationStartFrame)/10;
        }
        wrapAndtransformDraw(Levels[currentLevelIndex].skyPic, {x: 0, y: previewOffsetY, scale: undefined });
        wrapAndtransformDraw(Levels[currentLevelIndex].backgroundPic, {x: -animationSpeedBackground, y: previewOffsetY, scale: undefined });
        wrapAndtransformDraw(Levels[currentLevelIndex].middleGroundPic, {x: -animationSpeedForeground, y: previewOffsetY, scale: undefined });

        printWord(textStrings.LevelSelect, 100, canvas.height/2+180, 0.6);
        printWord(Levels[currentLevelIndex].name, 100, canvas.height/2 + 240);
    };
    
    this.control = function levelSelectControl(keyCode, pressed) {
        if(pressed){
            return false;
        }
        switch (keyCode){
            case KEY_LEFT:
                this.selectLevelAnimationStartFrame = framesFromGameStart;
                prevLevel();
                return true;
            case KEY_RIGHT:
                this.selectLevelAnimationStartFrame = framesFromGameStart;
                nextLevel();
                return true;
            case KEY_ENTER:
                scene = null;
                ScreenStates.setState(GAMEPLAY_SCREEN);
                return true;
            case KEY_ESCAPE:
            case KEY_BACKSPACE:
                ScreenStates.setState(MENU_SCREEN);
                return true;
        }
        return false;
    }
    return this;
}