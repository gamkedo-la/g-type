//CreditFont
function CreditFont(activeImage, inactiveImage, frameSize, context) {
	const characters = [];
	this.addCreditsString = function(text, position, alignment, drawSize) {
		for(let i = 0; i < text.length; i++) {
			const character = text.charAt(i);
			const characterPos = getCharPos(i, position, alignment, text.length, drawSize);
			characters.push(new CollidableChar(activeImage, inactiveImage, character, frameSize, drawSize, characterPos, context));
		}
	};
	
	const getCharPos = function(index, stringPos, alignment, charCount, drawSize) {
		if(alignment === textAlignment.Left) {
			return leftAlignedCharPos(index, stringPos, drawSize);
		} else if(alignment === textAlignment.Center) {
			return centerAlignedCharPos(index, stringPos, charCount, drawSize);
		} else if(alignment === textAlignment.Right) {
			return rightAlignedCharPos(index, stringPos, drawSize);
		}
	};
	
	const leftAlignedCharPos = function(index, stringPos, drawSize) {
		return {x: stringPos.x + index * drawSize.width, y:stringPos.y};
	};
	
	const centerAlignedCharPos = function(index, stringPos, charCount, drawSize) {
		if(charCount % 2 === 0) {//even number of characters
			return {x: stringPos.x + (drawSize.width * (index - (charCount / 2))), y:stringPos.y};
		} else {//odd number of characters
			if(index < charCount / 2) {//need to subtract half a drawSize.width
				return {x: stringPos.x + (drawSize.width * (index - Math.floor(charCount / 2)) - Math.floor(drawSize.width / 2)), y: stringPos.y};
			} else {//need to add half a drawSize.width
				return {x: stringPos.x + (drawSize.width * (index - Math.floor(charCount / 2)) + Math.floor(drawSize.width / 2)), y: stringPos.y};				
			}
		}
	};
	
	const rightAlignedCharPos = function(index, stringPos, charCount, drawSize) {
		return {x: stringPos.x - (index - charCount) * drawSize.width, y:stringPos.y};
	};
	
	this.update = function(deltaTime, speed) {
		for(let i = 0; i < characters.length; i++) {
			characters[i].update(deltaTime, speed);
		}
	};
	
	this.draw = function() {
		for(let i = 0; i < characters.length; i++) {
			characters[i].draw();
		}
	};
	
	return this;
}

function CollidableChar(activeImage, inactiveImage, character, frameSize, drawSize, position, context) {
	this.isActive = true;
	this.isCollidable = false;
	this.type = EntityType.Text;
	this.position = {x:position.x, y:position.y};
	this.size = {width:drawSize.width, height:drawSize.height};
	
	const colliderPath = [{x: this.position.x, 					y: this.position.y}, 
						  {x: this.position.x + drawSize.width, y: this.position.y}, 
						  {x: this.position.x + drawSize.width, y: this.position.y + drawSize.height}, 
						  {x: this.position.x, 					y: this.position.y + drawSize.height}];
	this.collisionBody = new Collider(ColliderType.Polygon, {points: colliderPath, position:{x:this.position.x, y:this.position.y}});
	
	this.update = function(deltaTime, speed) {
		if(this.isActive) {
			if((this.position.y < GameField.bottom) && (this.position.y > GameField.y - drawSize.height)) {//active and onscreen
				if(!this.isCollidable) {//no collision checks occurring => add it to the list
					scene.addEntity(this, false);
					this.isCollidable = true;
				}
			} else if(this.isCollidable) {//Not onscreen but active and collidable => remove it from the list
				scene.removeEntity(this, false);
				this.isCollidable = false;
			}
		}
		
		this.position.x += (deltaTime * speed.x);
		this.position.y -= (deltaTime * speed.y);
		
		//keep the collisionBody position in synch with the visual position
		this.collisionBody.setPosition({x:this.position.x, y:this.position.y});
	};
	
	this.draw = function() {
		
		const thisFrame = frameForCharacter(character);
		
		let imageToUse = activeImage;
		if(!this.isActive) {
			imageToUse = inactiveImage;
		}
		context.drawImage(imageToUse, thisFrame.x, thisFrame.y, frameSize.width, frameSize.height, this.position.x, this.position.y, drawSize.width, drawSize.height);

		//collision bodies know not to draw themselves if DRAW_COLLIDERS = false
		this.collisionBody.draw();
	};
	
	this.didCollideWith = function(otherEntity) {
		this.isActive = false;
		this.isCollidable = false;
		scene.removeEntity(this, false);
	};
	
	const frameForCharacter = function(character) {
		switch(character) {
			case "a":
			case "A":
				return {x:0, y:0};
			case "b":
			case "B":
				return {x:frameSize.width, y:0};
			case "c":
			case "C":
				return {x:2 * frameSize.width, y:0};
			case "d":
			case "D":
				return {x:3 * frameSize.width, y:0};
			case "e":
			case "E":
				return {x:4 * frameSize.width, y:0};
			case "f":
			case "F":
				return {x:5 * frameSize.width, y:0};
			case "g":
			case "G":
				return {x:6 * frameSize.width, y:0};
			case "h":
			case "H":
				return {x:7 * frameSize.width, y:0};
			case "i":
			case "I":
				return {x:8 * frameSize.width, y:0};
			case "j":
			case "J":
				return {x:9 * frameSize.width, y:0};
			case "k":
			case "K":
				return {x:10 * frameSize.width, y:0};
			case "l":
			case "L":
				return {x:11 * frameSize.width, y:0};
			case "m":
			case "M":
				return {x:12 * frameSize.width, y:0};
			case "n":
			case "N":
				return {x:13 * frameSize.width, y:0};
			case "o":
			case "O":
				return {x:14 * frameSize.width, y:0};
			case "p":
			case "P":
				return {x:15 * frameSize.width, y:0};
			case "q":
			case "Q":
				return {x:16 * frameSize.width, y:0};
			case "r":
			case "R":
				return {x:17 * frameSize.width, y:0};
			case "s":
			case "S":
				return {x:18 * frameSize.width, y:0};
			case "t":
			case "T":
				return {x:19 * frameSize.width, y:0};
			case "u":
			case "U":
				return {x:20 * frameSize.width, y:0};
			case "v":
			case "V":
				return {x:21 * frameSize.width, y:0};
			case "w":
			case "W":
				return {x:22 * frameSize.width, y:0};
			case "x":
			case "X":
				return {x:23 * frameSize.width, y:0};
			case "y":
			case "Y":
				return {x:24 * frameSize.width, y:0};
			case "z":
			case "Z":
				return {x:25 * frameSize.width, y:0};
			case "0":
				return {x:0, y:frameSize.height};
			case "1":
				return {x:frameSize.width, y:frameSize.height};
			case "2":
				return {x:2 * frameSize.width, y:frameSize.height};
			case "3":
				return {x:3 * frameSize.width, y:frameSize.height};
			case "4":
				return {x:4 * frameSize.width, y:frameSize.height};
			case "5":
				return {x:5 * frameSize.width, y:frameSize.height};
			case "6":
				return {x:6 * frameSize.width, y:frameSize.height};
			case "7":
				return {x:7 * frameSize.width, y:frameSize.height};
			case "8":
				return {x:8 * frameSize.width, y:frameSize.height};
			case "9":
				return {x:9 * frameSize.width, y:frameSize.height};
			case "!":
				return {x:10 * frameSize.width, y:frameSize.height};
			case "@":
				return {x:11 * frameSize.width, y:frameSize.height};
			case "(":
			case "[":
				return {x:12 * frameSize.width, y:frameSize.height};
			case ")":
			case "]":
				return {x:13 * frameSize.width, y:frameSize.height};
			case ">":
				return {x:14 * frameSize.width, y:frameSize.height};
			case "<":
				return {x:15 * frameSize.width, y:frameSize.height};
			case "^":
				return {x:16 * frameSize.width, y:frameSize.height};
			case "|":
				return {x:17 * frameSize.width, y:frameSize.height};
			case "-":
				return {x:18 * frameSize.width, y:frameSize.height};
			case ".":
				return {x:19 * frameSize.width, y:frameSize.height};
			case ",":
				return {x:20 * frameSize.width, y:frameSize.height};
			case ";":
				return {x:21 * frameSize.width, y:frameSize.height};
			case ":":
				return {x:22 * frameSize.width, y:frameSize.height};
			case '"':
				return {x:23 * frameSize.width, y:frameSize.height};
			case '"':
				return {x:24 * frameSize.width, y:frameSize.height};
			case " ":
				return {x:25 * frameSize.width, y:frameSize.height};
			default:
				return {x:18.5 * frameSize.width, y:frameSize.height};//18.5 so it doesn't crash, but you can tell something's not right
		}
	};
	
	return this;
}