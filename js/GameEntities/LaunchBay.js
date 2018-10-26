//LaunchBay
function LaunchBay(position = {x:0, y:0}, spawnPos) {
    this.type = EntityType.LaunchBay;
    this.group = null;
    const children = [];
    this.score = 500;
    this.worldPos = spawnPos;
    
    this.hitPoints = 40;
    
    const SPRITE_SCALE = 2;
    this.position = {x:position.x, y:position.y};
    let unusedTime = 0;
    let startSpawn = -2048;
    const DELTA_SPAWN = 768;
    this.isVisible = true;
    
    let sprite = new AnimatedSprite(launchBaySheet, 30, 75, 45, false, true, {min:0, max:0}, 0, {min:0, max:29}, 128, {min:29, max:29}, 0);
    this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
    
    const EXPLOSION_COUNT = 3;
    const explosions = [];
    
    const colliderPath = [{x: this.position.x, y: this.position.y + (SPRITE_SCALE * 3)},
                          {x: this.position.x + this.size.width, y: this.position.y + (SPRITE_SCALE * 3)},
                          {x: this.position.x + this.size.width, y: this.position.y + this.size.height},
                          {x: this.position.x, y: this.position.y + this.size.height}];
    
    this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
    
    let didCollide = false;
    
    this.update = function(deltaTime, worldPos) {
        if((this.group != null) && (children.length === 0)) {
            for(let i = 0; i < this.group.enemies.length; i++) {
                if(this.group.enemies[i] != this) {
                    children.push(this.group.enemies[i]);
                }
            }
        }
        
        if(!this.isVisible) {return;}
        if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn
        
        if(sprite.getDidDie()) {
            scene.removeEntity(this, false);
            sprite.isDying = false;
            return;
        }
        
        this.position.x -= (worldPos - this.worldPos);
        
        if(this.position.x < -this.size.width) {scene.removeEntity(this, false);}
        
        if(startSpawn <= (children.length * DELTA_SPAWN)) {
            startSpawn += deltaTime;
            
            if(startSpawn > 0) {
                const anIndex = Math.floor(startSpawn / DELTA_SPAWN);
                if(anIndex < children.length) {
                    children[anIndex].spawn(-position.x + this.position.x + this.size.width);
                }
            }
        }
        
        this.worldPos = worldPos;
        
        if(!sprite.isDying) {
            sprite.update(deltaTime);
            this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
        } else {
            sprite.update(deltaTime / 2);
            this.updateExplosions(deltaTime);
        }
    };
    
    this.draw = function() {
        if(this.position.x > GameField.right) {
            return;
        } else if(this.position.x < GameField.x - this.size.width) {
            scene.removeEntity(this, false);
            return;
        }
        
        sprite.drawAt(this.position, this.size);
        sprite.drawAt(this.position, this.size);
        if(!sprite.isDying) {
            this.collisionBody.draw();
        } else {
            this.drawExplosions();
        }
    };
    
    this.respawn = function(worldPos) {
        if(worldPos > spawnPos) {
            this.worldPos = worldPos;
            this.position.x -= (worldPos - spawnPos);
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
            
            enemyMediumExplosion.play();
        }// TODO else -- add SFX to show a non-lethal hit
    };
    
    this.updateExplosions = function(deltaTime) {
        if(explosions.length < EXPLOSION_COUNT) {
            if((100 * Math.random()) < 25) {//1 in 20 chance the next explosion should spawn
                const newExplosion = new AnimatedSprite(enemyExplosionSheet2, 11, 96, 96, false, true, {min:0, max:0}, 0, {min:0, max:0}, 0, {min:0, max:18}, 64);
                newExplosion.deltaXPos = 0.5 * this.size.width - (this.size.width * Math.random());
                newExplosion.deltaYPos = 0.5 * this.size.height - (this.size.height * Math.random());
                
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
            explosions[i].drawAt({x:(this.position.x + explosions[i].deltaXPos), y: (this.position.y + explosions[i].deltaYPos)}, this.size);
        }
    };
}
