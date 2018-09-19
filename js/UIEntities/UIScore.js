//UIScore
function UIScore(position = {x:0, y:0}) {
	let currentScore = 0;
	let scoreText = "00000000" + currentScore.toString();
	this.position = {x:position.x, y:position.y};
	
	const FONT = 30;
	
	this.getScore = function() {
		return currentScore;
	}
	
	this.addToScore = function(scoreToAdd) {
		currentScore += scoreToAdd;
		scoreText = currentScore.toString();
		while(scoreText.length < 9) {
			scoreText = "0" + scoreText;
		}
	}
	
	this.draw = function() {
		gameFont.printTextAt(scoreText, this.position, FONT, textAlignment.Center);
	}
	
	this.reset = function() {
		currentScore = 0;
		this.addToScore(0);
	}
}