//Cargo Ship Boss
function AlienBoss1(position = {x:0, y:0}, speed = 10, pattern = PathType.None, timeOffset = 0, spawnPos = 0, difficulty = 0) {	
	this.type = EntityType.AlienBoss1;
	this.group = null;
	this.worldPos = 0;
	this.score = 9200;
	let previousBackgroundMusic = null;

	const MAX_HITPOINTS = 500;
    this.hitPoints = MAX_HITPOINTS;     // Every enemy type should have a hitPoints property
    const MINI_MINI_BULLETS = 5;
	
	const SPRITE_SCALE = 1; 
	this.position = position;
	this.vel = {x: -50, y:speed};
	let unusedTime = 0;
	this.isVisible = true;
	this.bulletsLeft = 0;
	this.timeSinceLastFire = 0;
	this.ticksInState = 0;
	this.timeSinceLastDip = 0;
	let sprite = new AnimatedSprite(alienBoss1Sheet, 
		/*frameCount =*/ 12, 
		/*frameWidth =*/ 211.7, 
		/*frameHeight =*/ 210, 
		/*reverses =*/ true, 
		/*autoLife =*/ true, 
		/*birthRange =*/ {min:0, max:1}, 
		/*birthRate =*/ 0, 
		/*lifeRange =*/ {min:0, max:11}, 
		/*lifeRate =*/ 328, 
		/*deathRange =*/ {min:0, max:1}, 
		/*deathRate =*/  0);
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	const EXPLOSION_COUNT = 7;
	const explosions = [];

	//all magic numbers in collider path are based on the sprite
	const colliderPath = [{x: this.position.x,	 					y: this.position.y + 78 / 2},
						  {x: this.position.x + this.size.width / 8,  y: this.position.y + 78 / 5},
						  {x: this.position.x + this.size.width / 4,  y: this.position.y + 78 / 10},
						  {x: this.position.x + this.size.width / 2, y: this.position.y},
						  {x: this.position.x + 3 * this.size.width / 4, y: this.position.y + 78 / 10},
						  {x: this.position.x + 7 * this.size.width / 8, y: this.position.y + 78 / 5},
						  {x: this.position.x + this.size.width, y: this.position.y + 78 / 2},
						  {x: this.position.x + 7 * this.size.width / 8, y: this.position.y + 4 * 78 / 5},
						  {x: this.position.x + 3 * this.size.width / 4, y: this.position.y + 9 * 78 / 10},
						  {x: this.position.x + this.size.width / 2, y: this.position.y + 78},
						  {x: this.position.x + this.size.width / 4, y: this.position.y + 9 * 78 / 10},
						  {x: this.position.x + this.size.width / 8, y: this.position.y + 4 * 78 / 5}];
	
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	
	let didCollide = false;
	
 	this.update = function(deltaTime, worldPos, playerPos) {
		if(sprite.getDidDie()) {
			scene.removeEntity(this, false);
			sprite.isDying = false;
            scene.levelComplete();
			return;
		}
		
		this.worldPos = worldPos;
		if(!this.isVisible) {return;}
		if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn
		
		this.timeSinceLastFire += deltaTime;
		
		if((this.worldPos > spawnPos + 50) && (!sprite.isDying)) {
			if(previousBackgroundMusic === null) {
				scene.worldShouldPause(true);
				previousBackgroundMusic = currentBackgroundMusic.getCurrentTrack();
				currentBackgroundMusic.setCurrentTrack(AudioTracks.Boss1);
				this.currentState = state.entrance; 

		        currentBackgroundMusic.play();
			}
		} else if((sprite.isDying) && (previousBackgroundMusic != null)) {
			scene.worldShouldPause(false);
			currentBackgroundMusic.setCurrentTrack(previousBackgroundMusic);
            currentBackgroundMusic.play();
			previousBackgroundMusic = null;			
		}
		
		this.position.x += (this.vel.x * SIM_STEP / 1000);
		this.position.y += (this.vel.y * SIM_STEP / 1000);		
		
		if(!sprite.isDying) {
			sprite.update(deltaTime);
			this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
		} else {
			sprite.update(deltaTime / 4);
			this.updateExplosions(deltaTime);
		}
		//run current state
		this.currentState();
		this.ticksInState += 1;
		this.timeSinceLastDip += 1;
	};

	this.currentState = function(){}
	let state = {}
	state.entrance = function(){
		if(this.ticksInState == 1){
			
			this.vel.x = -100
			
		}
		if(this.position.x < 700){
			this.bulletsLeft = 100;
		}
		
		if(this.position.x < 500){
			this.vel.x = 0
			this.vel.y = 0;
			this.targetPos.y = this.position.y
			
			//this.currentState = state.phase1;
			this.changeState(state.pewpew);
		}
	}
	this.targetPos = {
		x: 0,
		y: 378
	}
	this.changeState = function(newState){
		this.ticksInState = 0
		this.currentState = newState;
	}

	this.oldDistance = 0
	state.phase1 = function(){
		if(this.ticksInState == 1){
			this.bulletsLeft = 15;
			this.targetPos.y = this.position.y
		}
		if(!sprite.isDying) {//Don't allow enemies to shoot when they are in the process of dying
			const firingChance = Math.floor(100 * Math.random());
		
			if(Math.abs(this.position.y - this.targetPos.y) > this.oldDistance){
				console.warn("going wrong way")
			}
			this.oldDistance = Math.abs(this.position.y - this.targetPos.y)
			if(Math.abs(this.position.y - this.targetPos.y) < 5){
				this.targetPos.y = Math.floor(400 * Math.random() + 200);

				if(this.targetPos.y > this.position.y){
					this.vel.y = 20
				} else {
					this.vel.y = -20
				}
			}

			if(this.bulletsLeft > 0 && this.timeSinceLastFire > 10){
				//fireBullet
				xVel =  -(Math.floor(Math.random() * 360)) + 1;
				yVel = Math.cos(xVel * Math.PI/9 ) * Math.sin(xVel* Math.PI/9) * 100;
				newBullet = new EnemyBullet(EntityType.EnemyBullet5, {x: this.position.x - 10, y: this.collisionBody.center.y}, {x: xVel, y:yVel});
				scene.addEntity(newBullet, false);
				bossLaserShot.play();
				this.bulletsLeft -= 1;
				this.timeSinceLastFire = 0
			}

			if(this.bulletsLeft == 0 && firingChance < difficulty || this.timeSinceLastFire > 3000) {
				let yVel;
				this.bulletsLeft = 10;
				yVel = -50;
				
				let xVel = this.vel.x;
				
				const newBullet = new EnemyBullet(EntityType.EnemyBullet6, {x: this.position.x - 10, y: this.collisionBody.center.y}, {x: xVel, y:yVel});
				laserShot.play();
				scene.addEntity(newBullet, false);
			}
			
			if(this.ticksInState > 600) {
				this.changeState(state.pewpew)
				return;
			}
			
			if((this.timeSinceLastDip > 400) && (this.hitPoints < MAX_HITPOINTS / 2)) {
				this.changeState(state.dip)
			}
		}

	}
	state.pewpew = function(){
		if(this.ticksInState == 1){
			this.bulletsLeft = MINI_MINI_BULLETS;
			this.vel.x = 0
			this.vel.y = 0;
		}

		if(this.bulletsLeft > 0 && this.timeSinceLastFire > 1000){
			this.bulletsLeft -= 1;
			const thisEnemy = new MiniMiniBoss1({x:this.position.x + 78, y:this.position.y + 78}, (11 - this.bulletsLeft));

			thisEnemy.respawn(this.worldPos);

			scene.addEntity(thisEnemy, false);
			this.timeSinceLastFire = 0
		}

		if(this.bulletsLeft == 0) {
			this.changeState(state.phase1)
			//this.changeState(state.dip)
		}
	}

	state.dip = function(){
		if(this.ticksInState == 1){
			this.vel.x = -50

		}
		this.timeSinceLastDip = 0;
		if(this.vel.x < 450){
			this.vel.x -= 10
		}
		if(this.vel.y > 1){
			this.vel.y -= 3;
		} else {
			this.vel.y += 3;
		}
		if(this.position.x < -600){
			this.vel.y = 0
			this.vel.x = 0
			if(this.ticksInState > 300){
				this.position.x = 1000;
				this.changeState(state.entrance)
			}
		}
	}

	this.draw = function() {
		if(!this.isVisible) {return;}
		if(this.worldPos < spawnPos) {return;}
		if((this.position.x < GameField.x - this.size.width) || 
		   (this.position.x > GameField.right) ||
		   (this.position.y < GameField.y - this.size.height) ||
		   (this.position.y > GameField.bottom)) {
			   return;
		}
		
		sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
		if(!sprite.isDying) {
			this.collisionBody.draw();
		} else {
			this.drawExplosions();
		}
	};
	
	this.updateExplosions = function(deltaTime) {
		if(explosions.length < EXPLOSION_COUNT) {
			if((100 * Math.random()) < 25) {//1 in 20 chance the next explosion should spawn
				const newExplosion = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
                newExplosion.deltaXPos = (0.5 * this.size.width) - (this.size.width * Math.random());
                newExplosion.deltaYPos = (0.5 * this.size.height) - (this.size.height * Math.random());
				
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
		
		if (this.hitPoints <= 0) {
			if(sprite.isDying) {return;}//already dying, no reason to continue
			
			scene.displayScore(this);

			sprite = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
			
			this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
			
			this.position.x = this.collisionBody.center.x - this.size.width / 2;
			this.position.y = this.collisionBody.center.y - this.size.height / 2;

			sprite.isDying = true;
			sprite.wasBorn = true;
			scene.removeCollisions(this);

			enemyLargeExplosion.play();
		} else {
			shotDamaged.play();
		}
	};
}
