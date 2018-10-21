//EnemyBullet
function EnemyBullet(type, position = {x:0, y:0}, velocity = {x:0, y:0}) {
	this.type = type;
	
	this.position = position;
	let vel = velocity;
	let unusedTime = 0;
	this.isVisible = true;
	this.worldPos = null;
    this.damagePoints = 5;
	
	let sprite;
	if(this.type === EntityType.EnemyBullet1) {
		sprite = new AnimatedSprite(enemyBulletSheet, 2, 21, 21, false, true, {min:0, max:0}, 0, {min:0, max:1}, 128, {min:1, max:1}, 0);
	} else if(this.type === EntityType.EnemyBullet2) {
		sprite = new AnimatedSprite(enemyBullet2Sheet, 11, 30, 30, true, true, {min:0, max:0}, 0, {min:0, max:10}, 128, {min:0, max:0}, 0);
	} else if(this.type === EntityType.EnemyBullet3) {
		sprite = new AnimatedSprite(pewpew1Sheet, 4, 40, 40, false, true, {min:0, max:3}, 0, {min:0, max:3}, 68, {min:3, max:3}, 0);
	} else if(this.type === EntityType.EnemyBullet4) {
		sprite = new AnimatedSprite(pewpew2Sheet, 2, 32, 32, false, true, {min:0, max:1}, 0, {min:0, max:1}, 40, {min:1, max:1}, 0);
	}
	this.size = {width:sprite.width, height:sprite.height};
	
	this.collisionBody = new Collider(ColliderType.Circle, {points:   [], 
		position: {x:this.position.x + sprite.width / 2, y:this.position.y + sprite.height / 2}, 
		radius:   7, 
		center:   {x:this.position.x + sprite.width / 2, y:this.position.y + sprite.height / 2}}
  	);

	let didCollide = false;
	
	this.setPosition = function(newPos) {
		this.position.x = newPos.x;
		this.position.y = newPos.y;
		this.collisionBody.position.x = this.position.x + sprite.width / 2;
		this.collisionBody.position.y = this.position.y + sprite.height / 2;
		this.collisionBody.center.x = this.position.x + sprite.width / 2;
		this.collisionBody.center.y = this.position.y + sprite.height / 2;
	}
	
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
			
			if((this.position.x > GameField.right) || 
			   (this.position.x < GameField.x - sprite.width) || 
			   (this.position.y < GameField.y - sprite.height) || 
			   (this.position.y > GameField.bottom)) {
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
        if(this.type === EntityType.EnemyBullet3) {
            if(otherEntity.type != PlayerShot) {
                scene.removeEntity(this, false);
            }
        } else {
            if(otherEntity.type === EntityType.PlayerForceUnit) {
                if(otherEntity.position.x <= this.position.x) {
                    vel.x = Math.abs(vel.x);
                } else {
                    vel.x = -Math.abs(vel.x);
                }
                
                if(otherEntity.position.y <= this.position.y) {
                    vel.y = Math.abs(vel.y);
                } else {
                    vel.y = -Math.abs(vel.y);
                }
                
                this.type = EntityType.PlayerShot;
            } else {
                scene.removeEntity(this, false);
            }
        }
	};
}
