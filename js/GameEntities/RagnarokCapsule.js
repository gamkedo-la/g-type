//Ragnarok Capsule
function RagnarokCapsule(position = {x:0, y:0}, initialWorldPos) {
	this.worldPos = initialWorldPos;
	this.type = EntityType.RagnarokCapsule;
	this.damagePoints = 10;
	
	this.position = {x: position.x, y:position.y};
	
	const sprite = new AnimatedSprite(ragnarokSheet, 15, 60, 60, false, true, {min:0, max:0}, 0, {min:0, max:14}, 128, {min:14, max:14}, 0);
	const SPRITE_SCALE = 1;
	
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	
	this.collisionBody = new Collider(ColliderType.Circle, 
									 {points:   [], 
										 //13 and 17 are based on the sprite
									  position: {x:this.position.x + this.size.width / 2, 
										  		 y:this.position.y + this.size.height / 2}, 
									  radius:   SPRITE_SCALE * 17, 
									  center:   {x:this.position.x + this.size.width / 2, 
										  		 y:this.position.y + this.size.height / 2}}
									  );
	let didCollide = false;

	this.update = function(deltaTime, worldPos) {
		this.position.x -= (worldPos - this.worldPos);
		
		if(this.position.x < -this.size.width) {scene.removeEntity(this, false);}
		
		this.worldPos = worldPos;
		
		this.collisionBody.setPosition({x:this.position.x + this.size.width / 2, 
										y:this.position.y + this.size.height / 2});
		
		sprite.update(deltaTime);
	};
	
	this.draw = function() {
		if(this.position.x > GameField.right) {
			return;
		} else if(this.position.x < GameField.x - this.size.width) {
			scene.removeEntity(this, false);
			return;
		}
		
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
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
        scene.shouldShake(MAX_SHAKE_MAGNITUDE/2);
		scene.removeEntity(this, false);
		scene.destroyAllOnScreen(this);
		clearScreen.play();
//		explosionEmitter = createParticleEmitter(this.position.x + this.size.width / 2,this.position.y + this.size.height / 2, getCapsule);
	};
}
