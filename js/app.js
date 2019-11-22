let container;
let camera;
let controls;
let renderer;
let composer, copyPass, renderPass;
let scene;
let scrubber;
let animationMaxTime = 1.99; //Animation time when mouth is fully opened
let animationLength = animationMaxTime * 100;
let selectedObject;

let startingTouchePos;
let touchTravelDistance = 0;

var globalGLTF;
var globalModel;
var globalAnimation;
var globalAction;
var globalMixer;
let globalLoader;

let raycaster, mouse = { x : 0, y : 0 };


const mixers = [];
const clock = new THREE.Clock();

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x282828 );

  createCamera();
  createControls();
  createLights();
  loadModels();
  createRenderer();
  addMouthOpeningScrubber();
	
	
  raycaster = new THREE.Raycaster();
  renderer.domElement.addEventListener( 'mousedown', raycast, false );
	
  renderer.domElement.addEventListener('touchstart', function(event){
  	mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
	console.log('starting', mouse.x, mouse.y);
	startingTouchePos = [mouse.x, mouse.y];	  
  }, false);
	
  renderer.domElement.addEventListener('touchend', function(event){
	
	  
	  
    	mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    	mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
	console.log('ending', mouse.x, mouse.y);
	  
	let xCoord = startingTouchePos[0] - mouse.x;
	let yCoord = startingTouchePos[1] - mouse.y;
	let distance = Math.sqrt( xCoord*xCoord + yCoord*yCoord );
    	alert(distance);
  }, false);
	
	
  //Outlining the object
  var renderPass = new THREE.RenderPass( scene, camera );
  copyPass = new THREE.ShaderPass( THREE.CopyShader );
  copyPass.renderToScreen = true;
	
  composer = new THREE.EffectComposer(renderer);
  composer.addPass( renderPass );
  composer.addPass( copyPass );
  //renderPass = new THREE.RenderPass( scene, camera );
  
  
  

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );
	
 //animate();
	/*requestAnimationFrame(function(){
	 composer.render();	
	});*/

}

function createCamera() {

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 1, 5000 );
  camera.position.set( 0, 1, 16 );
  
	

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );
  controls.enableDamping = true;
  controls.dampingFactor = 1.2;
  controls.minPolarAngle = 0.0;
  controls.maxPolarAngle = 2.9;
  controls.update();
	
}

function createLights() {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 4.5 );
  ambientLight.castShadow = true;

  const frontLight = new THREE.DirectionalLight( 0xffffff, 2 );
  frontLight.position.set( 0, 5, 30 );
	frontLight.castShadow = true;
	frontLight.shadow.mapSize.width = 512;
	frontLight.shadow.mapSize.height = 512;
	frontLight.shadow.mapSize.near = 0.5;
	frontLight.shadow.mapSize.far = 500;
	
  const farLeftLight = new THREE.DirectionalLight( 0xffffff, 2 );
  farLeftLight.position.set( -30, 2, 2 );
	
  const leftLight = new THREE.DirectionalLight( 0xffffff, 2 );
  leftLight.position.set( -30, 10, 7 );
	
  const farRightLight = new THREE.DirectionalLight( 0xffffff, 2 );
  farRightLight.position.set( 30, 3, 2 );
	
  const rightLight = new THREE.DirectionalLight( 0xffffff, 2 );
  rightLight.position.set( 20, 10, 10 );	

  scene.add( ambientLight, frontLight, farLeftLight, leftLight, rightLight, farRightLight );

}

function loadModels() {
	console.log('loading');
  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = ( gltf, position ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );

	 
    const animation = gltf.animations[ 0 ];
	  
    const mixer = new THREE.AnimationMixer( model );
    mixers.push( mixer );

	 
	  
    const action = mixer.clipAction( animation );  
    action.play();
    action.paused = true;
	  
	  globalGLTF = gltf;
	  globalModel = model;
	  globalAnimation = animation;
	  globalAction = action;
	  globalMixer = mixer;
	  

    scene.add( model );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  /*const parrotPosition = new THREE.Vector3( 0, 0, 2.5 );
  loader.load( 'models/Parrot.glb', gltf => onLoad( gltf, parrotPosition ), onProgress, onError );*/

  const teethPosition = new THREE.Vector3( 0, -1, 1 );
  loader.load( 'models/Teeth.glb', gltf => onLoad( gltf, teethPosition ), onProgress, onError );
globalLoader = loader;
	
}

function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild( renderer.domElement );

}

function update() {
  const delta = clock.getDelta();
  for ( const mixer of mixers ) {
    mixer.update( delta );
  }
}

function render() {

  
  renderer.render( scene, camera );
  composer.render();

}

/*function animate(){
	 requestAnimationFrame( animate );

	   const delta = clock.getDelta();
	  for ( const mixer of mixers ) {
	    mixer.update( delta );
	  }

    renderer.render( scene, camera );
    composer.render();
}*/

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );


function addMouthOpeningScrubber(){
	scrubber = new ScrubberView();
	//document.body.appendChild(scrubber.elt);
	document.getElementsByClassName("controls-container")[0].appendChild(scrubber.elt);
	
	/*scrubber.min();// 0
	scrubber.max(); // 1
	scrubber.step(); // 0
	scrubber.value(); // 0
	scrubber.orientation(); // 'horizontal'

	scrubber.value(0.5); // Updates the scrubber's value
	scrubber.value(); // 0.5*/

	// Setters are chainable
	scrubber.value(0);
	scrubber.min(0).max(60).step(1).orientation('horizontal');
	
	scrubber.onScrubStart = function (value) {
    	console.log(value); // the value at the time of scrub start
	}
	// onValueChanged is called whenever the scrubber is moved.
	scrubber.onValueChanged = function (value) {
		
		
		let currentPos = value * (animationMaxTime+2) / animationLength; //animation's time based on slider value

		globalAction.paused = false
		seekAnimationTime(globalMixer, currentPos)
		globalAction.paused = true
		
	  console.log(value, currentPos); // the value at time of invocation
	}
	// onScrubEnd is called whenever a user stops scrubbing
	scrubber.onScrubEnd = function (value) {
	    console.log(value); // the value at the time of scrub end
	}
function seekAnimationTime(animMixer, timeInSeconds){
    animMixer.time=0;
    for(var i=0;i<animMixer._actions.length;i++){
      animMixer._actions[i].time=0;
    }
    animMixer.update(timeInSeconds)
  }
}


//======================
//===== RAYCASTING =====
function raycast ( e ) {
    //sets the mouse position with a coordinate system where the center
    //of the screen is the origin
    /*mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;*/
    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
    

    //set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera( mouse, camera );    

    //compute intersections (no 2nd parameter true anymore)
    var intersects = raycaster.intersectObjects( scene.children, true );

    let closestIntersection = intersects[0];
    console.log(closestIntersection);
    selectedObject = closestIntersection.object;
    addOutlinePass(selectedObject)
}



function onWindowTouchEnd(event) {
	console.log('ending', mouse.x, mouse.y);
    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
    //let distance = Math.sqrt( startingTouchePos[0]*mouse.x + startingTouchePos[1]*mouse.y );
    //alert(distance);
	
    //event.preventDefault();
    

    //raycaster.setFromCamera(mouse, camera);
   // const intersects = raycaster.intersectObjects(yourObject3D);
}


function addOutlinePass(object){
	if(composer.passes.length > 2){
		composer.passes[2].selectedObjects = [object];
	} else{
		outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
		outlinePass.edgeStrength = Number( 5 );
		outlinePass.edgeGlow = Number( 0);
		outlinePass.edgeThickness = Number( 1 );
		outlinePass.pulsePeriod = Number( 0 );
		outlinePass.visibleEdgeColor.set( new THREE.Color("rgb(90%, 90%, 90%)") );
		outlinePass.hiddenEdgeColor.set( new THREE.Color("rgb(30%, 30%, 30%)") );
		outlinePass.selectedObjects = [object];
		composer.addPass( outlinePass );
	}
}



init();
