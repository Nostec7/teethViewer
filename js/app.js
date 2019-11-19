//ORIGINAL from base empty scene
/*// Get a reference to the container element that will hold our scene
const container = document.querySelector( '#scene-container' );

// create a Scene
const scene = new THREE.Scene();

// Set the background color
scene.background = new THREE.Color( 'skyblue' );

// Create a Camera
const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

// every object is initially created at ( 0, 0, 0 )
// we'll move the camera back a bit so that we can view the scene
camera.position.set( 0, 0, 10 );

// create a geometry
const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );

// create a default (white) Basic material
const material = new THREE.MeshBasicMaterial();

// create a Mesh containing the geometry and material
const mesh = new THREE.Mesh( geometry, material );

// add the mesh to the scene
scene.add( mesh );

// create the renderer
const renderer = new THREE.WebGLRenderer();

renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setPixelRatio( window.devicePixelRatio );

// add the automatically created <canvas> element to the page
container.appendChild( renderer.domElement );

// render, or 'create a still image', of the scene
renderer.render( scene, camera );
*/


// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;

const mixers = [];
const clock = new THREE.Clock();

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x8FBCD4 );

  createCamera();
  createControls();
  createLights();
  loadModels();
  createRenderer();

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createCamera() {

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 1, 100 );
  camera.position.set( -1.5, 1.5, 6.5 );

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );

}

function createLights() {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set( 10, 10, 10 );

  scene.add( ambientLight, mainLight );

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

    scene.add( model );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3( 0, 0, 2.5 );
  loader.load( 'models/Parrot.glb', gltf => onLoad( gltf, parrotPosition ), onProgress, onError );

  const flamingoPosition = new THREE.Vector3( 7.5, 0, -10 );
  loader.load( 'models/Flamingo.glb', gltf => onLoad( gltf, flamingoPosition ), onProgress, onError );

  const storkPosition = new THREE.Vector3( 0, -2.5, -10 );
  loader.load( 'models/Stork.glb', gltf => onLoad( gltf, storkPosition ), onProgress, onError );

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

}

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

init();
