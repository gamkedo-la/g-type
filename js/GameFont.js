//GameFont
function GameFont(image, charSize, context) {
	let actualYPos = canvas.height;
	this.printTextAt = function(text, position, height, alignment, scrollProperty) {
		let actualXPos = position.x;		
		let actualYPosOffset;

		const drawWidth = (height / charSize.height) * charSize.width;
		
		if(alignment === textAlignment.Center) {
			actualXPos -= (Math.floor(drawWidth * text.length / 2));
		} else if(alignment === textAlignment.Right) {
			actualXPos -= (drawWidth * text.length);
		}
		
		for(let i = 0; i < text.length; i++) {
			const thisFrame = frameForCharacter(text.charAt(i));

			if (scrollProperty) {
				actualYPos -= (scrollProperty.deltaTime * scrollProperty.speed.y);
				actualYPosOffset = (canvas.height - position.y) - canvas.height * 0.25;
			} else {
				actualYPos = position.y;
				actualYPosOffset = 0;
			}

			context.drawImage(image, thisFrame.x, thisFrame.y, charSize.width, charSize.height, actualXPos + (i * drawWidth), actualYPos - actualYPosOffset, drawWidth, height);
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
				return {x:25 * charSize.width, y:charSize.height};
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
			case "[":
				return {x:12 * charSize.width, y:charSize.height};
			case "]":
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
			case " ":
				return {x:19 * charSize.width, y:charSize.height};
			default:
				return {x:18.5 * charSize.width, y:charSize.height};//18.5 so it doesn't crash, but you can tell something's not right
		}
	};
}