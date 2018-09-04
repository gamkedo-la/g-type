//EnemyBullet
function EnemyBullet(position = {x:0, y:0}, velocity = {x:0, y:0}) {
	this.type = EntityType.EnemyBullet;
	
	this.position = position;
	let vel = velocity;
	let unusedTime = 0;
	this.isVisible = true;
	this.worldPos = null;
	
	const sprite = new AnimatedSprite(enemyBulletSheet, 2, 21, 21, false, true, {min:0, max:0}, 0, {min:0, max:1}, 128, {min:1, max:1}, 0);
	this.size = {width:sprite.width, height:sprite.height};
	
	this.collisionBody = new Collider(ColliderType.Circle, {points:   [], 
															position: {x:this.position.x + sprite.width / 2, y:this.position.y + sprite.height / 2}, 
															radius:   7, 
															center:   {x:this.position.x + sprite.width / 2, y:this.position.y + sprite.height / 2}}
									  );
	let didCollide = false;
	
	this.update = function(deltaTime, worldPos) {
		if(!this.isVisible) {return;}
		
		if(this.worldPos == null) {
			this.worldPos = worldPos;
		}
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			this.position.x += (vel.x * SIM_STEP / 1000);
			this.position.y += (vel.y * SIM_STEP / 1000);
			
			if((this.position.x > canvas.width) || (this.position.x < -sprite.width) || (this.position.y < -sprite.height) || (this.position.y > canvas.height)) {
				scene.removeEntity(this, false);
				return;
			}
		}
		
		this.position.x -= (worldPos - this.worldPos);
		this.worldPos = worldPos;
		
		unusedTime = availableTime;
		
		this.collisionBody.setPosition({x:this.position.x + sprite.width / 2, y:this.position.y + sprite.height / 2});
		sprite.update(deltaTime);
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		
		sprite.drawAt(this.position, this.size);
		this.collisionBody.draw();
		
		if(didCollide) {
			didCollide = false;
			canvasContext.fillStyle = 'green';
			canvasContext.arc(this.position.x + sprite.width / 2, this.position.y + sprite.height / 2, 7, 0, 2 * Math.PI);
			canvasContext.fill();
		}
	};
	
	this.didCollideWith = function(otherEntity) {
		scene.removeEntity(this, false);
	};
}
