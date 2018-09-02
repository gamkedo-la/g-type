//Collider
const ColliderType = {
	Polygon:"polygon",
	Circle:"circle"
};

function Collider(type, data) {
	this.type = type;
	this.center = {x:0, y:0};
	this.radius = 1;
	this.points = [];
	for(let i = 0; i < data.points.length; i++) {
		this.points[i] = {x:data.points[i].x, y:data.points[i].y};
	}

	this.position = data.position;
	
	this.findCenterAndRadiusOfPoints = function(points) {
		let minX = points[0].x;
		let maxX = points[0].x; 
		let minY = points[0].y; 
		let maxY = points[0].y;
		
		for(let i = 1; i < points.length; i++) {
			minX = Math.min(minX, points[i].x);
			maxX = Math.max(maxX, points[i].x);
			minY = Math.min(minY, points[i].y);
			maxY = Math.max(maxY, points[i].y);
		}
		
		const halfDeltaX = (maxX - minX) / 2;
		const centerX = minX + (halfDeltaX);
		const halfDeltaY = (maxY - minY) / 2;
		const centerY = minY + (halfDeltaY);
		
		this.center = {x: centerX, y: centerY};
		
		//Divide by 0.707 (cos(45)) to account for worst case distance from center to a corner => polygon radii are ~30% too big (which is fine)
		this.radius = Math.max(Math.abs(halfDeltaX / 0.707), Math.abs(halfDeltaY / 0.707));		
	};
		
	if(this.type === ColliderType.Polygon) {
		this.points = data.points;
		this.findCenterAndRadiusOfPoints(this.points);
	} else if(this.type === ColliderType.Circle) {
		this.center = data.center;
		this.radius = data.radius;
		this.points = null;
	}
	
	this.setPosition = function(newPosition) {
		const deltaX = newPosition.x - this.position.x;
		const deltaY = newPosition.y - this.position.y;

		if(this.type === ColliderType.Polygon) {
			for(let i = 0; i < this.points.length; i++) {
				this.points[i].x += deltaX;
				this.points[i].y += deltaY;
			}
		}
		
		this.center.x += deltaX;
		this.center.y += deltaY;
		
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;
	};
	
	this.draw = function() {
		if(DRAW_COLLIDERS) {
			switch(this.type) {
				case ColliderType.Polygon:
					canvasContext.beginPath();
					canvasContext.strokeStyle = COLLIDER_COLOR;
					canvasContext.moveTo(this.points[0].x, this.points[0].y);
					for(let i = 0; i < this.points.length; i++) {
						canvasContext.lineTo(this.points[i].x, this.points[i].y);
					}
					canvasContext.lineTo(this.points[0].x, this.points[0].y);
					canvasContext.stroke();
					break;
				case ColliderType.Circle:
					canvasContext.beginPath();
					canvasContext.strokeStyle = COLLIDER_COLOR;
					canvasContext.lineWidth = 2;
					canvasContext.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
					canvasContext.stroke();
					break;
			}
		}
	}
}
