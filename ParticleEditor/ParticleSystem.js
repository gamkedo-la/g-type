
//Current version: v1.1.0

// Particle system for club JS games. Made by your Gamkedo friend Remy, with original code from Christer
// and much inspiration from this tutorial: http://buildnewgames.com/particle-systems/ .

// For pretty particles to spawn, we need two things: a ParticleEmitter (created with createParticleEmitter() ) and the ParticleRenderer.
// The emitter is the spawning point, the place where the particles are born. It also takes care of updating them properly and
// killing them when appropriate. Everything is defined in the "config" variable which is used to initialize particles.
// Note that configs are completely reusable for multiple emitters, and hence it might be worth it to create hard-coded particle configs (in CodedAssets folder)
// Update: you will soon be able to use the ParticleEditor.html to generate your own particle settings, ready to import in code!

// The ParticleRenderer is already created as an object literal in this script. You can access it using ParticleRenderer.foo()

// The Particle object is a dummy. The class is empty, everything is initialized in the ParticleEmitter. These settings are all in the "config" object litteral that you must create and pass as an argument to the ParticleEmitter constructor.

// Fun implementation insight:
// There are often many particles in a typical game; depending on the genre, each frame may have 100+ particles going on at once
// As such, it becomes useful to implement what is known as object pooling. This reuses old particles (resuscitates them) so that instead
// of allocating new memory, we simply move a previously dead particle and start it all over again (which is fine because it is only a visual effect).
// As of v1.1, this is also true for the particle emitters themselves.

// Don't hesitate to contact me if you need help or want a walkthrough of the implementation! :)

// <3 Remy



// Use this to create emitters in your game!
function createParticleEmitter(x,y, config) {
    ParticleEmitterManager.createParticleEmitter(x,y, config);
}


function ParticleEmitter () {

    
    ////////       Initialize the emitter with configurations, if undefined set to (arbitrary and/or logical) default          //////////

    ParticleEmitter.prototype.init = function (x,y, config) {
        
        //Avoids error and lets us set to default configs 
        if (typeof config === "undefined") {
        config = {};
        }

        this.pool = [];
        this.poolPointer = 0; //moves around in the pool, pointing to the last dead particle
        this.toSwap = []; //stores which particles died this frame and need to be swapped
    
        this.isActive = true;

        this.emissionRate = config.emissionRate || 10;
        if (this.emissionRate != 0) {
            this.emitCounter = 1/this.emissionRate; //init at this value so we spawn a particle on the first frame! (ie not wait the first spawn interval)
        } else {
            this.emitCounter = 0;
        }
        //stores delta times and tells us if we must create a new particle
    
        this.x = x || 0;
        this.y = y || 0;
    
        this.duration = config.duration || 2; //note: all particles finish their lives before an emitter truly dies
        this.timeLeft = this.duration;
        this.immortal = config.immortal || false; //if the emitter is immortal, duration/timeLeft is ignored
    
        this.pLife = config.particleLife || 2;

        this.speed = config.speed || 25;
        this.angle = config.angle*(Math.PI/180) || 0; //converts to rads for the calculations
        this.size = config.size || 1;

        this.startColor = config.color || [247,46,0, 1]; //default is rgb for a nice orange (with alpha = 1)
        this.endColor = config.endColor || this.startColor;

        this.useTexture = config.useTexture || false; //this can be turned off to improve performance
        this.texture = config.texture; // add a default texture?
        this.textureAdditive = config.textureAdditive || false; //turn off to improve performance
        this.tint = config.tint || false; //tint uses the color property just like a normal particle
    
        this.fadeAlpha = config.fadeAlpha || false; //fades the alpha over the particle's lifetime
        this.fadeSize = config.fadeSize || false;
        this.fadeSpeed = config.fadeSpeed || false;
    
        this.gravity = config.gravity || 0; //currently does nothing, will add when needed
    
    
    
        // Var is the degree at which the value varies randomly. The formula: value = base + var * (random (-1 to 1))
        this.xVar = config.xVar || 0;
        this.yVar = config.yVar || 0;

        this.pLifeVar = config.particleLifeVar || 0;

        this.speedVar = config.speedVar || 0;

        this.angleVar = (config.angleVar >= 0 && config.angleVar <=360) ? config.angleVar*(Math.PI/180) : 360; //needs testing
        this.sizeVar = config.sizeVar || 0;
    
        this.startColorVar = config.startColorVar || [0,0,0,0];
        this.endColorVar = config.endColorVar || [0,0,0,0];
    }


    //Give dt in seconds
    ParticleEmitter.prototype.update = function (dt) {

        this.toSwap = [];

        //Update emitter time left
        if (this.isActive && this.immortal === false){
            this.timeLeft -= dt; //in seconds
            if (this.timeLeft < 0) {
                this.isActive = false;
            }
        }

        //Emit new particles if needed           
        if (this.emissionRate != 0 && this.isActive){

            let rate = 1 / this.emissionRate;

            // Here, we check how many particles we have to spawn. It's possible that for a given dt, we have to spawn
            // more than 1 if emissionRate is high enough, hence the while loop and the emitCounter
            this.emitCounter += dt;
            while (this.emitCounter > rate){
                this.addParticle();
                this.emitCounter -= rate;
            }
        }

        //Update all alive particles (moves, applies forces, but NO RENDERING here)
        for (var i = 0, l = this.poolPointer; i < l; i++) {

            this.updateParticle(this.pool[i], i, dt);
        }
        
        // Return all that died to pool
        for (var i = 0, l = this.toSwap.length; i < l; i++){
                    
            this.returnParticleToPool(this.toSwap[i]);
        }

    }

    ParticleEmitter.prototype.updateParticle = function (particle, particleIndex, dt) {

        particle.lifeLeft -= dt; // again, times are in seconds!

        // if alive, do EVERYTHING!
        if (particle.lifeLeft > 0){
               		
    		particle.x += particle.velocity.x * dt;
            particle.y += particle.velocity.y * dt;
            
            particle.color[0] += particle.deltaColor[0] * dt;
            particle.color[1] += particle.deltaColor[1] * dt;
            particle.color[2] += particle.deltaColor[2] * dt;
            particle.color[3] += particle.deltaColor[3] * dt;

            //Update the fading over lifetime properties
            var ageRatio = particle.lifeLeft / particle.lifetime;
            if (particle.fadeAlpha) {
                particle.color[3] = ageRatio; //index 3 is alpha in rgba
            }
            if (particle.fadeSize) {
                particle.size = particle.originalSize * ageRatio;
            }
            if (particle.fadeSpeed) {
                particle.velocity.x = particle.originalSpeedX * ageRatio;
                particle.velocity.y = particle.originalSpeedY * ageRatio;
            }

        } else {
            this.toSwap.push(particleIndex); //particle died this frame, we'll need to swap this one once we're done updating everyone else
        }
    }

    ParticleEmitter.prototype.addParticle = function () {

        let newParticle = this.getParticleFromPool(); //grab a dead one if available, or extend the pool if it's full
        
        this.initParticle(newParticle); //applies the emitter configuration to our newborn particle
    
    }

    ParticleEmitter.prototype.initParticle = function (p) {
               
        p.x = this.x + this.xVar*randomMin1To1();
        p.y = this.y + this.yVar*randomMin1To1();

        p.lifetime = this.pLife + this.pLifeVar*randomMin1To1(); //camelCase confusing?
        p.lifeLeft = p.lifetime; //life left starts at max

        
        p.angle = this.angle + this.angleVar*randomMin1To1();

        p.originalSpeedX = (this.speed + this.speedVar*randomMin1To1()) * Math.cos(p.angle);
        p.originalSpeedY = -(this.speed+ this.speedVar*randomMin1To1()) * Math.sin(p.angle); //minus because y axis points down;
        p.velocity = {
            x: p.originalSpeedX,
            y: p.originalSpeedY, //minus because y axis points down
        };

        p.originalSize = this.size + this.sizeVar*randomMin1To1();
        if (p.originalSize < 0 ){ p.originalSize = 0;}
        p.size = p.originalSize;



        var startColor = [
            this.startColor[0] + this.startColorVar[0] * randomMin1To1(),
    	    this.startColor[1] + this.startColorVar[1] * randomMin1To1(),
    	    this.startColor[2] + this.startColorVar[2] * randomMin1To1(),
    	    this.startColor[3] + this.startColorVar[3] * randomMin1To1()
        ];

        var endColor = [
            this.endColor[0] + this.endColorVar[0] * randomMin1To1(),
            this.endColor[1] + this.endColorVar[1] * randomMin1To1(),
            this.endColor[2] + this.endColorVar[2] * randomMin1To1(),
            this.endColor[3] + this.endColorVar[3] * randomMin1To1()
        ];
        p.color = startColor;

        //The variation between colors.This is applied each frame over lifetime
        p.deltaColor = [
    	(endColor[0] - startColor[0]) / p.lifeLeft,
    	(endColor[1] - startColor[1]) / p.lifeLeft,
    	(endColor[2] - startColor[2]) / p.lifeLeft,
    	(endColor[3] - startColor[3]) / p.lifeLeft
        ];



        p.useTexture = this.useTexture;
        p.textureAdditive = this.textureAdditive;
        p.texture = this.texture;
        p.tint = this.tint;

        p.fadeAlpha = this.fadeAlpha;
        p.fadeSize = this.fadeSize;
        p.fadeSpeed = this.fadeSpeed;

        p.gravity = this.gravity; //currently does nothing, will add when it becomes useful

    }

    ParticleEmitter.prototype.getParticleFromPool = function () {

        // If the pointer overshoots the array, we have no dead particles available. Create a new one.
        if (this.poolPointer === this.pool.length) {
            this.pool.push(new Particle()); //note: creating a new particle intuitively implies that it is alive, but it is really dead because it's not actually in the game yet!
        }

        var particle = this.pool[this.poolPointer]; //get the dead particle that is at the "barrier" between the alive and dead

        this.poolPointer++; //the barrier separating life and death is pushed forward, because we revived a particle

        return particle;

    }

    ParticleEmitter.prototype.returnParticleToPool = function (particleIndex) {

        this.poolPointer--; //one more dead -> move back by one, point to the current last alive

        var aliveParticle = this.pool[this.poolPointer]; //gets the last alive particle at the barrier

        this.pool[this.poolPointer] = this.pool[particleIndex]; //our dead particle takes its place...
        this.pool[particleIndex] = aliveParticle; //swap complete!

        //now our pool is still organised and separates the alive and dead, but we have one more dead

    }

};

ParticleEmitterManager = {

    pool : [],
    poolPointer : 0, //moves around in the pool, pointing to the last dead emitter
    toSwap : [], //stores which emitters died this frame and need to be swapped

    createParticleEmitter : function (x,y, config) {
        
        let emitter = this.getEmitterFromPool();

        emitter.init(x,y, config);

    },

    //Give dt in seconds
    updateAllEmitters : function(dt) {

        this.toSwap = []; //swap these indexes after we're done updating

        //Update all alive emitters
        for (var i = 0, l = this.poolPointer; i < l; i++) {

            let emitter = this.pool[i];

            emitter.update(dt);

            // check if the emitter is inactive and all partys are dead
            if (emitter.isActive === false && emitter.poolPointer === 0) {
                this.toSwap.push(i);
                continue;
            }

        }

        // Return all that died to pool
        for (var i = 0, l = this.toSwap.length; i < l; i++){           
            this.returnEmitterToPool(this.toSwap[i]);
        }
    
    },

    getEmitterFromPool : function () {

        // If the pointer overshoots the array, we have no dead emitters available. Create a new one.
        if (this.poolPointer === this.pool.length) {
            this.pool.push(new ParticleEmitter()); //note: creating a new emitter intuitively implies that it is alive, but it is really dead because it's not actually in the game yet!
        }

        let emitter = this.pool[this.poolPointer]; //get the dead emitter that is at the "barrier" between the alive and dead

        this.poolPointer++; //the barrier separating life and death is pushed forward, because we revived an emitter

        return emitter;

    },

    returnEmitterToPool : function (emitterIndex) {

        this.poolPointer--; //one more dead -> move back by one, point to the current last alive

        let aliveEmitter = this.pool[this.poolPointer]; //gets the last alive emitter at the barrier

        this.pool[this.poolPointer] = this.pool[emitterIndex]; //our dead emitter takes its place...
        this.pool[emitterIndex] = aliveEmitter; //swap complete!

        //now our pool is still organised and separates the alive and dead, but we have one more dead

    },

    killAllEmittersSoft : function () {

        for (var i = 0, l = this.poolPointer; i < l; i++) {

            this.pool[i].isActive = false;

        }
    }

}




// The ParticleRenderer, as the name implies, renders particles! Here you will find all the methods needed to draw flashy stuff on screen, as well as some graphics tricks to allow for colors.

//Note: tint, additive rendering, and to a degree, using textures, consumes resources! I will try to optimize the code, but still, the operations are costly. Use with care!
ParticleRenderer = {

    renderAll : function (context){

        // Iterate over every alive particle of every active emitter, and draw
        for (var i = 0, l = ParticleEmitterManager.poolPointer; i < l; i++) {
            for (var j = 0, k = ParticleEmitterManager.pool[i].poolPointer; j < k; j++) {

                particle = ParticleEmitterManager.pool[i].pool[j];
                this.renderParticle(particle, context);

            }
        }
    },

    renderParticle : function (particle, context) {

        if (particle.useTexture){

            context.globalAlpha = particle.color[3];

            if (particle.textureAdditive){
                context.globalCompositeOperation = "lighter";
            }
            if (particle.tint) {

                this.tintAndDraw(particle,context);

            } else {
                
                //copied from GraphicsCommon.js to remove dependency
                context.save();
                context.translate(particle.x - particle.texture.width, particle.y - particle.texture.height);
                context.rotate(-particle.angle);
                context.drawImage(particle.texture, -particle.texture.width / 2, -particle.texture.height / 2);
                context.restore();
             
            }
            
            context.globalAlpha = 1;
            context.globalCompositeOperation = "source-over";
        }

        //default to drawing a filled circle
        else {
            //copied from GraphicsCommon.js to remove dependency
			const colorString = "rgba(" + parseInt(particle.color[0]) + "," 
										+ parseInt(particle.color[1]) + "," 
										+ parseInt(particle.color[2]) + "," 
										+ particle.color[3] + ")";

			context.fillStyle = colorString;
			console.log(context.fillStyle);
			
            context.beginPath();
            context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, true); //Début, fin, horaire ou anti horaire
            context.fill();
        }
    },

    // This method is only used when applying tint. It draws the particle on a separate canvas, then draws a colored rect on top of it, and finally draws the result on the main canvas
    // This is costly, but allows for a nice effect. One possible optimisation would be to have multiple particles that share the same tint to be colored at once, ie there would be "tint tiers" that would result in a worse looking, better performing tint.
    tintAndDraw : function (particle,context) {

        // A canvas must have integer width that is more than zero
        if (particle.size < 1) {
            return;
        }

        tintCanvas.width = particle.size;
        tintCanvas.height = particle.size;
        tintContext.fillStyle = context.fillStyle = "rgba(" + particle.color[0] + ","+ particle.color[1] + "," + particle.color[2] + "," + particle.color[3] + ")";

        tintContext.drawImage(particle.texture, 0, 0, tintCanvas.width, tintCanvas.height);
        tintContext.globalCompositeOperation = "source-atop";
        tintContext.fillRect(0,0, tintCanvas.width,tintCanvas.height);
        tintContext.globalCompositeOperation = "source-over";
        
        //canvasContext.drawImage(tintCanvas, particle.x, particle.x, tintCanvas.width, tintCanvas.height);
        context.drawImage(tintCanvas, particle.x-tintCanvas.width/2, particle.y-tintCanvas.height/2, tintCanvas.width, tintCanvas.height);
    }
};

function Particle() {


    
};

// Returns a random number from -1 to 1 (inclusive -> exclusive)
function randomMin1To1() {
    return (Math.random()*2) - 1;
}











/////               EXPERIMENTAL   /   WIP                 ///////
//////////////////      Added functionality: Emitter Sequence       //////////////////

function ParticleEmitterSequence (x,y, emitterConfigs, sequenceConfig) {

    let currentEmitterIndex = 0;

    if (!emitterConfigs) {
        console.log("Error: Particle emitter sequence requires emitter configuration(s).");
        return;
    } else if (!sequenceConfig) {
        sequenceConfig = {};
    }



}