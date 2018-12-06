//SpacerUI
function SpacerUI(position, highlighted = false) {
	this.position = {x: position.x, y: position.y};
	let isLit = highlighted;
	this.contentsType = PowerUpType.None;
	
	let darkSprite = new AnimatedSprite(darkSpacerUI, 5, 32, 32, true, true, {min: 0, max: 0}, 0, {min: 0, max: 4}, 256, {min: 4, max: 4}, 0);
	let lightSprite = new AnimatedSprite(lightedSpacerUI, 5, 32, 32, true, true, {min: 0, max: 0}, 0, {min: 0, max: 4}, 256, {min: 4, max: 4}, 0);
	
	let sprite = darkSprite;
	if(isLit) {
		sprite = lightSprite;
	}
	
	this.size = {width:sprite.width, height:sprite.height};
		
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
	
	this.update = function(deltaTime) {
		sprite.update(deltaTime);
	};
	
	this.lockMe = function() {
		//don't need to do anything, but need this function to exist so we don't get any crashes
	};
	
	this.unlockMe = function() {
		//don't need to do anything, but need this function to exist so we don't get any crashes
	};
	
	this.draw = function() {
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
	};
	
	return this;
}