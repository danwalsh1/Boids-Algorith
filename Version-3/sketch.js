const boids = [];

let alignmentSlider, seperationSlider, cohesionSlider;

function setup(){
	let boidCanvas = createCanvas(640, 360);
	boidCanvas.parent('canvasContainer');
	
	// Three sliders are added to the page, which will allow the user to control each force acting on the Boids.
	// Each slider has a parent <div> tag to define where the slider should display on the page.
	alignmentSlider = createSlider(0, 10, 1, 0.1);
	alignmentSlider.parent('alignmentSliderContainer');
	seperationSlider = createSlider(0, 10, 1.5, 0.1);
	seperationSlider.parent('seperationSliderContainer');
	cohesionSlider = createSlider(0, 10, 1, 0.1);
	cohesionSlider.parent('cohesionSliderContainer');
	
	for(let i = 0; i < 100; i++){
		boids.push(new Boid());
	}
}

function draw(){
	background(51);
	for(let boid of boids){
		boid.flock(boids);
		boid.update();
		boid.borders();
		boid.render();
	}
}