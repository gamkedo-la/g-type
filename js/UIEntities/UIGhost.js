//UIGhost
function GhostUI(position = {x:0, y:0}) {
	this.position = {x:position.x, y:position.y};
	this.isLit = false;
	const SPRITE_SCALE = 2;
	const lightSprite = new AnimatedSprite(lightGhostUI, 8, 46, 41, true, true, {min:0, max:0}, 0, {min:0, max:7}, 512, {min:7, max:7}, 0);
	const darkSprite = new AnimatedSprite(darkGhostUI, 12, 46, 41, true, true, {min:0, max:0}, 0, {min:0, max:11}, 1536, {min:11, max:11}, 0);
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
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
	};
}