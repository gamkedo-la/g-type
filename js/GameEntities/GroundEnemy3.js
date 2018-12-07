//GroundEnemy3
function GroundEnemy3(position = {x:0, y:0}, spawnPos = 0, difficulty = 0) {
    this.type = EntityType.GroundEnemy3;
    this.group = null;
    this.worldPos = 0;
    this.score = 100;
    this.hitPoints = 25;     // Every enemy type should have a hitPoints property
    
    const SPRITE_SCALE = 1;
    this.position = {x: position.x + spawnPos, y:position.y};
    let unusedTime = 0;
    this.isVisible = true;
    
    const normalSprite = new AnimatedSprite(groundEnemy3Sheet, 8, 120, 126, true, true, {min:0, max:0}, 0, {min:0, max:4}, 256, {min:5, max:7}, 128);
    const explosionSprite = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
    let sprite = normalSprite;
    
    this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
    
    const colliderPath = [{x: this.position.x + SPRITE_SCALE * 20, y: this.position.y + SPRITE_SCALE * 20},
                          {x: this.position.x + SPRITE_SCALE * 79, y: this.position.y + SPRITE_SCALE * 14},
                          {x: this.position.x + SPRITE_SCALE * 81, y: this.position.y},
                          {x: this.position.x + SPRITE_SCALE * 111, y: this.position.y},
                          {x: this.position.x + SPRITE_SCALE * 119, y: this.position.y + this.size.height},
                          {x: this.position.x + SPRITE_SCALE * 73, y: this.position.y + this.size.height},
                          {x: this.position.x + SPRITE_SCALE * 78, y: this.position.y + SPRITE_SCALE * 32},
                          {x: this.position.x + SPRITE_SCALE * 20, y: this.position.y + SPRITE_SCALE * 28}];
    
    this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
    
    let didCollide = false;
    
    this.path = new EnemyPath(PathType.None, this.position, 0, [], 0);//speed & timeOffset = 0
    
    this.update = function(deltaTime, worldPos, playerPos) {
        if((worldPos >= spawnPos) && (this.position.x > -this.size.width)) {
            if(this.worldPos == null) {
                this.worldPos = worldPos;
            }
            
            if((sprite === explosionSprite) && (sprite.getDidDie())) {
	            scene.removeEntity(this, false);
				sprite.isDying = false;
				return;
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
            if(playerPos.x < this.position.x) {
                const xVel = -530;
                const yVel = 0;
                
                const bulletXPos = this.position.x + SPRITE_SCALE * 20;//20 from sprite
                const bulletYPos = this.position.y + SPRITE_SCALE * 25//25 from sprite    
                const newBullet = new EnemyBullet(EntityType.EnemyBullet4, {x: bulletXPos, y: bulletYPos}, {x: xVel, y:yVel});
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
        
        sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height, this.rotation);
        if(sprite != explosionSprite) {
            this.collisionBody.draw();
        }
    };
    
    this.respawn = function(worldPos) {
        if(worldPos > spawnPos) {
            this.worldPos = worldPos;
            const totalTime = (worldPos *  SIM_STEP);
            const nextPos = this.path.nextPoint(totalTime);
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
				(entityType === EntityType.ReflectedShot) ||
                (entityType === EntityType.PlayerShield)) {
                this.hitPoints -= otherEntity.damagePoints;
                if(this.hitPoints > 0) {
					shotDamaged.play();
				}
            }
        }
        
        if (this.hitPoints <= 0) {
            if(sprite === explosionSprite) {return;}//already dying, no reason to continue
            
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
