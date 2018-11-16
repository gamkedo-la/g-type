//ColliderPath
function FreeCollider(score = 0, position = {x:0, y:0}, spawnPos = 0, path = null) {
	this.type = EntityType.FreeCollider;
	this.group = null;
    this.worldPos = spawnPos;
	this.score = score;
	this.collisionBody = null;
	this.isVisible = false;
	
	this.position = {x:position.x, y:position.y};
	this.size = {width:0, height:0};
	
	let pathPoints = [];
	
	this.initialize = function() {
		if(path) {
			pathPoints = path.polygon.slice(0);
			
			let minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = -Number.MAX_VALUE/2, maxY = -Number.MAX_VALUE/2;
			pathPoints.forEach((point) => {
//	            point.x += GameField.x + GameField.width - 50;
//	            point.y += GameField.y + path.y;
				point.x += this.position.x;
				point.y += this.position.y;
	            
	            if(point.x < minX) {minX = point.x};
	            if(point.x > maxX) {maxX = point.x};
	            if(point.y < minY) {minY = point.y};
	            if(point.y > maxY) {maxY = point.y};
	        });
	        
	        console.log("Position: (" + this.position.x + ", " + this.position.y + "), Min: (" + minX + ", " + minY + "), Max: (" + maxX + ", " + maxY + ")");
			
//			this.position.x = minX;
//			this.position.y = minY;
			this.size.width = maxX - minX;
			this.size.height = maxY - minY;
			
			this.collisionBody = new Collider(ColliderType.Polygon, {points: pathPoints, position:{x:this.position.x, y:this.position.y}});
	    }
	};
	
	this.initialize();
    
    this.update = function(deltaTime, worldPos) {
		if(worldPos < spawnPos) {return;}//don't update if the world hasn't scrolled far enough to spawn
		
		this.position.x -= (worldPos - this.worldPos);
        
        if(this.position.x < -this.size.width) {scene.removeEntity(this, false);}
        
        this.worldPos = worldPos;
        
        this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
	};
	
	this.draw = function() {
		if(this.worldPos < spawnPos) {return;}
		this.collisionBody.draw();
		return;//FreeColliders are invisible
	};
	
	this.didCollideWith = function(otherEntity) {
//		console.log("Collided with it");
		if(otherEntity.type === EntityType.Player) {//FreeColliders only interact with the player
//			console.log("Now the player collided with it");
			console.log("Draw Score At: (" + (this.position.x + this.size.width / 2) + ", " + (this.position.y + this.size.height / 2) + ")");
			scene.displayScore(this, {x:(this.position.x + (this.size.width / 2)), y:(this.position.y + (this.size.height / 2))});
			capsulePickup.play();
			scene.removeEntity(this, false);
		}
	};
	
	this.respawn = function(worldPos) {
    	if(worldPos > spawnPos) {
            this.worldPos = worldPos;

            this.initialize();
		}
	};
}