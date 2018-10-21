function clear() {
	//This is the basic wipe of the whole canvas, do not limit to just the gamefield
    drawRect(0,0, canvas.width, canvas.height, CLEAR_COLOR);
};

function setPaused(shouldPause, pauseCause) {

	if(shouldPause === ScreenStates.isPaused) {
		return;
	};

	// Prevent resume if paused for a different reason
	if (pauseCause !== ScreenStates.pauseCause
		&& ScreenStates.pauseCause !== PauseCause.NotPaused) {
		return;
	}

  function showPause(){
  	
  if(ScreenStates.state === GAME_SCREEN) {
  	gameFont.printTextAt("[PAUSED]", {x:GameField.midX - 100, y:GameField.midY - 80}, 24, textAlignment.Left);}
else{
	gameFont.printTextAt("[HOLD]", {x:GameField.midX - 400, y:GameField.midY - 220}, 24, textAlignment.Left);
    }
  }  
	
	if(shouldPause) {
		ScreenStates.isPaused = true;
		ScreenStates.pauseCause = pauseCause;
		pauseSound.play();
		showPause();
		currentBackgroundMusic.pause();
	} else {
		ScreenStates.isPaused = false;
		ScreenStates.pauseCause = PauseCause.NotPaused;
		resumeSound.play();
		currentBackgroundMusic.resume();
	}
	return;
};

const ScreenStates = {
	stateLog : [],
	state: LOADING_SCREEN,
	isPaused:false,
	pauseCause:PauseCause.NotPaused,
	screens: {
		[LOADING_SCREEN]: new LoadingScreen(),
		[MENU_SCREEN]: new MenuScreen(),
        [OPTIONS_SCREEN]: new OptionsScreen(),
//		[LEVEL_SELECT_SCREEN]: new LevelSelectScreen(),
		[CREDITS_SCREEN]: new CreditsScreen(),
		[HELP_SCREEN]: new HelpScreen(),
		[GAME_SCREEN]: new GamePlayScreen(),
        [CUT_SCENE1_SCREEN]: new CutScene1Screen(),
        [CUT_SCENE2_SCREEN]: new CutScene1Screen(),//Need to create a new class of cut scene for this
        [CUT_SCENE3_SCREEN]: new CutScene1Screen(),//Need to create a new class of cut scene for this
		[DEMO_SCENE_SCREEN]: new DemoSceneScreen(),
//		[PAUSE_SCREEN]: new PauseScreen(),
		[GAME_OVER_SCREEN]: new GameOverScreen(),
		[ENDING_SCREEN]: new EndgameScreen()
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
		if(!this.isPaused) {
	       clear();
		   this.screens[this.state].run(deltaTime);
		}
 	},
	control: function(keyCode, pressed){
		let currentState = this.screens[this.state];
        let handled = currentState.control(keyCode, pressed);
        if(!handled) {//Do something here if that becomes necessary

		}
		return handled;
    }

};
