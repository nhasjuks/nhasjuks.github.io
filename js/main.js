import { GLTFLoader } from './examples/jsm/loaders/GLTFLoader.js';

// Game variables
var gold=0, stam=20, hp=10, level=0, food=0, score=0, mgold=0;
var A=[[0,0,1],
		[1,9,0],
		[1,1,1]];
var FloorImg=[[1,1,1],
		[1,1,1],
		[1,1,1]];
var r, direction=180;
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
	const fov = 75;
	const aspect = 2;  // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 0.75; //0.75
	camera.position.y = 2.5; //2.5
	camera.rotation.x = -50 * Math.PI / 180; //-50
	
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
	const geometry_Floor = new THREE.BoxGeometry(1, 1, 1);
	const geometry_Wall = new THREE.BoxGeometry(1, 0.5, 1);
	const texture_color = new THREE.MeshPhongMaterial({/*map: texture_loader.load('./textures/floora1.png')*/color: 0xff0000});
	const texture_Floor = new THREE.MeshPhongMaterial({map: texture_loader.load('./textures/floora1.png')});
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
	// Create text nodes to save some time for the browser.
	var goldNode = document.createTextNode("");
	var stamNode = document.createTextNode("");
	var hpNode = document.createTextNode("");
	var foodNode = document.createTextNode("");
	var textNode = document.createTextNode("");
	var consoleNode = document.createTextNode("");
	// Add those text nodes where they need to go
	goldElement.appendChild(goldNode);
	stamElement.appendChild(stamNode);
	hpElement.appendChild(hpNode);
	foodElement.appendChild(foodNode);
	textElement.appendChild(textNode);
	consoleElement.appendChild(consoleNode);
	
	GenerateMap();
	animate();
	
	//functions
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
	scene.remove.apply(scene, scene.children); // delete all
	// Light
	{
		const light = new THREE.DirectionalLight(0xFFFFFF, 2); // color, intensity
		light.position.set(1, 2, 3);
		scene.add(light);
	}
		
	//Objects
	//const shopData = await model_loader.loadAsync('./models/shop.glb');
	//const goldData = await model_loader.loadAsync('./models/gold.glb');
	
	for (var i=0;i<=2;i++){
		for (var j=0;j<=2;j++){
			//Floor
			const obj_Floor = new THREE.Mesh(geometry_Floor, texture_Floor); //.FloorImg[i][j].
			obj_Floor.position.x=j-1;
			obj_Floor.position.z=i-2;
			scene.add(obj_Floor);
			//console.log("Floor created: x="+(j-1)+" ; z="+(i-2));
				
			//Walls
			if (A[i][j]==1) {
				const obj_Wall = new THREE.Mesh(geometry_Wall, texture_Wall);
				obj_Wall.position.x=j-1;
				obj_Wall.position.z=i-2;
				obj_Wall.position.y=0.75;
				scene.add(obj_Wall);
			}
			// Gold
			else if (A[i][j]==2){
				/*const obj_Gold = goldData.scene.children[0];
				obj_Gold.position.set(j-1, 0.55, i-2);
				obj_Gold.scale.set(0.1, 0.1, 0.1);
				obj_Gold.rotation.y = -25 * Math.PI / 180;
				scene.add(obj_Gold);*/
				/*model_loader.load('./models/gold.glb', function(result) {
					const obj_Gold = result.scene.children[0];
					obj_Gold.position.set(j-1, 0.55, i-2);
					obj_Gold.scale.set(0.1, 0.1, 0.1);
					obj_Gold.rotation.y = -25 * Math.PI / 180;
					scene.add(obj_Gold);
				});*/
				loadModel(i,j,2);
			}
			// Shop
			else if (A[i][j]==3){
				loadModel(i,j,3);
			}
			else if (A[i][j]==4) loadModel(i,j,4);
			else if (A[i][j]==5) loadModel(i,j,5);
			else if (A[i][j]==9) loadModel(1,1,9);
			else if (A[i][j]==11) loadModel(1,1,11);
		}
	}
	//UpdateUI
	if (food>0) {
		document.getElementById("eat_btn").style.visibility = "visible";
	}
	if (A[1][1]!=11) document.getElementById("use_btn").style.visibility = "hidden";
	goldNode.nodeValue = gold/*angle.toFixed(0)*/;
	stamNode.nodeValue = stam;
	hpNode.nodeValue = hp;
	foodNode.nodeValue = food;
	consoleNode.nodeValue = A[0][0]+":"+A[0][1]+":"+A[0][2]+"\n"+A[1][0]+":"+A[1][1]+":"+A[1][2]+"\n"+A[2][0]+":"+A[2][1]+":"+A[2][2];
}
// Load model
async function loadModel(i,j,type) {
	let modelData;
	if (type==2){
		modelData = await model_loader.loadAsync('./models/gold.glb');
		const obj_Gold = modelData.scene.children[0];
		obj_Gold.position.set(j-1, 0.55, i-2);
		obj_Gold.scale.set(0.1, 0.1, 0.1);
		obj_Gold.rotation.y = -25 * Math.PI / 180;
		scene.add(obj_Gold);
	}
	else if (type==3){
		modelData = await model_loader.loadAsync('./models/shop.glb');
		const obj_Shop = modelData.scene.children[0];
		//obj_Shop.position.set(j-1.3, 0.9, i-2);
		obj_Shop.scale.set(0.175, 0.175, 0.175);
		if (j==0||(i==2&&j==1)){
			obj_Shop.position.set(j-1.3, 0.9, i-2);
			obj_Shop.rotation.y = -45 * Math.PI / 180;
		}
		else {
			obj_Shop.position.set(j-1, 0.9, i-2.25);
			obj_Shop.rotation.y = -135 * Math.PI / 180;
		}
		scene.add(obj_Shop);
	}
	else if (type==4){
		modelData = await model_loader.loadAsync('./models/apple.glb');
		const obj_Apple = modelData.scene.children[0];
		obj_Apple.position.set(j-1, 0.75, i-2);
		obj_Apple.scale.set(0.13, 0.13, 0.13);
		obj_Apple.rotation.y = -30 * Math.PI / 180;
		scene.add(obj_Apple);
	}
	else if (type==5){
		modelData = await model_loader.loadAsync('./models/ladder.glb');
		const obj_Ladder = modelData.scene.children[0];
		//obj_Ladder.position.set(j-1, 0.6, i-2.25);
		obj_Ladder.scale.set(0.12, 0.12, 0.12);
		//obj_Ladder.rotation.y = -90 * Math.PI / 180;
		if (i==0&&j==0){
			obj_Ladder.position.set(-1.15, 0.6, -2.15);
			obj_Ladder.rotation.y = -45 * Math.PI / 180;
		} else if (i==0&&j==1){
			obj_Ladder.position.set(0, 0.6, -2.15);
			obj_Ladder.rotation.y = -90 * Math.PI / 180;
		} else if (i==0&&j==2){
			obj_Ladder.position.set(1.15, 0.6, -2.15);
			obj_Ladder.rotation.y = -135 * Math.PI / 180;
		} else if (i==1&&j==0){
			obj_Ladder.position.set(-1.25, 0.6, -1);
		} else if (i==1&&j==2){
			obj_Ladder.position.set(1.25, 0.6, -1);
			obj_Ladder.rotation.y = 180 * Math.PI / 180;
		} else if (i==2&&j==0){
			obj_Ladder.position.set(-1.15, 0.6, 0.15);
			obj_Ladder.rotation.y = 45 * Math.PI / 180;
		} else if (i==2&&j==1){
			obj_Ladder.position.set(0, 0.6, 0.25);
			obj_Ladder.rotation.y = 90 * Math.PI / 180;
		} else if (i==2&&j==2){
			obj_Ladder.position.set(1.15, 0.6, 0.15);
			obj_Ladder.rotation.y = 135 * Math.PI / 180;
		}
		scene.add(obj_Ladder);
	}
	else if (type==9){
		modelData = await model_loader.loadAsync('./models/player.glb');
		const obj_Player = modelData.scene.children[0];
		//obj_Player.position.set(0, 0.97, -1);
		obj_Player.position.set(0, 1.115, -1);
		obj_Player.scale.set(0.04, 0.04, 0.04);
		//obj_Player.scale.set(0.145, 0.145, 0.145);
		obj_Player.rotation.y = direction * Math.PI / 180;
		scene.add(obj_Player);
	} else if (type==11){
		modelData = await model_loader.loadAsync('./models/player.glb');
		const obj_Player = modelData.scene.children[0];
		//obj_Player.position.set(0.25, 0.97, -0.75);
		obj_Player.position.set(0.15, 1.115, -0.95);
		obj_Player.scale.set(0.04, 0.04, 0.04);
		obj_Player.rotation.y = 135 * Math.PI / 180;
		//obj_Player.scale.set(0.145, 0.145, 0.145);
		//obj_Player.rotation.y = 45 * Math.PI / 180;
		scene.add(obj_Player);
		
		modelData = await model_loader.loadAsync('./models/shop.glb');
		const obj_Shop = modelData.scene.children[0];
		obj_Shop.position.set(-0.4, 0.97, -1.15);
		obj_Shop.scale.set(0.145, 0.145, 0.145);
		obj_Shop.rotation.y = -45 * Math.PI / 180;
		scene.add(obj_Shop);
	}
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
	}
}

// Movement
document.getElementById('right').addEventListener('click', MoveRight);	
function MoveRight(){
	if (A[1][2]!=1){
		if (A[1][2]==0){//nothing
			textNode.nodeValue = "";
			A[0][0]=A[0][1]; A[2][0]=A[2][1];
			A[0][1]=A[0][2]; A[2][1]=A[2][2];
			if (A[1][1]==9) A[1][0]=0;
			else if (A[1][1]==11) A[1][0]=3; A[1][1]=9;
			RanArrayRight();
		}
		else if (A[1][2]==2){//gold
			textNode.nodeValue = "You picked up some gold.";
			gold++; score++; mgold++;
			A[0][0]=A[0][1]; A[2][0]=A[2][1];
			A[0][1]=A[0][2]; A[2][1]=A[2][2];
			if (A[1][1]==9) A[1][0]=0;
			else if (A[1][1]==11) A[1][0]=3; A[1][1]=9;
			RanArrayRight();
		}
		else if (A[1][2]==3){//shop
			textNode.nodeValue = "You are near shop.";
			A[0][0]=A[0][1]; A[2][0]=A[2][1];
			A[0][1]=A[0][2]; A[2][1]=A[2][2];
			if (A[1][1]==9) A[1][0]=0;
			else if (A[1][1]==11) A[1][0]=3; A[1][1]=11;
			RanArrayRight();
		}
		else if (A[1][2]==4){//food
			textNode.nodeValue = "You picked up food.";
			food++;
			A[0][0]=A[0][1]; A[2][0]=A[2][1];
			A[0][1]=A[0][2]; A[2][1]=A[2][2];
			if (A[1][1]==9) A[1][0]=0;
			else if (A[1][1]==11) A[1][0]=3; A[1][1]=9;
			RanArrayRight();
		}
		else if (A[1][2]==5){//ladder
			//NextLevel();
			stam++; level++;
			GenerateMap();
		} score++;
		// shop button
		if (A[1][1]==11) {
			document.getElementById("use_btn").style.visibility = "visible";
			//document.getElementById("use_btn_txt").style.visibility = "visible";
		}
		if (stam<=0) hp--; else stam--;
		//if (hp<=0) GameOver();
	} else textNode.nodeValue = "Wall is blocking your way.";
	//direction=-90;
	direction=0;
	Update();
}
document.getElementById('left').addEventListener('click', MoveLeft);	
function MoveLeft(){
	if (A[1][0]!=1){
		if (A[1][0]==0){//nothing
			textNode.nodeValue = "";
			A[0][2]=A[0][1]; A[2][2]=A[2][1];
			A[0][1]=A[0][0]; A[2][1]=A[2][0];
			if (A[1][1]==9) A[1][2]=0;
			else if (A[1][1]==11) A[1][2]=3; A[1][1]=9;
			RanArrayLeft();
		}
		else if (A[1][0]==2){//gold
			textNode.nodeValue = "You picked up some gold.";
			gold++; score++; mgold++;
			A[0][2]=A[0][1]; A[2][2]=A[2][1];
			A[0][1]=A[0][0]; A[2][1]=A[2][0];
			if (A[1][1]==9) A[1][2]=0;
			else if (A[1][1]==11) A[1][2]=3; A[1][1]=9;
			RanArrayLeft();
		}
		else if (A[1][0]==3){//shop
			textNode.nodeValue = "You are near shop.";
			A[0][2]=A[0][1]; A[2][2]=A[2][1];
			A[0][1]=A[0][0]; A[2][1]=A[2][0];
			if (A[1][1]==9) A[1][2]=0;
			else if (A[1][1]==11) A[1][2]=3; A[1][1]=11;
			RanArrayLeft();
		}
		else if (A[1][0]==4){//food
			textNode.nodeValue = "You picked up food.";
			food++;
			A[0][2]=A[0][1]; A[2][2]=A[2][1];
			A[0][1]=A[0][0]; A[2][1]=A[2][0];
			if (A[1][1]==9) A[1][2]=0;
			else if (A[1][1]==11) A[1][2]=3; A[1][1]=9;
			RanArrayLeft();
		}
		else if (A[1][0]==5){//ladder
			stam++; level++;
			GenerateMap();
		} score++;
		// shop button
		if (A[1][1]==11) {
			document.getElementById("use_btn").style.visibility = "visible";
			//document.getElementById("use_btn_txt").style.visibility = "visible";
		}
		if (stam<=0) hp--; else stam--;
		//if (hp<=0) GameOver();
	} else textNode.nodeValue = "Wall is blocking your way.";
	//direction=90;
	direction=180;
	Update();
}
document.getElementById('up').addEventListener('click', MoveUp);	
function MoveUp(){
	if (A[0][1]!=1){
		if (A[0][1]==0){//nothing
			textNode.nodeValue = "";
			A[2][0]=A[1][0]; A[2][2]=A[1][2];
			A[1][0]=A[0][0]; A[1][2]=A[0][2];
			if (A[1][1]==9) A[2][1]=0;
			else if (A[1][1]==11) A[2][1]=3; A[1][1]=9;
			RanArrayUp();
		}
		else if (A[0][1]==2){//gold
			textNode.nodeValue = "You picked up some gold.";
			A[2][0]=A[1][0]; A[2][2]=A[1][2];
			A[1][0]=A[0][0]; A[1][2]=A[0][2];
			if (A[1][1]==9) A[2][1]=0;
			else if (A[1][1]==11) A[2][1]=3; A[1][1]=9;
			RanArrayUp();
		}
		else if (A[0][1]==3){//shop
			textNode.nodeValue = "You are near shop.";
			gold++; score++; mgold++;
			A[2][0]=A[1][0]; A[2][2]=A[1][2];
			A[1][0]=A[0][0]; A[1][2]=A[0][2];
			if (A[1][1]==9) A[2][1]=0;
			else if (A[1][1]==11) A[2][1]=3; A[1][1]=11;
			RanArrayUp();
		}
		else if (A[0][1]==4){//food
			textNode.nodeValue = "You picked up food.";
			food++;
			A[2][0]=A[1][0]; A[2][2]=A[1][2];
			A[1][0]=A[0][0]; A[1][2]=A[0][2];
			if (A[1][1]==9) A[2][1]=0;
			else if (A[1][1]==11) A[2][1]=3; A[1][1]=9;
			RanArrayUp();
		}
		else if (A[0][1]==5){//ladder
			stam++; level++;
			GenerateMap();
		} score++;
		// shop button
		if (A[1][1]==11) {
			document.getElementById("use_btn").style.visibility = "visible";
			//document.getElementById("use_btn_txt").style.visibility = "visible";
		}
		if (stam<=0) hp--; else stam--;
		//if (hp<=0) GameOver();
	} else textNode.nodeValue = "Wall is blocking your way.";
	//direction=0;
	direction=90;
	Update();
}
document.getElementById('down').addEventListener('click', MoveDown);	
function MoveDown(){
	if (A[2][1]!=1){
		if (A[2][1]==0){//nothing
			textNode.nodeValue = "";
			A[0][0]=A[1][0]; A[0][2]=A[1][2];
			A[1][0]=A[2][0]; A[1][2]=A[2][2];
			if (A[1][1]==9) A[0][1]=0;
			else if (A[1][1]==11) A[0][1]=3; A[1][1]=9;
			RanArrayDown();
		}
		else if (A[2][1]==2){//gold
			textNode.nodeValue = "You picked up some gold.";
			gold++; score++; mgold++;
			A[0][0]=A[1][0]; A[0][2]=A[1][2];
			A[1][0]=A[2][0]; A[1][2]=A[2][2];
			if (A[1][1]==9) A[0][1]=0;
			else if (A[1][1]==11) A[0][1]=3; A[1][1]=9;
			RanArrayDown();
		}
		else if (A[2][1]==3){//shop
			textNode.nodeValue = "You are near shop.";
			A[0][0]=A[1][0]; A[0][2]=A[1][2];
			A[1][0]=A[2][0]; A[1][2]=A[2][2];
			if (A[1][1]==9) A[0][1]=0;
			else if (A[1][1]==11) A[0][1]=3; A[1][1]=11;
			RanArrayDown();
		}
		else if (A[2][1]==4){//food
			textNode.nodeValue = "You picked up food.";
			food++;
			A[0][0]=A[1][0]; A[0][2]=A[1][2];
			A[1][0]=A[2][0]; A[1][2]=A[2][2];
			if (A[1][1]==9) A[0][1]=0;
			else if (A[1][1]==11) A[0][1]=3; A[1][1]=9;
			RanArrayDown();
		}
		else if (A[2][1]==5){//ladder
			stam++; level++;
			GenerateMap();
		} score++;
		// shop button
		if (A[1][1]==11) {
			document.getElementById("use_btn").style.visibility = "visible";
			//document.getElementById("use_btn_txt").style.visibility = "visible";
		}
		if (stam<=0) hp--; else stam--;
		//if (hp<=0) GameOver();
	} else textNode.nodeValue = "Wall is blocking your way.";
	//direction=180;
	direction=-90;
	Update();
}
// Keyboard movement
document.addEventListener("keydown", onKeyDown, false);
function onKeyDown(event) {
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
	} else if (keyCode==81&&A[1][1]==11) {// Eat
		UseButton();
	}
	updateUI();
	renderer.render(scene, camera);
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

}