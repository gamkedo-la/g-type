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

			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 0, 300, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 550, 300, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1100, 300, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1650, 300, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 2200, 300, 0)));
			
			const thirdGroup = new EnemyGroup();
			
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 0, 600, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 550, 600, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1100, 600, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 1650, 600, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 450}, -100, PathType.Sine, 2200, 600, 0)));
			
			const fourthGroup = new EnemyGroup();

			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 0, 900, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 550, 900, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 1100, 900, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 1650, 900, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: canvas.width + 50, y: 50}, -100, PathType.Sine, 2200, 900, 1)));
			
			return enemies;
		},
		initializeTerrain: function() {
			const world = [];
			world.push(new TerrainEntity(EntityType.RhombusBoulder, {x: canvas.width + 50, y: canvas.height / 2 - 60}, 50, 2));
			world.push(new TerrainEntity(EntityType.RhombusBoulder, {x: canvas.width + 50, y: canvas.height / 2 - 120}, 600, 2));

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
			debris.push(new DebrisEntity(sprite, {x: canvas.width + 50, y: canvas.height / 4}, 50, 1, -2));
			debris.push(new DebrisEntity(sprite, {x: canvas.width + 250, y: canvas.height / 4 * 3}, 250, 1, 1.3));

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
