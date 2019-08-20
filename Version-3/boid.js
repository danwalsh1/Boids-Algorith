class Boid{
	constructor(){
		this.acceleration = createVector();
		this.velocity = p5.Vector.random2D();
		this.velocity.setMag(random(2, 4));
		this.position = createVector(random(width), random(height));
		this.maxSpeed = 2;
		this.maxForce = 0.03;
	}
	
	flock(boids){
		let alignment = this.alignment(boids);
		let cohesion = this.cohesion(boids);
		let seperation = this.seperation(boids);
		
		//seperation.mult(1.5);
		//alignment.mult(1.0);
		//cohesion.mult(1.0);
		
		// The multipliers are now controlled by the value of each slider
		seperation.mult(seperationSlider.value());
		alignment.mult(alignmentSlider.value());
		cohesion.mult(cohesionSlider.value());
		
		this.acceleration.add(alignment);
		this.acceleration.add(cohesion);
		this.acceleration.add(seperation);
	}
	
	update(){
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.acceleration.mult(0);
	}
	
	borders(){
		if(this.position.x > width){
			this.position.x = 0;
		}else if(this.position.x < 0){
			this.position.x = width;
		}
		
		if(this.position.y > height){
			this.position.y = 0;
		}else if(this.position.y < 0){
			this.position.y = height;
		}
	}
	
	
	
	alignment(boids){
		let perceptionRadius = 50;
		let steering = createVector();
		let total = 0;
		
		for(let boid of boids){
			let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
			if(distance > 0 && distance < perceptionRadius){
				steering.add(boid.velocity);
				total++;
			}
		}
		
		if(total > 0){
			steering.div(total);
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
			return steering;
		}else{
			return createVector();
		}
	}
	
	seperation(boids){
		let perceptionRadius = 25;
		let steering = createVector();
		let total = 0;
		
		for(let boid of boids){
			let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
			if(distance > 0 && distance < perceptionRadius){
				let difference = p5.Vector.sub(this.position, boid.position);
				difference.normalize();
				difference.div(distance);
				steering.add(difference);
				total++;
			}
		}
		
		if(total > 0){
			steering.div(total);
		}
		
		if(steering.mag() > 0){
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
		}
		
		return steering;
	}
	
	cohesion(boids){
		let perceptionRadius = 50;
		let steering = createVector();
		let total = 0;
		
		for(let boid of boids){
			let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
			if(distance > 0 && distance < perceptionRadius){
				steering.add(boid.position);
				total++;
			}
		}
		
		if(total > 0){
			steering.div(total);
			steering.sub(this.position);
			steering.setMag(this.maxSpeed);
			steering.sub(this.velocity);
			steering.limit(this.maxForce);
			return steering;
		}else{
			return createVector();
		}
	}
	
	render(){
		strokeWeight(8);
		stroke(255);
		point(this.position.x, this.position.y);
	}
}