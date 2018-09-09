//Force Unit
function PlayerForceUnit(position = {x:0, y:0}) {
	this.type = EntityType.PlayerForceUnit;

	// TODO change the dimensions/parameters passed into the AnimatedSprite ctor once we have a sprite sheet
	const sprite = new AnimatedSprite(forceUnitSheet, 1, 48, 48);
	const SPRITE_SCALE = 1;
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	this.position = {x: position.x, y: position.y};
    this.parentObj = null;

    this.damagePoints = 4;   // Damage points = how many hit points to remove on contact with an enemy (every weapon that can inflict damage on an enemy must have this property

	// colliderPath given in clockwise winding, relative to Canvas coordinates (+x left-to-right of screen, +y top-to-bottom of screen)
	// TODO: modify the colliderPath computation once we have settled on the image/model for the force unit
	var centerX = sprite.width / 2;
	var centerY = sprite.height/ 2;
	//const colliderPath = [ {x: this.position.x + centerX + 0 * SPRITE_SCALE,  y: this.position.y + centerY - 18 * SPRITE_SCALE},
	//					   {x: this.position.x + centerX + 18 * SPRITE_SCALE, y: this.position.y + centerY - 10 * SPRITE_SCALE},
	//					   {x: this.position.x + centerX + 18 * SPRITE_SCALE, y: this.position.y + centerY + 10 * SPRITE_SCALE},
	//					   {x: this.position.x + centerX + 0 * SPRITE_SCALE,  y: this.position.y + centerY + 18 * SPRITE_SCALE},
	//					   {x: this.position.x + centerX - 18 * SPRITE_SCALE, y: this.position.y + centerY + 10 * SPRITE_SCALE},
	//					   {x: this.position.x + centerX - 18 * SPRITE_SCALE, y: this.position.y + centerY - 10 * SPRITE_SCALE} ];
	//this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});

	this.collisionBody = new Collider(ColliderType.Circle,	{points:   [], 
														//position: {x:centerX, y:centerY}, 
														position: {x:this.position.x, y:this.position.y}, 
														radius:   18, 
														center:   {x:centerX, y:centerY}});

	let didCollide = false;
	this.getIsDying = function() {
		return sprite.isDying;
	};
	
	let unusedTime = 0;//time left over from last call to this.update, helps smooth movement with variable frame rate


	this.update = function(deltaTime, worldPos) {
		this.position.x = this.parentObj.position.x + 70;	// TODO don't hardcode position - force unit should be able to attach to the front or back of ship; and also float in front of, or behind, ship.. At some distance..
		this.position.y = this.parentObj.position.y;
		sprite.update(deltaTime);   //update the image

		//keep the collisionBody position in synch with the visual position
		this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
	};


	this.didCollideWith = function(otherEntity) {
		didCollide = true;
	};

	this.draw = function() {
		sprite.drawAt(this.position, this.size);
		//collision bodies know not to draw themselves if DRAW_COLLIDERS = false
		this.collisionBody.draw();

		// TODO why are we resetting didCollide in the draw function? Should be in update() or somewhere else? - LH
		if(didCollide) {
			didCollide = false;
		}
	};

	this.clampPositionToScreen = function() {
		//clamp player position to the screen
		if(this.position.x < GameField.x) {
			this.position.x = GameField.x;
		} else if(this.position.x > (GameField.right - this.size.width)) {
			this.position.x = GameField.right - this.size.width;
		}
		
		if(this.position.y < GameField.y) {
			this.position.y = GameField.y;
		} else if(this.position.y > (GameField.bottom - this.size.height)) {
			this.position.y = GameField.bottom - this.size.height;
		}
	};
}
