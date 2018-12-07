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
		sprite = new AnimatedSprite(enemyBullet2Sheet, 11, 30, 30, true, true, {min:0, max:0}, 0, {min:0, max:10}, 64, {min:0, max:0}, 0);
	} else if(this.type === EntityType.EnemyBullet3) {
		sprite = new AnimatedSprite(pewpew1Sheet, 4, 40, 40, false, true, {min:0, max:3}, 0, {min:0, max:3}, 68, {min:3, max:3}, 0);
	} else if(this.type === EntityType.EnemyBullet4) {
		sprite = new AnimatedSprite(pewpew2Sheet, 2, 32, 32, false, true, {min:0, max:1}, 0, {min:0, max:1}, 40, {min:1, max:1}, 0);
	} else if(this.type === EntityType.EnemyBullet5) {
		sprite = new AnimatedSprite(pewpew3Sheet, 3, 59, 38, false, true, {min:0, max:0}, 0, {min:0, max:2}, 68, {min:2, max:2}, 0);
	} else if(this.type === EntityType.EnemyBullet6) {
		sprite = new AnimatedSprite(pewpew4Sheet, 5, 32, 32, false, true, {min:0, max:0}, 0, {min:0, max:4}, 68, {min:4, max:4}, 0);
	} else if(this.type === EntityType.EnemyBullet7) {
		sprite = new AnimatedSprite(pewpew5Sheet, 2, 35, 35, false, true, {min:0, max:0}, 0, {min:0, max:1}, 68, {min:1, max:1}, 0);
	} else if(this.type === EntityType.EnemyBullet8) {
		sprite = new AnimatedSprite(miniminiBoss1Sheet, 3, 59, 38, false, true, {min:0, max:0}, 0, {min:0, max:2}, 256, {min:2, max:2}, 0);
	} else if(this.type === EntityType.EnemyBullet9) {
		sprite = new AnimatedSprite(rotatingEyeSheet, 4, 22, 22, false, true, {min:0, max:0}, 0, {min:0, max:3}, 128, {min:3, max:3}, 0);
	} else if(this.type === EntityType.EnemyBullet10) {
		sprite = new AnimatedSprite(eyeBulletSheet, 4, 25, 25, false, true, {min:0, max:0}, 0, {min:0, max:3}, 128, {min:3, max:3}, 0);
	}
	this.size = {width:sprite.width, height:sprite.height};
	
	let bodyRadius = 7;
	if((this.type === EntityType.EnemyBullet3) ||
	   (this.type === EntityType.EnemyBullet4) ||
	   (this.type === EntityType.EnemyBullet5) || 
	   (this.type === EntityType.EnemyBullet6)) {
		bodyRadius = sprite.height/3;
	} else if(this.type === EntityType.EnemyBullet9) {
		bodyRadius = sprite.height/2;
	}
	
	this.collisionBody = new Collider(ColliderType.Circle, {points:   [], 
		position: {x:this.position.x + sprite.width / 2, y:this.position.y + sprite.height / 2}, 
		radius:   bodyRadius, 
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
		
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
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
            if((otherEntity.type === EntityType.PlayerLaser) ||
               (otherEntity.type === EntityType.PlayerForceUnit)) {//Only the laser & the force destroy the shot
                scene.removeEntity(this, false);
            }
        } else {
            if(otherEntity.type === EntityType.PlayerForceUnit) {
                if(otherEntity.position.x <= this.position.x) {
                    vel.x = Math.abs(3 * vel.x);
                } else {
                    vel.x = -Math.abs(vel.x);
                }
                
                if(otherEntity.position.y <= this.position.y) {
                    vel.y = Math.abs(vel.y);
                } else {
                    vel.y = -Math.abs(vel.y);
                }
                
                this.type = EntityType.ReflectedShot;
            } else {
                scene.removeEntity(this, false);
            }
        }
	};
}
