console.log('**************************************');
console.log('*   TEETH STATUS VIEWER BY NOSTEC7   *');
console.log('**************************************');


let container;
let camera;
let controls;
let renderer;
let composer, copyPass, renderPass;
let scene;
let scrubber;
let loadingOverlay;
let toothStatusMenu;
let toothStatusButtons;
let animationMaxTime = 1.99; //Animation time when mouth is fully opened
let animationLength = animationMaxTime * 100;
let isCameraMoving = false;

let hoveredObject;
let selectedObject;
let selectedObjectStatus;
let isTouchDevice = true; // touch or mouse device (determines if mouse one first mousemove event)
let hasTouched = false;
let hasClicked = true;

let startingTouchePos;
let touchTravelDistance = 0;

let raycaster, mouse = { x : 0, y : 0 };

let startingCameraPosition = new THREE.Vector3(-0.1469926322389252, 1.1960779151428367, 15.98586221593867);
let filteredObjectNames = ["Upper_jaw001", "Lower_jaw001"]; // Objects that will not be selectable (jaw meshes)

let gumObjects = [undefined, undefined];
let gumObjectNames = ["Upper_jaw001", "Lower_jaw001"];

let sickTeethTextures = [];
let sickTeethMaterials = [];
let damagedTeethTextures = [];
let damagedTeethMaterials = [];
let toothMaterials = []; // Holds 3 materials - healthy, missing and golden

let lastSelectedStatus;
let isStatusMenuExpanded = false;

let isIsolated = false;

let diseasedTeethDetailsWindow;
let diseasedWindowDetails;
let diseasedDescriptionBox;
let diseaseCheckboxes;
let diseaseCheckmarks;
let diseaseCheckboxNames;

let areGumsVisible = true;
let smallScreenScaleFactor = 0.8;


const mixers = [];
const clock = new THREE.Clock();

let iHeight = window.innerHeight;

var params;
var url = window.location.href;


let teethArr = [];
class Tooth{
	constructor(mesh, status, inside, outside, left, right, top, description){
		this.mesh = mesh;
		this.toothStatus = 'healthy';
		this.checkedInside = inside;
		this.checkedOutside = outside;
		this.checkedLeft = left;
		this.checkedRight = right;
		this.checkedTop = top;
		this.description = description;
	}

	setStatus(status){
		this.toothStatus = status;
	}
	setCheckedInside(isChecked){
		this.checkedInside = isChecked;
	}
	setCheckedOutside(isChecked){
		this.checkedOutside = isChecked;
	}
	setCheckedLeft(isChecked){
		this.checkedLeft = isChecked;
	}
	setCheckedRight(isChecked){
		this.checkedRight = isChecked;
	}
	setCheckedTop(isChecked){
		this.checkedTop = isChecked;
	}
	setDescription(description){
		this.description = description;
	}
}



function init() {
	isTouchDevice = isMobileTablet();

	container = document.getElementById( "scene-container" );
	loadingOverlay = document.getElementById( "loading-screen" );
	toothStatusMenu = document.getElementById( "tooth-status-menu" );
	toothStatusButtons = document.getElementsByClassName("status-selection");
	toothDescriptionSaveButton = document.getElementById("save-description");
	diseasedTeethDetailsWindow = document.getElementById('diseased-status-window');
	diseasedDescriptionBox = document.getElementById('disease-description-box');
	diseaseCheckboxes = document.getElementById('disease-checkboxes');
	diseaseCheckboxNames = document.getElementById('disease-checkbox-names');
	diseasedWindowDetails = document.getElementById('diseased-window-details');
	diseaseCheckmarks = document.getElementsByClassName('checkmark');

	addStatusButtonListeners();

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x25282d );

	createCamera();
	createControls();
	createLights();
	loadModels();
	createRenderer();
	addUiControls();
	
	
	raycaster = new THREE.Raycaster();
	renderer.domElement.addEventListener( 'mousedown', function(event){
		isCameraMoving = true;
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		startingTouchePos = [mouse.x, mouse.y];	

	}, false );
	
	renderer.domElement.addEventListener( 'mouseup', function(event){
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		if(get2dDistance(startingTouchePos, mouse) < 0.01){ // This is touch
			hasClicked = true;
			raycast (event, true);
		}
		isCameraMoving = false;
	}, false );
	
	renderer.domElement.addEventListener( 'mousemove', function(event){
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		raycast (event, false);
	}, false );
	
	
	renderer.domElement.addEventListener('touchstart', function(event){
		hasTouched = true;
	}, false);
	
	renderer.domElement.addEventListener('touchmove', function(event){
		hasTouched = false; 
		isCameraMoving = true;
	}, false);
	
	
	renderer.domElement.addEventListener('touchend', function(event){
		if(hasTouched){
			raycast (event, true);  
		}
		isCameraMoving = false;
	}, false);
	
	
	//Outlining the object
	var renderPass = new THREE.RenderPass( scene, camera );
	copyPass = new THREE.ShaderPass( THREE.CopyShader );
	copyPass.renderToScreen = true;

	composer = new THREE.EffectComposer(renderer);
	composer.addPass( renderPass );
	composer.addPass( copyPass );
	createOutlinePasses();
 

	let i = 0;
	renderer.setAnimationLoop( () => {
    	update();
    	render();
	});

}

function getJsonParamsFromUrl(url) {
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
    url = window.location.href,
    params = {},
    match;
    while(match = regex.exec(url)) {
        params[match[1]] = match[2];
    }
    return params;
}

function createCamera() {
	camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 1, 5000 );
	camera.position.set( 0, 1, 19 );
}



//======================================================
//============== TEETH STATUS SETTERS ==================
function addStatusButtonListeners(){

	toothStatusButtons[0].addEventListener('click', setAsHealthy);
	toothStatusButtons[1].addEventListener('click', setAsSick);
	toothStatusButtons[2].addEventListener('click', setAsDamaged);
	toothStatusButtons[3].addEventListener('click', setAsMissing);
	toothStatusButtons[4].addEventListener('click', setAsGolden);
	toothDescriptionSaveButton.addEventListener('click', saveToothDescription);


	for(let i = 0; i < toothStatusButtons.length; i++){
		toothStatusButtons[i].addEventListener('touchstart', function(event){
			hasTouched = true;
		}, false);
		toothStatusButtons[i].addEventListener('touchmove', function(event){
			hasTouched = false; 
			isCameraMoving = true;
		}, false);

		toothStatusButtons[i].addEventListener('mousedown', function(){
			isCameraMoving = true;
			//transformToothStatusMenu();
		});
		toothStatusButtons[i].addEventListener('mouseup', function(){
			isCameraMoving = false;
		});
	}
	
	
	toothStatusButtons[0].addEventListener('touchend', function(event){
		if(hasTouched){
			setAsHealthy();
		}
		isCameraMoving = false;
	}, false);

	toothStatusButtons[0].addEventListener('touchend', function(event){
		if(hasTouched){
			setAsHealthy(); 
		}
		isCameraMoving = false;
	});
	toothStatusButtons[1].addEventListener('touchend', function(event){
		if(hasTouched){
			setAsSick(); 
		}
		isCameraMoving = false;
	});
	toothStatusButtons[2].addEventListener('touchend', function(event){
		if(hasTouched){
			setAsDamaged(); 
		}
		isCameraMoving = false;
	});

	toothStatusButtons[3].addEventListener('touchend', function(event){
		if(hasTouched){
			setAsMissing(); 
		}
		isCameraMoving = false;
	});
	toothStatusButtons[3].addEventListener('touchend', function(event){
		if(hasTouched){
			setAsGolden(); 
		}
		isCameraMoving = false;
	});

}

function highlightCurrentObjectStatus(toothObj){
	revertStatusButtonColorChanges();
	if(toothObj.toothStatus == 'healthy'){
		toothStatusButtons[0].style.backgroundColor = "rgba(20,20,20,0.50)";
	}
	else if(toothObj.toothStatus == 'sick'){
		expandToothStatusMenu();
		toothStatusButtons[1].style.backgroundColor = "rgba(20,20,20,0.50)";
	}
	else if(toothObj.toothStatus == 'damaged'){
		expandToothStatusMenu();
		toothStatusButtons[2].style.backgroundColor = "rgba(20,20,20,0.50)";
	} 
	else if(toothObj.toothStatus == 'missing'){
		toothStatusButtons[3].style.backgroundColor = "rgba(20,20,20,0.50)";
	} 
	else if(toothObj.toothStatus == 'golden'){
		toothStatusButtons[4].style.backgroundColor = "rgba(20,20,20,0.50)";
	} 
}


function adjustDescriptionElementSizing(){
	if(window.innerWidth > 768){
		//toothStatusMenu.style.transform = `scale(${smallScreenScaleFactor}, ${smallScreenScaleFactor})`;
		toothStatusMenu.style.width = "680px";
	} else{
		//toothStatusMenu.style.transform = `scale(${smallScreenScaleFactor}, ${smallScreenScaleFactor})`;
		//toothStatusMenu.style.width = "calc(100% - 30px)";
		toothStatusMenu.style.width = "calc(100% + 20px)";
		//toothStatusMenu.style.right = "-15px";
		//toothStatusMenu.style.bottom = "40px";
		//toothStatusMenu.transform = "translate(50,50)";
		//diseasedDescriptionBox.style.width = `${window.innerWidth-20 - toothStatusButtons[0].clientWidth - 37-62 - 30}px`; // 37 - checkbox width, 62 - checkboxname width
	}
}

function expandToothStatusMenu(){
	adjustDescriptionElementSizing();

	if(!isStatusMenuExpanded){
		setTimeout(function(){
			diseasedTeethDetailsWindow.style.display="flex";
			showDiseasedTeethDetailWindow();
			
		},200);
	}
	isStatusMenuExpanded = true;
}


function hideDiseasedTeethDetailWindow(){
	diseasedTeethDetailsWindow.style.opacity = "0";
	setTimeout(function(){
		diseasedTeethDetailsWindow.style.display = "none";
		//diseasedTeethDetailsWindow.pointerEvents = "none";
	},200);
}
function showDiseasedTeethDetailWindow(){
	diseasedTeethDetailsWindow.style.display = "flex";
	setTimeout(function(){
		diseasedTeethDetailsWindow.style.opacity = "1";
	}, 100);
	
	
	
}

function minimizeToothStatusMenu(){
	toothStatusMenu.style = "132px";
	toothStatusMenu.style.opacity = "1";
	toothStatusMenu.style.pointerEvents = "all";
	//fadeOutDomElement(diseasedTeethDetailsWindow, 10);
	hideDiseasedTeethDetailWindow();
	//diseasedTeethDetailsWindow.style.opacity = "0";
	isStatusMenuExpanded = false;
}
function contractToothStatusMenu(){
	minimizeToothStatusMenu();
		//if(selectedObject != undefined && lastSelectedStatus != 'sick' && lastSelectedStatus != 'damaged'){
			/*fadeOutDomElement(diseasedTeethDetailsWindow, 10);
			setTimeout(function(){
				diseasedTeethDetailsWindow.style.display="none";
			},1000);*/
		//}
	isStatusMenuExpanded = false;
	
}
function revertStatusButtonColorChanges(){
	for(let i = 0; i < toothStatusButtons.length; i++){
		toothStatusButtons[i].style.backgroundColor = "rgba(80,80,80,0.55)";
	}
}

function setAsHealthy(){
	selectedObject.material = toothMaterials[0];
	contractToothStatusMenu();
	revertStatusButtonColorChanges();
	setToothStatus(selectedObject, 'healthy');
	deselectObject();
	lastSelectedStatus = 'healthy';
	
}
function setAsSick(){
	revertStatusButtonColorChanges();
	toothStatusButtons[1].style.backgroundColor = "rgba(20,20,20,0.50)";
	
	expandToothStatusMenu();
	lastSelectedStatus = 'sick';
	
	//setToothStatus(selectedObject, 'sick');
}
function setAsDamaged(){
	revertStatusButtonColorChanges();
	toothStatusButtons[2].style.backgroundColor = "rgba(20,20,20,0.50)";
	
	expandToothStatusMenu();
	lastSelectedStatus = 'damaged';
	
	//setToothStatus(selectedObject, 'damaged');
}
function setAsMissing(){
	selectedObject.material = toothMaterials[3];
	revertStatusButtonColorChanges();
	contractToothStatusMenu();
	setToothStatus(selectedObject, 'missing');
	deselectObject();
	lastSelectedStatus = 'missing';
}
function setAsGolden(){
	selectedObject.material = toothMaterials[4];
	revertStatusButtonColorChanges();
	contractToothStatusMenu();
	setToothStatus(selectedObject, 'golden');
	deselectObject();
	lastSelectedStatus = 'golden'
}
function saveToothDescription(){
	contractToothStatusMenu();
	revertStatusButtonColorChanges();

	if(lastSelectedStatus == 'sick'){
		selectedObject.material = toothMaterials[1];
		setToothStatus(selectedObject, 'sick');
		//deselectObject();
	} else if(lastSelectedStatus == 'damaged'){
		selectedObject.material = toothMaterials[2];
		setToothStatus(selectedObject, 'damaged');
		
	}
	deselectObject();
}


function initTeethArray(){
	for(let i = 0; i < scene.children.length; i++){
		if(scene.children[i].name == 'root'){
			for(let j = 0; j < scene.children[i].children.length; j++){
				let tempMesh = scene.children[i].children[j];
				if(tempMesh.name.includes('Tooth')){
					teethArr.push(new Tooth(tempMesh, 'healthy', '0', '0', '0', '0', '0', ""));
				}
			}
		}
	}
}

function loadToothStatus(object){
	if(object != undefined){
		let toothObj = getSelectedToothObj(object);
		setStatusDataOnUIElements(toothObj);
	}
}


function getSelectedToothObj(){
	let toothObjInArr;
	for(let i = 0; i < teethArr.length; i++){
		if(selectedObject.name == teethArr[i].mesh.name){
			toothObjInArr = teethArr[i];
			break;
		}
	}
	return toothObjInArr;
}
function getSelectedToothObj(mesh){
	let toothObjInArr;
	for(let i = 0; i < teethArr.length; i++){
		if(mesh.name == teethArr[i].mesh.name){
			toothObjInArr = teethArr[i];
			break;
		}
	}
	return toothObjInArr;
}


function setStatusDataOnUIElements(object){
	selectedObjectStatus = object.toothStatus;
	if(selectedObjectStatus == 'sick' || selectedObjectStatus == 'damaged'){
		expandToothStatusMenu();
	} else if(isStatusMenuExpanded){
		minimizeToothStatusMenu();
	}
	highlightCurrentObjectStatus(object); // show on button that it is selected
	if(object.checkedInside != diseaseCheckmarks[0].getAttribute('value')) diseaseCheckmarks[0].click();
	if(object.checkedOutside != diseaseCheckmarks[1].getAttribute('value')) diseaseCheckmarks[1].click();
	if(object.checkedLeft != diseaseCheckmarks[2].getAttribute('value')) diseaseCheckmarks[2].click();
	if(object.checkedRight != diseaseCheckmarks[3].getAttribute('value')) diseaseCheckmarks[3].click();
	if(object.checkedTop != diseaseCheckmarks[4].getAttribute('value')) diseaseCheckmarks[4].click();
	diseasedDescriptionBox.value = object.description;
}


function setToothStatus(object, status){
	let toothObj = getSelectedToothObj(object);
	toothObj.setStatus(status);

	setTimeout(function(){
		if(status == 'sick' || status == 'damaged'){
			toothObj.setCheckedInside(diseaseCheckmarks[0].getAttribute('value'));
			toothObj.setCheckedOutside(diseaseCheckmarks[1].getAttribute('value'));
			toothObj.setCheckedLeft(diseaseCheckmarks[2].getAttribute('value'));
			toothObj.setCheckedRight(diseaseCheckmarks[3].getAttribute('value'));
			toothObj.setCheckedTop(diseaseCheckmarks[4].getAttribute('value'));
			toothObj.setDescription(diseasedDescriptionBox.value);
		} else{
			toothObj.setCheckedInside('0');
			toothObj.setCheckedOutside('0');
			toothObj.setCheckedLeft('0');
			toothObj.setCheckedRight('0');
			toothObj.setCheckedTop('0');
		}
	}, 100);
	
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
	if(pos1 != undefined){
	  let xCoord = pos1[0] - mousePos.x;
	  let yCoord = pos1[1] - mousePos.y;
	  return Math.sqrt( xCoord*xCoord + yCoord*yCoord );
	}
	return 0;
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


//======================================================
//================= SCENE LIGHTS =======================
function createLights() {
  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 8 );
  const frontLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
  frontLight.position.set( 0, 5, 30 );
	
	const frontBottomLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  frontBottomLight.position.set( 0, -15, 30 );

  const farLeftLight = new THREE.DirectionalLight( 0xffffff, 1 );
  farLeftLight.position.set( -30, 8, 10 );
	
  const leftLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
  leftLight.position.set( -30, 10, -80 );
	
  const farRightLight = new THREE.DirectionalLight( 0xffffff, 1 );
  farRightLight.position.set( 30, 3, 2 );
	
  const rightLight = new THREE.DirectionalLight( 0xffffff, 1 );
  rightLight.position.set( 20, 10, 10 );	

  scene.add( ambientLight, frontLight, frontBottomLight, farLeftLight, leftLight, rightLight, farRightLight );

}

function createToothMaterials(model){
	let object = model.children[1];

	object.material.side = THREE.DoubleSide;
	object.material.map.minFilter = THREE.NearestFilter;
	let healthyMaterial = cloneMaterial(object, true, 1, 0x838383);
	let sickMaterial = cloneMaterial(object, true, 1, 0x4f4f4f);
	let damagedMaterial = cloneMaterial(object, true, 1, 0x222222);
	let missingMaterial = cloneMaterial(object, true, 0, 0x838383);
	let goldenMaterial = cloneMaterial(object, true, 1, 0xb28c26);
	let gumMaterial = cloneMaterial(object, true, 1, 0x838383);

	toothMaterials.push(healthyMaterial, sickMaterial, damagedMaterial, missingMaterial, goldenMaterial, gumMaterial);
}

function loadTextureMap(textureName){
	//let texture = new THREE.TextureLoader().load( 'models/Textures/Roughness.jpg' );
	let src = 'models/Textures/' + textureName + '.jpg';
	let texture = new THREE.TextureLoader().load( src );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.encoding = THREE.sRGBEncoding;
	texture.flipY = false;
	texture.needsUpdate = true;
}

function fillSickAndDamagedMapArrays(){

}

function cloneMaterial(objectToClone, transparency, opacity, colorHex){
	//Healthy material
	let mat = objectToClone.material.clone();
	mat.map = objectToClone.material.map.clone();
	mat.map.repeat.set(1,1);
	mat.map.offset.set(0,0); 
	mat.map.minFilter = THREE.NearestFilter;
	mat.map.magFilter = THREE.NearestFilter;
	mat.map.needsUpdate = true;
	mat.side = THREE.DoubleSide;
	mat.transparent = transparency;
	mat.opacity = opacity;
	mat.color.setHex( colorHex );
	return mat;
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
		  
		addMouthOpeningScrubber(mixer, action);
	    scene.add( model );

	    fadeOutLoadingScreen();

	    //Replace object names with actual objects
		for(let i = 0; i < gumObjectNames.length; i++){
			gumObjects[i] = scene.getObjectByName(gumObjectNames[i], true);
		}

		createToothMaterials(model);
		initTeethArray();
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

	const teethPosition = new THREE.Vector3( 0, -0.1, 1 );
	loader.load( 'models/GLTF/Teeth.gltf', gltf => onLoad( gltf, teethPosition ), onProgress, onError );


	

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

	TWEEN.update();
	controls.update();
	
	renderer.render( scene, camera );
	composer.render();

}

var timeOut = null;

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  // update the camera's frustum
  camera.updateProjectionMatrix();
  renderer.setSize( container.clientWidth, container.clientHeight );


	if(window.innerHeight != iHeight) {
		iHeight = window.innerHeight;
		document.body.style.height = iHeight + 'px';
	}
	if(timeOut) clearTimeout(timeOut);
	timeOut = setTimeout(onWindowResize, 100);
}

window.addEventListener( 'resize', onWindowResize );
/*

function additionalHeightresize() {
	if(window.innerHeight != iHeight) {
		iHeight = window.innerHeight;
		document.body.style.height = iHeight + 'px';
	}
}*/


//======================================================
//=================== TRANSITIONS ======================
function fadeOutDomElement(element, interval) {

    var opacity = 1;  // initial opacity
    var timer = setInterval(function () {

    	if(opacity < 1){
    		element.pointerEvents = "none";
    	} 
    	if (opacity <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = opacity;
        element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
        opacity -= opacity * 0.1;
    }, interval);
}

function fadeOutLoadingScreen(element, interval) {
	setTimeout(function(){
		fadeOutDomElement(loadingOverlay.children[0], 20); // fade loading animation first
		setTimeout(function(){
			fadeOutDomElement(loadingOverlay, 20);
		}, 160);
	}, 1400);
}

function fadeInDomElement(element) {
    var opacity = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if(opacity > 0.1){
        	element.pointerEvents = "all";
        }
        if (opacity >= 1){
            clearInterval(timer);
        }
        element.style.opacity = opacity;
        element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
        opacity += opacity * 0.1;
    }, 10);
}



function fadeOutMeshElement(element) {
	if(element != undefined){
	    var opacity = 1;  // initial opacity
	    var timer = setInterval(function () {
	    	if(opacity < 1){
	    		//element.pointerEvents = "none";
	    	} 
	    	if (opacity <= 0.1){
	    		opacity = 0.0;
	    		element.visible = false;
	            clearInterval(timer);
	        }
	        element.material.opacity = opacity;
	        opacity -= opacity * 0.1;
	    }, 10);
	}
}
function fadeInMeshElement(element) {
	if(element != undefined){
	    var opacity = 0.1;  // initial opacity
	    element.visible = true;
	    var timer = setInterval(function () {
	        if (opacity >= 1){
	            clearInterval(timer);
	        }
	        element.material.opacity = opacity;
	        opacity += opacity * 0.1;
	    }, 10);
	}
}



//======================================================
//================== ADD UI CONTROLS ===================
function addUiControls(){
	/*
	let resetButton = document.createElement('div');
	resetButton.className += "button";

	let resetText = document.createTextNode("RESET");     // Create a text node
	resetButton.appendChild(resetText);  

	resetButton.id = "reset-button";
	resetButton.title ="Reset camera button";
	document.getElementById("controls-container").appendChild(resetButton);
	resetButton.addEventListener('click', resetToStartingPosition);*/

	/*let resetButton = document.createElement('div');
	let resetImage = document.createElement('IMG');
	resetImage.src = "../images/Reset-icon.svg";
	resetButton.appendChild(resetImage);
	
	resetButton.id = "reset-button";
	resetButton.class += 'button';
	resetButton.title ="Reset camera button";
	document.getElementById("controls-container").appendChild(resetButton);
	resetButton.addEventListener('click', resetToStartingPosition);*/


	/*let toggleGumsButton = document.createElement('div');
	toggleGumsButton.className += "button";

	let gumsText = document.createTextNode("GUMS");     // Create a text node
	toggleGumsButton.appendChild(gumsText);  

	toggleGumsButton.id = "toggle-gums-button";
	toggleGumsButton.title = "Toggle gum visibility"
	document.getElementById("controls-container").appendChild(toggleGumsButton);
	toggleGumsButton.addEventListener('click', toggleGumVisibility);*/


	let resetButton = document.getElementById('reset-icon');
	resetButton.title ="Reset camera button";
	resetButton.addEventListener('click', resetToStartingPosition);

	let toggleGumsButton = document.getElementById('no-gums-icon');
	toggleGumsButton.title = "Toggle gum visibility";
	toggleGumsButton.addEventListener('click', toggleGumVisibility);

	let toggleIsolationButton = document.getElementById('isolate-icon');
	toggleIsolationButton.title = "Toggle object isolation";
	toggleIsolationButton.addEventListener('click', toggleSelectionIsolation);


	for(let i = 0; i < diseaseCheckmarks.length; i++){
		if (diseaseCheckmarks[i].hasAttribute('value') == false) {
            diseaseCheckmarks[i].setAttribute('value', '0');
            diseaseCheckmarks[i].children[0].style.display="none";
        } else {
            if (diseaseCheckmarks[i].getAttribute('value') == '1') {
                diseaseCheckmarks[i].setAttribute('value', '1');
                diseaseCheckmarks[i].className += " selected";
                diseaseCheckmarks[i].children[0].style.display="inline-block";
            }
        }


        diseaseCheckmarks[i].onclick = function () {
            if (this.getAttribute('value') == '1') {
                this.setAttribute('value', '0');
                this.className = this.className.replace(' selected', '');
                this.children[0].style.display="none";
            } else {
                this.setAttribute('value', '1');
                this.className += " selected";
                this.children[0].style.display="inline-block";
            }
        };
    }

/*
		diseaseCheckmarks[i].addEventListener('click', function(){
			if(diseaseCheckmarks[i].getAttribute('value') == '0') {
				diseaseCheckmarks[i].setAttribute('value', '1');
			}
			else {
				diseaseCheckmarks[i].setAttribute('value', '0');
			}
		});
		diseaseCheckmarks[i].setAttribute('value', '0');
	}*/
}

function toggleGumVisibility(){
	if(gumObjects[0] != undefined){
		if(areGumsVisible){
			for(let i = 0; i < gumObjects.length; i++){
				gumObjects[i].material = toothMaterials[5];
				fadeOutMeshElement(gumObjects[i]);
			}
			areGumsVisible = false;
		} else{
			for(let i = 0; i < gumObjects.length; i++){
				gumObjects[i].material = toothMaterials[5];
				fadeInMeshElement(gumObjects[i]);
			}
			areGumsVisible = true;
		}
	}
	
}


function addMouthOpeningScrubber(mixer, action){
	scrubber = new ScrubberView();
	scrubber.elt.title = "Slide to control openness of the mouth"

	let container = document.getElementById("controls-container");
	container.insertBefore(scrubber.elt, container.children[2]);
	/*if(window.innerWidth < 768){
		container.style.transform = `scale(${smallScreenScaleFactor}, ${smallScreenScaleFactor})`;
		container.style.bottom = "20px";
	}*/
	
	scrubber.value(0);
	scrubber.min(0).max(60).step(1).orientation('horizontal');
	
	scrubber.onScrubStart = function (value) {
	}
	// onValueChanged is called whenever the scrubber is moved.
	scrubber.onValueChanged = function (value) {
		
		
		let currentPos = value * (animationMaxTime+4) / animationLength; //animation's time based on slider value

		action.paused = false
		seekAnimationTime(mixer, currentPos)
		action.paused = true;


		adjustIsolationPositionOnMouthPositionChange();

		



		//transformToothStatusMenu(); // animate status box
		
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


//======================================================
//================== RAYCASTING ========================
function raycast ( e , isSelected) {
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
	    //selectedObject = null;
	    composer.passes[2].enabled = false;
	    if(isSelected){
	    	deselectObject();
	    }
    } else{
		if(!isObjectFiltered(closestIntersection.object, isSelected)){
			composer.passes[2].enabled = true;
			if(isSelected){
				selectObject(closestIntersection.object);
				setOutlinedObject(closestIntersection.object, true); 

		    } else{
		    	setOutlinedObject(closestIntersection.object, false); 
		    }
		} else{
			composer.passes[2].enabled = false;
		}
    }
    
}


//Does not allow to pick an object that is in filtered object's list
function isObjectFiltered(object, isSelected){
	let objectName = object.name;
	for(let i = 0; i < filteredObjectNames.length; i++){
		if(filteredObjectNames[i] == objectName){
			if(isSelected){
				selectedObject = null;
	    		composer.passes[3].enabled = false;
	    		deselectObject();
			}
			return true;
		}
	}
	return false;
}



//======================================================
//================ OBJECT SELECTION ====================
function selectObject(object){
	selectedObject = object;
	composer.passes[3].enabled = true;
	setOutlinedObject(object, true); 
	//transformToothStatusMenu();
	loadToothStatus(object);
	fadeInToothStatusMenu();
}

function deselectObject(){
	selectedObject = null;
	composer.passes[3].enabled = false;
	//fadeOutDomElement(toothStatusMenu);
	contractToothStatusMenu();
	fadeOutToothStatusMenu();
	//controls.target.set(0, 0, 0);
	//setupTween (controls, controls.target.clone(),controls.target, new THREE.Vector3(0,0,0), 1000);	
	controls.update();

}


let defaultCameraSettings;
function isolateObject(){
	if(selectedObject != undefined){


		defaultCameraSettings = camera.clone();

		//console.log(camera.position.z);
		let boundingBox = new THREE.Box3();
		boundingBox.setFromObject( selectedObject );
		const center = new THREE.Vector3();
		const size = new THREE.Vector3();
		boundingBox.getCenter(center);
		boundingBox.getSize(size);
		
		let offset = 7.5;
		const maxDim = Math.max( size.x, size.y, size.z );
		//const fov = camera.fov * ( Math.PI / 180 );


		let cameraZ = Math.abs( maxDim / 4 * Math.tan( camera.fov * 2 ) );
	    cameraZ *= offset; // zoom out a little so that objects don't fill the screen
	    //camera.position.z = cameraZ;

	    const minZ = boundingBox.min.z;

	    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;
	    camera.far = cameraToFarEdge * 100;
	    

		let objPos = selectedObject.position;
		let camPos = camera.position;
		let destinationCamPos = getLinearCoords(camPos, objPos, 6);


		setupTween(controls, controls.target.clone(), controls.target, center, 1300);
		setupTween(camera, camera.position.clone(), camera.position, destinationCamPos, 1300);
		

		setNonSelectedObjectVisibility(false);

	}
}
//VECTOR CALCULATIONS (For camera zooming)
function addVectors(v1, v2) {
    return v1.map((x, i) => x + v2[i]);
}

function scalarMultiply(v, c) {
    return v.map(x => x*c);
}

function getLength(v) {
    return Math.hypot(...v);
}

//Point B + distance looking from point A
function getLinearCoords(posA, posB, dist){
	const A = [posA.x, posA.y, posA.z];
	const B = [posB.x, posB.y, posB.z];

	const vecB2A = addVectors(A, scalarMultiply(B, -1));
	const normB2A = scalarMultiply(vecB2A, 1/getLength(vecB2A));
	const distB2A = scalarMultiply(normB2A, dist);
	const C = addVectors(B, distB2A);
	return new THREE.Vector3(C[0], C[1], C[2]);
}


function deIsolateObject(){
	if(selectedObject != undefined){
		
		setNonSelectedObjectVisibility(true);
		camera.needsUpdate = true;

		let objPos = selectedObject.position;
		let camPos = camera.position;

		let destinationCamPos;

		if(camera.position.z < 0){
			destinationCamPos = startingCameraPosition;
		//destinationCamPos.y = 1;
		
			/*destinationCamPos.z = 0;
			if(controls.target.x >= 0) destinationCamPos.x = 16;
			else destinationCamPos.x = -16;*/
		}  else{
			destinationCamPos = getLinearCoords(camPos, objPos, 19);
		}
		setupTween(controls, controls.target.clone(), controls.target, new THREE.Vector3(0,0,0), 1300);
		setupTween(camera, camera.position.clone(), camera.position, destinationCamPos, 1300);
	} else{

		setNonSelectedObjectVisibility(true);
		setupTween(controls, controls.target.clone(), controls.target, new THREE.Vector3(0,0,0), 1300);
		setupTween(camera, camera.position.clone(), camera.position, startingCameraPosition, 1300);
	}
}


function toggleSelectionIsolation(){
		if(isIsolated){
			deIsolateObject();
			isIsolated = false;
		} else{
			if(selectedObject != undefined){
				isolateObject();
				isIsolated = true;
			}
		}
}

function adjustIsolationPositionOnMouthPositionChange(){
	if(isIsolated && selectedObject != undefined){
			let boundingBox = new THREE.Box3();
			boundingBox.setFromObject( selectedObject );
			let center = new THREE.Vector3();
			boundingBox.getCenter(center);
			controls.target = center;
		}
}


const fitCameraToObject = function ( camera, object, offset, controls ) {
    offset = offset || 1.25;
    const boundingBox = new THREE.Box3();
    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject( object );
    const center = boundingBox.getCenter();
    const size = boundingBox.getSize();
    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max( size.x, size.y, size.z );
    const fov = camera.fov * ( Math.PI / 180 );
    let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );
    cameraZ *= offset; // zoom out a little so that objects don't fill the screen
    camera.position.z = cameraZ;
    const minZ = boundingBox.min.z;
    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;
    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();

    if ( controls ) {
      // set camera to rotate around center of loaded object
      controls.target = center;
      // prevent camera from zooming out far enough to create far plane cutoff
      controls.maxDistance = cameraToFarEdge * 2;
      controls.saveState();
    } else {
        camera.lookAt( center )
   }
}

function setNonSelectedObjectVisibility(isVisible){
	for(let i = 0; i < scene.children.length; i++){
		if(scene.children[i].name == 'root'){
			for(let j = 0; j < scene.children[i].children.length; j++){
				let tempChild = scene.children[i].children[j];
				if(selectedObject != undefined){
					if(selectedObject.name != tempChild.name){
						tempChild.visible = isVisible;
					}
				} else{
					tempChild.visible = isVisible
				}
			}
		}
	}
}

function setupTween (object, position, copyParam, target, duration)
{
    //TWEEN.removeAll();    // remove previous tweens if needed
    new TWEEN.Tween (position)
        .to (target, duration)
        .easing (TWEEN.Easing.Cubic.InOut)
        .onUpdate (
            function() {
                // copy incoming position into capera position
                copyParam.copy (position);

                //transformToothStatusMenu();
            })
        .start();
}
function resetToStartingPosition(){
	setupTween (camera, camera.position.clone(), camera.position, startingCameraPosition, 1500);	
	setupTween (controls, controls.target.clone(),controls.target, new THREE.Vector3(0,0,0), 1500);	
}





function fadeOutToothStatusMenu(){
	toothStatusMenu.style.opacity = "0";
	toothStatusMenu.style.pointerEvents = "none";
}
function fadeInToothStatusMenu(){
	//setupTween (camera.position.clone(), new THREE.Vector3 (startingCameraPosition.x, startingCameraPosition.y, startingCameraPosition.z), 1500);
	
	toothStatusMenu.style.opacity = "1";
	toothStatusMenu.style.pointerEvents = "all";

	//console.log(selectedObjectStatus);
	if(selectedObjectStatus == 'sick' || selectedObjectStatus == 'damaged'){
		expandToothStatusMenu();
	}
}


/*function transformToothStatusMenu(){
	if(toothStatusMenu.opacity != "0"){
		let pos = toScreenPosition(selectedObject, camera);
		toothStatusMenu.style.left = (`${pos.x+50}px`);
		toothStatusMenu.style.top = (`${pos.y}px`);



		if(pos.x > window.innerWidth/2){
			//toothStatusMenu.style.left = (`${pos.x+50}px`);
		} else{
			//toothStatusMenu.style.left = (`${pos.x-50-toothStatusMenu.clientWidth}px`);
		}
		
		

		//Right border protection
		if(toothStatusMenu.clientWidth + toothStatusMenu.offsetLeft + 5 > window.innerWidth){
			toothStatusMenu.style.left = `${window.innerWidth - toothStatusMenu.clientWidth - 5}px`;
		}
		//Left border protection
		if(toothStatusMenu.offsetLeft - 5 < 0 ){
			toothStatusMenu.style.left = "5px";
		}
		//Bottom border protection
		if(toothStatusMenu.clientHeight + toothStatusMenu.offsetTop + 70 > window.innerHeight){
			toothStatusMenu.style.top = `${window.innerHeight - toothStatusMenu.clientHeight - 70}px`;
		}
		//Top border protection
		if(toothStatusMenu.offsetTop - 5 < 0 ){
			toothStatusMenu.style.top = "5px";
		}
	}
}*/


//======================================================
//================ OBJECT OUTLINING ====================
function createOutlinePasses(){ // 2 pass - hover, 3 pass - selection
	//Outline for hover
	let outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
	if(isTouchDevice){
		outlinePass.edgeStrength = Number( 25 );
		outlinePass.edgeThickness = Number( 3 );
	} else{
		outlinePass.edgeStrength = Number( 20 );
		outlinePass.edgeThickness = Number( 3 );	
	}
	outlinePass.edgeGlow = Number( 0);
	outlinePass.pulsePeriod = Number( 0 );
	outlinePass.visibleEdgeColor.set( new THREE.Color("rgb(15, 15, 15)") );
	outlinePass.hiddenEdgeColor.set( new THREE.Color("rgb(4, 4, 4)") );
	outlinePass.selectedObjects = [];
	composer.addPass( outlinePass );

	//Outline for selection
	outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
	if(isTouchDevice){
		outlinePass.edgeStrength = Number( 25 );
		outlinePass.edgeThickness = Number( 3 );
	} else{
		outlinePass.edgeStrength = Number( 20 );
		outlinePass.edgeThickness = Number( 3 );	
	}

	outlinePass.edgeGlow = Number( 0);
	outlinePass.pulsePeriod = Number( 0 );
	outlinePass.visibleEdgeColor.set( new THREE.Color("rgb(255, 255, 255)") );
	outlinePass.hiddenEdgeColor.set( new THREE.Color("rgb(9, 9, 9)") );
	outlinePass.selectedObjects = [];
	composer.addPass( outlinePass );
}

function setOutlinedObject(object, isSelected){
	if(isSelected){ // selected
		let tempOutlinePass = composer.passes[3];
		
		if(tempOutlinePass == undefined || !tempOutlinePass.selectedObjects.includes(object)){
			tempOutlinePass.enabled = true;
			tempOutlinePass.selectedObjects = [object];
		}
	} else{ // hovered
		let tempOutlinePass = composer.passes[2];
		if((tempOutlinePass == undefined || !tempOutlinePass.selectedObjects.includes(object)) && !tempOutlinePass.selectedObjects.includes(selectedObject)){
			tempOutlinePass.enabled = true;
			tempOutlinePass.selectedObjects = [object];
		}
	}

}


//======================================================
//============= 2D POSITIONING FROM 3D =================
function toScreenPosition(object, camera){
	if(object != null){
	    var vector = new THREE.Vector3();

	    //var widthHalf = 0.5*renderer.context.canvas.width;
	    //var heightHalf = 0.5*renderer.context.canvas.height;
	    var widthHalf = window.innerWidth/2;
	    var heightHalf = window.innerHeight/2;

	    object.updateMatrixWorld();
	    vector.setFromMatrixPosition(object.matrixWorld);
	    vector.project(camera);

	    vector.x = ( vector.x * widthHalf ) + widthHalf;
	    vector.y = - ( vector.y * heightHalf ) + heightHalf;

	    return { 
	        x: vector.x,
	        y: vector.y
	    };
	} return {x:0, y:0}
};



params = getJsonParamsFromUrl(url);
if(params.autostart == "false"){
	var preloadScreen = document.getElementById("preloader");
	preloadScreen.children[0].addEventListener('click', function(){
		preloadScreen.style.pointerEvents = "none";
		preloadScreen.style.opacity = "0";
		init();
	});
} else{
	init();
}

