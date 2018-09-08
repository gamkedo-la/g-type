//LevelData
const LevelData = [
	{//levelIndex = 0
		clearColor:"#010119",
		getPlayerSpawn: function() {return {x:canvas.width / 8, y:canvas.height / 2}},
		initializeEnemies: function() {
			const enemies = [];

			const firstGroup = new EnemyGroup();
			
			enemies.push(firstGroup.add(new FlyingEnemy2({x: canvas.width + 50, y: 50}, -100, PathType.Points, 0, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy2({x: canvas.width + 50, y: 50}, -100, PathType.Points, 600, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy2({x: canvas.width + 50, y: 50}, -100, PathType.Points, 1200, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy2({x: canvas.width + 50, y: 50}, -100, PathType.Points, 1800, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy2({x: canvas.width + 50, y: 50}, -100, PathType.Points, 2400, 0, 1)));
			
			const secondGroup = new EnemyGroup();

			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 0, 500, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 550, 500, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1100, 500, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1650, 500, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 2200, 500, 0)));
			
			const thirdGroup = new EnemyGroup();
			
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 0, 800, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 550, 800, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1100, 800, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1650, 800, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 2200, 800, 0)));
			
			const fourthGroup = new EnemyGroup();

			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 0, 1100, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 550, 1100, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 1100, 1100, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 1650, 1100, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 2200, 1100, 1)));
			
			enemies.push(new GroundEnemy1({x: canvas.width + 164, y: canvas.height / 2 - 52}, Math.PI/4, 0, PathType.None, 0, 100, 5));
			enemies.push(new GroundEnemy1({x: canvas.width + 164, y: canvas.height / 2 + 48}, 3*Math.PI/4, 0, PathType.None, 0, 100, 5));
			
			return enemies;
		},
		initializeTerrain: function() {
			const world = [];
			world.push(new Capsule({x: canvas.width + 50, y: canvas.height / 5}, 0));
			world.push(new Capsule({x: canvas.width + 50, y: 4 * canvas.height / 5}, 300));
			
			world.push(new TerrainEntity(EntityType.Rock01, {x: canvas.width + 50, y: canvas.height / 2 - 60}, 100, 2));
			world.push(new TerrainEntity(EntityType.RhombusBoulder, {x: canvas.width + 50, y: canvas.height / 2 - 120}, 600, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: canvas.width + 50, y: canvas.height / 5}, 1350, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: canvas.width + 50, y: 5 * canvas.height / 6}, 850, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: canvas.width + 50, y: 3 * canvas.height / 5 + 50}, 950, 2));

			const delta = 45;
			for(let i = 0; i < 50; i++) {
				let xPos = delta * Math.floor(i % 10);
				let yPos = delta * Math.floor(i / 10);
				
				let thisEntity;
				if(i === 18) {
					thisEntity = new Capsule({x: canvas.width + (50 + xPos), y: canvas.height / 2 + (yPos - 112)}, 850);
				} else {
					thisEntity = new BubbleEntity(EntityType.Bubble, {x: canvas.width + (50 + xPos), y: canvas.height / 2 + (yPos - 112)}, 850, 1);
					thisEntity.setInitialFrame(i % 5);
				}
								
				world.push(thisEntity);
			}

			return world;
		},
		initializeDebris: function() {
			const debris = [];
			let sprite = new AnimatedSprite(debrisSheet, 1, 68, 77, false, true, {min:0, max:0}, 0, {min:0, max:0}, 128, {min:0, max:0}, 0);
			debris.push(new DebrisEntity(sprite, {x: canvas.width + 50, y: canvas.height / 4}, 50, 2.2, .8, -2));
			debris.push(new DebrisEntity(sprite, {x: canvas.width + 55, y: canvas.height / 4 - 75}, 55, 2, 1.5, 2.2));
			debris.push(new DebrisEntity(sprite, {x: canvas.width + 250, y: canvas.height / 4 * 3}, 250, 3, 1, 1.3));

			return debris;
		},
		checkpointPositions:[0, 600, 1200]
	},
	{//levelIndex = 1
		clearColor: "#010119",//placeholder value
		getPlayerSpawn: function() {return {x:canvas.width / 8, y:canvas.height / 2}},
		initializeEnemies: function() {
		},
		initializeTerrain: function() {
		},
		initializeDebris: function() {
		},
		checkpointPositions:[0, 600, 1200]//placeholder values
	}
];
