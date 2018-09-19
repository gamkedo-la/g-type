//PowerUp Types
const PowerUpType = {
	None:"none",
	Speed:"speed",
	Missile:"missile",
	Double:"double",
	Laser:"laser",
	Triple:"triple",
	Ghost:"ghost",
	Shield:"shield",
	Force:"force"
};

//UI Manager
function UIManager() {
	let page = 0;
	const PAGES = Math.ceil(Object.keys(PowerUpType).length / 3);
	let elements = [];
	let highlightedIndex = -1;
	let powerUpToActivate = PowerUpType.None;
	
	elements.push(new PowerUpUI({x: 250, y: 25}));
	elements.push(new SpacerUI({x: 359, y: 59}));
	elements.push(new PowerUpUI({x: 400, y: 25}));
	elements.push(new SpacerUI({x: 509, y: 59}));
	elements.push(new PowerUpUI({x: 550, y: 25}));
	
	const score = new UIScore({x:GameField.midX, y:GameField.y - 20});
	const lives = new UILives({x:GameField.midX - 150, y:GameField.y + 20});
	
	const updateContents = function() {
		const types = Object.values(PowerUpType);
		
		elements[0].setContents(types[1 + (3 * page)]);
		elements[2].setContents(types[2 + (3 * page)]);
		elements[4].setContents(types[3 + (3 * page)]);
	};
	
	updateContents();
	
	this.getCanActivatePowerUp = function() {
		if((highlightedIndex < 0) ||
		   (highlightedIndex == 1) ||
		   (highlightedIndex == 3)) {
			   return false;
		}
		
		return true;
	};
		
	this.incrementActivePowerUp = function() {
		if(highlightedIndex >= 0) {
			elements[highlightedIndex].setIsHighlighted(false);		
		}
		
		highlightedIndex++;
		
		if(page < 1) {//for the first page, skip the spacer => reach next powerUp faster
			if((highlightedIndex == 1) || (highlightedIndex == 3)) {
				highlightedIndex++;
			}
		}
		
		if(highlightedIndex >= elements.length) {
			highlightedIndex = 0;
			page++;
			if(page == PAGES) {page = 0;}
			updateContents();
		}
		
		if((highlightedIndex != 1) && (highlightedIndex != 3)) {
			incrementPowerUpToActivate();
		}
		
		elements[highlightedIndex].setIsHighlighted(true);
	};
	
	this.update = function(deltaTime) {
		for(let i = 0; i < elements.length; i++) {
			elements[i].update(deltaTime);
		}
		
		lives.update(deltaTime);
	};
	
	this.draw = function() {
		canvasContext.drawImage(gameFrame2, 0, 0, gameFrame2.width, gameFrame2.height, 0, 0, canvas.width, canvas.height);

		for(let i = 0; i < elements.length; i++) {
			elements[i].draw();
		}
		
		score.draw();
		
		lives.draw();
	};
	
	this.addToScore = function(scoreToAdd) {
		score.addToScore(scoreToAdd);
	};
	
	this.getScore = function() {
		return score.getScore();
	};
		
	this.reset = function(shouldResetScore) {
		page = 0;
		if(highlightedIndex >= 0) {
			elements[highlightedIndex].setIsHighlighted(false);
			highlightedIndex = -1;
		}
		updateContents();
		
		powerUpToActivate = PowerUpType.None;
		
		if(shouldResetScore) {
			score.reset();
		}
	};
	
	this.getPowerUpToActivate = function() {
		return powerUpToActivate;
	}
	
	const incrementPowerUpToActivate = function() {
		switch(powerUpToActivate) {
			case PowerUpType.None:
				powerUpToActivate = PowerUpType.Speed;
				break;
			case PowerUpType.Speed:
				powerUpToActivate = PowerUpType.Missile;
				break;
			case PowerUpType.Missile:
				powerUpToActivate = PowerUpType.Double;
				break;
			case PowerUpType.Double:
				powerUpToActivate = PowerUpType.Laser;
				break;
			case PowerUpType.Laser:
				powerUpToActivate = PowerUpType.Triple;
				break;
			case PowerUpType.Triple:
				powerUpToActivate = PowerUpType.Ghost;
				break;
			case PowerUpType.Ghost:
				powerUpToActivate = PowerUpType.Shield;
				return;
			case PowerUpType.Shield:
				powerUpToActivate = PowerUpType.Force;
				break;
			case PowerUpType.Force:
				powerUpToActivate = PowerUpType.Speed;
				break;
		}

//		uiManager.incrementActivePowerUp();
	};
}