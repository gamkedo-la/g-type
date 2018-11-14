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
   
   this.updateHighScore = function(currentScore, highScore){
     if (currentScore > highScore){
     	highScore = currentScore;
     	allHighScores.sort();
        }
     }
    
    this.saveHighScores = function(){
  	if((allHighScores=== null) || (allHighScores === undefined)) {
  	 allHighScores = [];
  localStorage.setFloat("allHighScores", highScore);
  	}
  	else{
  		localStorage.allHighScores.unshift(highScore);
   }
      }

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