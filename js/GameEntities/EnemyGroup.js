const EnemyType = {
	Flying1:"flying1",
}

const MovementPattern = {
	None:"none",
	Sine:"sine",
}

//Enemy Grouping
function EnemyGroup() {
	this.enemies = [];
	this.hasCapsule = true;
	
	this.add = function(newEnemy, worldPos) {
		this.enemies.push(newEnemy);
		
		newEnemy.group = this;
		
		return newEnemy;
	}
	
	this.remove = function(enemyToRemove, worldPos) {
		const indexToRemove = this.enemies.indexOf(enemyToRemove);
		this.enemies.splice(indexToRemove, 1);
		
		if((this.enemies.length == 0) && (this.hasCapsule)) {
			this.hasCapsule = false;
			
			const newCapsule = new Capsule({x:enemyToRemove.position.x, y:enemyToRemove.position.y}, worldPos);
			newCapsule.position.x += ((enemyToRemove.size.width / 2) - (newCapsule.size.width / 2));
			newCapsule.position.y += ((enemyToRemove.size.height / 2) - (newCapsule.size.height / 2));
			scene.addEntity(newCapsule, false);
		}
	}	
}

const PathType = {
	None:"none",
	Sine:"sine",
	Points:"points"
}

function EnemyPath(type = PathType.None, start = {x:0, y:0}, speed = 0, points = [], timeOffset = 0) {
	let elapsedTime = 0;
	let lastPointIndex = -1;
	let lastPosition = {x:start.x, y:start.y};
	
	this.nextPoint = function(deltaTime) {
		elapsedTime += deltaTime;
		if(elapsedTime >= timeOffset) {
			if(type == PathType.None) {
				return {};
			} else if(type == PathType.Sine) {
				return {x:speed * deltaTime / 1000, 
					    y:0.0025 * canvas.height * Math.sin((elapsedTime - timeOffset) / 500)};
			} else if(type == PathType.Points) {
				if(points.length == 0) {return lastPosition;}
				
				if(lastPointIndex < 0) {//between start and points[0]
					const distThisCall = speed * deltaTime;
					const deltaX = points[0].x - lastPosition.x;
					const deltaY = points[0].y - lastPosition.y;
					const distToFirstPoint = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
					if(distThisCall < distToFirstPoint) {
						//atan2 to find the angle and then add that to lastPosition to get the new lastPosition
					} else {
						//set lastPosition to points[0], set lastPointIndex = 0, return recursive call to this.nextPoint
					}
				} else {
					
				}
			}
		}
	}
}