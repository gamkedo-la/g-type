//Collision Manager
function CollisionManager(player) {
	let entities = new Set();
	let enemyBullets = new Set();
	let terrain = new Set();
	this.player = player;
	this.playerBullets = [];
	this.playerForceUnit = null;
	let collidableText = new Set();

	this.setPlayer = function(newPlayer) {
		this.player = newPlayer;
		return true;
	};

	this.addPlayerBullet = function(newBullet) {
		this.playerBullets.push(newBullet);
		return true;
	};

	this.removePlayerBullet = function(bulletToRemove) {
		const indexToRemove = this.playerBullets.indexOf(bulletToRemove);
		const value = this.playerBullets.splice(indexToRemove, 1);

		return ((value !== null) && (value !== undefined));
	};

	this.addForceUnit = function(newPlayerForceUnit) {
		this.playerForceUnit = newPlayerForceUnit;
		return true;
	};


	this.addEntity = function(newEntity) {
		if((newEntity.type === EntityType.EnemyBullet1) || (newEntity.type === EntityType.EnemyBullet2)) {
			addEnemyBullet(newEntity);
		} else if((newEntity.type === EntityType.RhombusBoulder) ||
				  (newEntity.type === EntityType.Rock01) ||
				  (newEntity.type === EntityType.Rock02) ||
				  (newEntity.type === EntityType.Rock03) ||
				  (newEntity.type === EntityType.Rock04)) {//Need to check for all other terrain types here
			addTerrain(newEntity);
		} else if (newEntity.type === EntityType.PlayerForceUnit) {
			this.addForceUnit(newEntity);
		} else if (newEntity.type === EntityType.CollidableText) {
			addCollidableText(newEntity);
		}

		const beforeLength = entities.size;
		entities.add(newEntity);

		return (!(beforeLength === entities.size));
	};

	const addEnemyBullet = function(newEnemyBullet) {
		const beforeLength = enemyBullets.size;
		enemyBullets.add(newEnemyBullet);

		return (!(beforeLength === enemyBullets.size));
	};

	const addTerrain = function(newTerrain) {
		const beforeLength = terrain.size;
		terrain.add(newTerrain);

		return (!(beforeLength === terrain.size));
	};
	
	const addCollidableText = function(newText) {
		const beforeLength = collidableText.size;
		collidableText.add(newText);

		return (!(beforeLength === collidableText.size));
	};

	this.removeEntity = function(entityToRemove) {
		if((entityToRemove.type === EntityType.EnemyBullet1) || (entityToRemove.type === EntityType.EnemyBullet2)) {
			removeEnemyBullet(entityToRemove);
		} else if(entityToRemove.type === EntityType.RhombusBoulder) {//Need to check for all other terrain types here
			removeTerrain(entityToRemove);
		} else if(entityToRemove.type === EntityType.PlayerForceUnit) {
			this.playerForceUnit = null;
		} else if(entityToRemove.type === EntityType.CollidableText) {
			removeCollidableText(entityToRemove);
		}

		if(entities.has(entityToRemove)) {
			entities.delete(entityToRemove);

			return true;
		}

		return false;
	};

	const removeEnemyBullet = function(enemyBulletToRemove) {
		if(enemyBullets.has(enemyBulletToRemove)) {
			enemyBullets.delete(enemyBulletToRemove);

			return true;
		}

		return false;
	};

	const removeTerrain = function(terrainToRemove) {
		if(terrain.has(terrainToRemove)) {
			terrain.delete(terrainToRemove);

			return true;
		}

		return false;
	};
	
	const removeCollidableText = function(textToRemove) {
		if(collidableText.has(textToRemove)) {
			collidableText.delete(textToRemove);

			return true;
		}

		return false;
	};

	this.clearWorldAndBullets = function() {
		entities.clear();
		enemyBullets.clear();
		terrain.clear();
	};

	this.doCollisionChecks = function() {
		const collisions = [];

		for(let entity of entities) {
			if((entity.position.x > GameField.right) || 
			   (entity.position.x < GameField.x - entity.size.width)) {continue;}//entity is not on screen => bail out early

			//Do collision between player bullets and all other entites (except the player)
			for(let i = 0; i < this.playerBullets.length; i++) {
				if(entity.type === EntityType.Capsule1) {continue;}//can't shoot the power ups
				if(entity.type === EntityType.PlayerForceUnit) {continue;}//can't shoot the force unit
				if(!this.playerBullets[i].isActive) {continue;}//don't check collisions on inactive bullets

				const aBulletBody = this.playerBullets[i].collisionBody;
				if(withinSquareRadii(entity.collisionBody, aBulletBody)) {
					//if both objects are circles, the above check is a valid collision
					if((entity.collisionBody.type === ColliderType.Circle) &&
					   (this.playerBullets[i].collisionBody.type === ColliderType.Circle)) {
						entity.didCollideWith(this.playerBullets[i]);
						this.playerBullets[i].didCollideWith(entity);
						collisions.push({blue:this.playerBullets[i], red:entity});
						continue;
					}

					if(checkCollisionBetween(entity.collisionBody, aBulletBody)) {
						console.log("EntityType: " + entity.type);
						entity.didCollideWith(this.playerBullets[i]);
						this.playerBullets[i].didCollideWith(entity);
						collisions.push({blue:this.playerBullets[i], red:entity});
					}
				}
			}

			// Do force unit collision check against other entities (but, of course, not the player)
			if (this.playerForceUnit !== null) {
				const forceUnitBody = this.playerForceUnit.collisionBody;
				if(withinSquareRadii(entity.collisionBody, forceUnitBody)) {
					//if both objects are circles, the above check is a valid collision
					// TODO clean up this code (e.g., there are redundant checks to make sure the force unit doesn't collide with a powerup or player shot -- perhaps smarten up the conditional test?
					if((entity.type === EntityType.Capsule1) ||	//can't hit the capsules
					   (entity.type === EntityType.PlayerShot) ||
					   (entity.type === EntityType.PlayerDouble) || 
					   (entity.type === EntityType.PlayerLaser) || 
					   (entity.yype === EntityType.PlayerTriple)) {
						   continue;//ignore collisions with player shots
					}	

					if((entity.collisionBody.type === ColliderType.Circle) &&
					   (this.playerForceUnit.collisionBody.type === ColliderType.Circle)) {
						entity.didCollideWith(this.playerForceUnit);
						this.playerForceUnit.didCollideWith(entity);
						collisions.push({blue:this.playerForceUnit, red:entity});
						continue;
					}

					if(checkCollisionBetween(entity.collisionBody, forceUnitBody)) {
						if((entity.type === EntityType.Capsule1) ||	//can't hit the capsules
					   (entity.type === EntityType.PlayerShot) ||
					   (entity.type === EntityType.PlayerDouble) || 
					   (entity.type === EntityType.PlayerLaser) || 
					   (entity.yype === EntityType.PlayerTriple)) {
						   continue;//ignore collisions with player shots
					}
					
						entity.didCollideWith(this.playerForceUnit);
						this.playerForceUnit.didCollideWith(entity);
						collisions.push({blue:this.playerForceUnit, red:entity});
					}
				}
			}

			//Do collision between player and all other entities (except player bullets)
			if(withinSquareRadii(entity.collisionBody, this.player.collisionBody)) {
				//if both objects are circles, the above check is a valid collision
				if((entity.collisionBody.type === ColliderType.Circle) &&
				   (this.player.collisionBody.type === ColliderType.Circle)) {
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

		//Do collision between player and terrain

		//Do collision between player and enemy bullets

		//Do collision between enemy bullets and terrain
		for(let terr of terrain) {
			for(let bullet of enemyBullets) {
				if(withinSquareRadii(terr.collisionBody, bullet.collisionBody)) {
					if((terr.collisionBody.type === ColliderType.Circle) &&
					   (bullet.collisionBody.type === ColliderType.Circle)) {
					   //if both objects are circles, the above check is a valid collision
					   terr.didCollideWith(bullet);
					   bullet.didCollideWith(terr);
					   continue;
					}

					if(checkCollisionBetween(terr.collisionBody, bullet.collisionBody)) {
						terr.didCollideWith(bullet);
						bullet.didCollideWith(terr);
					}
				}
			}
		}
		
		//Do collision between player bullets and collidable text
		for(let txt of collidableText) {
			for(let i = 0; i < this.playerBullets.length; i++) {
				const thisBullet = this.playerBullets[i];
				if(withinSquareRadii(txt.collisionBody, thisBullet.collisionBody)) {
					//collidable text is all polygon collision bodies (i.e. no circles)
					if(checkCollisionBetween(txt.collisionBody, thisBullet.collisionBody)) {
						txt.didCollideWith(thisBullet);
						thisBullet.didCollideWith(txt);
					}
				}
			}
		}

		return collisions;
	};

	const withinSquareRadii = function(body1, body2) {
		const squareDist = (body1.center.x - body2.center.x) * (body1.center.x - body2.center.x) +
						   (body1.center.y - body2.center.y) * (body1.center.y - body2.center.y);
		const squareRadius = (body1.radius + body2.radius) * (body1.radius + body2.radius);

		return (squareDist <= squareRadius);
	};

	const checkCollisionBetween = function(body1, body2) {
		if(body1.type === ColliderType.Polygon) {
			if(body2.type === ColliderType.Polygon) {
				return polygonVPolygon(body1, body2);
			} else if(body2.type === ColliderType.Circle) {
				return polygonVCircle(body1, body2);
			}
		} else if(body1.type === ColliderType.Circle) {
			if(body2.type === ColliderType.Polygon) {
				return polygonVCircle(body2, body1);//reverse the order so polygon passed as first parameter
			}/* else if(body2.type == ColliderType.Circle) {
				return circleVCircle(body1, body2);
			}*/ //circle vs circle is handled by 'withinSquareRadii()'
		}
	};

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
	};

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

		if (crossings % 2 === 1) {
			return true;
		} else {
			return false;
		}
	};

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
	return Math.sqrt(((vector.x * vector.x) + (vector.y * vector.y)));
}

function dotProduct(vec1, vec2) {
	return (vec1.x * vec2.x) + (vec1.y * vec2.y);
}
