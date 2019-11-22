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
let isTouchDevice = true; // touch or mouse device (determines if mouse one first mousemove event)
let hasTouched = false;

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
  isTouchDevice = isMobileTablet();
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
  renderer.domElement.addEventListener( 'mousedown', function(event){
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	startingTouchePos = [mouse.x, mouse.y];	
  }, false );
	
  renderer.domElement.addEventListener( 'mouseup', function(event){
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
	if(get2dDistance(startingTouchePos, mouse) < 0.01){ // This is touch
		raycast (event);
	}
  }, false );
	
	
	

  renderer.domElement.addEventListener('touchstart', function(event){
	  
	  hasTouched = true;
	  
  	/*mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
	startingTouchePos = [mouse.x, mouse.y];	*/
	  
  }, false);
	
  renderer.domElement.addEventListener('touchmove', function(event){
	  hasTouched = false; 
  }, false);
	
	
  renderer.domElement.addEventListener('touchend', function(event){
	  if(hasTouched){
		raycast (event);  
	  }
    	/*mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    	mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

    	if(get2dDistance(startingTouchePos, mouse) < 0.01){ // This is touch
		raycast (event);
	}*/
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


function isMobileTablet(){
    var check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
            check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function get2dDistance(pos1, mousePos){
  let xCoord = pos1[0] - mousePos.x;
  let yCoord = pos1[1] - mousePos.y;
  return Math.sqrt( xCoord*xCoord + yCoord*yCoord );
}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;
  controls.rotateSpeed = 0.1;
  controls.panSpeed = 0.1;
  controls.zoomSpeed = 1;
  controls.minPolarAngle = 0.0;
  controls.maxPolarAngle = 2.9;
  controls.screenSpacePanning = true;
  controls.update();
	
}

function createLights() {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

  const frontLight = new THREE.DirectionalLight( 0xffffff, 1 );
  frontLight.position.set( 0, 5, 30 );
	frontLight.castShadow = true;
	frontLight.shadow.mapSize.width = 512;
	frontLight.shadow.mapSize.height = 512;
	frontLight.shadow.mapSize.near = 0.5;
	frontLight.shadow.mapSize.far = 500;
	
  const farLeftLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
  farLeftLight.position.set( -30, -2, -80 );
	
  const leftLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
  leftLight.position.set( -30, 10, -80 );
	
  const farRightLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  farRightLight.position.set( 30, 3, 2 );
	
  const rightLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  rightLight.position.set( 20, 10, 10 );	

  scene.add( ambientLight, frontLight, farLeftLight, leftLight, rightLight, farRightLight );

}

function loadModels() {
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

	controls.update();
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
	}
	// onValueChanged is called whenever the scrubber is moved.
	scrubber.onValueChanged = function (value) {
		
		
		let currentPos = value * (animationMaxTime+2) / animationLength; //animation's time based on slider value

		globalAction.paused = false
		seekAnimationTime(globalMixer, currentPos)
		globalAction.paused = true
		
	}
	// onScrubEnd is called whenever a user stops scrubbing
	scrubber.onScrubEnd = function (value) {
	    //console.log(value); // the value at the time of scrub end
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
    if(isTouchDevice){
    	mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
   	mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
    } else{
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    }
    

    //set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera( mouse, camera );    

    //compute intersections (no 2nd parameter true anymore)
    var intersects = raycaster.intersectObjects( scene.children, true );

    let closestIntersection = intersects[0];
    if(closestIntersection == undefined){
	    selectedObject = null;
	    composer.passes[2].enabled = false;
    } else{
	  selectedObject = closestIntersection.object;
    	  addOutlinePass(selectedObject)  
    }
    
}



function addOutlinePass(object){
	if(composer.passes.length > 2){
		outlinePass.enabled = true;
		composer.passes[2].selectedObjects = [object];
	} else{
		outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
		if(isTouchDevice){
			outlinePass.edgeStrength = Number( 25 );
			outlinePass.edgeThickness = Number( 3 );
		} else{
			outlinePass.edgeStrength = Number( 20 );
			outlinePass.edgeThickness = Number( 2 );	
		}
		
		outlinePass.edgeGlow = Number( 0);
		outlinePass.pulsePeriod = Number( 0 );
		outlinePass.visibleEdgeColor.set( new THREE.Color("rgb(255, 255, 255)") );
		outlinePass.hiddenEdgeColor.set( new THREE.Color("rgb(9, 9, 9)") );
		outlinePass.selectedObjects = [object];
		composer.addPass( outlinePass );
	}
}



init();
