//Level2 Boss
function Level2Boss(position = {x:0, y:0}, spawnPos = 0) {
	this.type = EntityType.Level2Boss;
    this.group = null;
    const children = [];//An array of arrays of children
    let childrenLoaded = false;
    this.score = 5000;
    this.worldPos = spawnPos;
    let previousBackgroundMusic = null;
    
    this.hitPoints = 40;//Level2Boss can't be killed
    
    const SPRITE_SCALE = 4;
    this.position = {x:position.x, y:position.y};
    let unusedTime = 0;
    let startSpawn = -128;
    const DELTA_SPAWN = 768;
    this.isVisible = true;
    
    let sprite = new AnimatedSprite(launchBaySheet, 30, 75, 45, false, true, {min:0, max:0}, 0, {min:0, max:29}, 128, {min:29, max:29}, 0);
    this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
        
    const colliderPath = [{x: this.position.x, y: this.position.y + (SPRITE_SCALE * 3)},
                          {x: this.position.x + this.size.width, y: this.position.y + (SPRITE_SCALE * 3)},
                          {x: this.position.x + this.size.width, y: this.position.y + this.size.height},
                          {x: this.position.x, y: this.position.y + this.size.height}];
    
    this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
    
    this.update = function(deltaTime, worldPos) {
        if((this.group != null) && (!childrenLoaded)) {
	        childrenLoaded = true;
            for(let i = 0; i < this.group.enemies.length; i++) {
                if(this.group.enemies[i] != this) {
	                this.group.enemies[i].updatePathOffset(100);//magic number based on size of Level2Boss
                    children.push(this.group.enemies[i]);
                }
            }
        }
        
        if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn
        
        if(sprite.getDidDie()) {
            scene.removeEntity(this, false);
            sprite.isDying = false;
            return;
        }
        
        this.position.x -= (worldPos - this.worldPos);
        
        if((this.worldPos > spawnPos + 300) && (!sprite.isDying)) {
			if(previousBackgroundMusic === null) {
				scene.worldShouldPause(true);
				previousBackgroundMusic = currentBackgroundMusic.getCurrentTrack();
				currentBackgroundMusic.setCurrentTrack(AudioTracks.Boss1);

		        currentBackgroundMusic.play();

			} else if((this.group.enemies.length === 1) && (previousBackgroundMusic != null)) {
	           scene.levelComplete();
			}
		} 
        
        if(this.position.x < -this.size.width) {scene.removeEntity(this, false);}
        
        this.position.x -= (worldPos - this.worldPos);
        
        this.worldPos = worldPos;
        
        if((!sprite.isDying) && (previousBackgroundMusic != null)) {
            startSpawn += deltaTime;
            
            if(startSpawn > 0) {
                if(this.group.enemies.length === 1) {return;}
                if(children.length === (this.group.enemies.length - 1)) {
	                children[0].spawn(-position.x + this.position.x + this.size.width);
	                const isThisAThing = children.splice(0, 1);
                } 
            }
            
            sprite.update(deltaTime);
            this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
        }
    };
    
    this.draw = function() {
        if(this.position.x > GameField.right) {
            return;
        }
        
        if(!this.isVisible) {return;}
        sprite.drawAt(this.position, this.size);
        if(!sprite.isDying) {
            this.collisionBody.draw();
        }
    };
    
    this.respawn = function(worldPos) {
        if(worldPos > spawnPos) {
            this.worldPos = worldPos;
            this.position.x -= (worldPos - spawnPos);
        }
    };
    
    this.didCollideWith = function(otherEntity) {
	    return;//Level2Boss can't be killed
    };
}