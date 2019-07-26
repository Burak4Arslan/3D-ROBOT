"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];
var mystack = [];
//
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var radius = 4.0;
var theta  = 0.0;

var dr = 5.0 * Math.PI/180.0;
var eye;
var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;  
var near = 1;
var far = 2000;
//
var bacakacisi = 0;
var onearkaya = 1;
var leftrightfarki = 1;
var run = 0;
var kolkaldir=0;
var kolacisi=0;
var p = 0;
var kolmuelmi=0;
var elsagsolkontrol = 0;
var elacisi=0;
var dusuyorum = 0;
var sallanma = 0.2;
var sallanmakontrol = 0;
var sallanmakontrol2 = 0;
var dus =0;
var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

// RGBA colors
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT      = 6.0;
var BASE_WIDTH       = 5.0;
var BASE_GEN         = 4.5;
var LOWER_ARM_HEIGHT = 3.5;
var LOWER_ARM_WIDTH  = 0.5;
var UPPER_ARM_HEIGHT = 3.5;
var UPPER_ARM_WIDTH  = 1;
var HEAD_WIDTH 		 = 2;
var HEAD_HEIGHT 	 = 2;
var UPPER_LEG_WIDTH  = 1.5;
var UPPER_LEG_HEIGHT = 3.5;
var LOWER_LEG_WIDTH  = 1;
var LOWER_LEG_HEIGHT =3.5

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;


var theta = [ 0, 0, 0];
var alpha = [ 0, 0, 0];
//kafahareketi
var phi=[0,0];
var flag=0;

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(  r,a,  b,  c,  d ) {
    colors.push(vertexColors[r]);
    points.push(vertices[a]);
    colors.push(vertexColors[r]);
    points.push(vertices[b]);
    colors.push(vertexColors[r]);
    points.push(vertices[c]);
    colors.push(vertexColors[r]);
    points.push(vertices[a]);
    colors.push(vertexColors[r]);
    points.push(vertices[c]);
    colors.push(vertexColors[r]);
    points.push(vertices[d]);
}


function colorCube() {
    quad( 6,1, 0, 3, 2 );
    quad( 6,2, 3, 7, 6 );
    quad( 6,3, 0, 4, 7 );
    quad( 6,6, 5, 1, 2 );
    quad( 6,4, 5, 6, 7 );
    quad( 6,5, 4, 0, 1 );
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext("webgl");
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );
	aspect =  canvas.width/canvas.height; 

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	window.onkeydown = function(Event) {
	
		switch( Event.keyCode ) {
			case 87:
				alpha[0]++; // press w
				break;
			case 83:
				alpha[0]--; // press s
				break;
			case 68:
				alpha[1]++; // press d
				break;
			case 65:
				alpha[1]--; // press a
				break;
			case 72: // press h
				if(kolkaldir==0) {
					dusuyorum = 0;
					kolkaldir=1;
					kolacisi=0;
					kolmuelmi=0;
					run=0;
					bacakacisi=-0;
				}
				else if(kolkaldir==1) {
					kolkaldir=0;
					kolacisi=0;
					kolmuelmi=0;
				}
				break;
			case 82: // press r
				if(run==1) {
					kolkaldir=0;
					kolacisi=0;
					kolmuelmi=0;
					bacakacisi=-0;
					run--;
				}
				else if(run==0) {
					kolkaldir=0;
					kolacisi=0;
					kolmuelmi=0;
					run++;
				}
				break;
			case 80: // press p
				if(p==0) {
					
					//eye = vec3(0,0,0);
					//var mvMatrix = lookAt(eye, at , up);
					var f = 60* Math.PI / 180;
					f = Math.tan(Math.PI * 0.5 - 0.5 * f);
					var rangeInv = 1.0 / (near - far);
					var pMatrix = [f / aspect, 0, 0, 0,
									0, f, 0, 0,
									0, 0, (near + far) * rangeInv, -1,
									0, 0, near * far * rangeInv * 2,21		
					];
					
					
					//var pMatrix = perspective(fovy, aspect, near, far);
					//pMatrix = mult(pMatrix,translate(0, 0, -25));
					//pMatrix = mult(pMatrix,scale4(1,1,-1));
					//console.log(pMatrix);*/
					
					
					//pMatrix = mult(pMatrix,rotateY(90));
					//alert(pMatrix);
					//pMatrix = mult(pMatrix,rotateY(-180));
					//pMatrix = mult(pMatrix,scale4(-1,1,1));
					//pMatrix = mult(pMatrix,mvMatrix);
					gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(pMatrix) );
					
					
					//gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(mvMatrix) );
					
					//alert(modelViewMatrix);
					/*var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
					var zNear = 1;
					var zFar = 2000;*/
					//projectionMatrix = perspective(45, aspect, zNear, zFar);
					
					//gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );
					p++;
					
				}
				else if(p==1) {
					projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
					gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );
					p--;
				}
				break;
				
				case 66:  // press b kafa hareketi
					flag=1;
					phi[0]++;
					break;
				case 67: // press c kafa hareketi
					phi[1]++;
					break;
					
				case 76: // press l
					if(dusuyorum ==0 )
						{dusuyorum = 1;}
					else if(dusuyorum ==1 )
						{dusuyorum = 0;}
		}
	
	};
	
	
	
	
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
}

//----------------------------------------------------------------------------


function torso() {
    var s = scale4(BASE_WIDTH, BASE_HEIGHT, BASE_GEN);
    var instanceMatrix = mult( translate( 0.0,0.0, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
	var col = mat4();
	col = mult(col,scale4(0.3,0.6,0.9));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function lua() {
    var s = scale4(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate( 0, 0, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
	var col = mat4();
	col = mult(col,scale4(0.4,0,0));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function lla()
{
    var s = scale4(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult( translate( 0, -3.5, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
	var col = mat4();
	col = mult(col,scale4(0,0.4,0));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function rua() {
    var s = scale4(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate( 0, 0, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
	var col = mat4();
	col = mult(col,scale4(0,0.4,0.4));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function rla()
{
    var s = scale4(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult( translate( 0, -3.5, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
	var col = mat4();
	col = mult(col,scale4(0.8,0,0));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------

function head()
{
    var s = scale4(HEAD_WIDTH, HEAD_HEIGHT, HEAD_WIDTH);
    var instanceMatrix = mult( translate( 0, 4, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
	t=mult(t,rotate(phi[0] , 1 , 0 ,0));
	t=mult(t,rotate(phi[1] , 0 , 1 ,0));
	var col = mat4();
	col = mult(col,scale4(0,0.8,0));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function lul() {
    var s = scale4(UPPER_LEG_WIDTH, UPPER_LEG_HEIGHT, UPPER_LEG_WIDTH);
    var instanceMatrix = mult(translate( 0, 0, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
	var col = mat4();
	col = mult(col,scale4(0,0,0.8));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function lll()
{
    var s = scale4(LOWER_LEG_WIDTH, LOWER_LEG_HEIGHT, LOWER_LEG_WIDTH);
    var instanceMatrix = mult( translate( 0, -3.5, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
	var col = mat4();
	col = mult(col,scale4(1,0.4,0.2));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function rul() {
    var s = scale4(UPPER_LEG_WIDTH, UPPER_LEG_HEIGHT, UPPER_LEG_WIDTH);
    var instanceMatrix = mult(translate( 0, 0 , 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
	var col = mat4();
	col = mult(col,scale4(0,1,0.5));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function rll()
{
    var s = scale4(LOWER_LEG_WIDTH, LOWER_LEG_HEIGHT, LOWER_LEG_WIDTH);
    var instanceMatrix = mult( translate( 0 , -3.5, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
	var col = mat4();
	col = mult(col,scale4(0.6,0,1));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function bina()
{
    var s = scale4(1, 4, 1);
    var instanceMatrix = mult( translate( 8 , dus , 0 ), s);
	
	if(dus>11) {
		dus=-14;
	}
	dus++;
	
    var t =  instanceMatrix;
	var col = mat4();
	col = mult(col,scale4(1,0,0));
	gl.uniformMatrix4fv( gl.getUniformLocation(program, "aColor"),  false, flatten(col) );
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------




var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	
	if(dusuyorum==1) {
		
		bina();
	}
	
	
    modelViewMatrix = rotate(alpha[0], 1, 0, 0 );
	modelViewMatrix = mult(modelViewMatrix,rotate(alpha[1],0,1,0))
	modelViewMatrix = mult(modelViewMatrix,translate( 0,2,0 ));      // her şeyi etkileyen modelViewMatrix
	
	modelViewMatrix = mult(modelViewMatrix,translate(0,-bacakacisi/30,0)); // yürürken yukarı aşağı hareketi
		
	

	if(dusuyorum==1) {
		modelViewMatrix = mult(modelViewMatrix,translate(0,-5,0));
		modelViewMatrix = mult(modelViewMatrix,rotateX(90));
		modelViewMatrix = mult(modelViewMatrix,rotateY(0));
		modelViewMatrix = mult(modelViewMatrix,rotateZ(55));
		
	}
	

	if(dusuyorum==1) {
		modelViewMatrix = mult(modelViewMatrix, translate(0,-sallanma/4,0));
	}
	
    torso();
	mystack.push(modelViewMatrix); 
	
	head();
	
	if(dusuyorum==1) {
		modelViewMatrix = mult(modelViewMatrix, translate(0,-sallanma,0));
		modelViewMatrix = mult(modelViewMatrix, translate(0,2,-2));
		modelViewMatrix = mult(modelViewMatrix,rotateX(90));
	}
	
	

	if(run==1) {
		bacakacisi = bacakacisi + onearkaya;
	}
	
		modelViewMatrix = mult(modelViewMatrix,rotateX(bacakacisi*(-leftrightfarki)));
		modelViewMatrix = mult(modelViewMatrix,translate(0,-bacakacisi/30,bacakacisi*leftrightfarki/20)); // yürürken sol kol öne arkaya
	
	// el sallama hareketinde kolu kaldırma
	
	if(kolkaldir==1) {
		modelViewMatrix = mult(modelViewMatrix,rotateX(-kolacisi));
		modelViewMatrix = mult(modelViewMatrix,translate( 0, -kolacisi/40, kolacisi/130 ));
	}
	modelViewMatrix = mult(modelViewMatrix,translate( -3, 1, 0.0 ));
    lua();
	
	// el sallama hareketinde eli sallama
	
	if(kolmuelmi==1) {
		modelViewMatrix = mult(modelViewMatrix,rotateZ(elacisi));
		modelViewMatrix = mult(modelViewMatrix,translate(-elacisi/20,0 , 0 ));
	}
	else {
		modelViewMatrix = mult(modelViewMatrix,rotateZ(-elacisi));
		modelViewMatrix = mult(modelViewMatrix,translate(elacisi/20,0 , 0 ));
		elacisi =0;
	}    
	
    lla();
	
	modelViewMatrix = mystack.pop();
	mystack.push(modelViewMatrix);
	
	if(dusuyorum==1) {
		modelViewMatrix = mult(modelViewMatrix, translate(0,-sallanma,0));
		modelViewMatrix = mult(modelViewMatrix, translate(0,2,-2));
		modelViewMatrix = mult(modelViewMatrix,rotateX(90));
	}
	
	
		modelViewMatrix = mult(modelViewMatrix,rotateX(bacakacisi*leftrightfarki));
		modelViewMatrix = mult(modelViewMatrix,translate(0,-bacakacisi/30,-bacakacisi*leftrightfarki/20)); // yürürken sağ kol öne arkaya
	
	modelViewMatrix = mult(modelViewMatrix,translate( 3, 1, 0.0 ));
    rua();

    rla();
	
	modelViewMatrix = mystack.pop();
	mystack.push(modelViewMatrix);
	
	
		modelViewMatrix = mult(modelViewMatrix,rotateX(bacakacisi*leftrightfarki/1.5));
		modelViewMatrix = mult(modelViewMatrix,translate(0,-bacakacisi/40,-bacakacisi*leftrightfarki/30)); // yürürken sol bacak öne arkaya
	
	modelViewMatrix = mult(modelViewMatrix,translate( -1, -4.5, 0.0 ));
	
	if(dusuyorum==1) {
		modelViewMatrix = mult(modelViewMatrix, translate(0,-sallanma,0));
		modelViewMatrix = mult(modelViewMatrix, translate(0,1,-2));
		modelViewMatrix = mult(modelViewMatrix,rotateX(90));
	}
	
	lul();

    lll();
	
	modelViewMatrix = mystack.pop();
	mystack.push(modelViewMatrix);
	
	
		modelViewMatrix = mult(modelViewMatrix,rotateX(bacakacisi*(-leftrightfarki)/1.5));
		modelViewMatrix = mult(modelViewMatrix,translate(0,-bacakacisi/60,bacakacisi*leftrightfarki/30)); // yürürken sağ bacak öne arkaya
	
	modelViewMatrix = mult(modelViewMatrix,translate( 1, -4.5, 0.0 ));
	
	if(dusuyorum==1) {
		modelViewMatrix = mult(modelViewMatrix, translate(0,-sallanma,0));
		modelViewMatrix = mult(modelViewMatrix, translate(0,1,-2));
		modelViewMatrix = mult(modelViewMatrix,rotateX(90));
	}
	
	rul();

    rll();
	
	
	
	if(run==1) {	// eğer yürüyorsa 
	if(bacakacisi>20) {	// bacak açısı sona ulaştı
		onearkaya = -1;
	}
	if(bacakacisi<1) {
		onearkaya = 1;
		leftrightfarki = -leftrightfarki;
	}
	}
	if(kolkaldir==1) { // el sallama hareketi başlangıcı
		if(kolmuelmi==0){ // kol kalkana kadar buraya girecek
		kolacisi = kolacisi + 3;
		}
		else{  // kol tamamen kalkınca buraya gircek
			if(elsagsolkontrol==1) {
				elacisi++;
				if(elacisi>10) { // sağ 
					elsagsolkontrol=0;
				}
			}
			if(elsagsolkontrol==0){
				elacisi--; 
				if(elacisi<-10){ // sol
					elsagsolkontrol=1;
				}
			}
		}
		if(kolacisi>130) { // kolun kalkması bitti
			kolmuelmi=1;
		}
	}
	
	if(dusuyorum ==1 ) { // sallanma hareketi için değerler burada hesaplanıyor
	
		if(sallanmakontrol>10){  
			sallanmakontrol2=1;
		}
		else if(sallanmakontrol<1) {
				sallanmakontrol2=0;
		}
		
		if(sallanmakontrol2==1) {
			sallanma = -sallanma;
			sallanmakontrol=0;
			sallanmakontrol2=0;
		}
			sallanmakontrol++;
	
	
	}
	
    requestAnimationFrame(render);
}

/*var fovy = 45;
					var aspect =  canvas.width/canvas.height;
					var near = 0.3;
					var far = 3;
					var eye;
					const at = vec3(0.0, 0.0, 0.0);
					const up = vec3(0.0, 1.0, 0.0);
					var theta  = 0.0;
					var phi    = 0.0;
					var radius = 4.0;
					eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
						radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
					var mvMatrix = lookAt(eye, at , up);
					var pMatrix = perspective(fovy, aspect, near, far);
					gl.uniformMatrix4fv( modelViewMatrix, false, flatten(mvMatrix) );
					gl.uniformMatrix4fv( projectionMatrix, false, flatten(pMatrix) );
					p++;
					alert("a");*/
