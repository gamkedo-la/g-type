//UIGhost
function GhostUI(position = {x:0, y:0}) {
	this.position = {x:position.x, y:position.y};
	this.isLit = false;
	const SPRITE_SCALE = 2;
	const lightSprite = new AnimatedSprite(lightGhostUI, 4, 46, 41, true, true, {min:0, max:0}, 0, {min:0, max:3}, 256, {min:3, max:3}, 0);
	const darkSprite = new AnimatedSprite(darkGhostUI, 4, 46, 41, true, true, {min:0, max:0}, 0, {min:0, max:3}, 256, {min:3, max:3}, 0);
	this.size = {width:SPRITE_SCALE * lightSprite.width, height:SPRITE_SCALE * lightSprite.height};
	let sprite = darkSprite;
	this.update = function(deltaTime) {
		if(this.isLit) {
			sprite = lightSprite;
		} else {
			sprite = darkSprite;
		}
		
		sprite.update(deltaTime);
	};
	this.draw = function() {
		sprite.drawAt(this.position, this.size);
	};
}