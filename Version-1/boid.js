// Quotes (inside quotation marks) from https://cs.stanford.edu/people/eroberts/courses/soco/projects/2008-09/modeling-natural-systems/boids.html unless stated otherwise.
class Boid{
	constructor(){
		// Give the Boid a random initial position.
		this.position = createVector(random(width), random(height));
		// Give the Boid a random initial velocity.
		this.velocity = p5.Vector.random2D();
		// Give the Boid an initial speed.
		this.velocity.setMag(random(2, 4));
		// Give the Boid an acceleration, initially a zero vetor.
		this.acceleration = createVector();
		// Used to limit the magnitude of a steering velocity's vector.
		this.maxForce = 1;
		// Used to limit the maximum speed this Boid can move.
		this.maxSpeed = 4;
		// Used to limit the minimum speed this Boid can move.
		this.minSpeed = 2;
	}
	
	bounds(){
		// Used to allow Boids to continue travelling in a direction after hitting a boundary.
		// E.g. A Boid traveling directly up the screen will hit the top boundary. It then gets moved to the same horizontal position but at the bottom boundary.
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
		// "[Boids] try to change their position so that it corresponds with the average alignment of other nearby [Boids]."
		// To do this, we calculate a vector that is the sum of all nearby Boids velocities. We then divide this sum by the number of Boids that are nearby, which gives us an average velocity.
		// This is similar to finding the average of a group on numbers. You add all the numbers together then divide that total by the amount of numbers you have.
		// E.g: [5, 8, 10] ==> 5 + 8 + 10 = 23 ==> 23 / 3 = 7.6 ==> The average of 5, 8, and 10 is 7.6
		
		// Set the radius of the area that counts as "nearby" to this Boid.
		let perceptionRadius = 50;
		// Store the vector to be steered towards.
		let steering = createVector();
		// Store the number of Boids that are within the perception radius ("nearby").
		let total = 0;
		
		// Check all Boids.
		for(let boid of boids){
			// Calculate the distance between this Boid and the Boid being checked.
			let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
			// If the Boid being checked is "nearby" and isn't THIS Boid, add it to the sum of velocities.
			if(boid != this && distance < perceptionRadius){
				// Add the velocity of the Boid currently being checked to the sum of velocities of Boids checked so far.
				steering.add(boid.velocity);
				// Increment the total number of Boids that are "nearby".
				total++;
			}
		}
		
		// If at least one Boid is "nearby", the average velocity and steering force is calculated. Otherwise a zero vector is returned
		if(total > 0){
			// Divide the sum of velocities by the number of "nearby" Boids to get the average velocity of all "nearby" Boids.
			steering.div(total);
			// Set the speed at which the Boid moves.
			steering.setMag(this.maxSpeed);
			// The steering force = desired velocity - current velocity. 
			steering.sub(this.velocity);
			// Limit the magnitude of the steering velocity. 
			steering.limit(this.maxForce);
		}
		
		return steering;
	}
	
	seperation(boids){
		// "Each [Boid] attempts to maintain a reasonable amount of distance between itself and any nearby [Boids], to prevent overcrowding."
		
		// Set the radius of the area that counts as "nearby" to this Boid.
		let perceptionRadius = 50;
		// Store the vector to be steered towards.
		let steering = createVector();
		// Store the number of Boids that are within the perception radius ("nearby").
		let total = 0;
		
		// Check all Boids.
		for(let boid of boids){
			// Calculate the distance between this Boid and the Boid being checked.
			let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
			// If the Boid being checked is "nearby" and isn't THIS Boid, add it's opposite velocity to the sum of velocities.
			if(boid != this && distance < perceptionRadius){
				// Get a vector that points in the oposite direction to the Boid being checked (points away from the Boid being checked).
				let difference = p5.Vector.sub(this.position, boid.position);
				// The further away the Boid being checked is, the less effect it has on the magnitude of the desired velocity.
				difference.div(distance * distance);
				// Add this to the sum of velocities.
				steering.add(difference);
				// Increment the total number of Boids that are "nearby".
				total++;
			}
		}
		
		// If at least one Boid is "nearby", the average velocity and steering force is calculated. Otherwise a zero vector is returned
		if(total > 0){
			// Divide the sum of velocities by the number of "nearby" Boids to get the average velocity of all "nearby" Boids.
			steering.div(total);
			// Set the speed at which the Boid moves.
			steering.setMag(this.maxSpeed);
			// The steering force = desired velocity - current velocity. 
			steering.sub(this.velocity);
			// Limit the magnitude of the steering velocity. 
			steering.limit(this.maxForce);
		}
		
		return steering;
	}
	
	cohesion(boids){
		// "Every [Boid] attempts to move towards the average position of other nearby [Boids]."
		// To do this, we calculate a vector that is the sum of all nearby Boids positions. We then divide this sum by the number of Boids that are nearby, which gives us an average position.
		// See alignment function for example of finding averages.
		
		// Set the radius of the area that counts as "nearby" to this Boid.
		let perceptionRadius = 100;
		// Store the vector to be steered towards.
		let steering = createVector();
		// Store the number of Boids that are within the perception radius ("nearby").
		let total = 0;
		
		// Check all Boids.
		for(let boid of boids){
			// Calculate the distance between this Boid and the Boid being checked.
			let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
			// If the Boid being checked is "nearby" and isn't THIS Boid, add it to the sum of velocities.
			if(boid != this && distance < perceptionRadius){
				// Add the position of the Boid currently being checked to the sum of positions of Boids checked so far.
				steering.add(boid.position);
				// Increment the total number of Boids that are "nearby".
				total++;
			}
		}
		
		// If at least one Boid is "nearby", the average velocity and steering force is calculated. Otherwise a zero vector is returned
		if(total > 0){
			// Divide the sum of velocities by the number of "nearby" Boids to get the average velocity of all "nearby" Boids.
			steering.div(total);
			// Desired velocity = average position - current position. 
			steering.sub(this.position);
			// Set the speed at which the Boid moves.
			steering.setMag(this.maxSpeed);
			// The steering force = desired velocity - current velocity. 
			steering.sub(this.velocity);
			// Limit the magnitude of the steering velocity. 
			steering.limit(this.maxForce);
		}
		
		return steering;
	}
	
	flock(boids){
		// To move a Boid (an object), a force must be applied on it.
		// Newton's Law of Motion states: "Force = Mass x Acceleration" (F = M x A)
		// If mass (M) is always 1 for everything, F = A
		// Therefore, to move a Boid (to apply a force to the object), we must simply set the acceleration of the Boid.
		//
		// We are applying three forces to each Boid (each object); a force from alignment, a force from cohesion, and a force from seperation.
		// Due to there being three forces (F's) that are being applied to the Boid (the object), we must allow for force accumulation.
		// This means that the resultant force being applied to the Boid (the object) is the sum of all forces being applied to the Boid (the object).
		// Therefore, to apply the three forces to our Boid we simply need to set our acceleration to the sum of the three forces (remembering F = A).
		
		let alignment = this.alignment(boids);
		let cohesion = this.cohesion(boids);
		let seperation = this.seperation(boids);
		
		this.acceleration.add(alignment);
		this.acceleration.add(cohesion);
		this.acceleration.add(seperation);
	}
	
	update(){
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		// Prevents Boid from traveling faster then the max speed.
		this.velocity.limit(this.maxSpeed);
		// Set the acceleration to a zero vector ready to calculate the next sum of forces.
		this.acceleration.mult(0);
	}
	
	show(){
		strokeWeight(8);
		stroke(255);
		point(this.position.x, this.position.y);
	}
}