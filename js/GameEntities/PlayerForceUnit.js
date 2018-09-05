//Force Unit
function PlayerForceUnit(position = {x:0, y:0}) {
	this.type = EntityType.PlayerForceUnit;

	// TODO change the dimensions/parameters passed into the AnimatedSprite ctor once we have a sprite sheet
	const sprite = new AnimatedSprite(forceUnitSheet, 1, 48, 48);
	const SPRITE_SCALE = 1;
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	this.position = {x: position.x, y: position.y};
    this.parentShip = null;

	// colliderPath given in clockwise winding, relative to Canvas coordinates (+x left-to-right of screen, +y top-to-bottom of screen)
	// TODO: modify the colliderPath computation once we have settled on the image/model for the force unit
	var centerX = sprite.width / 2;
	var centerY = sprite.height/ 2;
	const colliderPath = [ {x: this.position.x + centerX + 0 * SPRITE_SCALE,  y: this.position.y + centerY - 18 * SPRITE_SCALE},
						   {x: this.position.x + centerX + 18 * SPRITE_SCALE, y: this.position.y + centerY - 10 * SPRITE_SCALE},
						   {x: this.position.x + centerX + 18 * SPRITE_SCALE, y: this.position.y + centerY + 10 * SPRITE_SCALE},
						   {x: this.position.x + centerX + 0 * SPRITE_SCALE,  y: this.position.y + centerY + 18 * SPRITE_SCALE},
						   {x: this.position.x + centerX - 18 * SPRITE_SCALE, y: this.position.y + centerY + 10 * SPRITE_SCALE},
						   {x: this.position.x + centerX - 18 * SPRITE_SCALE, y: this.position.y + centerY - 10 * SPRITE_SCALE} ];
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	let didCollide = false;
	this.getIsDying = function() {
		return sprite.isDying;
	};
	
	let unusedTime = 0;//time left over from last call to this.update, helps smooth movement with variable frame rate


	this.update = function(deltaTime, worldPos) {
		this.position.x = this.parentShip.position.x - 70;	// TODO don't hardcode position - force unit should be able to attach to the front or back of ship; and also float in front of, or behind, ship.. At some distance..
		this.position.y = this.parentShip.position.y;
		sprite.update(deltaTime);   //update the image

		//keep the collisionBody position in synch with the visual position
		this.collisionBody.setPosition({x:this.position.x, y:this.position.y});

		//this.clampPositionToScreen();	// TODO delete this? We probably only want to clamp the ship position to the screen
	};

	this.draw = function() {
		sprite.drawAt(this.position, this.size);
		//collision bodies know not to draw themselves if DRAW_COLLIDERS = false
		this.collisionBody.draw();
	};

	this.clampPositionToScreen = function() {
		//clamp player position to the screen
		if(this.position.x < 0) {
			this.position.x = 0;
		} else if(this.position.x > (canvas.width - this.size.width)) {
			this.position.x = canvas.width - this.size.width;
		}
		
		if(this.position.y < 0) {
			this.position.y = 0;
		} else if(this.position.y > (canvas.height - this.size.height)) {
			this.position.y = canvas.height - this.size.height;
		}
	};
}
