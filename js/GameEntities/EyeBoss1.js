function EyeBoss1(position = {x:0, y:0}, speed = 10, pattern = PathType.None, timeOffset = 0, spawnPos = 0, difficulty = 0) {
	this.position = {x:position.x, y:position.y};
	this.type = EntityType.EyeBoss1;
	this.worldPos = 0;
	this.score = 5000;
	let previousBackgroundMusic = null;
	
	const MAX_HIT_POINTS = 300;
	const PHASE_TWO_THRESHOLD = MAX_HIT_POINTS / 2;
	const PHASE_THREE_THRESHOLD = MAX_HIT_POINTS / 4;
    this.hitPoints = MAX_HIT_POINTS;     // Every enemy type should have a hitPoints property
    const INVINCIBILITY_TIME = 64;
    this.invincibilityTime = 0;

	const SPRITE_SCALE = 1.0;
	this.vel = {x:speed, y:0};
	let unusedTime = 0;
	this.isVisible = true;
	this.currentState = function(){}
	var state = {}
	this.ticksInState = 0;
	this.timeSinceLastFire = 0;
	this.rotation = 0;
	this.targetPos = {x: 0, y: 0};
	this.aimAtTarget = false;
	this.attackPathStep = 0
	this.ticksInPathStep = 0;

	let sprite = new AnimatedSprite(eyeBoss1Sheet, 
		/*frameCount =*/ 4, 
		/*frameWidth =*/ 120, 
		/*frameHeight =*/ 120, 
		/*reverses =*/ false, 
		/*autoLife =*/ true, 
		/*birthRange =*/ {min:0, max:0}, 
		/*birthRate =*/ 0, 
		/*lifeRange =*/ {min:0, max:0}, 
		/*lifeRate =*/ 256, 
		/*deathRange =*/ {min:2, max:3}, 
		/*deathRate =*/  256);

	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};

	const EXPLOSION_COUNT = 7;
	const explosions = [];

	this.collisionBody = new Collider(ColliderType.Circle,
									 {points: [], 										
									  position:{x:this.position.x, y:this.position.y},  
									  radius: sprite.width/2,
								      center: {x: this.position.x + sprite.width/2, y: this.position.y + sprite.height/2}});
	
	let didCollide = false;
	
	this.update = function(deltaTime, worldPos, playerPos) {
		if(!this.isVisible) {return;}
		if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn

		if(this.invincibilityTime > 0) {
			this.invincibilityTime -= deltaTime;
		}

		if(sprite.getDidDie()) {
			scene.removeEntity(this, false);
			sprite.isDying = false;
			return;
		}
		
		this.worldPos = worldPos;
		if((this.worldPos > spawnPos + 50) && (!sprite.isDying)) {
			if(previousBackgroundMusic === null) {
				scene.worldShouldPause(true);
				previousBackgroundMusic = currentBackgroundMusic.getCurrentTrack();
				currentBackgroundMusic.setCurrentTrack(AudioTracks.Boss1);
				this.changeState(state.entrance);
				
				if(currentBackgroundMusic.getTime() > 0) {
		            currentBackgroundMusic.resume();    
		        } else {
		            currentBackgroundMusic.play();
		        }				
			}
		} else if((sprite.isDying) && (previousBackgroundMusic != null)) {
			scene.worldShouldPause(false);
			currentBackgroundMusic.setCurrentTrack(previousBackgroundMusic);
            currentBackgroundMusic.play();
			previousBackgroundMusic = null;			
		}
		
		this.position.x += (this.vel.x * SIM_STEP / 1000);
		this.position.y += (this.vel.y * SIM_STEP / 1000);
						
		if(this.position.x < -sprite.width) {
			scene.removeEntity(this, false);
			return;
		}
		
		if(!sprite.isDying) {
			this.collisionBody.setPosition({x:this.position.x, 
											y:this.position.y});
		} 
		
		if(!sprite.isDying) {
			sprite.update(deltaTime);
			this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
		} else {
			sprite.update(deltaTime);
			this.updateExplosions(deltaTime);
		}
		
		//run current state
		this.currentState();
		this.ticksInState++;
		this.ticksInPathStep++;
		
		if (this.aimAtTarget) {
			if (this.currentState == state.patrolAttack) {
				this.targetPos = {x: playerPos.x, y: playerPos.y}; // target = player
			} 
			this.rotation = -Math.atan2((this.position.y + sprite.height/2) - this.targetPos.y, // calculate angle of rotation
										(this.position.x + sprite.width/2) - this.targetPos.x); // based on target point
		}
	};
	
	this.changeState = function(newState){
		this.ticksInState = 0;
		this.ticksInPathStep = 0;
		this.currentState = newState;
	}
	
	state.entrance = function() {
		if(this.ticksInState == 1){
			this.vel.x = -speed;
			this.vel.y = 0;
			this.aimAtTarget = false;
			this.attackPathStep = 0;
		}
		if (this.attackPathStep == 0){
			if(this.position.x < GameField.right * 0.6){
				this.moveToNextAttackPathStep();
			}
		}
		else if (this.attackPathStep == 1) {
			this.waitInAttackPathStep(50);
		}
		else {
			this.changeState(state.sprayAttack);
		}
	}
	state.sprayAttack = function() {
		// stay in middle and just shoot randomly
		if(!sprite.isDying) {//Don't allow enemies to shoot when they are in the process of dying
			if (this.ticksInState == 1) {
				this.aimAtTarget = true;
				this.targetPos.x = this.position.x - 10;
				this.targetPos.y = this.position.y + this.size.width/2;
				this.ticksInPathStep = 0;
				this.attackPathStep = 0;
			}
			
			if (this.position.x < (GameField.right - this.size.width) * 0.95) {
				this.vel.x = speed / 4;
			}
			else {
				this.vel.x = 0
			}
			
			if (this.attackPathStep == 0) {
				if (this.targetPos.y < GameField.bottom) {
					this.targetPos.y += 10
				}
				else {
					this.moveToNextAttackPathStep();
				}
			}
			else if (this.attackPathStep == 1) {
				if (this.targetPos.y > 0) {
					this.targetPos.y -= 10;
				}
				else {
					this.moveToNextAttackPathStep();
				}
			}
			else if (this.ticksInState > 150) {
				this.changeState(state.patrolAttack);
			}
			else {
				this.attackPathStep = 0;
			}
			
			this.fireAtTarget(200);
		}
	}
	
	state.patrolAttack = function() {
		if (!sprite.isDying) {
			if (this.ticksInState == 1) {
				this.aimAtTarget = true;
				this.ticksInPathStep = 0;
				this.attackPathStep = 0;
			}
			
			let waitTime = 100;
			let shouldFire = false;
			if (this.attackPathStep === 0) {
				this.vel.x = -speed / 2;
				if(this.position.x < GameField.right * 0.6) {
					this.moveToNextAttackPathStep();
				}
			}
			else if (this.attackPathStep === 1) {
				this.waitInAttackPathStep(waitTime);
				shouldFire = true;
			}
			else if (this.attackPathStep === 2) {
				this.vel.x = speed;
				this.vel.y = -0.8 * speed;
				if (this.position.x > (GameField.right - this.size.width) * 0.95) {
					this.moveToNextAttackPathStep();
				}	
				shouldFire = true;	
			}
			else if (this.attackPathStep === 3) {
				this.waitInAttackPathStep(waitTime);
				shouldFire = true;
			}
			else if (this.attackPathStep === 4) {
				this.vel.y = speed;
				if (this.position.y > (GameField.bottom - this.size.height) * 0.95) {
					this.moveToNextAttackPathStep();
				}
				shouldFire = true;
			}
			else if (this.attackPathStep === 5) {
				this.waitInAttackPathStep(waitTime);
				shouldFire = true;
			}
			else if (this.attackPathStep === 6) {
				this.vel.x = -speed;
				this.vel.y = -1.15 * speed;
				let reachedPosX = false;
				let reachedPosY = false;
				if (this.position.x < GameField.right * 0.6) {
					this.vel.x = 0;
					reachedPosX = true;
				}
				if (this.position.y < GameField.midY - this.size.height / 2) {
					this.vel.y = 0;
					reachedPosY = true;
				}
				if (reachedPosX && reachedPosY) {
					this.moveToNextAttackPathStep();
				}
				shouldFire = true;
			}
			else if (this.attackPathStep == 7) {
				this.waitInAttackPathStep(waitTime);
			}
			else {
				if (this.hitPoints < PHASE_TWO_THRESHOLD) {
					this.changeState(state.burstAttack);
				}
				else {
					this.changeState(state.sprayAttack);
				}
			}
			
			if (shouldFire) {
				this.fireAtTarget(750);
			}
		} // end of if not dying*/
	} // end of function
	
	state.burstAttack = function() {
		// charge up and let a burst of bullets out from all angles - use sprite 1 and 2 for this
		if (this.ticksInState == 1) {
			this.aimAtTarget = true;
			this.targetPos = {x: 0, y: this.position.y + this.size.height/2}
			sprite.lifeRange = {min: 1, max: 2};
		}
		
		if (this.ticksInState == 150) {
			this.burstShot(15);
		}
		
		if (this.ticksInState == 200) {
			this.burstShot(25);
		}
		
		if (this.ticksInState == 250) {
			this.burstShot(40);
			this.updateSpriteBasedOnHP();
		}
		
		if (this.ticksInState == 300) {
		    this.changeState(state.sprayAttack);
		}
	}
	
	this.fireAtTarget = function(fireThreshold) {
		if (this.timeSinceLastFire * difficulty > fireThreshold) {
			this.timeSinceLastFire = 0;
			// calculate bullet velocity based on angle of target
			let bulletSpeed = 3 * difficulty;
			let xVel = bulletSpeed * Math.cos(this.rotation + Math.PI);
			let yVel = bulletSpeed * Math.sin(this.rotation);
	
			const newBullet = new EnemyBullet(EntityType.EnemyBullet9, {x: 0, y: 0}, {x: xVel, y:yVel});
	
			// calculate bullet start position based on angle of target
			let origin = {x: this.collisionBody.center.x, y: this.collisionBody.center.y};
			let radius = sprite.width/2 + 20; // as sprite is a square, either width or height will do
	
			let bulletStartPos = {x: 0, y: 0};
			bulletStartPos.x = origin.x + radius * Math.cos(this.rotation + Math.PI);
			bulletStartPos.y = origin.y + radius * Math.sin(this.rotation);
	
			bulletStartPos.x -= newBullet.size.width / 2;
			bulletStartPos.y -= newBullet.size.height / 2;
	
			newBullet.position.x = bulletStartPos.x;
			newBullet.position.y = bulletStartPos.y;
		
			scene.addEntity(newBullet, false);
		}
		this.timeSinceLastFire++;
	}
	
	this.burstShot = function(numberOfShots) {
		let dAngle = (Math.PI * 2) / numberOfShots
		let i;
		for (i = 0; i < Math.PI * 2; i += dAngle) {
			this.rotation = i;
			this.fireAtTarget(0);
		}
	}
	
	this.waitInAttackPathStep = function(waitTime) {
		if (this.ticksInPathStep > waitTime) {
			this.ticksInPathStep = 0;
			this.attackPathStep++;
		}
	}
	
	this.moveToNextAttackPathStep = function() {
		this.vel.x = 0;
		this.vel.y = 0;
		this.ticksInPathStep = 0;
		this.attackPathStep++;
	}
	
	this.updateSpriteBasedOnHP = function() {
		if (this.hitPoints < PHASE_THREE_THRESHOLD) {
			sprite.lifeRange = {min: 2, max: 3};			
		}
		else if (this.hitPoints < PHASE_TWO_THRESHOLD) {
			sprite.lifeRange = {min: 2, max: 2};
		}
		else {
			sprite.lifeRange = {min: 0, max: 0};			
		}
	}
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		if(this.worldPos < spawnPos) {return;}
		
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height, this.rotation)
		if(!sprite.isDying) {
			this.collisionBody.draw();
		} else {
			this.drawExplosions();
		}
	};
	
	this.updateExplosions = function(deltaTime) {
		if(explosions.length < EXPLOSION_COUNT) {
			if((100 * Math.random()) < 25) {//1 in 20 chance the next explosion should spawn
				const newExplosion = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 128);
                newExplosion.deltaXPos = (0.25 * this.size.width) - (this.size.width * Math.random());
                newExplosion.deltaYPos = (0.25 * this.size.height) - (this.size.height * Math.random());
				
				newExplosion.isDying = true;
				newExplosion.wasBorn = true;
				
				explosions.push(newExplosion);
			}
		}
		
		for(let i = 0; i < explosions.length; i++) {
			explosions[i].update(deltaTime);
		}
	};
	
	this.drawExplosions = function() {
		for(let i = 0; i < explosions.length; i++) {
            explosions[i].drawAt((this.position.x + explosions[i].deltaXPos), (this.position.y + explosions[i].deltaYPos), this.size.width * 2, this.size.height * 2);
		}
	};
	
	this.respawn = function(worldPos) {
		if(worldPos > spawnPos) {
			this.worldPos = worldPos;
			const totalTime = (worldPos *  SIM_STEP);
			this.position.x = position.x;
			this.position.y = position.y;
		}
	};
		
	this.didCollideWith = function(otherEntity) {
		if(this.invincibilityTime > 0) {return;}
		
		if((otherEntity.type === EntityType.Player) ||
		   (otherEntity.type === EntityType.RagnarokCapsule) || 
		   (otherEntity.type === EntityType.PlayerShot) ||
		   (otherEntity.type === EntityType.PlayerMissile) ||
		   (otherEntity.type === EntityType.PlayerDouble) ||
		   (otherEntity.type === EntityType.PlayerLaser) ||
		   (otherEntity.type === EntityType.ReflectedShot) ||
		   (otherEntity.type === EntityType.PlayerTriple) ||
		   (otherEntity.type === EntityType.PlayerForceUnit)) {
			   
			   let prevHitPoints = this.hitPoints;
			   this.hitPoints -= otherEntity.damagePoints;
			   if(otherEntity.type === EntityType.ReflectedShot) {//EyeBoss suffers 3x damage from its own shots
				   this.hitPoints -= (2 * otherEntity.damagePoints);
			   }
			   enemyMediumExplosion.play();
			   this.invincibilityTime = INVINCIBILITY_TIME;
			   
			   // change sprite if entering new phase
			   if (this.hitPoints <= PHASE_TWO_THRESHOLD && prevHitPoints > PHASE_TWO_THRESHOLD || 
				   this.hitPoints <= PHASE_THREE_THRESHOLD && prevHitPoints > PHASE_THREE_THRESHOLD) {
				   this.updateSpriteBasedOnHP();
			   }
		}
		   
		if(this.hitPoints <= 0) {
			if(sprite.isDying) {return;}//already dying, no reason to continue
			
			scene.displayScore(this);
			sprite.isDying = true;
			scene.removeCollisions(this);	
		}
	};
}
