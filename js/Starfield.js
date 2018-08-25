//Starfield
function Starfield() {
	let farthestStars = [];
    let middleStars = [];
    let nearestStars = [];
    
	const farthestCount = 15;
    const middleCount = 12;
    const nearestCount = 8;
    
    for(let i = 0; i < farthestCount; i++) {
	    const xPos = Math.floor(Math.random() * canvas.width);
	    const yPos = Math.floor(Math.random() * canvas.height);
	    const minFrame = 3 * Math.floor(Math.random() * 4);
	    const frameTime = 512;
	    const reverses = ((xPos % 2) == 0);//using xPos because it is convenient and already random
	    
	    const aStar = new AnimatedSprite(starSheet, 3, 5, 5, reverses, true, {min:minFrame, max:minFrame}, 0, {min:minFrame, max:minFrame + 2}, frameTime, {min:minFrame + 2, max:minFrame + 2}, 0);
	    farthestStars.push(new StarEntity(aStar, {x:xPos, y:yPos}, {x:0, y:0}, {width:5, height:5}));
    }
    
    for(let i = 0; i < middleCount; i++) {
	    const xPos = Math.floor(Math.random() * canvas.width);
	    const yPos = Math.floor(Math.random() * canvas.height);
	    const minFrame = 3 * Math.floor(Math.random() * 4);
	    const frameTime = 512;
	    const reverses = ((xPos % 2) == 0);//using xPos because it is convenient and already random
	    
	    const aStar = new AnimatedSprite(starSheet, 3, 5, 5, reverses, true, {min:minFrame, max:minFrame}, 0, {min:minFrame, max:minFrame + 2}, frameTime, {min:minFrame + 2, max:minFrame + 2}, 0);
	    middleStars.push(new StarEntity(aStar, {x:xPos, y:yPos}, {x:-8, y:0}, {width:7, height:7}));
    }
    
    for(let i = 0; i < nearestCount; i++) {
	    const xPos = Math.floor(Math.random() * canvas.width);
	    const yPos = Math.floor(Math.random() * canvas.height);
	    const minFrame = 3 * Math.floor(Math.random() * 4);
	    const frameTime = 512;
	    const reverses = ((xPos % 2) == 0);//using xPos because it is convenient and already random
	    
	    const aStar = new AnimatedSprite(starSheet, 3, 5, 5, reverses, true, {min:minFrame, max:minFrame}, 0, {min:minFrame, max:minFrame + 2}, frameTime, {min:minFrame + 2, max:minFrame + 2}, 0);
	    nearestStars.push(new StarEntity(aStar, {x:xPos, y:yPos}, {x:-16, y:0}, {width:9, height:9}));
    }
    
    this.update = function(deltaTime) {
	    for(let i = 0; i < farthestStars.length; i++) {
	        farthestStars[i].update(deltaTime);
        }

		for(let i = 0; i < middleStars.length; i++) {
	        middleStars[i].update(deltaTime);
        }

		for(let i = 0; i < nearestStars.length; i++) {
	        nearestStars[i].update(deltaTime);
        }
    }
    
    this.draw = function() {
        for(let i = 0; i < farthestStars.length; i++) {
	        farthestStars[i].draw();
        }
        
        for(let i = 0; i < middleStars.length; i++) {
	        middleStars[i].draw();
        }

        for(let i = 0; i < nearestStars.length; i++) {
	        nearestStars[i].draw();
        }
    }
}