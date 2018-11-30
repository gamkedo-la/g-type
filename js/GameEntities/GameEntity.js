const EntityType = {
	//Terrain & World
	RhombusBoulder:"rhombusBoulder",
	BrokenBoulder:"brokenBoulder",
	BrokenBoulderFlipped:"brokenBoulderFlipped",
	Rock01:"rock01",
	Rock02:"rock02",
	Rock03:"rock03",
	Rock04:"rock04",
	Volcano:"volcano",
	FlatRockPile:"flatRockPile",
	Lvl1BotRock1:"lvl1BotRock1",
	Lvl1TopRock1:"lvl1TopRock1",
	Lvl1HorzRock1:"lvl1HorzRock1",
	Lvl1PyramidRocks:"lvl1PyramidRocks",
	Lvl1BotGate1Rocks:"lvl1BotGate1Rocks",
	Lvl1TopGate1Rocks:"lvl1TopGate1Rocks",
	Lvl1BotGate2Rocks:"lvl1BotGate2Rocks",
	Lvl1TopGate3Rocks:"lvl1TopGate3Rocks",
	Lvl1BotGate3Rocks:"lvl1BotGate3Rocks",
	Lvl1BotGate4Rocks:"lvl1BotGate4Rocks",
	Lvl3AncientBoard:"lvl3AncientBoard",
	Lvl3Square:"lvl3Square",
	Lvl3Square2:"lvl3Square2",
	Lvl3Cast:"lvl3Cast",
	Lvl3Plus:"lvl3Plus",
	BigDestRock:"bigDestRock",
	SmDestRock1:"smDestRock1",
	SmDestRock2:"smDestRock2",
	SmDestRock3:"smDestRock3",
    Platform1:"platform1",
    WarpObstacle:"warpObstacle",
	Bubble:"bubble",
	
	//Blocks (terrain)
	Board:"board",
	Cast:"cast",
	Gate:"gate",
	Left:"left",
	LeftCorner:"leftCorner",
	LeftStand:"leftStand",
	LongStand:"longStand",
	Machine2:"machine2",
	Match:"match",
	Plus:"plus",
	Propeller:"propeller",
	RightCorner:"rightCorner",
	RightStand:"rightStand",
	Robo:"robo",
	SittingRobo:"sittingRobo",
	Square:"square",
	Square2:"square2",
	Square3:"square3",
	Stand:"stand",
	Starw:"starw",
	Statue:"Statue",
	TallStand:"tallStand",
	Tomb:"tomb",
	TwoSide:"twoSide",
	Vacuum:"vacuum",
	VerticalStand:"verticalStand",
	WideGate:"wideGate",
	
	//Miscellaneous
	Text:"text",
	CollidableText:"collidableText",
	FreeCollider:"freeCollider",
	
	//Player
	Player:"player",
	PlayerShot:"playerShot",
	PlayerMissile:"playerMissile",
	PlayerDouble:"playerDouble",
	PlayerLaser:"playerLaser",
	PlayerTriple:"playerTriple",
	PlayerForceUnit:"playerForceUnit",
	PlayerShield:"playerShield",
	GhostShip:"ghostShip",
	
	//capsules
	Capsule1:"capsule1",
	RagnarokCapsule:"ragnarokCapsule",
	
	//Enemies
	FlyingEnemy1:"flyingEnemy1",
    FlyingEnemy2:"flyingEnemy2",
    FlyingEnemy3:"flyingEnemy3",
    GroundEnemy1:"groundEnemy1",
    GroundEnemy2:"groundEnemy2",
    GroundEnemy3:"groundEnemy3",
	EnemyBullet1:"enemyBullet1",
	EnemyBullet2:"enemyBullet2",
	EnemyBullet3:"enemyBullet3",
	EnemyBullet4:"enemyBullet4",
	MiniBoss1:"miniBoss1", 
	EyeBoss1:"eyeBoss1",
	AlienBoss1:"alienBoss1",
	MaskBoss1:"maskBoss1",
	Level2Boss:"level2Boss",
	MiniMiniBoss1:"miniminiBoss1",
	CargoBoss: "cargoBoss",
    LaunchBay:"launchBay"
};

const spriteForType = function(type) {
	switch(type) {
		case EntityType.Rock01:
			return (new AnimatedSprite(rock1, 1, 74, 73, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Rock02:
			return (new AnimatedSprite(rock2, 1, 40, 40, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Rock03:
			return (new AnimatedSprite(rock3, 1, 32, 37, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Rock04:
			return (new AnimatedSprite(rock4, 1, 27, 27, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Volcano:
			return (new AnimatedSprite(volcano, 1, 518, 222, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.FlatRockPile:
			return (new AnimatedSprite(flatRockPile, 1, 582, 128, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl1BotRock1:
			return (new AnimatedSprite(lvl1BotRock1, 1, 358, 146, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl1TopRock1:
			return (new AnimatedSprite(lvl1TopRock1, 1, 323, 160, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl1HorzRock1:
			return (new AnimatedSprite(lvl1HorzRock1, 1, 502, 106, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl1PyramidRocks:
			return (new AnimatedSprite(lvl1PyramidRocks, 1, 209, 157, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl1BotGate1Rocks:
			return (new AnimatedSprite(lvl1BotGate1Rocks, 1, 237, 202, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl1TopGate1Rocks:
			return (new AnimatedSprite(lvl1TopGate1Rocks, 1, 299, 271, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl1BotGate2Rocks:
			return (new AnimatedSprite(lvl1BotGate2Rocks, 1, 248, 466, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl1TopGate3Rocks:
			return (new AnimatedSprite(lvl1TopGate3Rocks, 1, 400, 241, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl1BotGate3Rocks:
			return (new AnimatedSprite(lvl1BotGate3Rocks, 1, 219, 226, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl1BotGate4Rocks:
			return (new AnimatedSprite(lvl1BotGate4Rocks, 1, 186, 458, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl3AncientBoard:
			return (new AnimatedSprite(lvl3AncientBoard, 11, 150, 150, false, true, {min:0, max:0}, 0, {min:0, max:10}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl3Square:
			return (new AnimatedSprite(lvl3Square, 12, 38, 38, false, true, {min:0, max:0}, 0, {min:0, max:11}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl3Square2:
			return (new AnimatedSprite(lvl3Square2, 12, 40, 37, false, true, {min:0, max:0}, 0, {min:0, max:11}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl3Cast:
			return (new AnimatedSprite(lvl3Cast, 12, 38, 45, false, true, {min:0, max:0}, 0, {min:0, max:11}, 512, {min:0, max:0}, 0));
		case EntityType.Lvl3Plus:
			return (new AnimatedSprite(lvl3Plus, 5, 38, 37, false, true, {min:0, max:0}, 0, {min:0, max:4}, 512, {min:0, max:0}, 0));
        case EntityType.RhombusBoulder:
            return (new AnimatedSprite(largeRhombusBoulder, 2, 90, 90, false, true, {min:0, max:0}, 0, {min:0, max:1}, 512, {min:1, max:1}, 0));
        case EntityType.BrokenBoulder:
            return (new AnimatedSprite(brokenBoulder, 1, 77, 68, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.BrokenBoulderFlipped:
            return (new AnimatedSprite(brokenBoulderFlipped, 1, 77, 68, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.BigDestRock:
            return (new AnimatedSprite(bigDestRock, 1, 37, 39, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.SmDestRock1:
            return (new AnimatedSprite(smDestRock1, 1, 23, 21, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.SmDestRock2:
            return (new AnimatedSprite(smDestRock2, 1, 33, 24, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.SmDestRock3:
            return (new AnimatedSprite(smDestRock3, 1, 25, 25, false, true, {min:0, max:0}, 0, {min:0, max:0}, 512, {min:0, max:0}, 0));
        case EntityType.Platform1:
            return (new AnimatedSprite(platform1, 5, 76, 38, false, true, {min:0, max:0}, 0, {min:0, max:4}, 512, {min:4, max:4}, 0));
        case EntityType.WarpObstacle:
            return (new AnimatedSprite(warpObstacle, 5, 107, 74, true, true, {min:0, max:0}, 0, {min:0, max:4}, 64, {min:4, max:4}, 0));
		case EntityType.Bubble:
			return (new AnimatedSprite(bubble, 15, 30, 30, true, true, {min:0, max:4}, 256, {min:5, max:9}, 128, {min:10, max:14}, 32));
	}
};

//Game Entity
function GameEntity(sprite, position = {x:0, y:0}, velocity = {x:0, y:0}, size = {width:sprite.width, height:sprite.height}, collisionBody = null) {
	let pos = position;
	let vel = velocity;
	let unusedTime = 0;
	this.size = size;
	
	this.update = function(deltaTime) {
		sprite.update(deltaTime);//update the image
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			
			pos.x += vel.x * SIM_STEP / 1000;
			pos.y += vel.y * SIM_STEP / 1000;
		}
		
		unusedTime = availableTime;
	};
	
	this.draw = function() {
		sprite.drawAt(pos.x, pos.y, size.width, size.height);
	};
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
	};
	
	return this;
}

function TerrainEntity(type, position = {x:0, y:0}, spawnPos = 0, scale = 1, speed = 0, timeDelay = 0, childrenCount = 0) {
	this.type = type;
	this.isVisible = true;
	this.position = position;
	this.worldPos = null;
	this.timeDelay = timeDelay;
	this.childrenCount = childrenCount;
	let unusedTime = 0;
	this.velocity = {x:0, y:0};//only used for destructible rocks, regular terrain does not need to change this
	
	if(((this.type === EntityType.BigDestRock) ||
		(this.type === EntityType.SmDestRock1) || 
		(this.type === EntityType.SmDestRock2) ||
		(this.type === EntityType.SmDestRock3)) &&
	   (this.childrenCount === 0)) {
		this.velocity.x = Math.ceil(20 * Math.random()) - 10;//get values between -9 and +10
		this.velocity.y = -Math.ceil(18 * Math.random()) - 18;//values between -14 and 0 (negative so they travel up)
	}
	
	const sprite = spriteForType(type);

	this.size = {width:scale * sprite.width, height:scale * sprite.height};
	
	const colliderForTypeAndPosition = function(type, pos) {
		let colliderPath = [];
		let collisionBody;
		switch(type) {
			case EntityType.RhombusBoulder:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * ((sprite.height / 2) - 2)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2) + 2), y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * ((sprite.height / 2) + 2)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2) - 2), y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.BrokenBoulder:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * ((sprite.height / 2) - 12)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2)), y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * ((sprite.height / 2) + 2)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2) + 2), y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.BrokenBoulderFlipped:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * ((sprite.height / 2) + 2)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2) + 2), y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * ((sprite.height / 2) - 12)});
				colliderPath.push({x: pos.x + scale * ((sprite.width / 2) - 2), y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.BigDestRock:
			case EntityType.SmDestRock1:
			case EntityType.SmDestRock2:
			case EntityType.SmDestRock3:
				return (new Collider(ColliderType.Circle, 
									{points:   [], 
									 position: {x:pos.x + scale * sprite.width, y:pos.y + scale * sprite.height}, 
									 radius:   (scale * sprite.height / 2) - 2, 
									 center:   {x:pos.x + scale * sprite.width, y:pos.y + scale * sprite.height}}));
			case EntityType.Rock01:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * sprite.height / 2});
				colliderPath.push({x: pos.x + scale * sprite.width / 2, y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * sprite.height / 2});
				colliderPath.push({x: pos.x + scale * sprite.width / 2, y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Rock02:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * sprite.height / 2 + 2});
				colliderPath.push({x: pos.x + scale * sprite.width / 2, y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * sprite.height / 2});
				colliderPath.push({x: pos.x + scale * sprite.width / 2, y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Rock03:
				colliderPath.push({x: pos.x, 							y: pos.y + scale * 20});
				colliderPath.push({x: pos.x + scale * 2,				y: pos.y + scale * 12});
				colliderPath.push({x: pos.x + scale * (sprite.width / 2 - 1), y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * (sprite.height / 2 - 1)});
				colliderPath.push({x: pos.x + scale * 10, y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x, y: pos.y + scale * 27});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Rock04:
				colliderPath.push({x: pos.x, 			  			y: pos.y + scale * 14});
				colliderPath.push({x: pos.x + scale * 4,  			y: pos.y + scale * 8});
				colliderPath.push({x: pos.x + scale * 16, 			y: pos.y});
				colliderPath.push({x: pos.x + scale * 19, 			y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * 10});
				colliderPath.push({x: pos.x + scale * 10, 			y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x, 						y: pos.y + scale * 17});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Volcano:
				colliderPath.push({x: pos.x, 						y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x + scale * 223, 			y: pos.y + scale * 11});
				colliderPath.push({x: pos.x + scale * 309, 			y: pos.y + scale * 5});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.FlatRockPile:
				colliderPath.push({x: pos.x, 						y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x + scale * 88, 			y: pos.y + scale * 32});
				colliderPath.push({x: pos.x + scale * 260, 			y: pos.y + scale * 10});
				colliderPath.push({x: pos.x + scale * 463, 			y: pos.y + scale * 31});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl1BotRock1:
				colliderPath.push({x: pos.x, 						y: pos.y + scale * 134});
				colliderPath.push({x: pos.x + scale * 74, 			y: pos.y + scale * 64});
				colliderPath.push({x: pos.x + scale * 139, 			y: pos.y + scale * 81});
				colliderPath.push({x: pos.x + scale * 192, 			y: pos.y + scale * 5});
				colliderPath.push({x: pos.x + scale * 210, 			y: pos.y + scale * 2});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl1TopRock1:
				colliderPath.push({x: pos.x, 						y: pos.y + scale * 72});
				colliderPath.push({x: pos.x + scale * 88, 			y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * 55});
				colliderPath.push({x: pos.x + scale * 291, 			y: pos.y + scale * 66});
				colliderPath.push({x: pos.x + scale * 231, 			y: pos.y + scale * 138});
				colliderPath.push({x: pos.x + scale * 161, 			y: pos.y + scale * 158});
				colliderPath.push({x: pos.x + scale * 121, 			y: pos.y + scale * 118});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl1HorzRock1:
				colliderPath.push({x: pos.x, 				y: pos.y + scale * 42});
				colliderPath.push({x: pos.x + scale * 38, 	y: pos.y + scale * 7});
				colliderPath.push({x: pos.x + scale * 78, 	y: pos.y + scale * 6});
				colliderPath.push({x: pos.x + scale * 120, 	y: pos.y + scale * 42});
				colliderPath.push({x: pos.x + scale * 167, 	y: pos.y});
				colliderPath.push({x: pos.x + scale * 213, 	y: pos.y + scale * 42});
				colliderPath.push({x: pos.x + scale * 260, 	y: pos.y + scale * 57});
				colliderPath.push({x: pos.x + scale * 294, 	y: pos.y + scale * 77});
				colliderPath.push({x: pos.x + scale * 357, 	y: pos.y + scale * 15});
				colliderPath.push({x: pos.x + scale * 402, 	y: pos.y + scale * 14});
				colliderPath.push({x: pos.x + scale * 427, 	y: pos.y + scale * 38});
				colliderPath.push({x: pos.x + scale * 466, 	y: pos.y + scale * 3});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * 38});
				colliderPath.push({x: pos.x + scale * 465, 	y: pos.y + scale * 75});
				colliderPath.push({x: pos.x + scale * 416, 	y: pos.y + scale * 71});
				colliderPath.push({x: pos.x + scale * 344, 	y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x + scale * 289, 	y: pos.y + scale * 100});
				colliderPath.push({x: pos.x + scale * 242, 	y: pos.y + scale * 72});
				colliderPath.push({x: pos.x + scale * 195, 	y: pos.y + scale * 98});
				colliderPath.push({x: pos.x + scale * 111, 	y: pos.y + scale * 60});
				colliderPath.push({x: pos.x + scale * 36, 	y: pos.y + scale * 79});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl1PyramidRocks:
				colliderPath.push({x: pos.x + scale * 8, 			y: pos.y + scale * 81});
				colliderPath.push({x: pos.x + scale * 103, 			y: pos.y});
				colliderPath.push({x: pos.x + scale * 173, 			y: pos.y + scale * 69});
				colliderPath.push({x: pos.x + scale * 186, 			y: pos.y + scale * 56});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * 96});
				colliderPath.push({x: pos.x + scale * 167, 			y: pos.y + scale * 152});
				colliderPath.push({x: pos.x + scale * 130, 			y: pos.y + scale * 117});
				colliderPath.push({x: pos.x + scale * 100, 			y: pos.y + scale * 145});
				colliderPath.push({x: pos.x + scale * 74, 			y: pos.y + scale * 119});
				colliderPath.push({x: pos.x + scale * 36, 			y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x,			 			y: pos.y + scale * 120});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl1BotGate1Rocks:
				colliderPath.push({x: pos.x + scale * 5, 			y: pos.y + scale * 142});
				colliderPath.push({x: pos.x + scale * 22, 			y: pos.y + scale * 105});
				colliderPath.push({x: pos.x + scale * 28, 			y: pos.y + scale * 72});
				colliderPath.push({x: pos.x + scale * 65, 			y: pos.y + scale * 22});
				colliderPath.push({x: pos.x + scale * 83, 			y: pos.y});
				colliderPath.push({x: pos.x + scale * 112, 			y: pos.y + scale * 70});
				colliderPath.push({x: pos.x + scale * 98, 			y: pos.y + scale * 92});
				colliderPath.push({x: pos.x + scale * 117, 			y: pos.y + scale * 112});
				colliderPath.push({x: pos.x + scale * 150, 			y: pos.y + scale * 83});
				colliderPath.push({x: pos.x + scale * 185, 			y: pos.y + scale * 111});
				colliderPath.push({x: pos.x + scale * 206,			y: pos.y + scale * 91});
				colliderPath.push({x: pos.x + scale * 221,			y: pos.y + scale * 107});
				colliderPath.push({x: pos.x + scale * sprite.width,	y: pos.y + scale * 158});
				colliderPath.push({x: pos.x + scale * 198,			y: pos.y + scale * 193});
				colliderPath.push({x: pos.x + scale * 42,			y: pos.y + scale * 194});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl1TopGate1Rocks:
				colliderPath.push({x: pos.x,			 			y: pos.y + scale * 205});
				colliderPath.push({x: pos.x + scale * 105, 			y: pos.y + scale * 93});
				colliderPath.push({x: pos.x + scale * 61, 			y: pos.y + scale * 46});
				colliderPath.push({x: pos.x + scale * 98, 			y: pos.y + scale * 11});
				colliderPath.push({x: pos.x + scale * 262, 			y: pos.y + scale * 41});
				colliderPath.push({x: pos.x + scale * sprite.width,	y: pos.y + scale * 77});
				colliderPath.push({x: pos.x + scale * 263, 			y: pos.y + scale * 114});
				colliderPath.push({x: pos.x + scale * 237, 			y: pos.y + scale * 91});
				colliderPath.push({x: pos.x + scale * 219, 			y: pos.y + scale * 110});
				colliderPath.push({x: pos.x + scale * 254, 			y: pos.y + scale * 147});
				colliderPath.push({x: pos.x + scale * 177,			y: pos.y + scale * 236});
				colliderPath.push({x: pos.x + scale * 134,			y: pos.y + scale * 233});
				colliderPath.push({x: pos.x + scale * 97,			y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x + scale * 75,			y: pos.y + scale * 250});
				colliderPath.push({x: pos.x + scale * 55,			y: pos.y + scale * 269});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl1BotGate2Rocks:
				colliderPath.push({x: pos.x + scale * 102, 	y: pos.y});
				colliderPath.push({x: pos.x + scale * 154, 	y: pos.y + scale * 52});
				colliderPath.push({x: pos.x + scale * 210, 	y: pos.y + scale * 71});
				colliderPath.push({x: pos.x + scale * 180, 	y: pos.y + scale * 115});
				colliderPath.push({x: pos.x + scale * 168, 	y: pos.y + scale * 103});
				colliderPath.push({x: pos.x + scale * 152, 	y: pos.y + scale * 120});
				colliderPath.push({x: pos.x + scale * 172, 	y: pos.y + scale * 141});
				colliderPath.push({x: pos.x + scale * 155, 	y: pos.y + scale * 159});
				colliderPath.push({x: pos.x + scale * 167, 	y: pos.y + scale * 171});
				colliderPath.push({x: pos.x + scale * 180, 	y: pos.y + scale * 160});
				colliderPath.push({x: pos.x + scale * 215, 	y: pos.y + scale * 197});
				colliderPath.push({x: pos.x + scale * 178, 	y: pos.y + scale * 234});
				colliderPath.push({x: pos.x + scale * 189, 	y: pos.y + scale * 268});
				colliderPath.push({x: pos.x + scale * 146, 	y: pos.y + scale * 312});
				colliderPath.push({x: pos.x + scale * 187, 	y: pos.y + scale * 337});
				colliderPath.push({x: pos.x + scale * 222, 	y: pos.y + scale * 373});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * 419});
				colliderPath.push({x: pos.x + scale * 211, 	y: pos.y + scale * 456});
				colliderPath.push({x: pos.x + scale * 43, 	y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x, 				y: pos.y + scale * 418});
				colliderPath.push({x: pos.x + scale * 80, 	y: pos.y + scale * 352});
				colliderPath.push({x: pos.x + scale * 44, 	y: pos.y + scale * 314});
				colliderPath.push({x: pos.x + scale * 82, 	y: pos.y + scale * 279});
				colliderPath.push({x: pos.x + scale * 117, 	y: pos.y + scale * 265});
				colliderPath.push({x: pos.x + scale * 86, 	y: pos.y + scale * 235});
				colliderPath.push({x: pos.x + scale * 142, 	y: pos.y + scale * 196});
				colliderPath.push({x: pos.x + scale * 135, 	y: pos.y + scale * 135});
				colliderPath.push({x: pos.x + scale * 99, 	y: pos.y + scale * 98});
				colliderPath.push({x: pos.x + scale * 100, 	y: pos.y + scale * 72});
				colliderPath.push({x: pos.x + scale * 64, 	y: pos.y + scale * 35});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl1TopGate3Rocks:
				colliderPath.push({x: pos.x, 	y: pos.y + scale * 20});
				colliderPath.push({x: pos.x + scale * 20, 	y: pos.y});
				colliderPath.push({x: pos.x + scale * 366, 	y: pos.y});
				colliderPath.push({x: pos.x + scale * 387, 	y: pos.y + scale * 22});
				colliderPath.push({x: pos.x + scale * 355, 	y: pos.y + scale * 55});
				colliderPath.push({x: pos.x + scale * 383, 	y: pos.y + scale * 63});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * 79});
				colliderPath.push({x: pos.x + scale * 379, 	y: pos.y + scale * 99});
				colliderPath.push({x: pos.x + scale * 337, 	y: pos.y + scale * 93});
				colliderPath.push({x: pos.x + scale * 320, 	y: pos.y + scale * 109});
				colliderPath.push({x: pos.x + scale * 334, 	y: pos.y + scale * 124});
				colliderPath.push({x: pos.x + scale * 313, 	y: pos.y + scale * 144});
				colliderPath.push({x: pos.x + scale * 348, 	y: pos.y + scale * 176});
				colliderPath.push({x: pos.x + scale * 327, 	y: pos.y + scale * 196});
				colliderPath.push({x: pos.x + scale * 317, 	y: pos.y + scale * 186});
				colliderPath.push({x: pos.x + scale * 290, 	y: pos.y + scale * 136});
				colliderPath.push({x: pos.x + scale * 259, 	y: pos.y + scale * 157});
				colliderPath.push({x: pos.x + scale * 293, 	y: pos.y + scale * 220});
				colliderPath.push({x: pos.x + scale * 274, 	y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x + scale * 229, 	y: pos.y + scale * 191});
				colliderPath.push({x: pos.x + scale * 196, 	y: pos.y + scale * 221});
				colliderPath.push({x: pos.x + scale * 123, 	y: pos.y + scale * 143});
				colliderPath.push({x: pos.x + scale * 156, 	y: pos.y + scale * 111});
				colliderPath.push({x: pos.x + scale * 119, 	y: pos.y + scale * 82});
				colliderPath.push({x: pos.x + scale * 97, 	y: pos.y + scale * 103});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl1BotGate3Rocks:
				colliderPath.push({x: pos.x + scale * 36, 	y: pos.y + scale * 35});
				colliderPath.push({x: pos.x + scale * 74, 	y: pos.y});
				colliderPath.push({x: pos.x + scale * 113, 	y: pos.y + scale * 32});
				colliderPath.push({x: pos.x + scale * 158, 	y: pos.y + scale * 72});
				colliderPath.push({x: pos.x + scale * 214, 	y: pos.y + scale * 90});
				colliderPath.push({x: pos.x + scale * sprite.width, 	y: pos.y + scale * 103});
				colliderPath.push({x: pos.x + scale * 117, 	y: pos.y + scale * 166});
				colliderPath.push({x: pos.x + scale * 81, 	y: pos.y + scale * 173});
				colliderPath.push({x: pos.x + scale * 83, 	y: pos.y + scale * 188});
				colliderPath.push({x: pos.x + scale * 62, 	y: pos.y + scale * 208});
				colliderPath.push({x: pos.x + scale * 38, 	y: pos.y + scale * 217});
				colliderPath.push({x: pos.x + scale * 11, 	y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x + scale * 1, 	y: pos.y + scale * 215});
				colliderPath.push({x: pos.x + scale * 39, 	y: pos.y + scale * 178});
				colliderPath.push({x: pos.x + scale * 66, 	y: pos.y + scale * 172});
				colliderPath.push({x: pos.x + scale * 80, 	y: pos.y + scale * 172});
				colliderPath.push({x: pos.x + scale * 13, 	y: pos.y + scale * 114});
				colliderPath.push({x: pos.x,			 	y: pos.y + scale * 106});
				colliderPath.push({x: pos.x + scale * 14, 	y: pos.y + scale * 81});
				colliderPath.push({x: pos.x + scale * 51, 	y: pos.y + scale * 87});
				colliderPath.push({x: pos.x + scale * 61, 	y: pos.y + scale * 61});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl1BotGate4Rocks:
				colliderPath.push({x: pos.x, 				y: pos.y + scale * 410});
				colliderPath.push({x: pos.x + scale * 88, 	y: pos.y + scale * 340});
				colliderPath.push({x: pos.x + scale * 40, 	y: pos.y + scale * 275});
				colliderPath.push({x: pos.x + scale * 109, 	y: pos.y + scale * 214});
				colliderPath.push({x: pos.x + scale * 114, 	y: pos.y + scale * 203});
				colliderPath.push({x: pos.x + scale * 59, 	y: pos.y + scale * 147});
				colliderPath.push({x: pos.x + scale * 96, 	y: pos.y + scale * 111});
				colliderPath.push({x: pos.x + scale * 85, 	y: pos.y + scale * 96});
				colliderPath.push({x: pos.x + scale * 77, 	y: pos.y + scale * 44});
				colliderPath.push({x: pos.x + scale * 122, 	y: pos.y});
				colliderPath.push({x: pos.x + scale * 162, 	y: pos.y + scale * 42});
				colliderPath.push({x: pos.x + scale * 185, 	y: pos.y + scale * 93});
				colliderPath.push({x: pos.x + scale * 116, 	y: pos.y + scale * 164});
				colliderPath.push({x: pos.x + scale * 135, 	y: pos.y + scale * 183});
				colliderPath.push({x: pos.x + scale * 116, 	y: pos.y + scale * 203});
				colliderPath.push({x: pos.x + scale * 111, 	y: pos.y + scale * 215});
				colliderPath.push({x: pos.x + scale * 129, 	y: pos.y + scale * 233});
				colliderPath.push({x: pos.x + scale * 110, 	y: pos.y + scale * 269});
				colliderPath.push({x: pos.x + scale * 153,	y: pos.y + scale * 317});
				colliderPath.push({x: pos.x + scale * 71, 	y: pos.y + scale * 394});
				colliderPath.push({x: pos.x + scale * 89, 	y: pos.y + scale * 414});
				colliderPath.push({x: pos.x + scale * 43, 	y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
			case EntityType.Lvl3AncientBoard:
			case EntityType.Lvl3Square:
			case EntityType.Lvl3Square2:
				colliderPath.push({x: pos.x, 						y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x, 						y: pos.y + scale * sprite.height});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
		   case EntityType.Lvl3Cast:
				colliderPath.push({x: pos.x, 						y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * 6});
				colliderPath.push({x: pos.x + scale * 25, 			y: pos.y + scale * 8});
				colliderPath.push({x: pos.x + scale * 25, 			y: pos.y + scale * 37});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * 37});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x,						y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x, 						y: pos.y + scale * 37});
				colliderPath.push({x: pos.x + scale * 12, 			y: pos.y + scale * 37});
				colliderPath.push({x: pos.x + scale * 12, 			y: pos.y + scale * 8});
				colliderPath.push({x: pos.x, 						y: pos.y + scale * 8});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}})); 			
		   case EntityType.Lvl3Plus:
				colliderPath.push({x: pos.x, 						y: pos.y + scale * 12});
				colliderPath.push({x: pos.x + scale * 12, 			y: pos.y + scale * 11});
				colliderPath.push({x: pos.x + scale * 13, 			y: pos.y});
				colliderPath.push({x: pos.x + scale * 25, 			y: pos.y});
				colliderPath.push({x: pos.x + scale * 25, 			y: pos.y + scale * 11});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * 11});
				colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * 22});
				colliderPath.push({x: pos.x + scale * 26,			y: pos.y + scale * 22});
				colliderPath.push({x: pos.x + scale * 26, 			y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x + scale * 12, 			y: pos.y + scale * sprite.height});
				colliderPath.push({x: pos.x + scale * 12, 			y: pos.y + scale * 22});
				colliderPath.push({x: pos.x, 						y: pos.y + scale * 22});
				
				return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}})); 			
           case EntityType.Platform1:
                colliderPath.push({x: pos.x,                        y: pos.y});
                colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y});
                colliderPath.push({x: pos.x + scale * sprite.width, y: pos.y + scale * sprite.height});
                colliderPath.push({x: pos.x,                        y: pos.y + scale * sprite.height});
                
                return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
            case EntityType.WarpObstacle:
                colliderPath.push({x: pos.x + scale * 2,            y: pos.y + scale * (2 + (sprite.height / 2))});
                colliderPath.push({x: pos.x + scale * (sprite.width - 6), y: pos.y + scale * 4});
                colliderPath.push({x: pos.x + scale * (sprite.width - 6), y: pos.y + scale * (sprite.height - 4)});
                
                return (new Collider(ColliderType.Polygon, {points:colliderPath, position:{x:pos.x, y:pos.y}}));
		}
	};
	
	this.collisionBody = colliderForTypeAndPosition(type, this.position);
	this.didCollide = false;
	
	this.update = function(deltaTime, worldPos) {
		if((worldPos >= spawnPos) && (this.position.x > -this.size.width)) {
			if(this.worldPos == null) {
				this.worldPos = worldPos;
			}
			
			sprite.update(deltaTime);//update the image
			
			let availableTime = unusedTime + deltaTime;
			while(availableTime > SIM_STEP) {
				availableTime -= SIM_STEP;
				this.position.x -= (worldPos - this.worldPos);
				this.worldPos = worldPos;
			}
			
			if(((this.type === EntityType.BigDestRock) ||
				(this.type === EntityType.SmDestRock1) || 
				(this.type === EntityType.SmDestRock2) ||
				(this.type === EntityType.SmDestRock3)) &&
			   (this.childrenCount === 0)) {
				this.position.x += this.velocity.x;
				this.position.y += this.velocity.y;//adding because velocities are negative
				this.velocity.y += 1;//apply a constant change to velocity to simulate gravity
			} else if((this.type === EntityType.BigDestRock) && (this.childrenCount > 0)) {
				this.isVisible = false;
				if(this.position.x < GameField.midX) {
					scene.worldShouldPause(true);
				}
				
				this.timeDelay -= deltaTime;
				if(this.timeDelay <= 0) {
					this.timeDelay = timeDelay;
					
					const newRock = new TerrainEntity(EntityType.BigDestRock, {x: this.position.x, y:this.position.y}, spawnPos);
					scene.addEntity(newRock);
					
					this.childrenCount--;
					if(this.childrenCount === 0) {
						scene.worldShouldPause(false);
						//need to tell the group this one is done...
					}
				}
			}
			
			unusedTime = availableTime;
			
			if(this.collisionBody.type === ColliderType.Polygon) {
				this.collisionBody.setPosition({x: this.position.x, y: this.position.y});
			} else if(this.collisionBody.type === ColliderType.Circle) {
				this.collisionBody.setPosition({x:this.position.x + this.size.height / 2, 
											    y:this.position.y + this.size.height / 2});
			}
			
		} else if((this.position.x < GameField.x - this.size.width) || (this.position.y > GameField.bottom)) {
			scene.removeEntity(this, false);
		} 
	};
	
	this.draw = function() {
		if(!this.isVisible) {return;}
		if((this.worldPos >= spawnPos) && 
		   (this.position.x > GameField.x - this.size.width) &&
		   (this.position.x <= GameField.right)) {
			sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
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
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
		
		if(this.type === EntityType.BigDestRock) {
			let entityType = otherEntity.type;
			if ((entityType === EntityType.PlayerForceUnit) ||
				(entityType === EntityType.RagnarokCapsule) || 
				(entityType === EntityType.PlayerShot) || 
				(entityType === EntityType.PlayerMissile) || 
				(entityType === EntityType.PlayerDouble) || 
				(entityType === EntityType.PlayerLaser) || 
				(entityType === EntityType.PlayerTriple) ||
				(entityType === EntityType.PlayerShield)) {
					
					if(this.didCollide) {return;}
					
					this.didCollide = true;
					
					const chip1 = new TerrainEntity(EntityType.SmDestRock1, {x:this.position.x, y:this.position.y - 20}, spawnPos);
					chip1.velocity.x = (chip1.velocity.x + this.velocity.x) / 2;
					chip1.velocity.y *= 0.25;
					scene.addEntity(chip1);
					
					const chip2 = new TerrainEntity(EntityType.SmDestRock2, {x:this.position.x, y:this.position.y - 20}, spawnPos);
					chip2.velocity.x = (chip1.velocity.x + this.velocity.x) / 2;
					chip2.velocity.y *= 0.25;
					scene.addEntity(chip2);
					
					const chip3 = new TerrainEntity(EntityType.SmDestRock3, {x:this.position.x, y:this.position.y - 20}, spawnPos);
					chip3.velocity.x = (chip1.velocity.x + this.velocity.x) / 2;
					chip3.velocity.y *= 0.25;
					scene.addEntity(chip3);
					
					this.score = 100;
					scene.displayScore(this);
					
					scene.removeEntity(this);
			}
		} else if((this.type === EntityType.SmDestRock1) ||
				  (this.type === EntityType.SmDestRock2) ||
				  (this.type === EntityType.SmDestRock3)) {
					  
				    this.score = 50;
					scene.displayScore(this);
					  
				  	scene.removeEntity(this);
		}
	};
	
	return this;
}

function BubbleEntity(type, position = {x:0, y:0}, spawnPos = 0, scale = 1, returnTime = -1) {
	this.type = type;
	this.position = position;
	this.worldPos = null;
	let unusedTime = 0;
	this.returnTime = returnTime;
	let canCollide = true;
	
	const sprite = spriteForType(type);

	this.size = {width:scale * sprite.width, height:scale * sprite.height};
	
	this.collisionBody = new Collider(ColliderType.Circle,  {points:   [], 
										position: {x:this.position.x, y:this.position.y}, 
										radius:   this.size.height / 2, 
										center:   {x:this.position.x + this.size.height / 2, y:this.position.y + this.size.height / 2}});
	
	this.update = function(deltaTime, worldPos) {
		if(worldPos < spawnPos) {return;}//don't update until after spawn position
		if(this.position.x < GameField.x - this.size.width) {//remove from game once scrolled past left side of screen
			scene.removeEntity(this, false);
		}
		
		if(this.worldPos == null) {
			this.worldPos = worldPos;
		}
		
		this.position.x -= (worldPos - this.worldPos);
		this.worldPos = worldPos;
		
		this.collisionBody.setPosition({x: this.position.x, y: this.position.y});
		
		if(sprite.getDidDie()) {
			if(this.returnTime < 0) {//this bubble doesn't return
				scene.removeEntity(this, false);
			} else {
				this.returnTime -= deltaTime;
				if(this.returnTime <= 0) {//now it can return, but first it needs to be born
					this.returnTime = returnTime;
					sprite.clearDeath();
					sprite.wasBorn = false;
				}
			}
		} else {
			sprite.update(deltaTime);
			
			if(!sprite.isDying) {
				if((sprite.currentFrame > sprite.birthRange.max) && (!canCollide)) {
					canCollide = true;
					scene.addCollisions(this, false);
				}
			}
		}
	};
	
	this.draw = function() {
		if((this.worldPos >= spawnPos) && 
		   (this.position.x > GameField.x - this.size.width) &&
		   (this.position.x <= GameField.right)) {
			sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
			this.collisionBody.draw();
		}
	};
	
	this.setInitialFrame = function(initialFrame) {
		sprite.setFrame(initialFrame);
	};
	
	this.respawn = function(worldPos) {
		if(worldPos > spawnPos) {
			this.worldPos = worldPos;
			this.position.x -= (worldPos - spawnPos);
		}		
	};
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
		
		const entityType = otherEntity.type;
		if ((entityType === EntityType.PlayerForceUnit) ||
			(entityType === EntityType.PlayerShot) || 
			(entityType === EntityType.PlayerMissile) || 
			(entityType === EntityType.PlayerDouble) || 
			(entityType === EntityType.PlayerLaser) || 
			(entityType === EntityType.PlayerTriple) ||
			(entityType === EntityType.PlayerShield)) {

			sprite.isDying = true;
			bubbleExplosion.play();
			scene.removeCollisions(this);
			canCollide = false;
		}
	};
	
	return this;
}
