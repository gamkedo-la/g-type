//UIForce
function UIForce(position = {x:0, y:0}) {
    this.position = {x:position.x, y:position.y};
    this.isLit = false;
    const SPRITE_SCALE = 1.75;
    const lightSprite = new AnimatedSprite(lightForceUI, 4, 50, 50, true, true, {min:0, max:0}, 0, {min:0, max:3}, 512, {min:1, max:3}, 0);
    const darkSprite = new AnimatedSprite(darkForceUI, 6, 50, 50, true, true, {min:0, max:0}, 0, {min:0, max:5}, 1536, {min:1, max:5}, 0);

    this.size = {width:SPRITE_SCALE * lightSprite.width, height:SPRITE_SCALE * lightSprite.height};
    
    let sprite = darkSprite;
    
    this.update = function(deltaTime) {
        if(this.isLit) {
            sprite = lightSprite;
        } else {
            sprite = darkSprite;
        }
        
        sprite.update(deltaTime);
    };
    
    this.draw = function() {
        sprite.drawAt(this.position.x, this.position.y, this.size.width, this.size.height);
    };
}
