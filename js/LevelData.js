//LevelData
const LevelData = [
	/*
	 {//levelIndex = -1 Rybar's tiled level loading scheme
		clearColor:"#010119",
		getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY}},
		initializeEnemies: function() {
			
			const enemies = [];
			let offRight = GameField.right + 50;
			let enemiesData = TileMaps.levelOne.layers[2].objects;
			let enemiesInGroups = enemiesData.filter((obj)=>{return obj.properties[0].value > 0});
			enemiesInGroups.unshift([]);
			let enemyGroups = enemiesInGroups.reduce((group, obj)=>{
					let groupNumber = obj.properties[0].value;
					if(!group[groupNumber.toString()]) { group[groupNumber] = []; }
					group[groupNumber].push(obj);
					return group;
				});
			enemyGroups.forEach((group)=>{
					let currentGroup = new EnemyGroup();
					group.forEach((obj)=>{
						switch(obj.type){
							case "flyingEnemy1":
							//tiled-editor object origin is bottom-left, game engine sprite origin is top-left
							enemies.push(currentGroup.add(new FlyingEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, -100, "none" ,25,obj.x,1)));
							break;
							case "flyingEnemy2":
							enemies.push(currentGroup.add(new FlyingEnemy2({x:offRight, y:GameField.y+obj.y-obj.height}, -100, "none",25,obj.x,1)));
							break;
							case "flyingEnemy1sine":
							enemies.push(currentGroup.add(new FlyingEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, -100, "sine" ,25,obj.x,1)));
							break;
							case "flyingEnemy2sine":
							enemies.push(currentGroup.add(new FlyingEnemy2({x:offRight, y:GameField.y+obj.y-obj.height}, -100, "sine",25,obj.x,1)));
							break;
							case "groundEnemy1N":
							enemies.push(currentGroup.add(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, 0, -100, "none", 0, obj.x, 1)));
							break;
							case "groundEnemy1S":
							enemies.push(currentGroup.add(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI, -100, "none", 0, obj.x, 1)));
							break;
							case "groundEnemy1E":
							enemies.push(currentGroup.add(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/2*3, -100, "none", 0, obj.x, 1)));
							break;
							case "groundEnemy1W":
							enemies.push(currentGroup.add(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/2, -100, "none", 0, obj.x, 1)));
							break;
							case "groundEnemy1NE":
							enemies.push(currentGroup.add(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/4*7, -100, "none", 0, obj.x, 1)));
							break;
							case "groundEnemy1NW":
							enemies.push(currentGroup.add(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/4, -100, "none", 0, obj.x, 1)));
							break;
							case "groundEnemy1SE":
							enemies.push(currentGroup.add(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/4*5, -100, "none", 0, obj.x, 1)));
							break;
							case "groundEnemy1SW":
							enemies.push(currentGroup.add(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/4*3, -100, "none", 0, obj.x, 1)));
							break;
							default:
							break;
						}
					});
				}); 
			let noGroupsEnemies = enemiesData.filter((obj)=>{return obj.properties[0].value == 0});
			noGroupsEnemies.forEach((obj)=>{	
				switch(obj.type){
					case "flyingEnemy1":
					//tiled-editor object origin is bottom-left, game engine sprite origin is top-left
					enemies.push(new FlyingEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, -100, "none" ,25,obj.x,1))
					break;
					case "flyingEnemy2":
					enemies.push(new FlyingEnemy2({x:offRight, y:GameField.y+obj.y-obj.height}, -100, "none",25,obj.x,1))
					break;
					case "flyingEnemy1sine":
					enemies.push(new FlyingEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, -100, "sine" ,25,obj.x,1))
					break;
					case "flyingEnemy2sine":
					enemies.push(new FlyingEnemy2({x:offRight, y:GameField.y+obj.y-obj.height}, -100, "sine",25,obj.x,1))
					break;
					case "groundEnemy1N":
					enemies.push(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, 0, -100, "none", 0, obj.x, 1))
					break;
					case "groundEnemy1S":
					enemies.push(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI, -100, "none", 0, obj.x, 1))
					break;
					case "groundEnemy1E":
					enemies.push(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/2*3, -100, "none", 0, obj.x, 1))
					break;
					case "groundEnemy1W":
					enemies.push(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/2, -100, "none", 0, obj.x, 1))
					break;
					case "groundEnemy1NE":
					enemies.push(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/4*7, -100, "none", 0, obj.x, 1))
					break;
					case "groundEnemy1NW":
					enemies.push(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/4, -100, "none", 0, obj.x, 1))
					break;
					case "groundEnemy1SE":
					enemies.push(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/4*5, -100, "none", 0, obj.x, 1))
					break;
					case "groundEnemy1SW":
					enemies.push(new GroundEnemy1({x:offRight, y:GameField.y+obj.y-obj.height}, Math.PI/4*3, -100, "none", 0, obj.x, 1))
					break;
					default:
					break;
				}
			})
			return enemies;
		},
		initializeTerrain: function() {
			const world = [];
			let offRight = GameField.right + 50;
			TileMaps.levelOne.layers[1].objects.forEach(function(obj){
				switch(obj.type){
					case "bubble":
					world.push(new BubbleEntity(EntityType.Bubble, {x:offRight, y:GameField.y+obj.y-obj.height}, obj.x, 1, 1024));
					break;
					case "capsule1":
					world.push(new Capsule({x:offRight, y:GameField.y+obj.y-obj.height}, obj.x));
					break;
					default:
					world.push(new TerrainEntity(obj.type, {x:offRight, y:GameField.y+obj.y-obj.height}, obj.x, 1));
					break;
				}
				
			})
			return world;      
		},
		initializeDebris: function() {
			const debris = [];
			return debris;
		},
		checkpointPositions:[0, 600, 1200]
	}, 
	*/
	{//levelIndex = 0
		clearColor:"#010119",
		getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY}},
		initializeEnemies: function() {
			const enemies = [];

			const firstGroup = new EnemyGroup();
			
			enemies.push(firstGroup.add(new FlyingEnemy2({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 0, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy2({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 600, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy2({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 1200, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy2({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 1800, 0, 1)));
			enemies.push(firstGroup.add(new FlyingEnemy2({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Points, 2400, 0, 1)));
			
			const secondGroup = new EnemyGroup();

			enemies.push(secondGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 0, 500, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 550, 500, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 1100, 500, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 1650, 500, 0)));
			enemies.push(secondGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 2200, 500, 0)));
			
			const thirdGroup = new EnemyGroup();
			
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 0, 800, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 550, 800, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 1100, 800, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 1650, 800, 0)));
			enemies.push(thirdGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 450}, -100, PathType.Sine, 2200, 800, 0)));
			
			const fourthGroup = new EnemyGroup();

			enemies.push(fourthGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Sine, 0, 1100, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Sine, 550, 1100, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Sine, 1100, 1100, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Sine, 1650, 1100, 1)));
			enemies.push(fourthGroup.add(new FlyingEnemy1({x: GameField.right + 50, y: GameField.y + 50}, -100, PathType.Sine, 2200, 1100, 1)));
			
			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: GameField.midY - 52}, Math.PI/4, 0, PathType.None, 0, 120, 5));
			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: GameField.midY + 48}, 3*Math.PI/4, 0, PathType.None, 0, 120, 5));

			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 556}, Math.PI/4, 0, PathType.None, 0, 1754, 15));
			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 556}, -Math.PI/4, 0, PathType.None, 0, 1844, 15));

			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 250}, 3 * Math.PI/4, 0, PathType.None, 0, 3093, 15));
			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 252}, -3 * Math.PI/4, 0, PathType.None, 0, 3190, 15));

			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 555}, Math.PI/4, 0, PathType.None, 0, 3718, 15));
			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 556}, -Math.PI/4, 0, PathType.None, 0, 3809, 15));
			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 656}, 3 * Math.PI/4, 0, PathType.None, 0, 3719, 15));

			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 506}, Math.PI/4, 0, PathType.None, 0, 4116, 15));
			enemies.push(new GroundEnemy1({x: GameField.right + 50, y: 508}, -Math.PI/4, 0, PathType.None, 0, 4210, 15));
			
			return enemies;
		},
		initializeTerrain: function() {
			const world = [];
			world.push(new Capsule({x: GameField.right + 50, y: GameField.y + GameField.height / 5}, 0));
			world.push(new Capsule({x: GameField.right + 50, y: GameField.y + 4 * GameField.height / 5}, 100));
			world.push(new Capsule({x: GameField.right + 50, y: GameField.y + GameField.height / 5}, 200));
			world.push(new Capsule({x: GameField.right + 50, y: GameField.y + 4 * GameField.height / 5}, 300));
			world.push(new Capsule({x: GameField.right + 50, y: GameField.y + 4 * GameField.height / 5}, 1000));
			world.push(new Capsule({x: GameField.right + 50, y: GameField.y + 4 * GameField.height / 5}, 1100));
			
			world.push(new TerrainEntity(EntityType.Rock01, {x: GameField.right + 50, y: GameField.midY - 60}, 100, 2));
			world.push(new TerrainEntity(EntityType.RhombusBoulder, {x: GameField.right + 50, y: GameField.midY - 120}, 600, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: GameField.y + GameField.height / 5}, 1350, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: GameField.y + 5 * GameField.height / 6}, 850, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: GameField.y + 3 * GameField.height / 5 + 50}, 950, 2));
			
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 547}, 1604, 2));
			world.push(new TerrainEntity(EntityType.Rock01, {x: GameField.right + 50, y: 547}, 1734, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 169}, 1737, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 248}, 1750, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 291}, 1878, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 635}, 1899, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 228}, 2055, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 298}, 2202, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 160}, 2223, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 433}, 2339, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 629}, 2356, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 309}, 2409, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 185}, 2509, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 337}, 2523, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 429}, 2662, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 313}, 2663, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 205}, 2789, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 388}, 2812, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 572}, 2812, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 653}, 2932, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 414}, 2936, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 239}, 2939, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 377}, 3056, 2));
			world.push(new TerrainEntity(EntityType.Rock01, {x: GameField.right + 50, y: 147}, 3084, 2));			
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 756}, 3111, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 631}, 3234, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 576}, 3237, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 491}, 3256, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 281}, 3397, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 597}, 3399, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 405}, 3403, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 485}, 3525, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 554}, 3541, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 395}, 3567, 2));
			world.push(new TerrainEntity(EntityType.Rock01, {x: GameField.right + 50, y: 547}, 3700, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 296}, 3716, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 234}, 3851, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 394}, 3979, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 458}, 3929, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 237}, 4010, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 543}, 4012, 2));
			world.push(new TerrainEntity(EntityType.Rock01, {x: GameField.right + 50, y: 497}, 4100, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 682}, 4148, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 533}, 4286, 2));
			world.push(new TerrainEntity(EntityType.Rock03, {x: GameField.right + 50, y: 120}, 4497, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 422}, 4321, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 306}, 4400, 2));
			world.push(new TerrainEntity(EntityType.Rock04, {x: GameField.right + 50, y: 534}, 4496, 2));
			world.push(new TerrainEntity(EntityType.Rock02, {x: GameField.right + 50, y: 623}, 4527, 2));
						
			const delta = 45;
			for(let i = 0; i < 50; i++) {
				let xPos = delta * Math.floor(i % 10);
				let yPos = delta * Math.floor(i / 10);
				
				let thisEntity;
				if(i === 18) {
					thisEntity = new Capsule({x: GameField.right + (50 + xPos), y: GameField.midY + (yPos - 112)}, 850);
				} else {
					thisEntity = new BubbleEntity(EntityType.Bubble, {x: GameField.right + (50 + xPos), y: GameField.midY + (yPos - 112)}, 850, 1, 1024);
					thisEntity.setInitialFrame(i % 5);
				}
								
				world.push(thisEntity);
			}

			return world;
		},
		initializeDebris: function() {
			const debris = [];
			let sprite = new AnimatedSprite(debrisSheet, 1, 68, 77, false, true, {min:0, max:0}, 0, {min:0, max:0}, 128, {min:0, max:0}, 0);
			debris.push(new DebrisEntity(sprite, {x: GameField.right + 50, y: GameField.y - 30}, 50, 1.5, 2.0, -2));
			debris.push(new DebrisEntity(sprite, {x: GameField.right + 50, y: GameField.bottom - 75}, 55, 1.5, 2.0, 2.2));
			debris.push(new DebrisEntity(sprite, {x: GameField.right + 50, y: GameField.bottom - 60}, 250, 1.5, 2.0, 1.3));

			return debris;
		},
		checkpointPositions:[0, 600, 1200]
	},
	{//levelIndex = 1
		clearColor: "#010119",//placeholder value
		getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY}},
		initializeEnemies: function() {
		},
		initializeTerrain: function() {
		},
		initializeDebris: function() {
		},
		checkpointPositions:[0, 600, 1200]//placeholder values
	},
	{//levelIndex = 2
		clearColor: "#010119",//placeholder value
		getPlayerSpawn: function() {return {x:GameField.x + 10, y:GameField.midY}},
		initializeEnemies: function() {
		},
		initializeTerrain: function() {
		},
		initializeDebris: function() {
		},
		checkpointPositions:[0, 600, 1200]//placeholder values
	}
];

/*			
Used to generate starting point of asteroid field, placed here so it doesn't have to be recreated if we want to do another field.

			for(let i = 0; i < 45; i++) {
				const rockTypeNum = Math.floor(8 * Math.random());
				let rockType;
				switch(rockTypeNum) {
					case 0:
					case 1:
					case 2:
						rockType = EntityType.Rock02;
						break;
					case 3:
					case 4:
					case 5:
						rockType = EntityType.Rock03;
						break;
					case 6:
					case 7:
					case 8:
						rockType = EntityType.Rock04;
						break;
					default:
						rockType = EntityType.Rock04;
						break;
				}
				
				const yPos = GameField.y + 50 * Math.floor(12.5 * Math.random()) - 25 + Math.floor(50 * Math.random());
				const spawnPos = 1600 + 150 * Math.floor(20 * Math.random()) - 25 + Math.floor(50 * Math.random());
				
				console.log("world.push(new TerrainEntity(" + rockType + ", {x: GameField.right + 50, y: " + yPos + "}, " + spawnPos + ", 2));");
				
				world.push(new TerrainEntity(rockType, {x: GameField.right + 50, y: yPos}, spawnPos, 2));
			}*/
