class Rectangle{
	// The width and height are only from the center of the rectangle to an edge
	constructor(x,y,width,height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	contains(boid){
		return (boid.position.x >= this.x - this.width && boid.position.x <= this.x + this.width && boid.position.y >= this.y - this.height && boid.position.y <= this.y + this.height);
	}
	
	intersects(range) {
		return !(range.x - range.width > this.x + this.width || range.x + range.width < this.x - this.width || range.y - range.height > this.y + this.height || range.y + range.height < this.y - this.height);
  }
}

class Circle{
	constructor(x,y,radius){
		this.x = x;
		this.y = y;
		this.radius = radius;
	}
	
	contains(boid){
		let distance = Math.pow((boid.position.x - this.x), 2) + Math.pow((boid.position.y - this.y), 2);
		return distance <= (this.radius * this.radius);
	}
	
	intersects(range){
		let xDistance = Math.abs(range.x - this.x);
		let yDistance = Math.abs(range.y - this.y);
		
		let edges = Math.pow((xDistance - range.width), 2) + Math.pow((yDistance - range.height), 2);
		
		if(xDistance > (this.radius + range.width) || yDistance > (this.radius + range.height)){
			// This circle doesn't intersect the given range.
			return false;
		}
		
		if(xDistance <= range.width || yDistance <= range.height){
			// This circle does intersect the given range.
			return true;
		}
		
		// The edge of the cirle intersects with the range.
		return edges <= (this.radius * this.radius);
	}
}

class QuadTree{
	constructor(boundary, capacity){
		this.boundary = boundary;
		this.capacity = capacity;
		this.boids = [];
		this.divided = false;
	}
	
	subdivide(){
		let width = this.boundary.width / 2;
		let height = this.boundary.height / 2;
		
		let rectB = new Rectangle(this.boundary.x + width, this.boundary.y - height, width, height);
		this.northEast = new QuadTree(rectB, this.capacity);
		
		rectB = new Rectangle(this.boundary.x - width, this.boundary.y - height, width, height);
		this.northWest = new QuadTree(rectB, this.capacity);
		
		rectB = new Rectangle(this.boundary.x + width, this.boundary.y + height, width, height);
		this.southEast = new QuadTree(rectB, this.capacity);
		
		rectB = new Rectangle(this.boundary.x - width, this.boundary.y + height, width, height);
		this.southWest = new QuadTree(rectB, this.capacity);
		
		this.divided = true;
	}
	
	insert(boid){
		if(!this.boundary.contains(boid)){
			return false;
		}
		
		if(this.boids.length < this.capacity){
			this.boids.push(boid);
			return true;
		}
		
		if(!this.divided){
			this.subdivide();
		}
			
		if(this.northWest.insert(boid)){
			return true;
		}else if(this.northEast.insert(boid)){
			return true;
		}else if(this.southWest.insert(boid)){
			return true;
		}else if(this.southEast.insert(boid)){
			return true;
		}
		// An error has occured if this false is returned
		console.log("Error: Boid couldn't be inserted!")
		return false;
	}
	
	queryRange(range){
		let qBoids = [];
		
		if(!this.boundary.intersects(range)){
			return qBoids;
		}
		
		for(let boid of this.boids){
			if(range.contains(boid)){
				qBoids.push(boid);
			}
		}
		
		if(this.divided){
			qBoids = qBoids.concat(this.northWest.queryRange(range));
			qBoids = qBoids.concat(this.northEast.queryRange(range));
			qBoids = qBoids.concat(this.southWest.queryRange(range));
			qBoids = qBoids.concat(this.southEast.queryRange(range));
		}
		
		return qBoids;
	}
	
	show(){
		// FOR VISUALISING QUADTREE ONLY
		stroke(255);
		strokeWeight(1);
		noFill();
		rectMode(CENTER);
		
		rect(this.boundary.x, this.boundary.y, this.boundary.width*2, this.boundary.height*2)
		
		if(this.divided){
			this.northEast.show();
			this.northWest.show();
			this.southEast.show();
			this.southWest.show();
		}
	}
}