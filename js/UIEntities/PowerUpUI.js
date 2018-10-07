//PowerUpUI Text
const PowerUpUIText = {
	Speed:"[Enter] for   Speed",
	Missile:"[Enter] for   Missiles",
	Double:"[Enter] for   Double Shot",
	Laser:"[Enter] for   Laser",
	Triple:"[Enter] for   Triple Shot",
	Ghost:"[Enter] for   Ghost Ship",
	Shield:"[Enter] for   Shields",
	Force:"[Enter] for   The Force"
}

//PowerUpUI
function PowerUpUI(position, highlighted = false, contains = PowerUpType.None, scale = 1) {
	this.position = {x: position.x, y: position.y};
	let isLit = highlighted;
	this.contentsType = contains;
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
				return (new AnimatedSprite(playerThruster, 3, 32, 32, true, true, {min:0, max:0}, 0, {min:0, max:2}, 128, {min:2, max:2}, 0));
			case PowerUpType.Missile:
				helpText = PowerUpUIText.Missile;
				return (new AnimatedSprite(missileSheet, 5, 35, 19, true, true, {min:0, max:0}, 0, {min:0, max:2}, 512, {min:2, max:2}, 0));
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
				return (new AnimatedSprite(lightGhostUI, 4, 46, 41, true, true, {min:0, max:0}, 0, {min:0, max:3}, 192, {min:3, max:3}, 0));
			case PowerUpType.Shield:
				helpText = PowerUpUIText.Shield;
				return (new AnimatedSprite(shieldSheet, 3, 60, 45, false, true, {min:0, max:0}, 0, {min:0, max:0}, 128, {min:2, max:2}, 0));
				return null;//TODO: need a spritesheet for this
			case PowerUpType.Force:
				helpText = PowerUpUIText.Force;
				return null;
				return (new AnimatedSprite(forceUnitSheet, 1, 48, 48));
			default://TODO: remove this, it is just for testing
				return (new AnimatedSprite(playerLaserShot, 13, 28, 6, false, true, {min:0, max:0}, 0, {min:0, max:12}, 128, {min:13, max:18}, 64));			
		}
	};
		
	let contents = spriteForContentsType(this.contentsType);
	
	this.updateContentPosition = function() {
		if(contents == null) {
			return {x:this.position.x, y:this.position.y};
		} else {
			const xPos = this.position.x + (this.size.width / 2) - (contents.width / 2);
			const yPos = this.position.y + (this.size.height / 2) - (contents.height / 2);
			return {x: xPos, y: yPos};
		}
	}
	
	let contentPosition = this.updateContentPosition();
	
	this.setIsHighlighted = function(isHighlighted) {
		if(isHighlighted !== isLit) {
			isLit = isHighlighted;
			if(isLit) {
				sprite = lightSprite;
			} else {
				sprite = darkSprite;
			}
		}
	};
	
	this.setContents = function(newContent) {
		this.contentsType = newContent;
		contents = spriteForContentsType(this.contentsType);
		contentPosition = this.updateContentPosition();
	};
	
	this.update = function(deltaTime) {
		displayTime += deltaTime;
		if(displayTime > helpTextTime) {
			shouldShowText = !shouldShowText;
			displayTime = 0;
		}
		
		sprite.update(deltaTime);
		
		if(contents != null) {
			contents.update(deltaTime);
		}
	};

	this.lockMe = function() {
		isLocked = true;
	};

	this.hasBeenLocked = function() {
		return isLocked;
	};
	
	this.unlockMe = function() {
		isLocked = false;
	};
	
	this.draw = function() {
		sprite.drawAt(this.position, this.size);

		if (isLocked) {
			return;
		}
		
		if(contents != null) {
			contents.drawAt(contentPosition, {width:contents.width, height:contents.height});//TODO: fix this after the base object is working correctly
		}
		
		if((isLit) && (shouldShowText)) {
			gameFont.printTextAt(helpText, {x:GameField.x + 25, y:GameField.bottom + 10}, FONT, textAlignment.Left);
		}
	};
	
	return this;
}