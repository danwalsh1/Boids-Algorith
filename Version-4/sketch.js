const boids = [];

let alignmentSlider, seperationSlider, cohesionSlider, maxSpeedSlider, maxForceSlider, alignmentRadiusSlider, seperationRadiusSlider, cohesionRadiusSlider, canvasWidthSlider, canvasHeightSlider;

function setup(){
	let boidCanvas = createCanvas(640, 360);
	boidCanvas.parent('canvasContainer');
	
	// Three sliders are added to the page, which will allow the user to control each force acting on the Boids.
	// Each slider has a parent <div> tag to define where the slider should display on the page.
	alignmentSlider = createSlider(0, 10, 1, 0.5);
	alignmentSlider.parent('alignmentSliderContainer');
	seperationSlider = createSlider(0, 10, 1.5, 0.5);
	seperationSlider.parent('seperationSliderContainer');
	cohesionSlider = createSlider(0, 10, 1, 0.5);
	cohesionSlider.parent('cohesionSliderContainer');
	
	// Two sliders are added to the page to allow control over the Boid constraints
	maxSpeedSlider = createSlider(1, 10, 2, 0.5);
	maxSpeedSlider.parent('maxSpeedSliderContainer');
	maxForceSlider = createSlider(0.01, 1, 0.03, 0.01);
	maxForceSlider.parent('maxForceSliderContainer');
	
	// Three sliders are added to the page, which will allow the user to control each force's perception range.
	alignmentRadiusSlider = createSlider(0, 500, 50, 10);
	alignmentRadiusSlider.parent('alignmentRadiusSliderContainer');
	seperationRadiusSlider = createSlider(0, 500, 30, 10);
	seperationRadiusSlider.parent('seperationRadiusSliderContainer');
	cohesionRadiusSlider = createSlider(0, 500, 50, 10);
	cohesionRadiusSlider.parent('cohesionRadiusSliderContainer');
	
	// Two sliders are added to the page to allow control over the size of the canvas.
	canvasWidthSlider = createSlider(100, 900, 640, 10);
	canvasWidthSlider.parent('canvasWidthSliderContainer');
	canvasHeightSlider = createSlider(100, 900, 360, 10);
	canvasHeightSlider.parent('canvasHeightSliderContainer');
	
	for(let i = 0; i < 100; i++){
		boids.push(new Boid());
	}
}

function draw(){
	// Resize the canvas if the canvas width and height don't match their respective sliders.
	if(width != canvasWidthSlider.value() || height != canvasHeightSlider.value()){
		resizeCanvas(canvasWidthSlider.value(), canvasHeightSlider.value())
	}
	background(51);
	for(let boid of boids){
		boid.flock(boids);
		boid.update();
		boid.borders();
		boid.render();
	}
}