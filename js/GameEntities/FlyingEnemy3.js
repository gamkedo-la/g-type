//FlyingEnemy3
function FlyingEnemy3(position = {x:0, y:0}, speed = -10, pattern = PathType.None, spawnPos = 0, difficulty = 0, path = null) {
    this.type = EntityType.FlyingEnemy3;
    this.group = null;
    this.worldPos = 0;
    this.score = 100;
    
    this.hitPoints = 4;
    
    const SPRITE_SCALE = 1;
    this.position = {x:position.x, y:position.y};
    let velocity = {x:speed, y:speed};
    let unusedTime = 0;
    this.isVisible = false;
    
    let sprite;
    if(difficulty > 15) {
        sprite = new AnimatedSprite(flyingEnemy3RedSheet, 18, 45, 45, false, true, {min:0, max:0}, 0, {min:0, max:17}, 64, {min:17, max:17}, 0);
    } else {
        sprite = new AnimatedSprite(flyingEnemy3Sheet, 18, 45, 45, false, true, {min:0, max:0}, 0, {min:0, max:17}, 64, {min:17, max:17}, 0);
    }
    this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
    
    const colliderPath = [{x: this.position.x, y: this.position.y},
                          {x: this.position.x + this.size.width, y: this.position.y},
                          {x: this.position.x + this.size.width, y: this.position.y + this.size.height},
                          {x: this.position.x, y: this.position.y + this.size.height}];
    
    this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
    
    let didCollide = false;
    let didSpawn = false;
    
    let pathPoints = [
        {x: GameField.right, y: GameField.y + 60},
        {x: GameField.x + GameField.width / 5, y: GameField.y + 60},
        {x: GameField.x + GameField.width / 4, y: GameField.y + 450},
        {x: GameField.x + GameField.width / 3, y: GameField.y + 450},
        {x: GameField.x + GameField.width / 2, y: GameField.y + 60},
        {x: GameField.x + GameField.width + 50, y: GameField.y + 60},
    ];
    
    this.updatePathOffset = function(additionalOffset) {
	        pathPoints.forEach((point) => {
	            point.x -= additionalOffset;
	        });
	    
	    this.path = new EnemyPath(pattern, this.position, speed, pathPoints);
    };
    
    if(path) {
        if(path.polygon === undefined) {
            pathPoints = path.polyline.slice(0);
        } else {
            pathPoints = path.polygon.slice(0);
        }
        
        pathPoints.forEach((point) => {
            point.x += GameField.x + GameField.width - 50;
            point.y += GameField.y + path.y;
        });
    }
    
    this.path = new EnemyPath(pattern, this.position, speed, pathPoints);
    
    
    this.spawn = function(deltaX) {
        if(didSpawn) {return;}//only spawn once
        const deltaPos = {x:deltaX, y:0};
        this.path.updatePosition(deltaPos);
        this.position = this.path.putAtFirstPoint();
        this.isVisible = true;
        didSpawn = true;
    };
    
    this.getDidSpawn = function() {
        return didSpawn;
    };

    this.update = function(deltaTime, worldPos, playerPos) {
        if(!this.isVisible) {return;}
        if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn
        
        if(sprite.getDidDie()) {
            scene.removeEntity(this, false);
            sprite.isDying = false;
            return;
        }
        
        this.worldPos = worldPos;
        
        if(didSpawn) {
            let availableTime = unusedTime + deltaTime;
            while(availableTime > SIM_STEP) {
                availableTime -= SIM_STEP;
                if(!sprite.isDying) {
                    const nextPos = this.path.nextPoint(SIM_STEP);
                    if(nextPos !== undefined) {
                        if(pattern === PathType.None) {
                            this.position.x += (velocity.x * SIM_STEP / 1000);
                        } else if(pattern === PathType.Sine) {
                            this.position.x += nextPos.x;
                            this.position.y += nextPos.y;
                        } else if((pattern === PathType.Points) || (pattern === PathType.Loop)) {
                            this.position.x = nextPos.x;
                            this.position.y = nextPos.y;
                        }
                    }
                }
                
                if(this.position.x < -sprite.width) {
                    scene.removeEntity(this, false);
                    return;
                }
            }
            
            //store unused time for future use
            unusedTime = availableTime;
        }
        
        //update the collision body position
        if(!sprite.isDying) {
            this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
            
            this.doShooting(playerPos);
        }
        
        sprite.update(deltaTime);
    };
    
    this.doShooting = function(playerPos) {
        const firingChance = Math.floor(1000 * Math.random());
        if(firingChance < difficulty) {
            let yVel;
            if(this.position.y < playerPos.y) {
                yVel = 50;
            } else {
                yVel = -50;
            }
            
            let xVel = velocity.x;
            if(this.position.x > (playerPos.x + 50)) {
                xVel -= 10;
            } else if(this.position.x < (playerPos.x - 50)) {
                xVel = -xVel;
            } else {
                xVel = 0;
            }
            
            if(difficulty > 10) {
				xVel *= 2;
				yVel *= 2;
			}
            
            const newBullet = new EnemyBullet(EntityType.EnemyBullet1, {x: this.position.x - 10, y: this.collisionBody.center.y}, {x: xVel, y:yVel});
            scene.addEntity(newBullet, false);
        }
    };
    
    this.draw = function() {
        if(!this.isVisible) {return;}
        if(this.worldPos < spawnPos) {return;}
        
        sprite.drawAt(this.position, this.size);
        if(!sprite.isDying) {
            this.collisionBody.draw();
        }
    };
    
    this.respawn = function(worldPos) {
        if(worldPos > spawnPos) {
            this.worldPos = worldPos;
            const totalTime = (worldPos * SIM_STEP);
            const nextPos = this.path.nextPoint(totalTime);
            this.position.x = nextPos.x;
            this.position.y = nextPos.y;
        }
    };
    
    this.didCollideWith = function(otherEntity) {
        if (otherEntity.collisionBody) {
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
        
        if (this.hitPoints <= 0) {
            if(sprite.isDying) {return;}//already dying, no reason to continue
            
            scene.displayScore(this);
            
            sprite = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
            
            this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
            
            this.position.x = this.collisionBody.center.x - this.size.width / 2;
            this.position.y = this.collisionBody.center.y - this.size.height / 2;
            
            sprite.isDying = true;
            
            if((this.group != null) && (this.group !== undefined)) {
                this.group.amDying(this, this.worldPos);
            }
            
            sprite.wasBorn = true;
            scene.removeCollisions(this);
            
            enemySmallExplosion.play();
        }
    };
}
