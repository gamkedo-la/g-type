//StoryScene
//CutScene - Use between Title Screen & Level 1, between Levels and for Game End animation
function StorySceneScreen() {
	const MENU_BG_COLOR = "#010119";

    let starfield;

    const DISPLAY_TIME = 7000;//6000 = 6 second display time
    const INTRO_STORY_SCROLL_SPEED_Y = 0.001; //default is 0.001

    let runtime = 0;
    let story;

    this.transitionIn = function() {
	    story = textStrings.Story;
	    
        starfield = new Starfield(120, 60, 40, -16, -32, -64);
	    
        currentBackgroundMusic.setCurrentTrack(AudioTracks.GameOver);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();
        }
        else {
            currentBackgroundMusic.play();
        }
    };
    
    this.transitionOut = function() {
        currentBackgroundMusic.pause();
    };
    
    this.run = function gamePlayFinishedScreenRun(deltaTime) {
	    runtime += deltaTime;
	    
	    if(runtime > DISPLAY_TIME) {
		    runtime = 0;
		    ScreenStates.setState(MENU_SCREEN);
		    return;
	    }

	    update(deltaTime);

	    draw(deltaTime);
    };
    
    this.control = function demoPlayScreenControl(keydownMap, pressed) {
	    if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }
        
        menuSelect.play();
		ScreenStates.setState(MENU_SCREEN);
	};

	const update = function(deltaTime) {
		starfield.update(deltaTime);
	};

	const draw = function(deltaTime) {
		// render the menu background
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);

        starfield.draw();
        
        let currentY = 10;
        const DELTA_Y = 40;
        for(let i = 0; i < story.length; i++) {
	        if((i === 7) || (i === 14)) {currentY += (DELTA_Y/2);}
	        gameFont.printTextAt(story[i], {x:canvas.width / 2, y:currentY}, 22, textAlignment.Center);
	        currentY += DELTA_Y;
        }
        
        currentY += DELTA_Y;
        gameFont.printTextAt("Press Any Key to Start", {x:canvas.width - 20, y:currentY}, 16, textAlignment.Right);
		
		gameFont.printTextAt(textStrings.SkipCutScene, {x:GameField.right - 70, y: GameField.bottom + 60}, 12, textAlignment.Right, {deltaTime: deltaTime, speed: {x:0, y:INTRO_STORY_SCROLL_SPEED_Y}});
    };
}