//SpacerUI
function SpacerUI(position, highlighted = false) {
	this.position = {x: position.x, y: position.y};
	let isLit = highlighted;
	
	let darkSprite = new AnimatedSprite(darkSpacerUI, 5, 32, 32, true, true, {min: 0, max: 0}, 0, {min: 0, max: 4}, 256, {min: 4, max: 4}, 0);
	let lightSprite = new AnimatedSprite(lightedSpacerUI, 5, 32, 32, true, true, {min: 0, max: 0}, 0, {min: 0, max: 4}, 256, {min: 4, max: 4}, 0);
	
	let sprite = darkSprite;
	if(isLit) {
		console.log("Lit");
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
	
	this.draw = function() {
		sprite.drawAt(this.position, this.size);
	};
	
	return this;
}