var _0x3cbf=['OutlinePass','Vector2','edgeStrength','edgeThickness','edgeGlow','pulsePeriod','visibleEdgeColor','rgb(15,\x2015,\x2015)','hiddenEdgeColor','rgb(4,\x204,\x204)','selectedObjects','rgb(255,\x20255,\x20255)','rgb(9,\x209,\x209)','updateMatrixWorld','matrixWorld','project','log','**************************************','*\x20\x20\x20TEETH\x20STATUS\x20VIEWER\x20BY\x20NOSTEC7\x20\x20\x20*','Vector3','Upper_jaw001','Lower_jaw001','innerHeight','mesh','toothStatus','healthy','checkedInside','checkedOutside','checkedLeft','checkedTop','description','setStatus','setCheckedInside','setCheckedOutside','setCheckedTop','setDescription','getElementById','loading-screen','tooth-status-menu','status-selection','save-description','diseased-status-window','disease-description-box','disease-checkboxes','disease-checkbox-names','diseased-window-details','getElementsByClassName','checkmark','Scene','background','Color','Raycaster','domElement','mousedown','clientX','clientY','addEventListener','mouseup','innerWidth','mousemove','touchstart','touchmove','RenderPass','ShaderPass','renderToScreen','addPass','setAnimationLoop','PerspectiveCamera','clientHeight','position','click','length','touchend','style','backgroundColor','rgba(20,20,20,0.50)','sick','damaged','missing','golden','width','680px','calc(100%\x20+\x2020px)','display','flex','none','opacity','132px','pointerEvents','material','children','name','includes','push','getAttribute','value','checkedRight','setCheckedLeft','setCheckedRight','test','substr','userAgent','vendor','opera','sqrt','enableDamping','dampingFactor','rotateSpeed','panSpeed','zoomSpeed','minPolarAngle','screenSpacePanning','DirectionalLight','set','add','DoubleSide','.jpg','TextureLoader','load','RepeatWrapping','wrapT','encoding','sRGBEncoding','clone','map','repeat','offset','side','transparent','color','setHex','copy','animations','AnimationMixer','clipAction','play','getObjectByName','WebGLRenderer','setSize','clientWidth','devicePixelRatio','gammaOutput','physicallyCorrectLights','appendChild','getDelta','update','render','aspect','body','height','resize','filter','alpha(opacity=','all','visible','reset-icon','title','Reset\x20camera\x20button','no-gums-icon','Toggle\x20gum\x20visibility','isolate-icon','Toggle\x20object\x20isolation','hasAttribute','setAttribute','inline-block','onclick','className','replace','\x20selected','elt','Slide\x20to\x20control\x20openness\x20of\x20the\x20mouth','min','max','step','orientation','horizontal','onValueChanged','paused','onScrubEnd','time','_actions','changedTouches','setFromCamera','intersectObjects','passes','enabled','object','setFromObject','getCenter','getSize','abs','tan','fov','far','hypot','needsUpdate','target','Box3','updateProjectionMatrix','maxDistance','saveState','lookAt','Tween','easing','Cubic','InOut','onUpdate','start'];(function(_0x3ea5fc,_0x278fbc){var _0x5bdf11=function(_0x44d4c9){while(--_0x44d4c9){_0x3ea5fc['push'](_0x3ea5fc['shift']());}};_0x5bdf11(++_0x278fbc);}(_0x3cbf,0x1b0));var _0xfcc2=function(_0x2b7374,_0x6cf57c){_0x2b7374=_0x2b7374-0x0;var _0x49f7e7=_0x3cbf[_0x2b7374];return _0x49f7e7;};console[_0xfcc2('0x0')](_0xfcc2('0x1'));console[_0xfcc2('0x0')](_0xfcc2('0x2'));console[_0xfcc2('0x0')](_0xfcc2('0x1'));let container;let camera;let controls;let renderer;let composer,copyPass,renderPass;let scene;let scrubber;let loadingOverlay;let toothStatusMenu;let toothStatusButtons;let animationMaxTime=1.99;let animationLength=animationMaxTime*0x64;let isCameraMoving=![];let hoveredObject;let selectedObject;let selectedObjectStatus;let isTouchDevice=!![];let hasTouched=![];let hasClicked=!![];let startingTouchePos;let touchTravelDistance=0x0;let raycaster,mouse={'x':0x0,'y':0x0};let startingCameraPosition=new THREE[(_0xfcc2('0x3'))](-0.1469926322389252,1.1960779151428367,15.98586221593867);let filteredObjectNames=[_0xfcc2('0x4'),_0xfcc2('0x5')];let gumObjects=[undefined,undefined];let gumObjectNames=['Upper_jaw001',_0xfcc2('0x5')];let sickTeethTextures=[];let sickTeethMaterials=[];let damagedTeethTextures=[];let damagedTeethMaterials=[];let toothMaterials=[];let lastSelectedStatus;let isStatusMenuExpanded=![];let isIsolated=![];let diseasedTeethDetailsWindow;let diseasedWindowDetails;let diseasedDescriptionBox;let diseaseCheckboxes;let diseaseCheckmarks;let diseaseCheckboxNames;let areGumsVisible=!![];let smallScreenScaleFactor=0.8;const mixers=[];const clock=new THREE['Clock']();let iHeight=window[_0xfcc2('0x6')];let teethArr=[];class Tooth{constructor(_0x3e51af,_0x417a7a,_0x23ccd7,_0x3b919c,_0xbe0058,_0x539d0d,_0x4184ab,_0x592c49){this[_0xfcc2('0x7')]=_0x3e51af;this[_0xfcc2('0x8')]=_0xfcc2('0x9');this[_0xfcc2('0xa')]=_0x23ccd7;this[_0xfcc2('0xb')]=_0x3b919c;this[_0xfcc2('0xc')]=_0xbe0058;this['checkedRight']=_0x539d0d;this[_0xfcc2('0xd')]=_0x4184ab;this[_0xfcc2('0xe')]=_0x592c49;}[_0xfcc2('0xf')](_0x3a5cef){this[_0xfcc2('0x8')]=_0x3a5cef;}[_0xfcc2('0x10')](_0x472652){this['checkedInside']=_0x472652;}[_0xfcc2('0x11')](_0x2f8e10){this[_0xfcc2('0xb')]=_0x2f8e10;}['setCheckedLeft'](_0x45544e){this['checkedLeft']=_0x45544e;}['setCheckedRight'](_0x5d4dee){this['checkedRight']=_0x5d4dee;}[_0xfcc2('0x12')](_0x129352){this[_0xfcc2('0xd')]=_0x129352;}[_0xfcc2('0x13')](_0x21e7c4){this[_0xfcc2('0xe')]=_0x21e7c4;}}function init(){isTouchDevice=isMobileTablet();container=document[_0xfcc2('0x14')]('scene-container');loadingOverlay=document[_0xfcc2('0x14')](_0xfcc2('0x15'));toothStatusMenu=document['getElementById'](_0xfcc2('0x16'));toothStatusButtons=document['getElementsByClassName'](_0xfcc2('0x17'));toothDescriptionSaveButton=document[_0xfcc2('0x14')](_0xfcc2('0x18'));diseasedTeethDetailsWindow=document['getElementById'](_0xfcc2('0x19'));diseasedDescriptionBox=document[_0xfcc2('0x14')](_0xfcc2('0x1a'));diseaseCheckboxes=document[_0xfcc2('0x14')](_0xfcc2('0x1b'));diseaseCheckboxNames=document[_0xfcc2('0x14')](_0xfcc2('0x1c'));diseasedWindowDetails=document['getElementById'](_0xfcc2('0x1d'));diseaseCheckmarks=document[_0xfcc2('0x1e')](_0xfcc2('0x1f'));addStatusButtonListeners();scene=new THREE[(_0xfcc2('0x20'))]();scene[_0xfcc2('0x21')]=new THREE[(_0xfcc2('0x22'))](0x25282d);createCamera();createControls();createLights();loadModels();createRenderer();addUiControls();raycaster=new THREE[(_0xfcc2('0x23'))]();renderer[_0xfcc2('0x24')]['addEventListener'](_0xfcc2('0x25'),function(_0x572276){isCameraMoving=!![];mouse['x']=_0x572276[_0xfcc2('0x26')]/window['innerWidth']*0x2-0x1;mouse['y']=-(_0x572276[_0xfcc2('0x27')]/window['innerHeight'])*0x2+0x1;startingTouchePos=[mouse['x'],mouse['y']];},![]);renderer[_0xfcc2('0x24')][_0xfcc2('0x28')](_0xfcc2('0x29'),function(_0x27f447){mouse['x']=_0x27f447[_0xfcc2('0x26')]/window[_0xfcc2('0x2a')]*0x2-0x1;mouse['y']=-(_0x27f447[_0xfcc2('0x27')]/window[_0xfcc2('0x6')])*0x2+0x1;if(get2dDistance(startingTouchePos,mouse)<0.01){hasClicked=!![];raycast(_0x27f447,!![]);}isCameraMoving=![];},![]);renderer[_0xfcc2('0x24')][_0xfcc2('0x28')](_0xfcc2('0x2b'),function(_0x483421){mouse['x']=_0x483421[_0xfcc2('0x26')]/window[_0xfcc2('0x2a')]*0x2-0x1;mouse['y']=-(_0x483421[_0xfcc2('0x27')]/window[_0xfcc2('0x6')])*0x2+0x1;raycast(_0x483421,![]);},![]);renderer[_0xfcc2('0x24')][_0xfcc2('0x28')](_0xfcc2('0x2c'),function(_0x155022){hasTouched=!![];},![]);renderer[_0xfcc2('0x24')][_0xfcc2('0x28')](_0xfcc2('0x2d'),function(_0x1e134f){hasTouched=![];isCameraMoving=!![];},![]);renderer[_0xfcc2('0x24')][_0xfcc2('0x28')]('touchend',function(_0x5756da){if(hasTouched){raycast(_0x5756da,!![]);}isCameraMoving=![];},![]);var _0x3c6d8f=new THREE[(_0xfcc2('0x2e'))](scene,camera);copyPass=new THREE[(_0xfcc2('0x2f'))](THREE['CopyShader']);copyPass[_0xfcc2('0x30')]=!![];composer=new THREE['EffectComposer'](renderer);composer['addPass'](_0x3c6d8f);composer[_0xfcc2('0x31')](copyPass);createOutlinePasses();renderer[_0xfcc2('0x32')](()=>{update();render();});}function createCamera(){camera=new THREE[(_0xfcc2('0x33'))](0x23,container['clientWidth']/container[_0xfcc2('0x34')],0x1,0x1388);camera[_0xfcc2('0x35')]['set'](0x0,0x1,0x13);}function addStatusButtonListeners(){toothStatusButtons[0x0][_0xfcc2('0x28')]('click',setAsHealthy);toothStatusButtons[0x1]['addEventListener']('click',setAsSick);toothStatusButtons[0x2][_0xfcc2('0x28')](_0xfcc2('0x36'),setAsDamaged);toothStatusButtons[0x3][_0xfcc2('0x28')](_0xfcc2('0x36'),setAsMissing);toothStatusButtons[0x4][_0xfcc2('0x28')](_0xfcc2('0x36'),setAsGolden);toothDescriptionSaveButton[_0xfcc2('0x28')]('click',saveToothDescription);for(let _0x466cba=0x0;_0x466cba<toothStatusButtons[_0xfcc2('0x37')];_0x466cba++){toothStatusButtons[_0x466cba][_0xfcc2('0x28')](_0xfcc2('0x2c'),function(_0x58f3f8){hasTouched=!![];},![]);toothStatusButtons[_0x466cba][_0xfcc2('0x28')]('touchmove',function(_0x1fd66e){hasTouched=![];isCameraMoving=!![];},![]);toothStatusButtons[_0x466cba][_0xfcc2('0x28')](_0xfcc2('0x25'),function(){isCameraMoving=!![];});toothStatusButtons[_0x466cba][_0xfcc2('0x28')](_0xfcc2('0x29'),function(){isCameraMoving=![];});}toothStatusButtons[0x0][_0xfcc2('0x28')](_0xfcc2('0x38'),function(_0x32bbc2){if(hasTouched){setAsHealthy();}isCameraMoving=![];},![]);toothStatusButtons[0x0][_0xfcc2('0x28')](_0xfcc2('0x38'),function(_0x59f79d){if(hasTouched){setAsHealthy();}isCameraMoving=![];});toothStatusButtons[0x1][_0xfcc2('0x28')](_0xfcc2('0x38'),function(_0x549a6d){if(hasTouched){setAsSick();}isCameraMoving=![];});toothStatusButtons[0x2][_0xfcc2('0x28')](_0xfcc2('0x38'),function(_0x2d2eca){if(hasTouched){setAsDamaged();}isCameraMoving=![];});toothStatusButtons[0x3][_0xfcc2('0x28')](_0xfcc2('0x38'),function(_0x51b19b){if(hasTouched){setAsMissing();}isCameraMoving=![];});toothStatusButtons[0x3][_0xfcc2('0x28')](_0xfcc2('0x38'),function(_0x1dc4e5){if(hasTouched){setAsGolden();}isCameraMoving=![];});}function highlightCurrentObjectStatus(_0x14d3f6){revertStatusButtonColorChanges();if(_0x14d3f6[_0xfcc2('0x8')]==_0xfcc2('0x9')){toothStatusButtons[0x0][_0xfcc2('0x39')][_0xfcc2('0x3a')]=_0xfcc2('0x3b');}else if(_0x14d3f6[_0xfcc2('0x8')]==_0xfcc2('0x3c')){expandToothStatusMenu();toothStatusButtons[0x1][_0xfcc2('0x39')][_0xfcc2('0x3a')]='rgba(20,20,20,0.50)';}else if(_0x14d3f6['toothStatus']==_0xfcc2('0x3d')){expandToothStatusMenu();toothStatusButtons[0x2][_0xfcc2('0x39')]['backgroundColor']=_0xfcc2('0x3b');}else if(_0x14d3f6[_0xfcc2('0x8')]==_0xfcc2('0x3e')){toothStatusButtons[0x3][_0xfcc2('0x39')][_0xfcc2('0x3a')]='rgba(20,20,20,0.50)';}else if(_0x14d3f6[_0xfcc2('0x8')]==_0xfcc2('0x3f')){toothStatusButtons[0x4][_0xfcc2('0x39')][_0xfcc2('0x3a')]=_0xfcc2('0x3b');}}function adjustDescriptionElementSizing(){if(window[_0xfcc2('0x2a')]>0x300){toothStatusMenu[_0xfcc2('0x39')][_0xfcc2('0x40')]=_0xfcc2('0x41');}else{toothStatusMenu[_0xfcc2('0x39')][_0xfcc2('0x40')]=_0xfcc2('0x42');}}function expandToothStatusMenu(){adjustDescriptionElementSizing();if(!isStatusMenuExpanded){setTimeout(function(){diseasedTeethDetailsWindow[_0xfcc2('0x39')][_0xfcc2('0x43')]=_0xfcc2('0x44');showDiseasedTeethDetailWindow();},0xc8);}isStatusMenuExpanded=!![];}function hideDiseasedTeethDetailWindow(){diseasedTeethDetailsWindow[_0xfcc2('0x39')]['opacity']='0';setTimeout(function(){diseasedTeethDetailsWindow[_0xfcc2('0x39')]['display']=_0xfcc2('0x45');},0xc8);}function showDiseasedTeethDetailWindow(){diseasedTeethDetailsWindow[_0xfcc2('0x39')][_0xfcc2('0x43')]=_0xfcc2('0x44');setTimeout(function(){diseasedTeethDetailsWindow[_0xfcc2('0x39')][_0xfcc2('0x46')]='1';},0x64);}function minimizeToothStatusMenu(){toothStatusMenu[_0xfcc2('0x39')]=_0xfcc2('0x47');toothStatusMenu[_0xfcc2('0x39')][_0xfcc2('0x46')]='1';toothStatusMenu[_0xfcc2('0x39')][_0xfcc2('0x48')]='all';hideDiseasedTeethDetailWindow();isStatusMenuExpanded=![];}function contractToothStatusMenu(){minimizeToothStatusMenu();isStatusMenuExpanded=![];}function revertStatusButtonColorChanges(){for(let _0x1986ad=0x0;_0x1986ad<toothStatusButtons['length'];_0x1986ad++){toothStatusButtons[_0x1986ad]['style'][_0xfcc2('0x3a')]='rgba(80,80,80,0.55)';}}function setAsHealthy(){selectedObject['material']=toothMaterials[0x0];contractToothStatusMenu();revertStatusButtonColorChanges();setToothStatus(selectedObject,_0xfcc2('0x9'));deselectObject();lastSelectedStatus=_0xfcc2('0x9');}function setAsSick(){revertStatusButtonColorChanges();toothStatusButtons[0x1]['style'][_0xfcc2('0x3a')]=_0xfcc2('0x3b');expandToothStatusMenu();lastSelectedStatus=_0xfcc2('0x3c');}function setAsDamaged(){revertStatusButtonColorChanges();toothStatusButtons[0x2]['style'][_0xfcc2('0x3a')]=_0xfcc2('0x3b');expandToothStatusMenu();lastSelectedStatus=_0xfcc2('0x3d');}function setAsMissing(){selectedObject['material']=toothMaterials[0x3];revertStatusButtonColorChanges();contractToothStatusMenu();setToothStatus(selectedObject,_0xfcc2('0x3e'));deselectObject();lastSelectedStatus=_0xfcc2('0x3e');}function setAsGolden(){selectedObject[_0xfcc2('0x49')]=toothMaterials[0x4];revertStatusButtonColorChanges();contractToothStatusMenu();setToothStatus(selectedObject,_0xfcc2('0x3f'));deselectObject();lastSelectedStatus=_0xfcc2('0x3f');}function saveToothDescription(){contractToothStatusMenu();revertStatusButtonColorChanges();if(lastSelectedStatus=='sick'){selectedObject[_0xfcc2('0x49')]=toothMaterials[0x1];setToothStatus(selectedObject,_0xfcc2('0x3c'));}else if(lastSelectedStatus==_0xfcc2('0x3d')){selectedObject[_0xfcc2('0x49')]=toothMaterials[0x2];setToothStatus(selectedObject,_0xfcc2('0x3d'));}deselectObject();}function initTeethArray(){for(let _0x3c39fc=0x0;_0x3c39fc<scene[_0xfcc2('0x4a')][_0xfcc2('0x37')];_0x3c39fc++){if(scene[_0xfcc2('0x4a')][_0x3c39fc][_0xfcc2('0x4b')]=='root'){for(let _0xf90204=0x0;_0xf90204<scene[_0xfcc2('0x4a')][_0x3c39fc]['children'][_0xfcc2('0x37')];_0xf90204++){let _0x21adea=scene['children'][_0x3c39fc][_0xfcc2('0x4a')][_0xf90204];if(_0x21adea['name'][_0xfcc2('0x4c')]('Tooth')){teethArr[_0xfcc2('0x4d')](new Tooth(_0x21adea,_0xfcc2('0x9'),'0','0','0','0','0',''));}}}}}function loadToothStatus(_0x5a2c36){if(_0x5a2c36!=undefined){let _0x178bce=getSelectedToothObj(_0x5a2c36);setStatusDataOnUIElements(_0x178bce);}}function getSelectedToothObj(){let _0x5f428d;for(let _0x232497=0x0;_0x232497<teethArr[_0xfcc2('0x37')];_0x232497++){if(selectedObject[_0xfcc2('0x4b')]==teethArr[_0x232497][_0xfcc2('0x7')][_0xfcc2('0x4b')]){_0x5f428d=teethArr[_0x232497];break;}}return _0x5f428d;}function getSelectedToothObj(_0xe4ccc){let _0x46efb2;for(let _0x1099e2=0x0;_0x1099e2<teethArr[_0xfcc2('0x37')];_0x1099e2++){if(_0xe4ccc[_0xfcc2('0x4b')]==teethArr[_0x1099e2][_0xfcc2('0x7')][_0xfcc2('0x4b')]){_0x46efb2=teethArr[_0x1099e2];break;}}return _0x46efb2;}function setStatusDataOnUIElements(_0xe31e7e){selectedObjectStatus=_0xe31e7e['toothStatus'];if(selectedObjectStatus==_0xfcc2('0x3c')||selectedObjectStatus==_0xfcc2('0x3d')){expandToothStatusMenu();}else if(isStatusMenuExpanded){minimizeToothStatusMenu();}highlightCurrentObjectStatus(_0xe31e7e);if(_0xe31e7e[_0xfcc2('0xa')]!=diseaseCheckmarks[0x0][_0xfcc2('0x4e')](_0xfcc2('0x4f')))diseaseCheckmarks[0x0][_0xfcc2('0x36')]();if(_0xe31e7e[_0xfcc2('0xb')]!=diseaseCheckmarks[0x1]['getAttribute'](_0xfcc2('0x4f')))diseaseCheckmarks[0x1]['click']();if(_0xe31e7e[_0xfcc2('0xc')]!=diseaseCheckmarks[0x2][_0xfcc2('0x4e')](_0xfcc2('0x4f')))diseaseCheckmarks[0x2][_0xfcc2('0x36')]();if(_0xe31e7e[_0xfcc2('0x50')]!=diseaseCheckmarks[0x3][_0xfcc2('0x4e')]('value'))diseaseCheckmarks[0x3][_0xfcc2('0x36')]();if(_0xe31e7e[_0xfcc2('0xd')]!=diseaseCheckmarks[0x4]['getAttribute'](_0xfcc2('0x4f')))diseaseCheckmarks[0x4]['click']();diseasedDescriptionBox[_0xfcc2('0x4f')]=_0xe31e7e[_0xfcc2('0xe')];}function setToothStatus(_0xd7abc4,_0x3e19e8){let _0x2c3ae8=getSelectedToothObj(_0xd7abc4);_0x2c3ae8['setStatus'](_0x3e19e8);setTimeout(function(){if(_0x3e19e8==_0xfcc2('0x3c')||_0x3e19e8==_0xfcc2('0x3d')){_0x2c3ae8[_0xfcc2('0x10')](diseaseCheckmarks[0x0][_0xfcc2('0x4e')](_0xfcc2('0x4f')));_0x2c3ae8[_0xfcc2('0x11')](diseaseCheckmarks[0x1][_0xfcc2('0x4e')]('value'));_0x2c3ae8[_0xfcc2('0x51')](diseaseCheckmarks[0x2][_0xfcc2('0x4e')](_0xfcc2('0x4f')));_0x2c3ae8[_0xfcc2('0x52')](diseaseCheckmarks[0x3][_0xfcc2('0x4e')](_0xfcc2('0x4f')));_0x2c3ae8[_0xfcc2('0x12')](diseaseCheckmarks[0x4][_0xfcc2('0x4e')](_0xfcc2('0x4f')));_0x2c3ae8[_0xfcc2('0x13')](diseasedDescriptionBox['value']);}else{_0x2c3ae8[_0xfcc2('0x10')]('0');_0x2c3ae8[_0xfcc2('0x11')]('0');_0x2c3ae8[_0xfcc2('0x51')]('0');_0x2c3ae8[_0xfcc2('0x52')]('0');_0x2c3ae8[_0xfcc2('0x12')]('0');}},0x64);}function isMobileTablet(){var _0x45f42e=![];(function(_0x3eaf1c){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i[_0xfcc2('0x53')](_0x3eaf1c)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i[_0xfcc2('0x53')](_0x3eaf1c[_0xfcc2('0x54')](0x0,0x4)))_0x45f42e=!![];}(navigator[_0xfcc2('0x55')]||navigator[_0xfcc2('0x56')]||window[_0xfcc2('0x57')]));return _0x45f42e;}function get2dDistance(_0x1c743b,_0x41b978){if(_0x1c743b!=undefined){let _0x5d5b4e=_0x1c743b[0x0]-_0x41b978['x'];let _0x2e473d=_0x1c743b[0x1]-_0x41b978['y'];return Math[_0xfcc2('0x58')](_0x5d5b4e*_0x5d5b4e+_0x2e473d*_0x2e473d);}return 0x0;}function createControls(){controls=new THREE['OrbitControls'](camera,container);controls[_0xfcc2('0x59')]=!![];controls[_0xfcc2('0x5a')]=0.2;controls[_0xfcc2('0x5b')]=0.1;controls[_0xfcc2('0x5c')]=0.1;controls[_0xfcc2('0x5d')]=0x1;controls[_0xfcc2('0x5e')]=0x0;controls['maxPolarAngle']=2.9;controls[_0xfcc2('0x5f')]=!![];controls['update']();}function createLights(){const _0x5a56b4=new THREE['HemisphereLight'](0xddeeff,0xf0e0d,0x8);const _0x4e908c=new THREE[(_0xfcc2('0x60'))](0xffffff,0x1);_0x4e908c[_0xfcc2('0x35')]['set'](0x0,0x5,0x1e);const _0xb4bd7a=new THREE[(_0xfcc2('0x60'))](0xffffff,0.5);_0xb4bd7a[_0xfcc2('0x35')][_0xfcc2('0x61')](0x0,-0xf,0x1e);const _0x4e9624=new THREE[(_0xfcc2('0x60'))](0xffffff,0x1);_0x4e9624[_0xfcc2('0x35')][_0xfcc2('0x61')](-0x1e,0x8,0xa);const _0x2feecb=new THREE[(_0xfcc2('0x60'))](0xffffff,0.1);_0x2feecb[_0xfcc2('0x35')][_0xfcc2('0x61')](-0x1e,0xa,-0x50);const _0x36fe11=new THREE[(_0xfcc2('0x60'))](0xffffff,0x1);_0x36fe11[_0xfcc2('0x35')][_0xfcc2('0x61')](0x1e,0x3,0x2);const _0x38a6dc=new THREE[(_0xfcc2('0x60'))](0xffffff,0x1);_0x38a6dc[_0xfcc2('0x35')]['set'](0x14,0xa,0xa);scene[_0xfcc2('0x62')](_0x5a56b4,_0x4e908c,_0xb4bd7a,_0x4e9624,_0x2feecb,_0x38a6dc,_0x36fe11);}function createToothMaterials(_0x4c39f5){let _0x150e19=_0x4c39f5['children'][0x1];_0x150e19[_0xfcc2('0x49')]['side']=THREE[_0xfcc2('0x63')];let _0x363c24=cloneMaterial(_0x150e19,!![],0x1,0x838383);let _0x373e4d=cloneMaterial(_0x150e19,!![],0x1,0x4f4f4f);let _0x5ee9da=cloneMaterial(_0x150e19,!![],0x1,0x222222);let _0x4c52c5=cloneMaterial(_0x150e19,!![],0x0,0x838383);let _0x2e2360=cloneMaterial(_0x150e19,!![],0x1,0xb28c26);let _0x539695=cloneMaterial(_0x150e19,!![],0x1,0x838383);toothMaterials[_0xfcc2('0x4d')](_0x363c24,_0x373e4d,_0x5ee9da,_0x4c52c5,_0x2e2360,_0x539695);}function loadTextureMap(_0x3e3f15){let _0x3b2aaf='models/Textures/'+_0x3e3f15+_0xfcc2('0x64');let _0x3c08b6=new THREE[(_0xfcc2('0x65'))]()[_0xfcc2('0x66')](_0x3b2aaf);_0x3c08b6['wrapS']=THREE[_0xfcc2('0x67')];_0x3c08b6[_0xfcc2('0x68')]=THREE[_0xfcc2('0x67')];_0x3c08b6[_0xfcc2('0x69')]=THREE[_0xfcc2('0x6a')];_0x3c08b6['flipY']=![];_0x3c08b6['needsUpdate']=!![];}function fillSickAndDamagedMapArrays(){}function cloneMaterial(_0xedf6ea,_0xc4e010,_0x56ff5c,_0x340398){let _0x1e5cda=_0xedf6ea[_0xfcc2('0x49')]['clone']();_0x1e5cda['map']=_0xedf6ea[_0xfcc2('0x49')]['map'][_0xfcc2('0x6b')]();_0x1e5cda[_0xfcc2('0x6c')][_0xfcc2('0x6d')]['set'](0x1,0x1);_0x1e5cda[_0xfcc2('0x6c')][_0xfcc2('0x6e')][_0xfcc2('0x61')](0x0,0x0);_0x1e5cda[_0xfcc2('0x6c')]['needsUpdate']=!![];_0x1e5cda[_0xfcc2('0x6f')]=THREE[_0xfcc2('0x63')];_0x1e5cda[_0xfcc2('0x70')]=_0xc4e010;_0x1e5cda['opacity']=_0x56ff5c;_0x1e5cda[_0xfcc2('0x71')][_0xfcc2('0x72')](_0x340398);return _0x1e5cda;}function loadModels(){const _0x47c3e9=new THREE['GLTFLoader']();const _0x48afd2=(_0x4a1b63,_0x407928)=>{const _0xaeff0f=_0x4a1b63['scene'][_0xfcc2('0x4a')][0x0];_0xaeff0f['position'][_0xfcc2('0x73')](_0x407928);const _0x373b97=_0x4a1b63[_0xfcc2('0x74')][0x0];const _0x19a0bb=new THREE[(_0xfcc2('0x75'))](_0xaeff0f);mixers[_0xfcc2('0x4d')](_0x19a0bb);const _0x5f53fd=_0x19a0bb[_0xfcc2('0x76')](_0x373b97);_0x5f53fd[_0xfcc2('0x77')]();_0x5f53fd['paused']=!![];addMouthOpeningScrubber(_0x19a0bb,_0x5f53fd);scene[_0xfcc2('0x62')](_0xaeff0f);fadeOutLoadingScreen();for(let _0x227849=0x0;_0x227849<gumObjectNames[_0xfcc2('0x37')];_0x227849++){gumObjects[_0x227849]=scene[_0xfcc2('0x78')](gumObjectNames[_0x227849],!![]);}createToothMaterials(_0xaeff0f);initTeethArray();};const _0x11a825=()=>{};const _0x3b1c31=_0x19de7e=>{console[_0xfcc2('0x0')](_0x19de7e);};const _0x360607=new THREE[(_0xfcc2('0x3'))](0x0,-0.1,0x1);_0x47c3e9[_0xfcc2('0x66')]('models/GLTF/Teeth.gltf',_0x2c8755=>_0x48afd2(_0x2c8755,_0x360607),_0x11a825,_0x3b1c31);}function createRenderer(){renderer=new THREE[(_0xfcc2('0x79'))]({'antialias':!![]});renderer[_0xfcc2('0x7a')](container[_0xfcc2('0x7b')],container[_0xfcc2('0x34')]);renderer['setPixelRatio'](window[_0xfcc2('0x7c')]);renderer['gammaFactor']=2.2;renderer[_0xfcc2('0x7d')]=!![];renderer[_0xfcc2('0x7e')]=!![];container[_0xfcc2('0x7f')](renderer[_0xfcc2('0x24')]);}function update(){const _0x1ed6ec=clock[_0xfcc2('0x80')]();for(const _0x83ddc5 of mixers){_0x83ddc5['update'](_0x1ed6ec);}}function render(){if(isCameraMoving){if(selectedObject!=undefined){}}TWEEN[_0xfcc2('0x81')]();controls[_0xfcc2('0x81')]();renderer['render'](scene,camera);composer[_0xfcc2('0x82')]();}var timeOut=null;function onWindowResize(){camera[_0xfcc2('0x83')]=container[_0xfcc2('0x7b')]/container[_0xfcc2('0x34')];camera['updateProjectionMatrix']();renderer[_0xfcc2('0x7a')](container[_0xfcc2('0x7b')],container[_0xfcc2('0x34')]);if(window[_0xfcc2('0x6')]!=iHeight){iHeight=window[_0xfcc2('0x6')];document[_0xfcc2('0x84')][_0xfcc2('0x39')][_0xfcc2('0x85')]=iHeight+'px';}if(timeOut)clearTimeout(timeOut);timeOut=setTimeout(onWindowResize,0x64);}window[_0xfcc2('0x28')](_0xfcc2('0x86'),onWindowResize);function fadeOutDomElement(_0x4e61c1,_0x24b934){var _0x32d317=0x1;var _0x4a5f4c=setInterval(function(){if(_0x32d317<0x1){_0x4e61c1[_0xfcc2('0x48')]=_0xfcc2('0x45');}if(_0x32d317<=0.1){clearInterval(_0x4a5f4c);_0x4e61c1[_0xfcc2('0x39')][_0xfcc2('0x43')]=_0xfcc2('0x45');}_0x4e61c1[_0xfcc2('0x39')][_0xfcc2('0x46')]=_0x32d317;_0x4e61c1[_0xfcc2('0x39')][_0xfcc2('0x87')]=_0xfcc2('0x88')+_0x32d317*0x64+')';_0x32d317-=_0x32d317*0.1;},_0x24b934);}function fadeOutLoadingScreen(_0x12347a,_0x4fef07){setTimeout(function(){fadeOutDomElement(loadingOverlay[_0xfcc2('0x4a')][0x0],0x14);setTimeout(function(){fadeOutDomElement(loadingOverlay,0x14);},0xa0);},0x578);}function fadeInDomElement(_0x5f12b8){var _0x1fc06c=0.1;_0x5f12b8[_0xfcc2('0x39')][_0xfcc2('0x43')]='block';var _0x3346a1=setInterval(function(){if(_0x1fc06c>0.1){_0x5f12b8[_0xfcc2('0x48')]=_0xfcc2('0x89');}if(_0x1fc06c>=0x1){clearInterval(_0x3346a1);}_0x5f12b8[_0xfcc2('0x39')]['opacity']=_0x1fc06c;_0x5f12b8[_0xfcc2('0x39')][_0xfcc2('0x87')]='alpha(opacity='+_0x1fc06c*0x64+')';_0x1fc06c+=_0x1fc06c*0.1;},0xa);}function fadeOutMeshElement(_0x332153){if(_0x332153!=undefined){var _0x32f4f5=0x1;var _0x2e5c3b=setInterval(function(){if(_0x32f4f5<0x1){}if(_0x32f4f5<=0.1){_0x32f4f5=0x0;_0x332153[_0xfcc2('0x8a')]=![];clearInterval(_0x2e5c3b);}_0x332153[_0xfcc2('0x49')]['opacity']=_0x32f4f5;_0x32f4f5-=_0x32f4f5*0.1;},0xa);}}function fadeInMeshElement(_0x4a5166){if(_0x4a5166!=undefined){var _0x347bd4=0.1;_0x4a5166[_0xfcc2('0x8a')]=!![];var _0x29c688=setInterval(function(){if(_0x347bd4>=0x1){clearInterval(_0x29c688);}_0x4a5166[_0xfcc2('0x49')][_0xfcc2('0x46')]=_0x347bd4;_0x347bd4+=_0x347bd4*0.1;},0xa);}}function addUiControls(){let _0x26325e=document[_0xfcc2('0x14')](_0xfcc2('0x8b'));_0x26325e[_0xfcc2('0x8c')]=_0xfcc2('0x8d');_0x26325e[_0xfcc2('0x28')](_0xfcc2('0x36'),resetToStartingPosition);let _0x41844d=document[_0xfcc2('0x14')](_0xfcc2('0x8e'));_0x41844d['title']=_0xfcc2('0x8f');_0x41844d['addEventListener']('click',toggleGumVisibility);let _0x56d1dc=document['getElementById'](_0xfcc2('0x90'));_0x56d1dc[_0xfcc2('0x8c')]=_0xfcc2('0x91');_0x56d1dc[_0xfcc2('0x28')](_0xfcc2('0x36'),toggleSelectionIsolation);for(let _0x421f6e=0x0;_0x421f6e<diseaseCheckmarks['length'];_0x421f6e++){if(diseaseCheckmarks[_0x421f6e][_0xfcc2('0x92')]('value')==![]){diseaseCheckmarks[_0x421f6e][_0xfcc2('0x93')](_0xfcc2('0x4f'),'0');diseaseCheckmarks[_0x421f6e][_0xfcc2('0x4a')][0x0][_0xfcc2('0x39')][_0xfcc2('0x43')]=_0xfcc2('0x45');}else{if(diseaseCheckmarks[_0x421f6e][_0xfcc2('0x4e')](_0xfcc2('0x4f'))=='1'){diseaseCheckmarks[_0x421f6e]['setAttribute'](_0xfcc2('0x4f'),'1');diseaseCheckmarks[_0x421f6e]['className']+='\x20selected';diseaseCheckmarks[_0x421f6e][_0xfcc2('0x4a')][0x0]['style'][_0xfcc2('0x43')]=_0xfcc2('0x94');}}diseaseCheckmarks[_0x421f6e][_0xfcc2('0x95')]=function(){if(this[_0xfcc2('0x4e')](_0xfcc2('0x4f'))=='1'){this[_0xfcc2('0x93')](_0xfcc2('0x4f'),'0');this[_0xfcc2('0x96')]=this[_0xfcc2('0x96')][_0xfcc2('0x97')](_0xfcc2('0x98'),'');this['children'][0x0][_0xfcc2('0x39')][_0xfcc2('0x43')]='none';}else{this[_0xfcc2('0x93')]('value','1');this[_0xfcc2('0x96')]+=_0xfcc2('0x98');this[_0xfcc2('0x4a')][0x0][_0xfcc2('0x39')][_0xfcc2('0x43')]=_0xfcc2('0x94');}};}}function toggleGumVisibility(){if(gumObjects[0x0]!=undefined){if(areGumsVisible){for(let _0x19ec54=0x0;_0x19ec54<gumObjects['length'];_0x19ec54++){gumObjects[_0x19ec54][_0xfcc2('0x49')]=toothMaterials[0x5];fadeOutMeshElement(gumObjects[_0x19ec54]);}areGumsVisible=![];}else{for(let _0x52aeb1=0x0;_0x52aeb1<gumObjects['length'];_0x52aeb1++){gumObjects[_0x52aeb1][_0xfcc2('0x49')]=toothMaterials[0x5];fadeInMeshElement(gumObjects[_0x52aeb1]);}areGumsVisible=!![];}}}function addMouthOpeningScrubber(_0x23c3dd,_0x2ec396){scrubber=new ScrubberView();scrubber[_0xfcc2('0x99')][_0xfcc2('0x8c')]=_0xfcc2('0x9a');let _0x564a52=document[_0xfcc2('0x14')]('controls-container');_0x564a52['insertBefore'](scrubber[_0xfcc2('0x99')],_0x564a52[_0xfcc2('0x4a')][0x2]);scrubber[_0xfcc2('0x4f')](0x0);scrubber[_0xfcc2('0x9b')](0x0)[_0xfcc2('0x9c')](0x3c)[_0xfcc2('0x9d')](0x1)[_0xfcc2('0x9e')](_0xfcc2('0x9f'));scrubber['onScrubStart']=function(_0x127b5e){};scrubber[_0xfcc2('0xa0')]=function(_0x1bd826){let _0x399ecf=_0x1bd826*(animationMaxTime+0x4)/animationLength;_0x2ec396[_0xfcc2('0xa1')]=![];_0x2395bf(_0x23c3dd,_0x399ecf);_0x2ec396[_0xfcc2('0xa1')]=!![];adjustIsolationPositionOnMouthPositionChange();};scrubber[_0xfcc2('0xa2')]=function(_0x311b78){};function _0x2395bf(_0x54e274,_0xc1ef00){_0x54e274[_0xfcc2('0xa3')]=0x0;for(var _0x11b0dd=0x0;_0x11b0dd<_0x54e274[_0xfcc2('0xa4')][_0xfcc2('0x37')];_0x11b0dd++){_0x54e274[_0xfcc2('0xa4')][_0x11b0dd]['time']=0x0;}_0x54e274[_0xfcc2('0x81')](_0xc1ef00);}}function raycast(_0x31c9ca,_0x2e4ae2){if(isTouchDevice){mouse['x']=event[_0xfcc2('0xa5')][0x0]['clientX']/window['innerWidth']*0x2-0x1;mouse['y']=-(event[_0xfcc2('0xa5')][0x0][_0xfcc2('0x27')]/window[_0xfcc2('0x6')])*0x2+0x1;}else{mouse['x']=_0x31c9ca[_0xfcc2('0x26')]/window[_0xfcc2('0x2a')]*0x2-0x1;mouse['y']=-(_0x31c9ca['clientY']/window[_0xfcc2('0x6')])*0x2+0x1;}raycaster[_0xfcc2('0xa6')](mouse,camera);var _0xfb0a2b=raycaster[_0xfcc2('0xa7')](scene['children'],!![]);let _0x1ece74=_0xfb0a2b[0x0];if(_0x1ece74==undefined){composer[_0xfcc2('0xa8')][0x2][_0xfcc2('0xa9')]=![];if(_0x2e4ae2){deselectObject();}}else{if(!isObjectFiltered(_0x1ece74[_0xfcc2('0xaa')],_0x2e4ae2)){composer['passes'][0x2][_0xfcc2('0xa9')]=!![];if(_0x2e4ae2){selectObject(_0x1ece74['object']);setOutlinedObject(_0x1ece74[_0xfcc2('0xaa')],!![]);}else{setOutlinedObject(_0x1ece74['object'],![]);}}else{composer[_0xfcc2('0xa8')][0x2][_0xfcc2('0xa9')]=![];}}}function isObjectFiltered(_0x5a6659,_0x3b3796){let _0x51f057=_0x5a6659[_0xfcc2('0x4b')];for(let _0x53e215=0x0;_0x53e215<filteredObjectNames[_0xfcc2('0x37')];_0x53e215++){if(filteredObjectNames[_0x53e215]==_0x51f057){if(_0x3b3796){selectedObject=null;composer[_0xfcc2('0xa8')][0x3][_0xfcc2('0xa9')]=![];deselectObject();}return!![];}}return![];}function selectObject(_0x28b9a8){selectedObject=_0x28b9a8;composer['passes'][0x3][_0xfcc2('0xa9')]=!![];setOutlinedObject(_0x28b9a8,!![]);loadToothStatus(_0x28b9a8);fadeInToothStatusMenu();}function deselectObject(){selectedObject=null;composer[_0xfcc2('0xa8')][0x3][_0xfcc2('0xa9')]=![];contractToothStatusMenu();fadeOutToothStatusMenu();controls[_0xfcc2('0x81')]();}let defaultCameraSettings;function isolateObject(){if(selectedObject!=undefined){defaultCameraSettings=camera['clone']();let _0x47e4a4=new THREE['Box3']();_0x47e4a4[_0xfcc2('0xab')](selectedObject);const _0x46106f=new THREE[(_0xfcc2('0x3'))]();const _0x34ce5f=new THREE[(_0xfcc2('0x3'))]();_0x47e4a4[_0xfcc2('0xac')](_0x46106f);_0x47e4a4[_0xfcc2('0xad')](_0x34ce5f);let _0xcc41eb=7.5;const _0x4b87b2=Math[_0xfcc2('0x9c')](_0x34ce5f['x'],_0x34ce5f['y'],_0x34ce5f['z']);let _0xc13b71=Math[_0xfcc2('0xae')](_0x4b87b2/0x4*Math[_0xfcc2('0xaf')](camera[_0xfcc2('0xb0')]*0x2));_0xc13b71*=_0xcc41eb;const _0x5a229a=_0x47e4a4[_0xfcc2('0x9b')]['z'];const _0x41a0d1=_0x5a229a<0x0?-_0x5a229a+_0xc13b71:_0xc13b71-_0x5a229a;camera[_0xfcc2('0xb1')]=_0x41a0d1*0x64;let _0x85bb82=selectedObject['position'];let _0x38c2dc=camera[_0xfcc2('0x35')];let _0x4988cd=getLinearCoords(_0x38c2dc,_0x85bb82,0x6);setupTween(controls,controls['target'][_0xfcc2('0x6b')](),controls['target'],_0x46106f,0x514);setupTween(camera,camera['position']['clone'](),camera['position'],_0x4988cd,0x514);setNonSelectedObjectVisibility(![]);}}function addVectors(_0xccec15,_0x35557d){return _0xccec15[_0xfcc2('0x6c')]((_0x1bef71,_0x180fa3)=>_0x1bef71+_0x35557d[_0x180fa3]);}function scalarMultiply(_0x28a908,_0x25b46b){return _0x28a908[_0xfcc2('0x6c')](_0x4bf977=>_0x4bf977*_0x25b46b);}function getLength(_0x17807d){return Math[_0xfcc2('0xb2')](..._0x17807d);}function getLinearCoords(_0x3c2ca2,_0x4557e5,_0x57c9f6){const _0x5da64b=[_0x3c2ca2['x'],_0x3c2ca2['y'],_0x3c2ca2['z']];const _0x5aaf2a=[_0x4557e5['x'],_0x4557e5['y'],_0x4557e5['z']];const _0x84f3b4=addVectors(_0x5da64b,scalarMultiply(_0x5aaf2a,-0x1));const _0x333b30=scalarMultiply(_0x84f3b4,0x1/getLength(_0x84f3b4));const _0x41453d=scalarMultiply(_0x333b30,_0x57c9f6);const _0x292465=addVectors(_0x5aaf2a,_0x41453d);return new THREE[(_0xfcc2('0x3'))](_0x292465[0x0],_0x292465[0x1],_0x292465[0x2]);}function deIsolateObject(){if(selectedObject!=undefined){setNonSelectedObjectVisibility(!![]);camera[_0xfcc2('0xb3')]=!![];let _0x20f36f=selectedObject[_0xfcc2('0x35')];let _0x579bba=camera[_0xfcc2('0x35')];let _0x1c4cb7;if(camera['position']['z']<0x0){_0x1c4cb7=startingCameraPosition;}else{_0x1c4cb7=getLinearCoords(_0x579bba,_0x20f36f,0x13);}setupTween(controls,controls[_0xfcc2('0xb4')]['clone'](),controls['target'],new THREE['Vector3'](0x0,0x0,0x0),0x514);setupTween(camera,camera[_0xfcc2('0x35')][_0xfcc2('0x6b')](),camera[_0xfcc2('0x35')],_0x1c4cb7,0x514);}else{setNonSelectedObjectVisibility(!![]);setupTween(controls,controls[_0xfcc2('0xb4')][_0xfcc2('0x6b')](),controls[_0xfcc2('0xb4')],new THREE[(_0xfcc2('0x3'))](0x0,0x0,0x0),0x514);setupTween(camera,camera[_0xfcc2('0x35')][_0xfcc2('0x6b')](),camera[_0xfcc2('0x35')],startingCameraPosition,0x514);}}function toggleSelectionIsolation(){if(isIsolated){deIsolateObject();isIsolated=![];}else{if(selectedObject!=undefined){isolateObject();isIsolated=!![];}}}function adjustIsolationPositionOnMouthPositionChange(){if(isIsolated&&selectedObject!=undefined){let _0x12eabd=new THREE['Box3']();_0x12eabd[_0xfcc2('0xab')](selectedObject);let _0x52daf8=new THREE[(_0xfcc2('0x3'))]();_0x12eabd[_0xfcc2('0xac')](_0x52daf8);controls[_0xfcc2('0xb4')]=_0x52daf8;}}const fitCameraToObject=function(_0x1e9851,_0x10a2e4,_0xfec6fe,_0x4ebe9a){_0xfec6fe=_0xfec6fe||1.25;const _0x461f59=new THREE[(_0xfcc2('0xb5'))]();_0x461f59[_0xfcc2('0xab')](_0x10a2e4);const _0x83d946=_0x461f59['getCenter']();const _0x558146=_0x461f59[_0xfcc2('0xad')]();const _0x2ac2de=Math[_0xfcc2('0x9c')](_0x558146['x'],_0x558146['y'],_0x558146['z']);const _0x1a02f2=_0x1e9851[_0xfcc2('0xb0')]*(Math['PI']/0xb4);let _0x4ce7d2=Math[_0xfcc2('0xae')](_0x2ac2de/0x4*Math[_0xfcc2('0xaf')](_0x1a02f2*0x2));_0x4ce7d2*=_0xfec6fe;_0x1e9851['position']['z']=_0x4ce7d2;const _0x39bf66=_0x461f59[_0xfcc2('0x9b')]['z'];const _0x35de7a=_0x39bf66<0x0?-_0x39bf66+_0x4ce7d2:_0x4ce7d2-_0x39bf66;_0x1e9851[_0xfcc2('0xb1')]=_0x35de7a*0x3;_0x1e9851[_0xfcc2('0xb6')]();if(_0x4ebe9a){_0x4ebe9a[_0xfcc2('0xb4')]=_0x83d946;_0x4ebe9a[_0xfcc2('0xb7')]=_0x35de7a*0x2;_0x4ebe9a[_0xfcc2('0xb8')]();}else{_0x1e9851[_0xfcc2('0xb9')](_0x83d946);}};function setNonSelectedObjectVisibility(_0x21ee2e){for(let _0x1a52cf=0x0;_0x1a52cf<scene[_0xfcc2('0x4a')][_0xfcc2('0x37')];_0x1a52cf++){if(scene[_0xfcc2('0x4a')][_0x1a52cf][_0xfcc2('0x4b')]=='root'){for(let _0x3e3ccb=0x0;_0x3e3ccb<scene[_0xfcc2('0x4a')][_0x1a52cf][_0xfcc2('0x4a')][_0xfcc2('0x37')];_0x3e3ccb++){let _0x3488ae=scene[_0xfcc2('0x4a')][_0x1a52cf][_0xfcc2('0x4a')][_0x3e3ccb];if(selectedObject!=undefined){if(selectedObject[_0xfcc2('0x4b')]!=_0x3488ae[_0xfcc2('0x4b')]){_0x3488ae[_0xfcc2('0x8a')]=_0x21ee2e;}}else{_0x3488ae[_0xfcc2('0x8a')]=_0x21ee2e;}}}}}function setupTween(_0x20bbe9,_0x49e8d2,_0x17f38,_0x122aff,_0xf579be){new TWEEN[(_0xfcc2('0xba'))](_0x49e8d2)['to'](_0x122aff,_0xf579be)[_0xfcc2('0xbb')](TWEEN['Easing'][_0xfcc2('0xbc')][_0xfcc2('0xbd')])[_0xfcc2('0xbe')](function(){_0x17f38[_0xfcc2('0x73')](_0x49e8d2);})[_0xfcc2('0xbf')]();}function resetToStartingPosition(){setupTween(camera,camera[_0xfcc2('0x35')][_0xfcc2('0x6b')](),camera['position'],startingCameraPosition,0x5dc);setupTween(controls,controls[_0xfcc2('0xb4')][_0xfcc2('0x6b')](),controls[_0xfcc2('0xb4')],new THREE[(_0xfcc2('0x3'))](0x0,0x0,0x0),0x5dc);}function fadeOutToothStatusMenu(){toothStatusMenu[_0xfcc2('0x39')][_0xfcc2('0x46')]='0';toothStatusMenu[_0xfcc2('0x39')][_0xfcc2('0x48')]=_0xfcc2('0x45');}function fadeInToothStatusMenu(){toothStatusMenu[_0xfcc2('0x39')][_0xfcc2('0x46')]='1';toothStatusMenu[_0xfcc2('0x39')][_0xfcc2('0x48')]=_0xfcc2('0x89');if(selectedObjectStatus==_0xfcc2('0x3c')||selectedObjectStatus==_0xfcc2('0x3d')){expandToothStatusMenu();}}function createOutlinePasses(){let _0x295893=new THREE[(_0xfcc2('0xc0'))](new THREE[(_0xfcc2('0xc1'))](window[_0xfcc2('0x2a')],window[_0xfcc2('0x6')]),scene,camera);if(isTouchDevice){_0x295893[_0xfcc2('0xc2')]=Number(0x19);_0x295893[_0xfcc2('0xc3')]=Number(0x3);}else{_0x295893['edgeStrength']=Number(0x14);_0x295893[_0xfcc2('0xc3')]=Number(0x3);}_0x295893[_0xfcc2('0xc4')]=Number(0x0);_0x295893[_0xfcc2('0xc5')]=Number(0x0);_0x295893[_0xfcc2('0xc6')][_0xfcc2('0x61')](new THREE[(_0xfcc2('0x22'))](_0xfcc2('0xc7')));_0x295893[_0xfcc2('0xc8')][_0xfcc2('0x61')](new THREE[(_0xfcc2('0x22'))](_0xfcc2('0xc9')));_0x295893[_0xfcc2('0xca')]=[];composer[_0xfcc2('0x31')](_0x295893);_0x295893=new THREE[(_0xfcc2('0xc0'))](new THREE[(_0xfcc2('0xc1'))](window[_0xfcc2('0x2a')],window[_0xfcc2('0x6')]),scene,camera);if(isTouchDevice){_0x295893['edgeStrength']=Number(0x19);_0x295893[_0xfcc2('0xc3')]=Number(0x3);}else{_0x295893[_0xfcc2('0xc2')]=Number(0x14);_0x295893[_0xfcc2('0xc3')]=Number(0x3);}_0x295893[_0xfcc2('0xc4')]=Number(0x0);_0x295893[_0xfcc2('0xc5')]=Number(0x0);_0x295893[_0xfcc2('0xc6')][_0xfcc2('0x61')](new THREE['Color'](_0xfcc2('0xcb')));_0x295893[_0xfcc2('0xc8')][_0xfcc2('0x61')](new THREE[(_0xfcc2('0x22'))](_0xfcc2('0xcc')));_0x295893[_0xfcc2('0xca')]=[];composer[_0xfcc2('0x31')](_0x295893);}function setOutlinedObject(_0x394f89,_0x174d3b){if(_0x174d3b){let _0x4e5937=composer[_0xfcc2('0xa8')][0x3];if(_0x4e5937==undefined||!_0x4e5937[_0xfcc2('0xca')][_0xfcc2('0x4c')](_0x394f89)){_0x4e5937['enabled']=!![];_0x4e5937[_0xfcc2('0xca')]=[_0x394f89];}}else{let _0x4f92dd=composer['passes'][0x2];if((_0x4f92dd==undefined||!_0x4f92dd[_0xfcc2('0xca')][_0xfcc2('0x4c')](_0x394f89))&&!_0x4f92dd['selectedObjects'][_0xfcc2('0x4c')](selectedObject)){_0x4f92dd[_0xfcc2('0xa9')]=!![];_0x4f92dd[_0xfcc2('0xca')]=[_0x394f89];}}}function toScreenPosition(_0x1694b6,_0x4e45af){if(_0x1694b6!=null){var _0x2b03af=new THREE[(_0xfcc2('0x3'))]();var _0x1c61d5=window[_0xfcc2('0x2a')]/0x2;var _0x190c66=window[_0xfcc2('0x6')]/0x2;_0x1694b6[_0xfcc2('0xcd')]();_0x2b03af['setFromMatrixPosition'](_0x1694b6[_0xfcc2('0xce')]);_0x2b03af[_0xfcc2('0xcf')](_0x4e45af);_0x2b03af['x']=_0x2b03af['x']*_0x1c61d5+_0x1c61d5;_0x2b03af['y']=-(_0x2b03af['y']*_0x190c66)+_0x190c66;return{'x':_0x2b03af['x'],'y':_0x2b03af['y']};}return{'x':0x0,'y':0x0};};init();