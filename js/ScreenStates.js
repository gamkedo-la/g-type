function clear() {
    drawRect(0,0, canvas.width, canvas.height, CLEAR_COLOR);
}

/*function drawLogo(){
    let titleImageX = canvas.width/2 - 150;
    let titleImageY = canvas.height/2 - 380;
    mainMenuLogoSprite.draw(titleImageX,titleImageY);
}*/

function setPaused(shouldPause) {
	if(shouldPause) {
//		mainStates.isPaused = true;
//		pauseMusic(backgroundMusic);
	} else {
//		mainStates.isPaused = false;
//		playAndLoopMusic(backgroundMusic);
	}
}

const ScreenStates = {
	stateLog : [],
	state: LOADING_SCREEN,
	screens: {
		[LOADING_SCREEN]: new LoadingScreen(),
		[MENU_SCREEN]: new MenuScreen(),
//        [OPTIONS_SCREEN]: new OptionsScreen(),
//		[LEVEL_SELECT_SCREEN]: new LevelSelectScreen(),
//		[CREDITS_SCREEN]: new CreditsScreen(),
		[HELP_SCREEN]: new HelpScreen(),
		[GAME_SCREEN]: new GamePlayScreen(),
//		[PAUSE_SCREEN]: new PauseScreen(),
		[GAME_OVER_SCREEN]: new GameOverScreen(),
//		[ENDING_SCREEN]: new EndingScreen()*/
	},
	setState: function(newState, properties) {
		if(newState === this.state) {
			return;
        }
        this.screens[this.state].transitionOut();
        this.stateLog.push(this.state);
		this.state = newState;
		this.screens[this.state].properties = properties;
		this.screens[this.state].transitionIn();
		return this;
	},
	getPreviousState: function() {
		return this.stateLog[this.stateLog.length-1];
	},
	run: function(deltaTime) {
        clear();
		this.screens[this.state].run(deltaTime);
	},
	control: function(keyCode, pressed){
		let currentState = this.screens[this.state];
        let handled = currentState.control(keyCode, pressed);
        if(!handled) {//Do something here if that becomes necessary

		}
		return handled;
    }

};
