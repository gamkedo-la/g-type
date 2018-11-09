//GameOver - Continue Screen
function GameOverScreen() {
	const MENU_BG_COLOR = "#010119";

    this.selectorPositionsIndex = 0;
    let selectorPosition = {x:0, y:0};
    let selectorSprite;
    let starfield;
    this.selections = [
	    { screen: GAME_SCREEN, title: textStrings.Continue },
	    { screen: GAME_SCREEN, title: textStrings.Restart },
	    { screen: MENU_SCREEN, title: textStrings.Quit },
//        { screen: LEVEL_SELECT_SCREEN, title: textStrings.Play },
//        { screen: HELP_SCREEN, title: textStrings.Help },
//        { screen: OPTIONS_SCREEN, title: textStrings.Options },
//        { screen: CREDITS_SCREEN, title: textStrings.Credits },
    ];
    this.transitionIn = function(){
        remainingLives = 2;//Set up for a continue or restart
        
        this.selectorPositionsIndex = 0;        
        starfield = new Starfield();
        selectorSprite = new AnimatedSprite(player1Sheet, 6, 62, 27, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0);
        currentBackgroundMusic.setCurrentTrack(AudioTracks.GameOver);
        if(currentBackgroundMusic.getTime() > 0){
            currentBackgroundMusic.resume();    
        }
        else {
            currentBackgroundMusic.play();
        }
    };
    this.transitionOut = function() {
	    if(this.selectorPositionsIndex !== 0) {
		    scene = null;
	    }
//        uiSelect.play();
        currentBackgroundMusic.pause();
    };
    this.run = function gamePlayFinishedScreenRun(deltaTime) {
	    update(deltaTime);
	    
	    draw(this.selections, this.selectorPositionsIndex);
    };
    this.control = function gamePlayFinishedScreenControl(keyCode, pressed){
       if (pressed) {//only act on key released events => prevent multiple changes on single press
            return false;
        }
        
        switch (keyCode) {
            case KEY_UP:
                this.selectorPositionsIndex--;
                if (this.selectorPositionsIndex < 0) {
                    this.selectorPositionsIndex += this.selections.length;
                }
                return true;
            case KEY_DOWN:
                this.selectorPositionsIndex = (this.selectorPositionsIndex + 1) % this.selections.length;
                if (this.selectorPositionsIndex > this.selections.length - 1) {
                    this.selectorPositionsIndex = 0;
                }
                return true;
            case KEY_ENTER:
                ScreenStates.setState(this.selections[this.selectorPositionsIndex].screen, {code: false, player: scene.getPlayerObject(), uiManager:scene.getUIManagerObject()});
                return true;
            case KEY_H:
                ScreenStates.setState(HELP_SCREEN);
                return true;
            case KEY_C:
                ScreenStates.setState(CREDITS_SCREEN);
                return true;
            case KEY_M:
            	toggleMute();	            	
                return true;
        }

        return false;
    };
    
    const printMenu = function(menuItems, selected, yOffset = null) {
	    let mainMenuX = GameField.midX - 80;
	    let mainMenuY = (yOffset == null ? GameField.y + 4 * GameField.height / 5 : yOffset);

	    const selectorXOffset = 35;
	    const selectorYOffset = 30;

	    for (let i = 0; i < menuItems.length; i++){
    	    gameFont.printTextAt(menuItems[i].title, {x:mainMenuX, y: (mainMenuY + selectorYOffset * i)}, 20,  textAlignment.Left);
		    if(i === selected) {
			    selectorPosition.x = mainMenuX - selectorXOffset;
			    selectorPosition.y = mainMenuY + selectorYOffset * i;
		    }
	    }
	};
    
	const update = function(deltaTime) {
		selectorSprite.update(deltaTime);
		
		starfield.update(deltaTime);
	};

	const draw = function(selections, selectorPositionIndex) {
		// render the menu background
        drawBG();
        
        starfield.draw();
        
        // render the logo overlay
//        drawLogo();

        // render menu
        printMenu(selections, selectorPositionIndex);
        //drawHighScores();
        //draw selector sprite
        selectorSprite.drawAt(selectorPosition, {width:30, height:19});

		canvasContext.drawImage(gameFrame1, 0, 0, gameFrame1.width, gameFrame1.height, 0, 0, canvas.width, canvas.height);
		
		gameFont.printTextAt(textStrings.GameOver, {x:GameField.midX, y:GameField.y - 20}, 35, textAlignment.Center);
	};
 /* 
  const scoreLeaders = function{
  
   for (var a = 0; a < highscoreList.length; ++a)
{
    for (var b = 0; b < highscoreList[a].length; ++b)
    {
        highscoreList[a][b].frameList = localStorage[getItem(highScores[a], b)].frameList;
        highscoreList[a][b].inbetweensList = localStorage[getItem(highScores[a], b)].inbetweensList;
        highscoreList.sort(function(a,b){return a.score < b.score});
}

    localStorage.setItem("highScore3", highScore3);      
    localStorage.setItem("highScore2", highScore2);
    localStorage.setItem("highScore1", highscore1);
  

 
    const drawHighScores = function() {
   highScoreText1 = highScore1.toString();
   highScoreText2 = highScore2.toString();
   highScoreText3 = highScore3.toString();
        gameFont.printTextAt("*High Scores*", {x:GameField.midX - 120, y:GameField.midY - 210 }, 20, textAlignment.Left);
        gameFont.printTextAt("1st.", {x:GameField.midX - 120 , y:GameField.midY - 180}, 20, textAlignment.Left);
        gameFont.printTextAt(highScoreText1, {x:GameField.midX - 120 , y:GameField.midY - 150 }, 20, textAlignment.Left);
        gameFont.printTextAt("2nd.", {x:GameField.midX - 120 , y:GameField.midY - 120}, 20, textAlignment.Left);
        gameFont.printTextAt(highScoreText2, {x:GameField.midX - 120 , y:GameField.midY - 150 }, 20, textAlignment.Left);
        gameFont.printTextAt("3rd", {x:GameField.midX - 120 , y:GameField.midY - 90}, 20, textAlignment.Left);
        gameFont.printTextAt(highScoreText3, {x:GameField.midX - 120 , y:GameField.midY - 150 }, 20, textAlignment.Left);
    };
	*/
	const drawBG = function menuScreenDrawBG() {
        // fill the background since there is no image for now
        drawRect(GameField.x, GameField.y - GameField.bgOffset, GameField.width, GameField.height + GameField.bgOffset, MENU_BG_COLOR);
        canvasContext.drawImage(backgroundColorLookup,150,0,16,100,0,0,canvas.width,canvas.height);
    };
}
