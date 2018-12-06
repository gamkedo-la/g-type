//UILives
function UILives(position = {x:0, y:0}) {
	this.position = {x:position.x, y:position.y};
	const sprite = new AnimatedSprite(livesUI, 4, 33, 27, false, true, {min:0, max:0}, 0, {min:0, max:3}, 256, {min:3, max:3}, 0);
	const SPRITE_SCALE = 1;
	this.size = {width:sprite.width * SPRITE_SCALE, height:sprite.height * SPRITE_SCALE};
	
	this.update = function(deltaTime) {
		sprite.update(deltaTime);
	};
	
	this.draw = function() {
		const livesToDraw = (remainingLives > MAX_LIVES_TO_SHOW ? MAX_LIVES_TO_SHOW : remainingLives);
		for(let i = 0; i < livesToDraw; i++) {
			sprite.drawAt((this.position.x + this.size.width * i), (this.position.y), this.size.width, this.size.height);
		}
	};
}