//GroundEnemy2
function GroundEnemy2(position = {x:0, y:0}, speed = 100, pattern = PathType.Loop, spawnPos = 0, difficulty = 1, path = null) {
    this.type = EntityType.GroundEnemy1;
    this.group = null;
    this.worldPos = 0;
    this.score = 100;
    this.hitPoints = 4;     // Every enemy type should have a hitPoints property
    
    const SPRITE_SCALE = 1;
    this.position = {x: position.x + spawnPos, y:position.y};
    let vel = {x:speed, y:speed};
    let unusedTime = 0;
    this.isVisible = true;
    
    const normalSprite = new AnimatedSprite(groundEnemy2Sheet, 9, 40, 28, true, true, {min:0, max:0}, 0, {min:0, max:4}, 256, {min:5, max:8}, 128);
    const explosionSprite = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
    let sprite = normalSprite;
    
    this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

    const colliderPath = [{x: this.position.x, y: this.position.y},
                          {x: this.position.x + this.size.width, y: this.position.y},
                          {x: this.position.x + this.size.width, y: this.position.y + this.size.height},
                          {x: this.position.x, y: this.position.y + this.size.height}];
    this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
    
    let didCollide = false;
    
    this.update = function(deltaTime, worldPos, playerPos) {
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
            this.collisionBody.setPosition({x: this.position.x, y: this.position.y});
        } else if(this.position.x < -this.size.width) {
            scene.removeEntity(this, false);
        }
        
        if(sprite !== explosionSprite) {
            this.doShooting(playerPos);
        }
    };
    
    this.doShooting = function(playerPos) {
        if(sprite === explosionSprite) {return;}//don't allow enemies to shoot while they are dying
        
        if(sprite.getDidDie()) {
            let facing = Math.PI / 2;
            
            const angleToPlayer = Math.atan2(this.position.y - playerPos.y, playerPos.x - this.position.x);
            
            const deltaAngle = angleToPlayer - facing;
            if((deltaAngle > -Math.PI / 2) && (deltaAngle < Math.PI / 2)) {
                let xVel;
				let yVel;
				if(difficulty > 10) {
					xVel = 100 * Math.cos(angleToPlayer);
					yVel = -100 * Math.sin(angleToPlayer);
				} else {
					xVel = 50 * Math.cos(angleToPlayer);
					yVel = -50 * Math.sin(angleToPlayer);
				}
                
                const bulletXPos = this.collisionBody.center.x + this.collisionBody.radius * Math.cos(facing);
                const bulletYPos = this.collisionBody.center.y - this.collisionBody.radius * Math.sin(facing);
                
                const newBullet = new EnemyBullet(EntityType.EnemyBullet1, {x: bulletXPos, y: bulletYPos}, {x: xVel, y:yVel});
                newBullet.setPosition({x:newBullet.position.x - newBullet.size.width / 2,
                                      y:newBullet.position.y - newBullet.size.height / 2});
                
                scene.addEntity(newBullet, false);
            }
            
            sprite.clearDeath();
            return;
        }
        
        const firingChance = Math.floor(1000 * Math.random());
        if(firingChance < difficulty) {
            sprite.isDying = true;//using the "dying" frames as "shooting" frames instead
        }
    };
    
    this.draw = function() {
        if(!this.isVisible) {return;}
        if(this.worldPos < spawnPos) {return;}

        sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
        if(!sprite.isDying) {
            this.collisionBody.draw();
        }
    };
    
    this.respawn = function(worldPos) {
        if(worldPos > spawnPos) {
            this.worldPos = worldPos;
            const totalTime = (worldPos *  SIM_STEP);
            const nextPos = this.path.nextPoint(totalTime - timeOffset);
            this.position.x = nextPos.x;
            this.position.y = nextPos.y;
        }
    };
    
    this.didCollideWith = function(otherEntity) {
        if (otherEntity) {
            let entityType = otherEntity.type;
            if ((entityType === EntityType.PlayerForceUnit) ||
                (entityType === EntityType.RagnarokCapsule) ||
                (entityType === EntityType.PlayerShot) ||
                (entityType === EntityType.PlayerMissile) ||
                (entityType === EntityType.PlayerDouble) ||
                (entityType === EntityType.PlayerLaser) ||
                (entityType === EntityType.PlayerTriple) ||
                (entityType === EntityType.PlayerShield)) {
                this.hitPoints -= otherEntity.damagePoints;
            }
        }
        else {
            this.hitPoints = 0; // TODO remove this catch-all; we want all collisions with player weapons to inflict damage based on their damagePoints
        }
        
        if (this.hitPoints <= 0) {
            if(sprite.isDying) {return;}//already dying, no reason to continue
            
            scene.displayScore(this);
            
            if((this.group != null) && (this.group !== undefined)) {
				this.group.amDying(this, this.worldPos);
			}
                        
            sprite = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
            
            this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

            this.position.x = this.collisionBody.center.x - this.size.width / 2;
            this.position.y = this.collisionBody.center.y - this.size.height / 2;
            
            sprite = explosionSprite;
            this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
            
            this.position.x = this.collisionBody.center.x - this.size.width / 2;
            this.position.y = this.collisionBody.center.y - this.size.height / 2;
            
            sprite.isDying = true;
            sprite.wasBorn = true;
            scene.removeCollisions(this);
            
            enemySmallExplosion.play();
        }
    };
}