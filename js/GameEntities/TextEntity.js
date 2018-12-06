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
