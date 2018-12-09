//Force Unit
function PlayerForceUnit(position = {x:0, y:0}) {
	this.type = EntityType.PlayerForceUnit;

    const sprite = new AnimatedSprite(forceUnitSheet, 4, 50, 45, false, true, {min:0, max:0}, 0, {min:0, max:3}, 256, {min:3, max:3}, 0);
	const SPRITE_SCALE = 0.5;
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	this.position = {x: position.x, y: position.y};
    this.parentObj = null;

    this.damagePoints = 4;   // Damage points = how many hit points to remove on contact with an enemy (every weapon that can inflict damage on an enemy must have this property

	let centerX = sprite.width / 2;
	let centerY = sprite.height/ 2;

	this.collisionBody = new Collider(ColliderType.Circle,	{points:   [], 
														//position: {x:centerX, y:centerY}, 
														position: {x:this.position.x, y:this.position.y}, 
														radius:   12,
														center:   {x:this.position.x + this.size.width/2, y:this.position.y + this.size.height/2}});

	this.getIsDying = function() {
		return sprite.isDying;
	};
	
	let unusedTime = 0;//time left over from last call to this.update, helps smooth movement with variable frame rate


	this.update = function(deltaTime, worldPos) {
		this.position.x = this.parentObj.position.x + 50;
		this.position.y = this.parentObj.position.y + 5;
		sprite.update(deltaTime);   //update the image

		//keep the collisionBody position in synch with the visual position
		this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
	};


	this.didCollideWith = function(otherEntity) {
		if(otherEntity.type === EntityType.ReflectedShot) {
			playerShieldHit.play();
		}
		//The Force doesn't respond to collisions
	};

	this.draw = function() {
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
		//collision bodies know not to draw themselves if DRAW_COLLIDERS = false
		this.collisionBody.draw();
	};
}
