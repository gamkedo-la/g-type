//PowerUpUI Text
const PowerUpUIText = {
	Speed:"[SPACE] for   Speed",
	Missile:"[SPACE] for   Missiles",
	Double:"[SPACE] for   Double Shot",
	Laser:"[SPACE] for   Laser",
	Triple:"[SPACE] for   Triple Shot",
	Ghost:"[SPACE] for   Ghost Ship",
	Shield:"[SPACE] for   Shields",
	Force:"[SPACE] for   The Force"
}

//PowerUpUI
function PowerUpUI(position, highlighted = false, contains = PowerUpType.None, scale = 1) {
	this.position = {x: position.x, y: position.y};
	let isLit = highlighted;
	this.contentsType = contains;
	let contents;
	let isLocked = false;
	let helpText = "";
	const FONT = 30;
	let displayTime = 0;
	let shouldShowText = false;
	const helpTextTime = 512;//milliseconds

	let darkSprite = new AnimatedSprite(darkPowerUpUI, 5, 100, 100, true, true, {min: 0, max: 0}, 0, {min: 0, max: 4}, 256, {min: 4, max: 4}, 0);
	let lightSprite = new AnimatedSprite(lightedPowerUpUI, 5, 100, 100, true, true, {min: 0, max: 0}, 0, {min: 0, max: 4}, 256, {min: 4, max: 4}, 0);
	
	let sprite = darkSprite;
	if(isLit) {
		sprite = lightSprite;
	}
	
	this.size = {width:scale * sprite.width, height:scale * sprite.height};
	
	const spriteForContentsType = function(type) {
		switch(type) {
			case PowerUpType.None:
				return null;
			case PowerUpType.Speed:
				helpText = PowerUpUIText.Speed;
				contents = new SpeedUI();
				return null;
			case PowerUpType.Missile:
				helpText = PowerUpUIText.Missile;
				return (new AnimatedSprite(missileSheet, 8, 28, 28, true, true, {min:0, max:0}, 0, {min:0, max:7}, 128, {min:7, max:7}, 32));
			case PowerUpType.Double:
				helpText = PowerUpUIText.Double;
				return (new AnimatedSprite(doubleShotUI, 4, 45, 41, false, true, {min:0, max:0}, 0, {min:0, max:3}, 256, {min:3, max: 3}, 0));
			case PowerUpType.Laser:
				helpText = PowerUpUIText.Laser;
				return (new AnimatedSprite(playerLaserShot, 13, 28, 6, false, true, {min:0, max:0}, 0, {min:0, max:12}, 128, {min:13, max:18}, 64));
			case PowerUpType.Triple:
				helpText = PowerUpUIText.Triple;
				return (new AnimatedSprite(tripleShotUI, 4, 65, 41, false, true, {min:0, max:0}, 0, {min:0, max:3}, 192, {min:3, max:3}, 0));
			case PowerUpType.Ghost:
				helpText = PowerUpUIText.Ghost;
				return null;
			case PowerUpType.Shield:
				helpText = PowerUpUIText.Shield;
				return (new AnimatedSprite(shieldSheet, 3, 60, 45, false, true, {min:0, max:0}, 0, {min:0, max:0}, 128, {min:2, max:2}, 0));
				return null;
			case PowerUpType.Force:
				helpText = PowerUpUIText.Force;
				return null;
				return (new AnimatedSprite(forceUnitSheet, 1, 48, 48));
		}
	};
		
	let contentsSprite = spriteForContentsType(this.contentsType);
	
	this.setContentsPosition = function() {
		if(contentsSprite == null) {
			if(this.contentsType === PowerUpType.Speed) {
				contents.position.x = this.position.x + (this.size.width / 2) - (contents.size.width / 2);
				contents.position.y = this.position.y + (this.size.height / 2) - (contents.size.height / 2);
			}
			
			return {x:this.position.x, y:this.position.y};
		} else {
			const xPos = this.position.x + (this.size.width / 2) - (contentsSprite.width / 2);
			const yPos = this.position.y + (this.size.height / 2) - (contentsSprite.height / 2);
			return {x: xPos, y: yPos};
		}
	}
	
	let contentsPosition = this.setContentsPosition();
	
	this.setIsHighlighted = function(isHighlighted) {
		if(isHighlighted !== isLit) {
			isLit = isHighlighted;
			if(isLit) {
				sprite = lightSprite;
			} else {
				sprite = darkSprite;
			}
			
			if(this.contentsType === PowerUpType.Speed) {
				contents.setIsLit(isHighlighted);
			}
		}
	};
	
	this.update = function(deltaTime) {
		displayTime += deltaTime;
		if(displayTime > helpTextTime) {
			shouldShowText = !shouldShowText;
			displayTime = 0;
		}
		
		sprite.update(deltaTime);
		
		if(contentsSprite != null) {
			contentsSprite.update(deltaTime);
		} else if(this.contentsType === PowerUpType.Speed) {
			contents.update(deltaTime);
		}
	};

	this.lockMe = function() {
		if(this.contentsType === PowerUpType.Speed) {
			contents.incrementSpeed();
			
			return;//no limit on speed ups
        } else if(this.contentsType === PowerUpType.Ghost) {
            
        }
		isLocked = true;
	};

	this.hasBeenLocked = function() {
		return isLocked;
	};
	
	this.unlockMe = function() {
        if(this.contentsType === PowerUpType.Speed) {
            contents.resetSpeed();
        }
        
		isLocked = false;
	};
	
	this.draw = function() {
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);

		if (isLocked) {
			return;
		}
		
		if(contentsSprite != null) {
			contentsSprite.drawAt(contentsPosition.x, contentsPosition.y, contentsSprite.width, contentsSprite.height);
		} else if(this.contentsType === PowerUpType.Speed) {
			contents.draw();
		}
		
		if((isLit) && (shouldShowText)) {
			gameFont.printTextAt(helpText, {x:GameField.x + 25, y:GameField.bottom + 10}, FONT, textAlignment.Left);
		}
	};
	
	return this;
}
