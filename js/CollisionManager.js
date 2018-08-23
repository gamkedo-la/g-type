//Collision Manager
function CollisionManager(player) {
	let entities = new Set();
	this.player = player;
	this.playerBullets = [];
	
	this.setPlayer = function(newPlayer) {
		this.player = newPlayer;
		return true;
	}
	
	this.addPlayerBullet = function(newBullet) {
		this.playerBullets.push(newBullet);
		return true;
	}
	
	this.removePlayerBullet = function(bulletToRemove) {
		const indexToRemove = this.playerBullets.indexOf(bulletToRemove);
		const value = this.playerBullets.splice(indexToRemove, 1);
		
		if((value == null) || (value == undefined)) {
			return false;
		} else {
			return true;
		}
	}
		
	this.addEntity = function(newEntity) {
		const beforeLength = entities.size;
		entities.add(newEntity);
		
		return (!(beforeLength == entities.size));
	}
	
	this.removeEntity = function(entityToRemove) {
		if(entities.has(entityToRemove)) {
			entities.delete(entityToRemove);
			
			return true;
		}
		
		return false;
	}
	
	this.doCollisionChecks = function() {
		const collisions = [];
		
		for(let entity of entities) {
			if((entity.position.x > canvas.width) || (entity.position.x < 0)) {continue;}//entity is not on screen => bail out early
			
			for(let i = 0; i < this.playerBullets.length; i++) {
				if(entity.type == EntityType.Capsule1) {continue;}//can't shoot the power ups
				if(!this.playerBullets[i].isActive) {continue;}//don't check collisions on inactive bullets
				
				const aBulletBody = this.playerBullets[i].collisionBody;
				if(withinSquareRadii(entity.collisionBody, aBulletBody)) {
					//if both objects are circles, the above check is a valid collision
					if((entity.collisionBody.type == ColliderType.Circle) && 
					   (this.playerBullets[i].collisionBody.type == ColliderType.Circle)) {
						entity.didCollideWith(this.playerBullets[i]);
						this.playerBullets[i].didCollideWith(entity);
						collisions.push({blue:this.playerBullets[i], red:entity});
						continue;
					}

					if(checkCollisionBetween(entity.collisionBody, aBulletBody)) {
						entity.didCollideWith(this.playerBullets[i]);
						this.playerBullets[i].didCollideWith(entity);
						collisions.push({blue:this.playerBullets[i], red:entity});
					}
				}
			}

			if(withinSquareRadii(entity.collisionBody, this.player.collisionBody)) {
				//if both objects are circles, the above check is a valid collision
				if((entity.collisionBody.type == ColliderType.Circle) && 
				   (this.player.collisionBody.type == ColliderType.Circle)) {
					entity.didCollideWith(this.player);
					this.player.didCollideWith(entity);
					collisions.push({blue:this.player, red:entity});
					continue;
				}
				
				if(checkCollisionBetween(entity.collisionBody, this.player.collisionBody)) {
					entity.didCollideWith(this.player);
					this.player.didCollideWith(entity);
					collisions.push({blue:this.player, red:entity});
				}
			}			
		}
		
		return collisions;
	}
	
	const withinSquareRadii = function(body1, body2) {
		const squareDist = (body1.center.x - body2.center.x) * (body1.center.x - body2.center.x) +
						   (body1.center.y - body2.center.y) * (body1.center.y - body2.center.y);
		const squareRadius = (body1.radius + body2.radius) * (body1.radius + body2.radius);
		
		return (squareDist <= squareRadius);
	}
	
	const checkCollisionBetween = function(body1, body2) {
		if(body1.type == ColliderType.Polygon) {
			if(body2.type == ColliderType.Polygon) {
				return polygonVPolygon(body1, body2);
			} else if(body2.type == ColliderType.Circle) {
				return polygonVCircle(body1, body2);
			}
		} else if(body1.type == ColliderType.Circle) {
			if(body2.type == ColliderType.Polygon) {
				return polygonVCircle(body2, body1);//reverse the order so polygon passed as first parameter
			}/* else if(body2.type == ColliderType.Circle) {
				return circleVCircle(body1, body2);
			}*/ //circle vs circle is handled by 'withinSquareRadii()'
		}
	}

	const polygonVPolygon = function(body1, body2) {
		const body2Points = body2.points;
		for(let i = 0; i < body2Points.length; i++) {
			if(pointInPolygon(body2Points[i], body1.points)) {
				//at least 1 point of polygon2 is inside polygon1 => collision occurred
				
				return true;
			}
		}
		
		const body1Points = body1.points;
		for(let i = 0; i < body1Points.length; i++) {
			if(pointInPolygon(body1Points[i], body2.points)) {
				//at least 1 point of polygon2 is inside polygon1 => collision occurred
				
				return true;
			}
		}
		
		return false;
	}
	
	const pointInPolygon = function(target, polygon) {
		let temp1;
		let temp2;
	
		// How many times the ray crosses a line-segment 
		var crossings = 0;
	
		// Iterate through each line 
		for (let i = 0; i < polygon.length; i++) {
			if(polygon[i].x < polygon[(i + 1) % polygon.length].x) {
				temp1 = polygon[i].x;
				temp2 = polygon[(i + 1) % polygon.length].x;
			} else {
				temp1 = polygon[(i + 1) % polygon.length].x;
				temp2 = polygon[i].x;
			}
	
			//First check if the ray is possible to cross the line
			if (target.x > temp1 && target.x <= temp2 && (target.y < polygon[i].y || target.y <= polygon[(i + 1) % polygon.length].y)) {
				var eps = 0.000001;
	
				//Calculate the equation of the line
				var dx = polygon[(i + 1) % polygon.length].x - polygon[i].x;
				var dy = polygon[(i + 1) % polygon.length].y - polygon[i].y;
				var k;
	
				if (Math.abs(dx) < eps) {
					k = Number.MAX_VALUE;
				} else {
					k = dy / dx;
				}
	
				var m = polygon[i].y - k * polygon[i].x;
				//Find if the ray crosses the line
				var y2 = k * target.x + m;
				if (target.y <= y2) {
					crossings++;
				}
			}
		}
	
		if (crossings % 2 == 1) {
			return true;
		} else {
			return false;
		}
	}

	const polygonVCircle = function(polygon, circle) {
		for(let i = 0; i < polygon.points.length; i++) {//loop through each side of the polygon to check for a circle-line collision on each
			const start = polygon.points[i];//start point of this edge
			let end;
			if(i < polygon.points.length - 1) {//end point of this edge, loop back to beginning 
				end = polygon.points[i + 1];
			} else {
				end = polygon.points[0];
			}
			
			const side = {x:end.x - start.x, y:end.y - start.y};
			const circleToStart = {x:circle.center.x - start.x, y:circle.center.y - start.y};//line from circle center to start point of polygon side
			const magnitudeOfSide = magnitudeOfVec(side);
			
			//how much of the circle-start vector is in line with this polygon side?
			const scalarProjection = dotProduct(circleToStart, side) / (magnitudeOfSide * magnitudeOfSide);
			
			//if between 0 and 1, the circle center is between this side's start and end points
			//add/subtract circleRadius/magnitude of side to account for collisions on the end points of the polygon side
			if((scalarProjection >= -(circle.radius / magnitudeOfSide)) && (scalarProjection <= (1 + circle.radius / magnitudeOfSide))) {
				const vectorProjection = {x:scalarProjection * side.x, y:scalarProjection * side.y};
				
				//Rejection vector is that portion of circle-start vector which is perpendicular to the polygon side
				const vectorRejection = {x:circleToStart.x - vectorProjection.x, y:circleToStart.y - vectorProjection.y};
				const magnitudeRejection = magnitudeOfVec(vectorRejection);
				
				//if the magnitude of the rejection vector is less than the circle radius, there is a collision
				if(magnitudeRejection <= circle.radius) {
					return true;
				}
			}
		}
		
		return false;
	}
}

function magnitudeOfVec(vector) {
	const magnitude = Math.sqrt(((vector.x * vector.x) + (vector.y * vector.y)));
	return magnitude;
}

function dotProduct(vec1, vec2) {
	const dot = (vec1.x * vec2.x) + (vec1.y * vec2.y);
	return dot;
}