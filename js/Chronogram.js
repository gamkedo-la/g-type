//Chronogram
function Chronogram() {
	let lastUpdate = Date.now();
	const events = {};
	
	this.getCurrentTime = function() {
		return Date.now();
	};
	
	this.update = function() {
		const previousLastUpdate = lastUpdate;
		lastUpdate = Date.now();
		return (worldSpeed * (lastUpdate - previousLastUpdate));
	};
	
	this.timeSinceUpdate = function() {
		let now = Date.now();
		return (now - lastUpdate);
	};
	
	this.registerEvent = function(eventName) {
		const thisTime = Date.now();
		events[eventName] = {time:thisTime, lastUpdate:thisTime};
		return thisTime;
	};
	
	this.updateEvent = function(eventName) {
		const thisTime = Date.now();
		const deltaTime = thisTime - events[eventName].lastUpdate
		events[eventName].lastUpdate = thisTime;
		return deltaTime;
	};
	
	this.timeSinceUpdateForEvent = function(eventName) {
		if(events[eventName] === undefined) {return null;}
		
		return (worldSpeed * (Date.now() - events[eventName].lastUpdate));
	};
}
