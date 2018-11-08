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
   
   this.updateHighScore = function()  {
	if(currentScore > highScore){
		 	highScore = currentScore;
             highScoreText = highScore.toString();
            }
		while(highScoreText.length < 15) {
			highScoreText = "0" + highScoreText;
		}
    };
	
	this.draw = function() {
		gameFont.printTextAt(scoreText, this.position, FONT, textAlignment.Center);
	}
	
	this.reset = function() {
         this.updateHighScore();
		currentScore = 0;
		this.addToScore(0);
		this.updateHighScore(0);
	}
}