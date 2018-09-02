//Force Unit
function PlayerForceUnit(position = {x:0, y:0}) {
	this.type = EntityType.PlayerForceUnit;

	// TODO change the dimensions/parameters passed into the AnimatedSprite ctor once we have a sprite sheet
	const sprite = new AnimatedSprite(forceUnitSheet, 1, 48, 48);
	const SPRITE_SCALE = 1;
	this.size = {width:SPRITE_SCALE * sprite.width, height:SPRITE_SCALE * sprite.height};
	this.position = {x: position.x, y: position.y};
    this.parentShip = null;

	// TODO update collider to be a hexagon
	////this path lays out the corners of the polygon collider for the player (a triangle in this case)
	//const colliderPath = [{x: this.position.x + SPRITE_SCALE * 6, y: this.position.y + SPRITE_SCALE * 1}, 
	//					  {x: this.position.x + SPRITE_SCALE * (sprite.width - 2), y: this.position.y + SPRITE_SCALE * sprite.height / 2}, 
	//					  {x: this.position.x + SPRITE_SCALE * 6, y: this.position.y + SPRITE_SCALE * (sprite.height - 1)}];
	//this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	//let didCollide = false;
	this.getIsDying = function() {
		return sprite.isDying;
	};
	
	let unusedTime = 0;//time left over from last call to this.update, helps smooth movement with variable frame rate




	this.update = function(deltaTime, worldPos) {
		this.position.x = this.parentShip.position.x - 70;	// TODO don't hardcode position - force unit should be able to attach to the front or back of ship; and also float in front of, or behind, ship.. At some distance..
		this.position.y = this.parentShip.position.y;
		sprite.update(deltaTime);   //update the image
	};

	this.draw = function() {
		sprite.drawAt(this.position, this.size);
		//collision bodies know not to draw themselves if DRAW_COLLIDERS = false
		//this.collisionBody.draw();	//TODO re-enable once the collider is defined
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
