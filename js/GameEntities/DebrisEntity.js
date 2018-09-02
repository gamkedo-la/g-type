function DebrisEntity(sprite, position = {x:0, y:0}, spawnPos = 0, scale = 1, rotation = 0) {
	this.position = position;
	this.worldPos = null;
	let unusedTime = 0;

	this.collisionBody = null;

	this.size = {width:scale * sprite.width, height:scale * sprite.height};

	this.angle = 0;
	// Make the rotation way smaller to have sensible numbers at creation
	rotation = rotation / 3000;

	this.update = function(deltaTime, worldPos) {
		if((worldPos >= spawnPos) && (this.position.x > -this.size.width)) {
			if(this.worldPos == null) {
				this.worldPos = worldPos;
			}

			sprite.update(deltaTime);//update the image

			let availableTime = unusedTime + deltaTime;
			while(availableTime > SIM_STEP) {
				availableTime -= SIM_STEP;

				this.position.x -= (worldPos - this.worldPos);
				this.worldPos = worldPos;
			}

			unusedTime = availableTime;

			this.angle = wrapNumber(this.angle + rotation * deltaTime, Math.PI * 2);
		} else if(this.position.x < -this.size.width) {
			scene.removeEntity(this, false);
		}
	};

	this.draw = function() {
		if((this.worldPos >= spawnPos) && (this.position.x > -this.size.width)) {
			sprite.drawAt(this.position, this.size, this.angle);
		}
	};

	this.respawn = function(worldPos) {
		if(worldPos > spawnPos) {
			this.worldPos = worldPos;
			this.position.x -= (worldPos - spawnPos);
		}
	};

	return this;
}
