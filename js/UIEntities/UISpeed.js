//UISpeed
function SpeedUI(position = {x:0, y:0}) {
	this.position = {x:position.x, y:position.y};
	let isLit = false;
	let currentSpeed = 1;
	const MAX_SPEED = 4
	let scale = 2;
	
	const lightSprite1 = new AnimatedSprite(lightSpeedUI1, 9, 20, 21, false, true, {min:0, max:0}, 0, {min:0, max:8}, 256, {min:8, max:8}, 0);
	const lightSprite2 = new AnimatedSprite(lightSpeedUI2, 9, 36, 21, false, true, {min:0, max:0}, 0, {min:0, max:8}, 256, {min:8, max:8}, 0);
	const lightSprite3 = new AnimatedSprite(lightSpeedUI3, 9, 52, 21, false, true, {min:0, max:0}, 0, {min:0, max:8}, 256, {min:8, max:8}, 0);
	const lightSprite3Plus = new AnimatedSprite(lightSpeedUI3Plus, 9, 72, 21, true, true, {min:0, max:0}, 0, {min:0, max:8}, 256, {min:8, max:8}, 0);
	const darkSprite1 = new AnimatedSprite(darkSpeedUI1, 9, 20, 21, false, true, {min:0, max:0}, 0, {min:0, max:8}, 256, {min:8, max:8}, 0);
	const darkSprite2 = new AnimatedSprite(darkSpeedUI2, 9, 36, 21, false, true, {min:0, max:0}, 0, {min:0, max:8}, 256, {min:8, max:8}, 0);
	const darkSprite3 = new AnimatedSprite(darkSpeedUI3, 9, 52, 21, false, true, {min:0, max:0}, 0, {min:0, max:8}, 256, {min:8, max:8}, 0);
	const darkSprite3Plus = new AnimatedSprite(darkSpeedUI3Plus, 9, 72, 21, false, true, {min:0, max:0}, 0, {min:0, max:8}, 256, {min:8, max:8}, 0);
	
	let sprite = darkSprite1;
	this.size = {width:scale * sprite.width, height:scale * sprite.height};
	
	this.incrementSpeed = function() {
		currentSpeed++;
		if(currentSpeed > MAX_SPEED) {currentSpeed = MAX_SPEED;}
		
		this.setIsLit(false);
	};
	
	this.resetSpeed = function() {
		currentSpeed = 1;
		sprite = spriteForCurrentSpeedAndLighting();
		
		this.adjustSizeAndPosition();
	};
	
	this.setIsLit = function(isNowLit) {
		isLit = isNowLit;
		sprite = spriteForCurrentSpeedAndLighting();

		this.adjustSizeAndPosition();
	};
	
	this.adjustSizeAndPosition = function() {
		const basePosX = this.position.x + this.size.width / 2;
		const basePosY = this.position.y + this.size.height / 2;
		
		this.size = {width:scale * sprite.width, height:scale * sprite.height};
		
		this.position.x = basePosX - this.size.width / 2;
		this.position.y = basePosY - this.size.height / 2;
	};
		
	const spriteForCurrentSpeedAndLighting = function() {
		if(isLit) {
			switch(currentSpeed) {
				case 1:
					scale = 2;
					return lightSprite1;
				case 2:
					scale = 2;
					return lightSprite2;
				case 3:
					scale = 1.5;
					return lightSprite3;
				default:
					scale = 1;
					return lightSprite3Plus;
			}
		} else {//not lit
			switch(currentSpeed) {
				case 1:
					scale = 2;
					return darkSprite1;
				case 2:
					scale = 2;
					return darkSprite2;
				case 3:
					scale = 1.5;
					return darkSprite3;
				default:
					scale = 1;
					return darkSprite3Plus;
			}
		}
	};
	
	this.update = function(deltaTime) {		
		sprite.update(deltaTime);
	};
	
	this.draw = function() {
		sprite.drawAt(this.position, this.size);
	};
}