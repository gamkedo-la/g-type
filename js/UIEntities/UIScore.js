//UIScore
function UIScore(position = {x:0, y:0}) {
    
	this.position = {x:position.x, y:position.y};
	
	const FONT = 30;
	
	this.getScore = function() {
		return currentScore;
	}

	this.getHighScore = function() {
		return highScore;
	}
	
	this.addToScore = function(scoreToAdd) {
		currentScore += scoreToAdd;
		scoreText = currentScore.toString();
		while(scoreText.length < 9) {
			scoreText = "0" + scoreText;
		}
	};
   
    this.updateHighScore = function(){
    	allHighScores.push(currentScore);
    	allHighScores.sort((a, b) => b - a);
    	if (allHighScores.length > 3){
//    		console.log("removed lowest score: " + allHighScores.pop());
    	}
//    	console.log(allHighScores);
    };
    
    this.saveHighScores = function(){
    	for(var i=0; i<allHighScores.length; i++){
    		localStorageHelper.setFloat("highScore" + i, allHighScores[i]);
    	}
    }

    this.loadHighScores = function(){
    	for(var i=0; i<3 ; i++){
    		allHighScores[i] = localStorageHelper.getFloat("highScore" + i);
			if(allHighScores[i] == null || isNaN(allHighScores[i])) {
				allHighScores[i] = 0;
			}
    	}
//    	console.log(allHighScores);
    }

	this.draw = function() {
		gameFont.printTextAt(scoreText, this.position, FONT, textAlignment.Center);
	}
	
	this.reset = function() {
         this.updateHighScore();
         this.saveHighScores();
		currentScore = 0;
		this.addToScore(0);
	}
}