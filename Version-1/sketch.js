const boids = [];

function setup(){
	createCanvas(640, 360);
	for(let i = 0; i < 200; i++){
		boids.push(new Boid());
	}
}

function draw(){
	background(51);
	for(let boid of boids){
		boid.bounds();
		boid.flock(boids);
		boid.update();
		boid.show();
	}
}