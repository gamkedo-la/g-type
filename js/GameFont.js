//GameFont
function GameFont(image, charSize, context) {
    let yPos;
	this.printTextAt = function(text, position, height, alignment, scrollProperty) {
		let actualXPos = position.x;		
        let actualYPos;
		let yPosScrollOffset = 0;

		const drawWidth = (height / charSize.height) * charSize.width;
		
		if(alignment === textAlignment.Center) {
			actualXPos -= (Math.floor(drawWidth * text.length / 2));
		} else if(alignment === textAlignment.Right) {
			actualXPos -= (drawWidth * text.length);
		}
		
		for(let i = 0; i < text.length; i++) {
			const thisFrame = frameForCharacter(text.charAt(i));
            
            if(!ScreenStates.isPaused) {
                if(scrollProperty != undefined) {
                    yPos -= (scrollProperty.deltaTime * scrollProperty.speed.y);
                }
            }
            
            if(scrollProperty === undefined) {
                yPos = position.y;
                yPosScrollOffset = 0;
            } else {
                yPosScrollOffset = (canvas.height - position.y) - canvas.height * 0.25;
            }
			
			actualYPos = yPos - yPosScrollOffset;
            context.drawImage(image, thisFrame.x, thisFrame.y, charSize.width, charSize.height, actualXPos + (i * drawWidth), actualYPos, drawWidth, height);
		}
	};
	
	const frameForCharacter = function(character) {
		switch(character) {
			case "a":
			case "A":
				return {x:0, y:0};
			case "b":
			case "B":
				return {x:charSize.width, y:0};
			case "c":
			case "C":
				return {x:2 * charSize.width, y:0};
			case "d":
			case "D":
				return {x:3 * charSize.width, y:0};
			case "e":
			case "E":
				return {x:4 * charSize.width, y:0};
			case "f":
			case "F":
				return {x:5 * charSize.width, y:0};
			case "g":
			case "G":
				return {x:6 * charSize.width, y:0};
			case "h":
			case "H":
				return {x:7 * charSize.width, y:0};
			case "i":
			case "I":
				return {x:8 * charSize.width, y:0};
			case "j":
			case "J":
				return {x:9 * charSize.width, y:0};
			case "k":
			case "K":
				return {x:10 * charSize.width, y:0};
			case "l":
			case "L":
				return {x:11 * charSize.width, y:0};
			case "m":
			case "M":
				return {x:12 * charSize.width, y:0};
			case "n":
			case "N":
				return {x:13 * charSize.width, y:0};
			case "o":
			case "O":
				return {x:14 * charSize.width, y:0};
			case "p":
			case "P":
				return {x:15 * charSize.width, y:0};
			case "q":
			case "Q":
				return {x:16 * charSize.width, y:0};
			case "r":
			case "R":
				return {x:17 * charSize.width, y:0};
			case "s":
			case "S":
				return {x:18 * charSize.width, y:0};
			case "t":
			case "T":
				return {x:19 * charSize.width, y:0};
			case "u":
			case "U":
				return {x:20 * charSize.width, y:0};
			case "v":
			case "V":
				return {x:21 * charSize.width, y:0};
			case "w":
			case "W":
				return {x:22 * charSize.width, y:0};
			case "x":
			case "X":
				return {x:23 * charSize.width, y:0};
			case "y":
			case "Y":
				return {x:24 * charSize.width, y:0};
			case "z":
			case "Z":
				return {x:25 * charSize.width, y:0};
			case "0":
				return {x:0, y:charSize.height};
			case "1":
				return {x:charSize.width, y:charSize.height};
			case "2":
				return {x:2 * charSize.width, y:charSize.height};
			case "3":
				return {x:3 * charSize.width, y:charSize.height};
			case "4":
				return {x:4 * charSize.width, y:charSize.height};
			case "5":
				return {x:5 * charSize.width, y:charSize.height};
			case "6":
				return {x:6 * charSize.width, y:charSize.height};
			case "7":
				return {x:7 * charSize.width, y:charSize.height};
			case "8":
				return {x:8 * charSize.width, y:charSize.height};
			case "9":
				return {x:9 * charSize.width, y:charSize.height};
			case "!":
				return {x:10 * charSize.width, y:charSize.height};
			case "@":
				return {x:11 * charSize.width, y:charSize.height};
			case "(":
			case "[":
				return {x:12 * charSize.width, y:charSize.height};
			case "]":
			case ")":
				return {x:13 * charSize.width, y:charSize.height};
			case ">":
				return {x:14 * charSize.width, y:charSize.height};
			case "<":
				return {x:15 * charSize.width, y:charSize.height};
			case "^":
				return {x:16 * charSize.width, y:charSize.height};
			case "|":
				return {x:17 * charSize.width, y:charSize.height};
			case "-":
				return {x:18 * charSize.width, y:charSize.height};
			case ".":
				return {x:19 * charSize.width, y:charSize.height};
			case ",":
				return {x:20 * charSize.width, y:charSize.height};
			case ";":
				return {x:21 * charSize.width, y:charSize.height};
			case ":":
				return {x:22 * charSize.width, y:charSize.height};
			case '"':
				return {x:23 * charSize.width, y:charSize.height};
			case '"':
				return {x:24 * charSize.width, y:charSize.height};
			case "?":
				return {x:25 * charSize.width, y:charSize.height};
			case "=":
				return {x:0, y: 2 * charSize.height};
			case "/":
				return {x:charSize.width, y:2 * charSize.height};
			case "+":
				return {x:2 * charSize.width, y:2 * charSize.height};
			case " ":
				return {x:3 * charSize.width, y:2 * charSize.height};
			default:
				return {x:18.5 * charSize.width, y:charSize.height};//18.5 so it doesn't crash, but you can tell something's not right
		}
	};
}

//CreditFont
function CreditFont(activeImage, inactiveImage, frameSize, context) {
	const characters = [];
	const charactersStartPos = [];
	
	let resetScrollOffsetY = 0;
	let currentScrollPosY = resetScrollOffsetY;
	let isResetScroll = false;

	this.addCreditsString = function(text, position, alignment, drawSize) {
		for(let i = 0; i < text.length; i++) {
			const character = text.charAt(i);
			const characterPos = getCharPos(i, position, alignment, text.length, drawSize);
			characters.push(new CollidableChar(activeImage, inactiveImage, character, frameSize, drawSize, {x:characterPos.x, y:characterPos.y + currentScrollPosY}, context));
			charactersStartPos.push(characterPos);
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
			if (!isResetScroll) {
				characters[i].update(deltaTime, speed);
			}
		}
	};
	
	this.draw = function() {
		for(let i = 0; i < characters.length; i++) {
			if (isResetScroll) {
				currentScrollPosY = charactersStartPos[i].y + resetScrollOffsetY;
				characters[i].position.y = currentScrollPosY;
			} else {
				currentScrollPosY = characters[i].position.y;
			}

			if((characters[i].position.y > (GameField.y - 90)) && (characters[i].position.y < (canvas.height - 55))) {				
				characters[i].draw(characters[i].position.x, currentScrollPosY);
			}
		}
		if (isResetScroll) {
			isResetScroll = false;
		}
	};
	
	this.resetScrollY = function(resetOffsetY = resetScrollOffsetY) {
		isResetScroll = true;
		resetScrollOffsetY = resetOffsetY;
	}

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
	
	this.draw = function(posX = this.position.x, posY = this.position.y) {
		this.position.x = posX;
		this.position.y = posY;

		const thisFrame = frameForCharacter(character);
		
		let imageToUse = activeImage;
		if(!this.isActive) {
			imageToUse = inactiveImage;
		}
		context.drawImage(imageToUse, thisFrame.x, thisFrame.y, frameSize.width, frameSize.height, posX, posY, drawSize.width, drawSize.height);

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
			case "?":
				return {x:25 * frameSize.width, y:frameSize.height};
			case "=":
				return {x:0, y:2 * frameSize.height};
			case "/":
				return {x:frameSize.width, y:2 * frameSize.height};
			case "+":
				return {x:2 * frameSize.width, y:2 * frameSize.height};
			case " ":
				return {x:3 * frameSize.width, y:2 * frameSize.height};
			default:
				return {x:18.5 * frameSize.width, y:frameSize.height};//18.5 so it doesn't crash, but you can tell something's not right
		}
	};
	
	return this;
}
