import { GLTFLoader } from './examples/jsm/loaders/GLTFLoader.js';

// Camera variables
let camera;
var fov=75, camera_z=0.75, camera_y=2.5, camera_rot_x=-50;
// Game variables
var gold=0, stam=20, hp=10, level=0, food=0, score=0, mgold=0;
var A=[[0,0,1],
		[1,9,0],
		[1,1,1]];
var FloorImg=[[1,1,1],
		[1,1,1],
		[1,1,1]];
var r, direction=180;
var obj_array=[];
var over=false;
var player_num;//Player model position in obj_array
//let scene;

main();

function main() {
	const canvas = document.querySelector('#c');
	/*var gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}*/
	const renderer = new THREE.WebGLRenderer({canvas}/*, {antialias: true}*/);
	
	// Camera
	//const fov = 75;
	const aspect = 2;  // the canvas default
	const near = 0.1;
	const far = 5;
	//const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	//camera.position.z = 0.75; //0.75
	//camera.position.y = 2.5; //2.5
	//camera.rotation.x = -50 * Math.PI / 180; //-50
	camera.position.z = camera_z;
	camera.position.y = camera_y;
	camera.rotation.x = camera_rot_x * Math.PI / 180;
	
	const scene = new THREE.Scene();
	// texture loader
	const texture_loader = new THREE.TextureLoader();
	// model loader
	const model_loader = new GLTFLoader();
	// Light
	/*{
		const light = new THREE.DirectionalLight(0xFFFFFF, 2); // color, intensity
		light.position.set(1, 2, 3);
		scene.add(light);
	}*/
	
	// Geometry && textures && models
	//const geometry_Floor = new THREE.BoxGeometry(1, 1, 1);
	const geometry_Wall = new THREE.BoxGeometry(1, 0.5, 1);
	const geometry_FloorPlane = new THREE.PlaneGeometry(1, 1);
	const texture_color = new THREE.MeshPhongMaterial({/*map: texture_loader.load('./textures/floora1.png')*/color: 0xff0000});
	const texture_Floor1 = new THREE.MeshPhongMaterial({map: texture_loader.load('./textures/floora1.png')});
	const texture_Floor2 = new THREE.MeshPhongMaterial({map: texture_loader.load('./textures/floora2.png')});
	const texture_Floor3 = new THREE.MeshPhongMaterial({map: texture_loader.load('./textures/floora3.png')});
	const texture_Wall = new THREE.MeshPhongMaterial({map: texture_loader.load('./textures/walla1.png')});
	//const shopData = await model_loader.loadAsync('./models/shop.glb');
	//const goldData = model_loader.load('./models/gold.glb');
	
	// TEXT
	// look up the elements we want to affect
	var goldElement = document.querySelector("#txt_gold");
	var stamElement = document.querySelector("#txt_stam");
	var hpElement = document.querySelector("#txt_hp");
	var foodElement = document.querySelector("#txt_food");
	var textElement = document.querySelector("#txt_info");
	var consoleElement = document.querySelector("#txt_console");
	
	var gameoverScoreElement = document.querySelector("#gameover_score");
	var gameoverGoldElement = document.querySelector("#gameover_gold");
	var gameoverLevelElement = document.querySelector("#gameover_levels");
	// Create text nodes to save some time for the browser.
	var goldNode = document.createTextNode("");
	var stamNode = document.createTextNode("");
	var hpNode = document.createTextNode("");
	var foodNode = document.createTextNode("");
	var textNode = document.createTextNode("");
	var consoleNode = document.createTextNode("");
	
	var gameoverScoreNode = document.createTextNode("");
	var gameoverGoldNode = document.createTextNode("");
	var gameoverLevelNode = document.createTextNode("");
	// Add those text nodes where they need to go
	goldElement.appendChild(goldNode);
	stamElement.appendChild(stamNode);
	hpElement.appendChild(hpNode);
	foodElement.appendChild(foodNode);
	textElement.appendChild(textNode);
	consoleElement.appendChild(consoleNode);
	
	gameoverScoreElement.appendChild(gameoverScoreNode);
	gameoverGoldElement.appendChild(gameoverGoldNode);
	gameoverLevelElement.appendChild(gameoverLevelNode);
	
	
	
	initAllModels();
	//GenerateMap();
	animate();
	
	//functions
// Start Game
document.getElementById('new_game').addEventListener('click', StartNewGame);
document.getElementById('new_game2').addEventListener('click', StartNewGame);
function StartNewGame(){
	gold=0; stam=20; hp=10; level=0; food=0; score=0; mgold=0;
	direction=180; over=false;
	//fov=75; //camera_z=0.75; camera_y=2.5; camera_rot_x=-50;
	camera.fov=75;
	camera.updateProjectionMatrix();
	obj_array[player_num].rotation.z=0;
	
	document.getElementById("UI_movement").style.visibility = "visible";
	document.getElementById("UI_stats").style.visibility = "visible";
	document.getElementById("main_menu_text").style.visibility = "hidden";
	document.getElementById("main_menu").style.visibility = "hidden";
	document.getElementById("gameover_screen").style.visibility = "hidden";
	
	GenerateMap();
}
// Generate Map and Update
function GenerateMap(){
	for (var i=0;i<=2;i++){
		A[0][i]=Math.floor(Math.random()*2);
	}
	A[1][0]=Math.floor(Math.random()*2);
	A[1][2]=Math.floor(Math.random()*2);
	for (var i=0;i<=2;i++){
		A[2][i]=Math.floor(Math.random()*2);
	}
	if (A[0][1]==1&&A[1][0]==1&&A[1][2]==1&&A[2][1]==1) A[1][2]=0;
	A[1][1]=9;
	
	Update();
}

function animate(){
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

function Update(){
	//var player_num=obj_array.length-14;
	var start_player_num=player_num+2;// +player +shop[1][1]
	obj_array[player_num].visible=true;
	// Output
	for (var i=0;i<obj_array.length-14;i++){
		obj_array[i].visible=false;
	}
	
	var startnum=0;
	for (var i=0;i<=2;i++){
		for (var j=0;j<=2;j++){
			//Floor Textures
			switch(FloorImg[i][j]){
				case 2:
					obj_array[start_player_num].material=texture_Floor2;
					break;
				case 3:
					obj_array[start_player_num].material=texture_Floor3;
					break;
				default:
					obj_array[start_player_num].material=texture_Floor1;
					break;
			}
			// Walls
			if (A[i][j]==1){
				obj_array[startnum].visible=true;
			}
			// Gold
			else if (A[i][j]==2){
				obj_array[startnum+2].visible=true;
			}
			// Shop
			else if (A[i][j]==3){
				obj_array[startnum+1].visible=true;
			}
			// Food
			else if (A[i][j]==4){
				obj_array[startnum+3].visible=true;
			}
			// Ladder
			else if (A[i][j]==5){
				obj_array[startnum+4].visible=true;
			}
			
			start_player_num++;
			startnum+=5;
			if (i==j&&i==1) startnum-=5;
		}
		start_player_num++;
	}
	//Front Floor Textures
	start_player_num=player_num+1;
	for (var i=0;i<=2;i++){
		start_player_num+=4;
		if (FloorImg[2][i]==2) obj_array[start_player_num].material=texture_Floor2;
		if (FloorImg[2][i]==3) obj_array[start_player_num].material=texture_Floor3;
		else obj_array[start_player_num].material=texture_Floor1;
	}
	
	//Player
	if (A[1][1]==9){
		obj_array[player_num].rotation.y = direction * Math.PI / 180;
		obj_array[player_num].position.set(0, 1.115, -1);
		
		obj_array[player_num+1].visible=false;
	} else if (A[1][1]==11){
		obj_array[player_num].position.set(0.15, 1.115, -0.8);
		obj_array[player_num].rotation.y = 135 * Math.PI / 180;
		
		obj_array[player_num+1].visible=true;
	}
	//Floor
	for (var i=0;i<12;i++)
		obj_array[obj_array.length-i-1].visible=true;
	
	
	//UpdateUI
	if (food>0) {
		document.getElementById("eat_btn").style.visibility = "visible";
	}
	if (A[1][1]!=11) document.getElementById("use_btn").style.visibility = "hidden";
	goldNode.nodeValue = gold/*angle.toFixed(0)*/;
	stamNode.nodeValue = stam;
	hpNode.nodeValue = hp;
	foodNode.nodeValue = food;
	//consoleNode.nodeValue = A[0][0]+":"+A[0][1]+":"+A[0][2]+"\n"+A[1][0]+":"+A[1][1]+":"+A[1][2]+"\n"+A[2][0]+":"+A[2][1]+":"+A[2][2];
	consoleNode.nodeValue = FloorImg[0][0]+":"+FloorImg[0][1]+":"+FloorImg[0][2]+"\n"+FloorImg[1][0]+":"+FloorImg[1][1]+":"+FloorImg[1][2]+"\n"+FloorImg[2][0]+":"+FloorImg[2][1]+":"+FloorImg[2][2];
	//Check for gameover
	if (hp<=0) GameOver();
}
// Preload all models
async function initAllModels(){
	let modelData, obj;
	// Light
	{
		const light = new THREE.DirectionalLight(0xFFFFFF, 2); // color, intensity
		light.position.set(1, 2, 3);
		scene.add(light);
	}
	
	for (var i=0;i<3;i++){
		for (var j=0;j<3;j++){
			if (i==j&&i==1){
				
			} else{
				//Wall
				obj = new THREE.Mesh(geometry_Wall, texture_Wall);
				obj.position.x=j-1;
				obj.position.z=i-2;
				obj.position.y=0.75;
				obj_array.push(obj);
				//Shop
				modelData = await model_loader.loadAsync('./models/shop.glb');
				obj = modelData.scene.children[0];
				obj.scale.set(0.175, 0.175, 0.175);
				if (j==0||(i==2&&j==1)){
					obj.position.set(j-1.3, 0.9, i-2);
					obj.rotation.y = -45 * Math.PI / 180;
				}
				else {
					obj.position.set(j-1, 0.9, i-2.25);
					obj.rotation.y = -135 * Math.PI / 180;
				}
				obj_array.push(obj);
				//Gold
				modelData = await model_loader.loadAsync('./models/gold.glb');
				obj = modelData.scene.children[0];
				obj.position.set(j-1, 0.55, i-2);
				obj.scale.set(0.1, 0.1, 0.1);
				obj.rotation.y = -25 * Math.PI / 180;
				obj_array.push(obj);
				//Food
				modelData = await model_loader.loadAsync('./models/apple.glb');
				obj = modelData.scene.children[0];
				obj.position.set(j-1, 0.75, i-2);
				obj.scale.set(0.13, 0.13, 0.13);
				obj.rotation.y = -30 * Math.PI / 180;
				obj_array.push(obj);
				//Ladder
				modelData = await model_loader.loadAsync('./models/ladder.glb');
				obj = modelData.scene.children[0];
				//obj_Ladder.position.set(j-1, 0.6, i-2.25);
				obj.scale.set(0.12, 0.12, 0.12);
				//obj_Ladder.rotation.y = -90 * Math.PI / 180;
				if (i==0&&j==0){
					obj.position.set(-1.15, 0.6, -2.15);
					obj.rotation.y = -45 * Math.PI / 180;
				} else if (i==0&&j==1){
					obj.position.set(0, 0.6, -2.15);
					obj.rotation.y = -90 * Math.PI / 180;
				} else if (i==0&&j==2){
					obj.position.set(1.15, 0.6, -2.15);
					obj.rotation.y = -135 * Math.PI / 180;
				} else if (i==1&&j==0){
					obj.position.set(-1.25, 0.6, -1);
				} else if (i==1&&j==2){
					obj.position.set(1.25, 0.6, -1);
					obj.rotation.y = 180 * Math.PI / 180;
				} else if (i==2&&j==0){
					obj.position.set(-1.15, 0.6, 0.15);
					obj.rotation.y = 45 * Math.PI / 180;
				} else if (i==2&&j==1){
					obj.position.set(0, 0.6, 0.25);
					obj.rotation.y = 90 * Math.PI / 180;
				} else if (i==2&&j==2){
					obj.position.set(1.15, 0.6, 0.15);
					obj.rotation.y = 135 * Math.PI / 180;
				}
				obj_array.push(obj);
			}
		}
	}
	// Player
	modelData = await model_loader.loadAsync('./models/player.glb');
	obj = modelData.scene.children[0];
	//obj_Player.position.set(0, 0.97, -1);
	obj.position.set(0, 1.115, -1);
	obj.scale.set(0.04, 0.04, 0.04);
	//obj_Player.scale.set(0.145, 0.145, 0.145);
	obj.rotation.y = direction * Math.PI / 180;
	obj_array.push(obj);
	//Shop for 11
	modelData = await model_loader.loadAsync('./models/shop.glb');
	obj = modelData.scene.children[0];
	obj.position.set(-0.3, 0.97, -0.95);
	obj.scale.set(0.145, 0.145, 0.145);
	obj.rotation.y = -45 * Math.PI / 180;
	obj_array.push(obj);
	//Floor
	for (var i=0;i<3;i++){
		for (var j=0;j<3;j++){
			obj = new THREE.Mesh(geometry_FloorPlane, texture_Floor1);
			obj.position.x=j-1;
			obj.position.z=i-2;
			obj.position.y=0.5;
			obj.rotation.x = -90 * Math.PI / 180;
			obj_array.push(obj);
		}
		obj = new THREE.Mesh(geometry_FloorPlane, texture_Floor1);
		obj.position.x=i-1;
		obj.position.z=0.5;
		obj.rotation.z = 90 * Math.PI / 180;
		obj_array.push(obj);
	}
	
	// Output
	for (var i=0;i<obj_array.length;i++){
		obj_array[i].visible=false;
		scene.add(obj_array[i]);
	}
	//obj_array[5].visible=true;
	player_num=obj_array.length-14;
	document.getElementById("main_menu").style.visibility = "visible";
	//GenerateMap();
}
// New random fields
function RanArrayRight(){
	for (var i=0;i<=2;i++){
		r=Math.floor(Math.random()*46);
		if (r>=0&&r<=15) A[i][2]=1;
		else if (r>=16&&r<=19) A[i][2]=2;
		else if (r>=20&&r<=21) A[i][2]=3;
		else if (r>=22&&r<=24) A[i][2]=4;
		else if (r==25) A[i][2]=5;
		else A[i][2]=0;
		
		r=Math.floor(Math.random()*3);
		if (r==0) FloorImg[i][2]=2;
		else if (r==1) FloorImg[i][2]=3;
		else FloorImg[i][2]=1;
	}
}
function RanArrayLeft(){
	for (var i=0;i<=2;i++){
		r=Math.floor(Math.random()*46);
		if (r>=0&&r<=15) A[i][0]=1;
		else if (r>=16&&r<=19) A[i][0]=2;
		else if (r>=20&&r<=21) A[i][0]=3;
		else if (r>=22&&r<=24) A[i][0]=4;
		else if (r==25) A[i][0]=5;
		else A[i][0]=0;
		
		r=Math.floor(Math.random()*3);
		if (r==0) FloorImg[i][0]=2;
		else if (r==1) FloorImg[i][0]=3;
		else FloorImg[i][0]=1;
	}
}
function RanArrayUp(){
	for (var i=0;i<=2;i++){
		r=Math.floor(Math.random()*46);
		if (r>=0&&r<=15) A[0][i]=1;
		else if (r>=16&&r<=19) A[0][i]=2;
		else if (r>=20&&r<=21) A[0][i]=3;
		else if (r>=22&&r<=24) A[0][i]=4;
		else if (r==25) A[0][i]=5;
		else A[0][i]=0;
		
		r=Math.floor(Math.random()*3);
		if (r==0) FloorImg[0][i]=2;
		else if (r==1) FloorImg[0][i]=3;
		else FloorImg[0][i]=1;
	}
}
function RanArrayDown(){
	for (var i=0;i<=2;i++){
		r=Math.floor(Math.random()*46);
		if (r>=0&&r<=15) A[2][i]=1;
		else if (r>=16&&r<=19) A[2][i]=2;
		else if (r>=20&&r<=21) A[2][i]=3;
		else if (r>=22&&r<=24) A[2][i]=4;
		else if (r==25) A[2][i]=5;
		else A[2][i]=0;
		
		r=Math.floor(Math.random()*3);
		if (r==0) FloorImg[2][i]=2;
		else if (r==1) FloorImg[2][i]=3;
		else FloorImg[2][i]=1;
	}
}

// Movement
document.getElementById('right').addEventListener('click', MoveRight);	
function MoveRight(){
	if (A[1][2]!=1&&A[1][2]!=5){
		A[0][0]=A[0][1]; A[2][0]=A[2][1];
		A[0][1]=A[0][2]; A[2][1]=A[2][2];
		if (A[1][1]==9) A[1][0]=0;
		else if (A[1][1]==11) A[1][0]=3; A[1][1]=9;
		FloorImg[0][0]=FloorImg[0][1]; FloorImg[2][0]=FloorImg[2][1];
		FloorImg[1][0]=FloorImg[1][1]; FloorImg[1][1]=FloorImg[1][2];
		FloorImg[0][1]=FloorImg[0][2]; FloorImg[2][1]=FloorImg[2][2];
		
		switch(A[1][2]){
			case 2: //gold
				textNode.nodeValue = "You picked up some gold.";
				gold++; score++; mgold++;
				break;
			case 3: //shop
				textNode.nodeValue = "You are near shop.";
				A[1][1]=11;
				break;
			case 4: //food
				textNode.nodeValue = "You picked up food.";
				food++;
				break;
			default: //nothing
				textNode.nodeValue = "";
				break;
		}
		RanArrayRight();
		score++;
		// shop button
		if (A[1][1]==11) {
			document.getElementById("use_btn").style.visibility = "visible";
		}
		if (stam<=0) hp--; else stam--;
		//if (hp<=0) GameOver();
		
	} else if (A[1][2]==5){//ladder
		level++; score++;
		GenerateMap();
	} else textNode.nodeValue = "Wall is blocking your way.";
	//direction=-90;
	direction=0;
	Update();
}
document.getElementById('left').addEventListener('click', MoveLeft);	
function MoveLeft(){
	if (A[1][0]!=1&&A[1][0]!=5){
		A[0][2]=A[0][1]; A[2][2]=A[2][1];
		A[0][1]=A[0][0]; A[2][1]=A[2][0];
		if (A[1][1]==9) A[1][2]=0;
		else if (A[1][1]==11) A[1][2]=3; A[1][1]=9;
		FloorImg[0][2]=FloorImg[0][1]; FloorImg[2][2]=FloorImg[2][1];
		FloorImg[1][2]=FloorImg[1][1]; FloorImg[1][1]=FloorImg[1][0];//
		FloorImg[0][1]=FloorImg[0][0]; FloorImg[2][1]=FloorImg[2][0];
		
		switch(A[1][0]){
			case 2: //gold
				textNode.nodeValue = "You picked up some gold.";
				gold++; score++; mgold++;
				break;
			case 3: //shop
				textNode.nodeValue = "You are near shop.";
				A[1][1]=11;
				break;
			case 4: //food
				textNode.nodeValue = "You picked up food.";
				food++;
				break;
			default: //nothing
				textNode.nodeValue = "";
				break;
		}
		RanArrayLeft();
		score++;
		// shop button
		if (A[1][1]==11) {
			document.getElementById("use_btn").style.visibility = "visible";
		}
		if (stam<=0) hp--; else stam--;
		//if (hp<=0) GameOver();
		
	} else if (A[1][0]==5){//ladder
		level++; score++;
		GenerateMap();
	} else textNode.nodeValue = "Wall is blocking your way.";
	//direction=90;
	direction=180;
	Update();
}
document.getElementById('up').addEventListener('click', MoveUp);	
function MoveUp(){
	if (A[0][1]!=1&&A[0][1]!=5){
		A[2][0]=A[1][0]; A[2][2]=A[1][2];
		A[1][0]=A[0][0]; A[1][2]=A[0][2];
		if (A[1][1]==9) A[2][1]=0;
		else if (A[1][1]==11) A[2][1]=3; A[1][1]=9;
		FloorImg[2][0]=FloorImg[1][0]; FloorImg[2][2]=FloorImg[1][2];
		FloorImg[2][1]=FloorImg[1][1]; FloorImg[1][1]=FloorImg[0][1];//
		FloorImg[1][0]=FloorImg[0][0]; FloorImg[1][2]=FloorImg[0][2];
		
		switch(A[0][1]){
			case 2: //gold
				textNode.nodeValue = "You picked up some gold.";
				gold++; score++; mgold++;
				break;
			case 3: //shop
				textNode.nodeValue = "You are near shop.";
				A[1][1]=11;
				break;
			case 4: //food
				textNode.nodeValue = "You picked up food.";
				food++;
				break;
			default: //nothing
				textNode.nodeValue = "";
				break;
		}
		RanArrayUp();
		score++;
		// shop button
		if (A[1][1]==11) {
			document.getElementById("use_btn").style.visibility = "visible";
		}
		if (stam<=0) hp--; else stam--;
		//if (hp<=0) GameOver();
		
	} else if (A[0][1]==5){//ladder
		level++; score++;
		GenerateMap();
	} else textNode.nodeValue = "Wall is blocking your way.";
	//direction=0;
	direction=90;
	Update();
}
document.getElementById('down').addEventListener('click', MoveDown);	
function MoveDown(){
	if (A[2][1]!=1&&A[2][1]!=5){
		A[0][0]=A[1][0]; A[0][2]=A[1][2];
		A[1][0]=A[2][0]; A[1][2]=A[2][2];
		if (A[1][1]==9) A[0][1]=0;
		else if (A[1][1]==11) A[0][1]=3; A[1][1]=9;
		FloorImg[0][0]=FloorImg[1][0]; FloorImg[0][2]=FloorImg[1][2];
		FloorImg[0][1]=FloorImg[1][1]; FloorImg[1][1]=FloorImg[2][1];//
		FloorImg[1][0]=FloorImg[2][0]; FloorImg[1][2]=FloorImg[2][2];
		
		switch(A[2][1]){
			case 2: //gold
				textNode.nodeValue = "You picked up some gold.";
				gold++; score++; mgold++;
				break;
			case 3: //shop
				textNode.nodeValue = "You are near shop.";
				A[1][1]=11;
				break;
			case 4: //food
				textNode.nodeValue = "You picked up food.";
				food++;
				break;
			default: //nothing
				textNode.nodeValue = "";
				break;
		}
		RanArrayDown();
		score++;
		// shop button
		if (A[1][1]==11) {
			document.getElementById("use_btn").style.visibility = "visible";
		}
		if (stam<=0) hp--; else stam--;
		//if (hp<=0) GameOver();
		
	} else if (A[2][1]==5){//ladder
		level++; score++;
		GenerateMap();
	} else textNode.nodeValue = "Wall is blocking your way.";
	//direction=180;
	direction=-90;
	Update();
}
// Keyboard movement
document.addEventListener("keydown", onKeyDown, false);
function onKeyDown(event) {
	if (over==false){
		var keyCode = event.which;
		if (keyCode==87||keyCode==38) {// Up
			MoveUp();
		} else if (keyCode==83||keyCode==40) {// Down
			MoveDown();
		} else if (keyCode==65||keyCode==37) {// Left
			MoveLeft();
		} else if (keyCode==68||keyCode==39) {// Right
			MoveRight();
		} else if (keyCode==69&&food>0) {// Eat
			EatFood();
		} else if (keyCode==81&&A[1][1]==11) {// Use
			UseButton();
		}
		//updateUI();
		renderer.render(scene, camera);
	}
};

// Food button
document.getElementById('eat_btn').addEventListener('click', EatFood);	
function EatFood(){
	food--; stam+=3;
	if (food==0) document.getElementById("eat_btn").style.visibility = "hidden";
	stamNode.nodeValue = stam;
	foodNode.nodeValue = food;
}
// Shop button
document.getElementById('use_btn').addEventListener('click', UseButton);	
function UseButton(){
	if (A[1][1]==11){
		if (gold>=5){
			gold-=5; stam+=7; A[1][1]=9;
			stamNode.nodeValue = stam;
			goldNode.nodeValue = gold;
			textNode.nodeValue = "You bought food for 5 gold.";
			document.getElementById("use_btn").style.visibility = "hidden";
			Update();
		}
		else textNode.nodeValue = "You have not enough gold.";
	}
}
// GameOver
function GameOver(){
	over=true;
	r=Math.floor(Math.random()*2);
	if (r==0&&A[1][1]!=11) obj_array[player_num].rotation.z = 90 * Math.PI / 180;
	else obj_array[player_num].rotation.z = -90 * Math.PI / 180;
	obj_array[player_num].position.set(0, 0.55, -1);
	//Change score text
	gameoverScoreNode.nodeValue = score;
	gameoverGoldNode.nodeValue = mgold;
	gameoverLevelNode.nodeValue = level;
	//Hide buttons, divs
	document.getElementById("gameover_screen").style.visibility = "visible";
	document.getElementById("UI_movement").style.visibility = "hidden";
	document.getElementById("UI_stats").style.visibility = "hidden";
	document.getElementById("use_btn").style.visibility = "hidden";
	document.getElementById("eat_btn").style.visibility = "hidden";
	
	camera.fov=30;
	camera.updateProjectionMatrix();
}

}