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
