function setPaused(shouldPause, pauseCause) {

	if(shouldPause === ScreenStates.isPaused) {
		return;
	}

	// Prevent resume if paused for a different reason
	if (pauseCause !== ScreenStates.pauseCause
		&& ScreenStates.pauseCause !== PauseCause.NotPaused) {
		return;
	} 
	
	if(shouldPause) {
		ScreenStates.isPaused = true;
		ScreenStates.pauseCause = pauseCause;
		pauseSound.play();
		let pausedPosition = {x:GameField.midX - 100, y:GameField.midY - 80};
		if((ScreenStates.state === HELP_SCREEN) || 
		   (ScreenStates.state === OPTIONS_SCREEN) ||
		   (ScreenStates.state === GAME_OVER_SCREEN)) {
			pausedPosition.x = GameField.midX + 200;
			pausedPosition.y = GameField.bottom - 40;
		} else if(ScreenStates.state === CREDITS_SCREEN) {
			pausedPosition.x = GameField.midX + 200;
			pausedPosition.y = 10;
		} else if(ScreenStates.state === MENU_SCREEN) {
			pausedPosition.x = GameField.midX - 96;
			pausedPosition.y = 10;
		}
		gameFont.printTextAt("[PAUSED]", pausedPosition, 24, textAlignment.Left);
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
		[CREDITS_SCREEN]: new CreditsScreen(),
		[HELP_SCREEN]: new HelpScreen(),
		[GAME_SCREEN]: new GamePlayScreen(),
		[STORY_SCENE_SCREEN]: new StorySceneScreen(),
        [CUT_SCENE1_SCREEN]: new CutScene1Screen(),
        [CUT_SCENE2_SCREEN]: new CutScene2Screen(),
        [CUT_SCENE3_SCREEN]: new CutScene3Screen(),
		[DEMO_SCENE_SCREEN]: new DemoSceneScreen(),
		[GAME_OVER_SCREEN]: new GameOverScreen(),
		[ENDING_SCREEN]: new EndgameScreen()
	},
	setState: function(newState, properties) {
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
		   this.screens[this.state].run(deltaTime);
		}
 	},
	control: function(keydownMap, pressed){
		this.screens[this.state].keysPressed = function () {
			let keysToPress = arguments;
		
			for(let i = 0; i < keysToPress.length; i++) {
				if(!keydownMap[keysToPress[i]]) { // if any key in arguments is not pressed
					return false;		
				}
			}			
			
			return true;			
		};

		let currentState = this.screens[this.state];
		let handled = currentState.control(keydownMap, pressed);

        if(!handled) {//Do something here if that becomes necessary
			
		}
		return handled;
    }
};
