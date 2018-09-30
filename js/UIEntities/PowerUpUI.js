//PowerUpUI
function PowerUpUI(position, highlighted = false, contains = PowerUpType.None) {
	this.position = {x: position.x, y: position.y};
	let isLit = highlighted;
	let contentsType = contains;
	let isLocked = false;
	
	let darkSprite = new AnimatedSprite(darkPowerUpUI, 5, 100, 100, true, true, {min: 0, max: 0}, 0, {min: 0, max: 4}, 256, {min: 4, max: 4}, 0);
	let lightSprite = new AnimatedSprite(lightedPowerUpUI, 5, 100, 100, true, true, {min: 0, max: 0}, 0, {min: 0, max: 4}, 256, {min: 4, max: 4}, 0);
	
	let sprite = darkSprite;
	if(isLit) {
		sprite = lightSprite;
	}
	
	this.size = {width:sprite.width, height:sprite.height};
	
	const spriteForContentsType = function(type) {
		switch(type) {
			case PowerUpType.None:
				return null;
			case PowerUpType.Speed:
				return (new AnimatedSprite(flyingEnemySheet, 5, 30, 21, true, true, {min:0, max:0}, 0, {min:0, max:4}, 128, {min:4, max:4}, 0));
			case PowerUpType.Missile:
				return (new AnimatedSprite(missileSheet, 5, 35, 19, true, true, {min:0, max:0}, 0, {min:0, max:2}, 512, {min:2, max:2}, 0));
			case PowerUpType.Double:
				return (new AnimatedSprite(doubleShotUI, 4, 45, 41, false, true, {min:0, max:0}, 0, {min:0, max:3}, 256, {min:3, max: 3}, 0));
			case PowerUpType.Laser:
				return (new AnimatedSprite(playerLaserShot, 13, 28, 6, false, true, {min:0, max:0}, 0, {min:0, max:12}, 128, {min:13, max:18}, 64));
			case PowerUpType.Triple:
				return (new AnimatedSprite(tripleShotUI, 4, 65, 41, false, true, {min:0, max:0}, 0, {min:0, max:3}, 192, {min:3, max:3}, 0));
			case PowerUpType.Ghost:
				return (new AnimatedSprite(lightGhostUI, 4, 46, 41, true, true, {min:0, max:0}, 0, {min:0, max:3}, 192, {min:3, max:3}, 0));
			case PowerUpType.Shield:
				return (new AnimatedSprite(shieldSheet, 3, 60, 45, false, true, {min:0, max:0}, 0, {min:0, max:0}, 128, {min:2, max:2}, 0));
				return null;//TODO: need a spritesheet for this
			case PowerUpType.Force:
				return (new AnimatedSprite(forceUnitSheet, 1, 48, 48));
			default://TODO: remove this, it is just for testing
				return (new AnimatedSprite(playerLaserShot, 13, 28, 6, false, true, {min:0, max:0}, 0, {min:0, max:12}, 128, {min:13, max:18}, 64));			
		}
	};
		
	let contents = spriteForContentsType(contentsType);
	
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
		contentsType = newContent;
		contents = spriteForContentsType(contentsType);
		contentPosition = this.updateContentPosition();
	};
	
	this.update = function(deltaTime) {
		sprite.update(deltaTime);
		
		if(contents != null) {
			contents.update(deltaTime);
		}
	};

	this.lockMe = function() {
		isLocked = true;
	}

	this.hasBeenLocked = function() {
		return isLocked;
	}
	
	this.draw = function() {

		sprite.drawAt(this.position, this.size);

		if (isLocked) {
			return;
		}
		
		if(contents != null) {
			contents.drawAt(contentPosition, {width:contents.width, height:contents.height});//TODO: fix this after the base object is working correctly
		}
	};
	
	return this;
}