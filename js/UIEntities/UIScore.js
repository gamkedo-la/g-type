//UIScore
function UIScore(position = {x:0, y:0}) {
	let currentScore = 0;
	let scoreText = "00000000" + currentScore.toString();
	let highScore = 0;
	let highScoreText = "00000000000000" + highScore.toString();
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

   this.addToHighScore = function(highScoreToAdd) {
	if(currentScore > highScore){
		 	highScore = currentScore;
		 	console.log(highScore);
             highScoreText = highScore.toString();
            }
		while(highScoreText.length < 15) {
			highScoreText = "0" + highScoreText;
		}
    };
	
	this.draw = function() {
		gameFont.printTextAt(scoreText, this.position, FONT, textAlignment.Center);
		gameFont.printTextAt(highScoreText, {x:GameField.midX - 380 , y:GameField.midY - 450 }, 20, textAlignment.Left);
	}
	
	this.reset = function() {
		currentScore = 0;
		this.addToScore(0);
		this.addToHighScore(0);
	}
}