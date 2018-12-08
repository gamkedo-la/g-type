//Starfield
function Starfield(farthest=15, middle=12, nearest=8, fVel = -2, mVel = -8, nVel = -16 ) {
	let stars = [];

	const farthestCount = farthest;
    const middleCount = middle;
    const nearestCount = nearest;
    
    for(let i = 0; i < farthestCount; i++) {
	    const xPos = Math.floor(Math.random() * CANVAS_WIDTH);
	    const yPos = Math.floor(Math.random() * CANVAS_HEIGHT);
	    const minFrame = 3 * Math.floor(Math.random() * 4);
	    const frameTime = 512;
	    const reverses = ((xPos % 2) === 0);//using xPos because it is convenient and already random
	    
	    const aStar = new AnimatedSprite(starSheet, 3, 5, 5, reverses, true, {min:minFrame, max:minFrame}, 0, {min:minFrame, max:minFrame + 2}, frameTime, {min:minFrame + 2, max:minFrame + 2}, 0);
      stars.push(new StarEntity(aStar, {x:xPos, y:yPos}, {x: fVel, y:0}, {width:5, height:5}));
    }
    
    for(let i = 0; i < middleCount; i++) {
	    const xPos = Math.floor(Math.random() * CANVAS_WIDTH);
	    const yPos = Math.floor(Math.random() * CANVAS_HEIGHT);
	    const minFrame = 3 * Math.floor(Math.random() * 4);
	    const frameTime = 512;
	    const reverses = ((xPos % 2) === 0);//using xPos because it is convenient and already random
	    
	    const aStar = new AnimatedSprite(starSheet, 3, 5, 5, reverses, true, {min:minFrame, max:minFrame}, 0, {min:minFrame, max:minFrame + 2}, frameTime, {min:minFrame + 2, max:minFrame + 2}, 0);
      stars.push(new StarEntity(aStar, {x:xPos, y:yPos}, {x: mVel, y:0}, {width:7, height:7}));
    }
    
    for(let i = 0; i < nearestCount; i++) {
	    const xPos = Math.floor(Math.random() * CANVAS_WIDTH);
	    const yPos = Math.floor(Math.random() * CANVAS_HEIGHT);
	    const minFrame = 3 * Math.floor(Math.random() * 4);
	    const frameTime = 512;
	    const reverses = ((xPos % 2) === 0);//using xPos because it is convenient and already random
	    
	    const aStar = new AnimatedSprite(starSheet, 3, 5, 5, reverses, true, {min:minFrame, max:minFrame}, 0, {min:minFrame, max:minFrame + 2}, frameTime, {min:minFrame + 2, max:minFrame + 2}, 0);
      stars.push(new StarEntity(aStar, {x:xPos, y:yPos}, {x: nVel, y:0}, {width:9, height:9}));
    }
    
    this.update = function(deltaTime) {
	    for(let i = 0; i < stars.length; i++) {
        stars[i].update(deltaTime);
        }
    };
    
    this.draw = function() {
        for(let i = 0; i < stars.length; i++) {
          stars[i].draw();
        }
    };
}

//Star Entity
function StarEntity(sprite, position = {x:0, y:0}, velocity = {x:0, y:0}, size = {width:sprite.width, height:sprite.height}, collisionBody = null) {
	let pos = position;
	let vel = velocity;
	let unusedTime = 0;
	this.size = size;
	
	sprite.setRandomFrame();
	
	this.update = function(deltaTime) {
		sprite.update(deltaTime);//update the image
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			
			pos.x += vel.x * SIM_STEP / 1000;
			pos.y += vel.y * SIM_STEP / 1000;

			// Wrap around the screen at a different position
			if(pos.x < sprite.width) {
				pos.x = CANVAS_WIDTH + sprite.width;
				pos.y = Math.floor(Math.random() * CANVAS_HEIGHT);
			}
		}
		
		unusedTime = availableTime;
	};
	
	this.draw = function() {
		sprite.drawAt(pos.x, pos.y, this.size.width, this.size.height);
	};
	
	this.didCollideWith = function(otherEntity) {
		if((this.collisionBody == null) || (otherEntity.collisionBody == null)) {return false;}
	};
	
	return this;
}

//In Game Text Entity
function TextEntity(text = "100", 
					font = Fonts.CreditsText, 
					color = Color.White, 
					position = {x:0, y:0}, 
					lifeSpan = 128, 
					shouldDrift = true) {
						
	this.type = EntityType.Text;
	this.position = position;
	this.worldPos = null;
	this.lifeSpan = lifeSpan;
	let unusedTime = 0;
	const yVel = -10;
	let currentAlpha = 1.0;
	
	canvasContext.save();
	canvasContext.font = font;
	
	this.size = {width:canvasContext.measureText(text).width, height:canvasContext.measureText(text).height};
	canvasContext.restore();
	
	this.collisionBody = null;
	
	this.update = function(deltaTime, worldPos) {
		if(currentAlpha <= 0.1) {
			scene.removeEntity(this, false);
			return;
		}
		
		if(this.worldPos == null) {
			this.worldPos = worldPos;
		}
		
		let availableTime = unusedTime + deltaTime;
		while(availableTime > SIM_STEP) {
			availableTime -= SIM_STEP;
			this.lifeSpan -= SIM_STEP;
			
			if(shouldDrift) {
				this.position.x -= (worldPos - this.worldPos);
			}
			
			this.worldPos = worldPos;
			
			this.position.y += (SIM_STEP * yVel / 1000);
			
			if(this.lifeSpan / lifeSpan < 0.5) {
				currentAlpha -= 0.05;
			}
		}
	};
	
	this.draw = function() {
		colorText(text, this.position.x, this.position.y, color, font, textAlignment.Left, currentAlpha);
	};
	
	return this;
}