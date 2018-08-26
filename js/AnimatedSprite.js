//Animated Sprite
function AnimatedSprite(sheet, 
						frameCount = 1, 
						frameWidth = (sheet.width / frameCount), 
						frameHeight = sheet.height, 
						reverses = false, //true = lifeRange frames play back and forth, false = return to lifeRange.min after reaching lifeRange.max
						autoLife = true, //true = automatically transition from birthRange.max to lifeRange.min, false requires manually setting wasBorn to true
						birthRange = {min:0, max:0},
						birthRate = 0,
						lifeRange = {min:0, max:(frameCount - 1)},
						lifeRate = 128, 
						deathRange = {min:0, max:(frameCount - 1)},
						deathRate = 0) 
{
	
	this.width = frameWidth;
	this.height = frameHeight;
	this.birthRange = birthRange;
	this.birthRate = birthRate;
	this.wasBorn = false;
	this.lifeRange = lifeRange;
	this.lifeRate = lifeRate;
	this.deathRange = deathRange;
	this.deathRate = deathRate;
	this.isDying = false;
	let deadCount = 0;
	this.getDidDie = function() {
		if((this.isDying) && (this.currentFrame == this.deathRange.max) && (deadCount > 2)) {
			deadCount = 0;
			return true;
		} else {
			return false;
		}
	}
	
	this.unusedTime = 0;
	this.currentFrame = this.birthRange.min;
	this.isReversing = false;
	this.FRAMES_PER_ROW = Math.round(sheet.width / this.width);
	this.currentFramePos = {x:0, y:0};
	
	this.setFrameRate = function(newFrameRate, which) {
		if(which == "birth") {
			this.birthRate = newFrameRate;
		} else if(which == "death") {
			this.deathRate = newFrameRate;
		} else {
			this.lifeRate = newFrameRate;
		}
	}
	
	this.setFrame = function(newFrame) {
		if(newFrame > this.birthRange.max) {
			wasBorn = true;
		} else if(newFrame > this.lifeRange.max) {
			wasBorn = true;
			isDying = true;
		}
		
		this.currentFrame = newFrame;
	}
	
	this.getCurrentFrame = function() {
		return this.currentFrame;
	}
	
	this.setRandomFrame = function() {
		this.currentFrame = this.lifeRange.min + (this.lifeRange.max - this.lifeRange.min) * Math.floor(Math.random());
	}
	
	this.update = function(deltaTime) {
		let availableTime = this.unusedTime + deltaTime;
		
		let currentFrameRate = this.getCurrentRate();
		
		while(availableTime >= currentFrameRate) {
			availableTime -= currentFrameRate;
			
			if(!this.wasBorn) {
				this.currentFrame++;
				if(this.currentFrame > this.birthRange.max) {
					if(autoLife) {
						this.wasBorn = true;
						currentFrameRate = this.getCurrentRate();
						this.currentFrame = this.lifeRange.min;
					} else {
						this.currentFrame = this.birthRange.max;
					}
				}
			} else if(this.isDying) {
				if(this.currentFrame < deathRange.min) {
					this.currentFrame = deathRange.min;
				} else if(this.currentFrame < (deathRange.max - 1)) {
					this.currentFrame++;
				} else {
					this.currentFrame = deathRange.max;
					deadCount++;
				}
			} else if(this.isReversing) {
				this.currentFrame--;
				
				if(this.currentFrame < this.lifeRange.min) {
					this.isReversing = false;
					this.currentFrame = this.lifeRange.min + 1;
				}
			} else {
				this.currentFrame++;
				
				if(this.currentFrame < this.lifeRange.min) {//could happen if transition from birth to life occurs quickly
					this.currentFrame = this.lifeRange.min;
				}
				
				if(this.currentFrame > this.lifeRange.max) {
					if(reverses) {
						this.isReversing = true;
						this.currentFrame = this.lifeRange.max - 1;
					} else {
						this.currentFrame = this.lifeRange.min;
					}
				}
			}			
		}
		
		this.unusedTime = availableTime;
		
		this.currentFramePos.x = this.width * (this.currentFrame % this.FRAMES_PER_ROW);
		this.currentFramePos.y = this.height * (Math.floor(this.currentFrame / this.FRAMES_PER_ROW));
	}
	
	this.getCurrentRate = function() {
		let answer = this.lifeRate;
		if(this.isDying) {
			answer = this.deathRate;
		} else if(!this.wasBorn) {
			answer = this.birthRate;
		}
		
		return answer;
	}
	
	this.drawAt = function(position, size = {width:this.width, height:this.height}) {
		canvasContext.drawImage(sheet, this.currentFramePos.x, this.currentFramePos.y, this.width, this.height, position.x, position.y, size.width, size.height);
	}
	
	return this;
}