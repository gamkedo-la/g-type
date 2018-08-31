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
				if(points.length <= 1) {return lastPosition;}//paths must have at least two points
				
				if(lastPointIndex < 0) {//between start and points[0]
					const distThisCall = speed * deltaTime;
					const deltaX = points[0].x - lastPosition.x;
					const deltaY = points[0].y - lastPosition.y;
					const distToFirstPoint = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
					
					if(distThisCall < distToFirstPoint) {//not going to make it to points[0]
						const percentToFirstPoint = distThisCall / distToFirstPoint;
						const newX = lastPosition.x + percentToFirstPoint * deltaX;
						const newY = lastPosition.y + percentToFirstPoint * deltaY;
						lastPosition = {x:newX, y:newY};
						return lastPosition;
					} else {//made it to points[0] and may have some leftover time to travel beyond it
						const remainingDistance = distThisCall - distToFirstPoint;
						const remainingTime = remainingDistance / speed;
						lastPosition = {x:points[0].x, y:points[0].y};
						lastPointIndex = 0;
						if(remainingDistance < 1) {return lastPosition;}//no excess time (i.e. landed right on points[0])
						return this.nextPoint(remainingTime);
					}
				} else if((lastPointIndex + 1) < points.length) {//in the middle of the path
					const distThisCall = speed * deltaTime;
					const deltaX = points[lastPointIndex + 1].x - lastPosition.x;
					const deltaY = points[lastPointIndex + 1].y - lastPosition.y;
					const distToNextPoint = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
					
					if(distThisCall < distToNextPoint) {//not going to make it to the next leg of the path
						const percentToNextPoint = distThisCall / distToNextPoint;
						const newX = lastPosition.x + percentToNextPoint * deltaX;
						const newY = lastPosition.y + percentToNextPoint * deltaY;
						lastPosition = {x: newX, y: newY};
						return lastPosition;
					} else {//made it to the next point and may have some leftover time to travel beyond it
						const remainingDistance = distThisCall - distToFirstPoint;
						const remainingTime = remainingDistance / speed;
						lastPointIndex++;
						lastPosition = {x:points[lastPointIndex].x, y:points[lastPointIndex].y};
						if(remainingDistance < 1) {return lastPosition;}//no excess time (i.e. landed right on points[0])
						return this.nextPoint(remainingTime);
					}
				} else {//already past the final leg of the path
					const distThisCall = speed * deltaTime;
					const finalDeltaX = points[points.length - 1].x - points[points.length - 2].x;
					const finalDeltaY = points[points.length - 1].y - points[points.length - 2].y;
					const finalDirection = Math.atan2(finalDeltaX, finalDeltaY);
					const newX = lastPosition.x + distThisCall * Math.cos(finalDirection);
					const newY = lastPosition.y + distThisCall * Math.sin(finalDirection);
					lastPosition = {x:newX, y:newY};
					return lastPosition;
				}
			}
		}
	}
}