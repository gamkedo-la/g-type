//Power Up
function Capsule(position = {x:0, y:0}, initialWorldPos) {
	this.worldPos = initialWorldPos;
	this.type = EntityType.Capsule1;
	
	this.position = position;
	
	const sprite = new AnimatedSprite(capsule1Sheet, 3, 33, 27, true, true, {min:0, max:0}, 0, {min:0, max:3}, 128, {min:3, max:3}, 0);
	const SPRITE_SCALE = 1; //TODO: would like to increase the size of the sprite and change this back to 1.
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	
	const colliderPath = [{x: this.position.x, y: this.position.y},
						  {x: this.position.x + SPRITE_SCALE * sprite.width, y: this.position.y}, 
						  {x: this.position.x + SPRITE_SCALE * sprite.width, y: this.position.y + SPRITE_SCALE * sprite.height}, 
						  {x: this.position.x, y: this.position.y + SPRITE_SCALE * sprite.height}];
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	let didCollide = false;

	this.update = function(deltaTime, worldPos) {
		this.position.x -= (worldPos - this.worldPos);
		this.worldPos = worldPos;
		
		this.collisionBody.setPosition(this.position);
		
		sprite.update(deltaTime);
	}
	
	this.draw = function() {
		sprite.drawAt(this.position, this.size);
		this.collisionBody.draw();
	}
	
	this.didCollideWith = function(otherEntity) {
		didCollide = true;
		scene.removeEntity(this, false);
	}
}