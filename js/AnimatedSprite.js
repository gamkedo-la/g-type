//Animated Sprite
function AnimatedSprite(sheet, 
						frameCount = 1, 
						frameWidth = (sheet.width / frameCount), 
						frameHeight = sheet.height, 
						timePerFrame = 128, 
						frameRange = {min:0, max:(frameCount - 1)}, 
						reverses = false) 
{
	
	this.width = frameWidth;
	this.height = frameHeight;
	this.frameRate = timePerFrame;
	this.frameRange = frameRange;
	
	this.unusedTime = 0;
	this.currentFrame = frameRange.min;
	let isReversing = false;
	this.FRAMES_PER_ROW = Math.round(sheet.width / this.width);
	this.currentFramePos = {x:0, y:0};
	
	this.setFrameRate = function(newFrameRate) {
		this.frameRate = newFrameRate;
	}
	
	this.setFrame = function(newFrame) {
		this.currentFrame = newFrame;
	}
	
	this.getCurrentFrame = function() {
		return this.currentFrame;
	}
	
	this.setRandomFrame = function() {
		this.currentFrame = frameRange.min + frameCount * Math.floor(Math.random());
	}
	
	this.update = function(deltaTime) {
		let availableTime = this.unusedTime + deltaTime;
		
		while(availableTime >= this.frameRate) {
			availableTime -= this.frameRate;
			
			if(isReversing) {
				this.currentFrame--;
				
				if(this.currentFrame < frameRange.min) {
					isReversing = false;
					this.currentFrame = frameRange.min + 1;
				}
			} else {
				this.currentFrame++;
				
				if(this.currentFrame > frameRange.max) {
					if(reverses) {
						isReversing = true;
						this.currentFrame = frameRange.max - 1;
					} else {
						this.currentFrame = frameRange.min;
					}
				}
			}
		}
		
		this.unusedTime = availableTime;
		
		this.currentFramePos.x = this.width * (this.currentFrame % this.FRAMES_PER_ROW);
		this.currentFramePos.y = this.height * (Math.floor(this.currentFrame / this.FRAMES_PER_ROW));
	}
	
	this.drawAt = function(position, size = {width:this.width, height:this.height}) {
		canvasContext.drawImage(sheet, this.currentFramePos.x, this.currentFramePos.y, this.width, this.height, position.x, position.y, size.width, size.height);
	}
	
	return this;
}