function CapsuleGroup() {
	this.capsules = [];
	
	this.add = function(newCapsule, worldPos) {
		this.enemies.push(newCapsule);
		
		newCapsule.group = this;
		
		return newCapsule;
	};
	
	// called by capsules in group when collected
	this.collected = function(capsuleToRemove, worldPos) {
		const indexToRemove = this.enemies.indexOf(capsuleToRemove);
		this.capsules.splice(indexToRemove, 1);

		// this is the very last one in the group, set the warp flag
		if(this.capsules.length === 0){
			scene.didCompleteWarpChallenge = true;
		}
	}

	return this;
}
