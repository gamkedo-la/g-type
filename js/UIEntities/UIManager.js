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
	let activePage = 0;
	const pages = [];
	pages.push(new UIPage([PowerUpType.Speed], false, false));
	pages.push(new UIPage([PowerUpType.Missile, PowerUpType.Double, PowerUpType.Laser], false, false));
	pages.push(new UIPage([PowerUpType.Triple, PowerUpType.Shield], true, false));
	pages.push(new UIPage([PowerUpType.Ghost, PowerUpType.Force], false, true));
	const PAGE_COUNT = pages.length;
	
	const score = new UIScore({x:GameField.midX, y:GameField.y - 20});
	const lives = new UILives({x:GameField.midX - 150, y:GameField.y + 20});
	
	this.reloadScores = function(){
		score.loadHighScores();
	}

	this.update = function(deltaTime) {
		pages[activePage].update(deltaTime);
		
		lives.update(deltaTime);
	};
	
	this.draw = function() {
		canvasContext.drawImage(gameFrame2, 0, 0, gameFrame2.width, gameFrame2.height, 0, 0, canvas.width, canvas.height);

		pages[activePage].draw();
		
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
		for(let i = 0; i < pages.length; i++) {
			pages[i].reset();
		}
		
		activePage = 0;
		
		if(shouldResetScore) {
			score.reset();
		}
	};
	
	this.clearPowerUps = function() {
		for(let i = 0; i < pages.length; i++) {
			pages[i].clearPowerUps();
		}
		
		this.reset(false);
	};
	
	this.powerUpWasActivated = function(activatedPowerUp, powerUpCount) {
		switch(activatedPowerUp) {//more concise than an if statement
			case PowerUpType.Double:
			case PowerUpType.Laser:
			case PowerUpType.Triple:
				this.synchronizePowerUpUI(activatedPowerUp);
				return;
		}
		
		//logic for power ups which allow >1 (Speed and Ghost) goes here, in the mean time assume only one of anything
        if((powerUpCount === null) || (powerUpCount >= MAX_GHOSTS)) {
            for(let i = 0; i < pages.length; i++) {
                pages[i].lockPowerUp(activatedPowerUp);
            }
        }
	};
	
	this.powerUpWasDeactivated = function(deactivatedPowerUp) {
		for(let i = 0; i < pages.length; i++) {
			pages[i].unLockPowerUp(deactivatedPowerUp);
		}
	};
	
	this.getCanActivatePowerUp = function() {
		return (pages[activePage].canActivatePowerUp());
	};
		
	this.getPowerUpToActivate = function() {
		return (pages[activePage].getPowerUpToActivate());
	};
	
	const lockPowerUp = function(powerUpToLock) {
		for(let i = 0; i < pages.length; i++) {
			pages[i].lockPowerUp(powerUpToLock);
		}
	};
	
	const unLockPowerUp = function(powerUpToUnlock) {
		for(let i = 0; i < pages.length; i++) {
			pages[i].unLockPowerUp(powerUpToUnlock);
		}
	};
	
	this.synchronizePowerUpUI = function(activatedPowerUp) {
		switch(activatedPowerUp) {
			case PowerUpType.Double:
				lockPowerUp(PowerUpType.Double);
				unLockPowerUp(PowerUpType.Laser);
				unLockPowerUp(PowerUpType.Triple);
				break;
			case PowerUpType.Laser:
				unLockPowerUp(PowerUpType.Double);
				lockPowerUp(PowerUpType.Laser);
				unLockPowerUp(PowerUpType.Triple);
				break;
			case PowerUpType.Triple:
				unLockPowerUp(PowerUpType.Double);
				unLockPowerUp(PowerUpType.Laser);
				lockPowerUp(PowerUpType.Triple);
				break;
		}
	};
	
	this.incrementPowerUpToActivate = function() {
		const activeIndex = pages[activePage].incrementPowerUp();
		if(activeIndex < 0) {
			activePage++;
			
			if(activePage === PAGE_COUNT) {
				activePage = 0;
			}
			
			pages[activePage].incrementPowerUp();
		}
	};
}

function UIPage(powerUps = [], hasSpacers = false, hasGhost_Force = false) {
	this.powerUps = powerUps;
	this.elements = [];
	let activeIndex = -1;
	let ghost = new GhostUI({x:GameField.x + 15, y:GameField.y - 75});
    let force = new UIForce({x:GameField.right - 103, y:GameField.y - 75});
	
	if(hasGhost_Force) {
		
		this.elements.push(new PowerUpUI({x:GameField.x - 15, y:GameField.y - 115}, false, PowerUpType.Ghost, 1.5));//scale = 1.5
		this.elements.push(new PowerUpUI({x: 250, y: 25}, false, PowerUpType.None));
		this.elements.push(new SpacerUI({x: 359, y: 59}));
		this.elements.push(new PowerUpUI({x: 400, y: 25}, false, PowerUpType.None));
		this.elements.push(new SpacerUI({x: 509, y: 59}));
		this.elements.push(new PowerUpUI({x: 550, y: 25}, false, PowerUpType.None));
        this.elements.push(new PowerUpUI({x:GameField.right - 135, y:GameField.y - 115}, false, PowerUpType.Force, 1.5));//scale = 1.5
	} else {
		switch(this.powerUps.length) {
			case 0: //this shouldn't happen
				break;
			case 1:
                this.elements.push(new PowerUpUI({x:GameField.x - 15, y:GameField.y - 115}, false, PowerUpType.None, 1.5));//scale = 1.5
				this.elements.push(new PowerUpUI({x: 250, y: 25}, false, PowerUpType.None));
				this.elements.push(new SpacerUI({x: 359, y: 59}));
				this.elements.push(new PowerUpUI({x: 400, y: 25}, false, this.powerUps[0]));
				this.elements.push(new SpacerUI({x: 509, y: 59}));
				this.elements.push(new PowerUpUI({x: 550, y: 25}, false, PowerUpType.None));
                this.elements.push(new PowerUpUI({x:GameField.right - 135, y:GameField.y - 115}, false, PowerUpType.None, 1.5));//scale = 1.5
				break;
			case 2:
                this.elements.push(new PowerUpUI({x:GameField.x - 15, y:GameField.y - 115}, false, PowerUpType.None, 1.5));//scale = 1.5
				this.elements.push(new PowerUpUI({x: 250, y: 25}, false, this.powerUps[0]));
				this.elements.push(new SpacerUI({x: 359, y: 59}));
				this.elements.push(new PowerUpUI({x: 400, y: 25}, false, PowerUpType.None));
				this.elements.push(new SpacerUI({x: 509, y: 59}));
				this.elements.push(new PowerUpUI({x: 550, y: 25}, false, this.powerUps[1]));
                this.elements.push(new PowerUpUI({x:GameField.right - 135, y:GameField.y - 115}, false, PowerUpType.None, 1.5));//scale = 1.5
				break;
			case 3:
                this.elements.push(new PowerUpUI({x:GameField.x - 15, y:GameField.y - 115}, false, PowerUpType.None, 1.5));//scale = 1.5
				this.elements.push(new PowerUpUI({x: 250, y: 25}, false, this.powerUps[0]));
				this.elements.push(new SpacerUI({x: 359, y: 59}));
				this.elements.push(new PowerUpUI({x: 400, y: 25}, false, this.powerUps[1]));
				this.elements.push(new SpacerUI({x: 509, y: 59}));
				this.elements.push(new PowerUpUI({x: 550, y: 25}, false, this.powerUps[2]));
                this.elements.push(new PowerUpUI({x:GameField.right - 135, y:GameField.y - 115}, false, PowerUpType.None, 1.5));//scale = 1.5
				break;
			default:
				break;//shouldn't ever get here
		}
	}
	
	this.update = function(deltaTime) {
		for(let i = 0; i < this.elements.length; i++) {
			if(i === activeIndex) {
				this.elements[i].setIsHighlighted(true);
			} else {
				this.elements[i].setIsHighlighted(false);
			}
			
			this.elements[i].update(deltaTime);
			
			ghost.update(deltaTime);
            force.update(deltaTime);
		}
	};
	
	this.draw = function() {
		for(let i = 0; i < this.elements.length; i++) {
			this.elements[i].draw();
		}
		
		ghost.draw();
        force.draw();
	};
	
	this.canActivatePowerUp = function() {
		if((activeIndex < 0) || (activeIndex > this.elements.length)) {
			return false;
		}
		
		if((this.elements[activeIndex].contentsType === PowerUpType.None) || (this.elements[activeIndex].hasBeenLocked())) {
			return false;
		} else {
			return true;
		}
	};
	
	this.getPowerUpToActivate = function() {
		if((activeIndex >= 0) && (activeIndex < this.elements.length)) {
			return this.elements[activeIndex].contentsType;
		} else {
			return PowerUpType.None;
		}
	};
		
	this.incrementPowerUp = function() {
		do {
			activeIndex++;
			if(activeIndex === this.elements.length) {
				activeIndex = -1;
				break;
			}
			
			if(hasGhost_Force) {
				if((this.elements[activeIndex].contentsType === PowerUpType.Ghost) &&
				   (!this.elements[activeIndex].hasBeenLocked())) {
					ghost.isLit = true;
				} else {
					ghost.isLit = false;
				}
                
                if((this.elements[activeIndex].contentsType === PowerUpType.Force) &&
                   (!this.elements[activeIndex].hasBeenLocked())) {
                    force.isLit = true;
                } else {
                    force.isLit = false;
                }
			}
		} while(this.elements[activeIndex].contentsType === PowerUpType.None);
		
		return activeIndex;
	};
	
	this.lockActive = function() {
		this.elements[activeIndex].lockMe();
		return this.elements[activeIndex];
	};
	
	this.lockPowerUp = function(powerUpToLock) {
		for(let i = 0; i < this.elements.length; i++) {
			if(this.elements[i].contentsType === powerUpToLock) {
				this.elements[i].lockMe();
			}
		}
	};
	
	this.unLockPowerUp = function(powerUpToUnlock) {
		for(let i = 0; i < this.elements.length; i++) {
			if(this.elements[i].contentsType === powerUpToUnlock) {
				this.elements[i].unlockMe();
			}
		}
	};
	
	this.reset = function() {
		activeIndex = -1;
		for(let i = 0; i < this.elements.length; i++) {
			this.elements[i].setIsHighlighted(false);
		}
		
		if(hasGhost_Force) {
			ghost.isLit = false;
            force.isLit = false;
		}
	};
	
	this.clearPowerUps = function() {
		for(let i = 0; i < this.elements.length; i++) {
			this.elements[i].unlockMe();
            
		}
		
		this.reset();
	};
	
	return this;
}
