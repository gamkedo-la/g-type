//Power Up
function PowerUp(position = {x:0, y:0}) {
	this.type = EntityType.PowerUp;
	
	this.position = position;
	
	const sprite = new AnimatedSprite(powerUpSheet, 3, 33, 27, 128, {min:0, max:3}, true);
	const SPRITE_SCALE = 1; //TODO: would like to increase the size of the sprite and change this back to 1.
	const size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	
	const colliderPath = [{x: this.position.x, y: this.position.y},
						  {x: this.position.x + SPRITE_SCALE * sprite.width, y: this.position.y}, 
						  {x: this.position.x + SPRITE_SCALE * sprite.width, y: this.position.y + SPRITE_SCALE * sprite.height}, 
						  {x: this.position.x, y: this.position.y + SPRITE_SCALE * sprite.height}];
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	let didCollide = false;

	this.update = function(deltaTime) {
		sprite.update(deltaTime);
	}
	
	this.draw = function() {
		sprite.drawAt(this.position, size);
		this.collisionBody.draw();
	}
	
	this.didCollideWith = function(otherEntity) {
		didCollide = true;
		scene.removeEntity(this, false);
	}
}