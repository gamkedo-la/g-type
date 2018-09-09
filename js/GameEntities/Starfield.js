//Starfield
function Starfield() {
	let stars = [];

	const farthestCount = 15;
    const middleCount = 12;
    const nearestCount = 8;
    
    for(let i = 0; i < farthestCount; i++) {
	    const xPos = GameField.x + Math.floor(Math.random() * GameField.width);
	    const yPos = GameField.y + Math.floor(Math.random() * GameField.height);
	    const minFrame = 3 * Math.floor(Math.random() * 4);
	    const frameTime = 512;
	    const reverses = ((xPos % 2) === 0);//using xPos because it is convenient and already random
	    
	    const aStar = new AnimatedSprite(starSheet, 3, 5, 5, reverses, true, {min:minFrame, max:minFrame}, 0, {min:minFrame, max:minFrame + 2}, frameTime, {min:minFrame + 2, max:minFrame + 2}, 0);
      stars.push(new StarEntity(aStar, {x:xPos, y:yPos}, {x:-2, y:0}, {width:5, height:5}));
    }
    
    for(let i = 0; i < middleCount; i++) {
	    const xPos = GameField.x + Math.floor(Math.random() * GameField.width);
	    const yPos = GameField.y + Math.floor(Math.random() * GameField.height);
	    const minFrame = 3 * Math.floor(Math.random() * 4);
	    const frameTime = 512;
	    const reverses = ((xPos % 2) === 0);//using xPos because it is convenient and already random
	    
	    const aStar = new AnimatedSprite(starSheet, 3, 5, 5, reverses, true, {min:minFrame, max:minFrame}, 0, {min:minFrame, max:minFrame + 2}, frameTime, {min:minFrame + 2, max:minFrame + 2}, 0);
      stars.push(new StarEntity(aStar, {x:xPos, y:yPos}, {x:-8, y:0}, {width:7, height:7}));
    }
    
    for(let i = 0; i < nearestCount; i++) {
	    const xPos = GameField.x + Math.floor(Math.random() * GameField.width);
	    const yPos = GameField.y + Math.floor(Math.random() * GameField.height);
	    const minFrame = 3 * Math.floor(Math.random() * 4);
	    const frameTime = 512;
	    const reverses = ((xPos % 2) === 0);//using xPos because it is convenient and already random
	    
	    const aStar = new AnimatedSprite(starSheet, 3, 5, 5, reverses, true, {min:minFrame, max:minFrame}, 0, {min:minFrame, max:minFrame + 2}, frameTime, {min:minFrame + 2, max:minFrame + 2}, 0);
      stars.push(new StarEntity(aStar, {x:xPos, y:yPos}, {x:-16, y:0}, {width:9, height:9}));
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
