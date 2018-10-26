//Power Up
function Capsule(position = {x:0, y:0}, initialWorldPos) {
	this.worldPos = initialWorldPos;
	this.type = EntityType.Capsule1;
	this.score = 50;
	
	this.position = {x:position.x, y:position.y};
	
	const sprite = new AnimatedSprite(capsule1Sheet, 3, 33, 27, true, true, {min:0, max:0}, 0, {min:0, max:3}, 128, {min:3, max:3}, 0);
	const SPRITE_SCALE = 1;
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	
	const colliderPath = [{x: this.position.x, y: this.position.y},
						  {x: this.position.x + SPRITE_SCALE * sprite.width, y: this.position.y}, 
						  {x: this.position.x + SPRITE_SCALE * sprite.width, y: this.position.y + SPRITE_SCALE * sprite.height}, 
						  {x: this.position.x, y: this.position.y + SPRITE_SCALE * sprite.height}];
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	let didCollide = false;

	this.update = function(deltaTime, worldPos) {
		this.position.x -= (worldPos - this.worldPos);
		
		if(this.position.x < -this.size.width) {scene.removeEntity(this, false);}
		
		this.worldPos = worldPos;
		
		this.collisionBody.setPosition(this.position);

		sprite.update(deltaTime);
	};
	
	this.draw = function() {
		if(this.position.x > GameField.right) {
			return;
		} else if(this.position.x < GameField.x - this.size.width) {
			scene.removeEntity(this, false);
			return;
		}
		
		sprite.drawAt(this.position, this.size);
		this.collisionBody.draw();
	};
	
	this.respawn = function(worldPos) {
		if(worldPos > initialWorldPos) {
			this.worldPos = worldPos;
			this.position.x -= (worldPos - initialWorldPos);
		}		
	};
	
	this.didCollideWith = function(otherEntity) {
		didCollide = true;
		if((this.group != null) && (typeof this.group !== "undefined")) {
			this.group.collected(this, this.worldPos);
		}
		scene.displayScore(this);
		scene.removeEntity(this, false);
		pauseSound.play();
		explosionEmitter = createParticleEmitter(this.position.x + this.size.width / 2,this.position.y + this.size.height / 2, getCapsule);
	};
}
