
/******** SETUP & CONTROLS ********/

let scene = new THREE.Scene()
scene.background = new THREE.Color( 0xffffff )

let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )
camera.position.z = 5

let renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

let controls = new THREE.OrbitControls( camera, renderer.domElement )
controls.addEventListener( 'change', function() { renderer.render(scene, camera) } )

let raycaster = new THREE.Raycaster()
let mouse = new THREE.Vector2()

/******** VARIABLES & INITIALIZE ********/

let color = 0x71f2ae
let player1 = 0xf2c285
let player2 = 0x75eeff

let turn = player1
let winner

let cubes = []

let blockArray = [
  // first layer
  { id: 1, x: -1.5, y: 1.5, z: 0},
  { id: 2, x: -1.5, y: 0, z: 0},
  { id: 3, x: -1.5, y: -1.5, z: 0},
  { id: 4, x: 0, y: 1.5, z: 0},
  { id: 5, x: 0, y: 0, z: 0},
  { id: 6, x: 0, y: -1.5, z: 0},
  { id: 7, x: 1.5, y: 1.5, z: 0},
  { id: 8, x: 1.5, y: 0, z: 0},
  { id: 9, x: 1.5, y: -1.5, z: 0},
  // second layer
  { id: 1, x: -1.5, y: 1.5, z: -2},
  { id: 2, x: -1.5, y: 0, z: -2},
  { id: 3, x: -1.5, y: -1.5, z: -2},
  { id: 4, x: 0, y: 1.5, z: -2},
  { id: 5, x: 0, y: 0, z: -2},
  { id: 6, x: 0, y: -1.5, z: -2},
  { id: 7, x: 1.5, y: 1.5, z: -2},
  { id: 8, x: 1.5, y: 0, z: -2},
  { id: 9, x: 1.5, y: -1.5, z: -2},
  // third layer
  { id: 1, x: -1.5, y: 1.5, z: -4},
  { id: 2, x: -1.5, y: 0, z: -4},
  { id: 3, x: -1.5, y: -1.5, z: -4},
  { id: 4, x: 0, y: 1.5, z: -4},
  { id: 5, x: 0, y: 0, z: -4},
  { id: 6, x: 0, y: -1.5, z: -4},
  { id: 7, x: 1.5, y: 1.5, z: -4},
  { id: 8, x: 1.5, y: 0, z: -4},
  { id: 9, x: 1.5, y: -1.5, z: -4}
]

let winArray = [
  // layer 1
  // vertical
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // horizontal
  [0, 3, 6],
  [1, 4, 7],
  [2, 3, 8],
  // diagonal
  [0, 4, 8],
  [2, 4, 6],

  // layer 2
  // vertical
  [9, 10, 11],
  [12, 13, 14],
  [15, 16, 17],
  // horizontal
  [9, 12, 15],
  [10, 13, 16],
  [11, 14, 17],
  // diagonal
  [9, 13, 17],
  [11, 13, 15],

  // layer 3
  // vertical
  [18, 19, 20],
  [21, 22, 23],
  [24, 25, 26],
  // horizontal
  [18, 21, 24],
  [19, 22, 25],
  [20, 23, 26],
  // diagonal
  [18, 22, 26],
  [20, 22, 24],

  // left layer
  // vertical
  [18, 19, 20],
  [9, 10, 11],
  [0, 1, 2],
  // horizontal
  [18, 9, 0],
  [19, 10, 1],
  [20, 11, 2],
  // diagonal
  [18, 10, 2],
  [20, 10, 0],

  // center layer
  // vertical
  [21, 22, 23],
  [12, 13, 14],
  [3, 4, 5],
  // horizontal
  [21, 12, 3],
  [22, 13, 4],
  [23, 14, 5],
  // diagonal
  [21, 13, 5],
  [23, 13, 3],

  // right layer
  // vertical
  [24, 25, 26],
  [15, 16, 17],
  [6, 7, 8],
  // horizontal
  [24, 15, 6],
  [25, 16, 7],
  [26, 17, 8],
  // diagonal
  [24, 16, 8],
  [26, 16, 6],

  // z-axis
  // top layer
  // vertical
  [18, 9, 0],
  [21, 12, 3],
  [24, 15, 6],
  // horizontal
  [18, 21, 24],
  [9, 12, 15],
  [0, 3, 6],
  // diagonal
  [18, 12, 6],
  [0, 12, 24],

    // middle layer
  // vertical
  [19, 10, 1],
  [22, 13, 4],
  [25, 16, 7],
  // horizontal
  [19, 22, 25],
  [10, 13, 16],
  [1, 4, 7],
  // diagonal
  [19, 13, 7],
  [1, 13, 25],

  // bottom layer
  // vertical
  [20, 11, 2],
  [23, 14, 5],
  [26, 17, 8],
  // horizontal
  [20, 23, 26],
  [11, 14, 17],
  [2, 5, 8],
  // diagonal
  [20, 14, 8],
  [2, 14, 26],

  // 3D diagonals
  [0, 13, 26],
  [2, 13, 24],
  [6, 13, 20],
  [8, 13, 18]
]

render()
createGameboard(blockArray)

window.addEventListener( 'mousedown', onMouseDown, false )
window.addEventListener( 'resize', onWindowResize, false )

/******** FUNCTIONS ********/

function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

function onMouseDown( event ) {
  event.preventDefault()

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera )

  // calculate objects intersecting the picking ray
  let intersects = raycaster.intersectObjects( scene.children )

  if ( intersects.length > 0 ) {
    if (intersects[ 0 ].object.material.color.getHex() === color) {
      if (turn === player1) {
        intersects[ 0 ].object.material.color.setHex( turn )
        win()
        turn = player2
      }
      else {
        intersects[ 0 ].object.material.color.setHex( turn )
        win()
        turn = player1
      }
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
}

function createGameboard(block) {
  cubes = []

  for (let i = 0; i < block.length; i++) {
    let geometry = new THREE.BoxGeometry( 1, 1, 1)
    let material = new THREE.MeshBasicMaterial( { color: color, transparent: true, opacity: 0.7 } )
    let cube = new THREE.Mesh( geometry, material )
    
    cube.position.set(block[i].x, block[i].y, block[i].z)
    cubes.push(cube)
    scene.add( cube )
  }

  container = document.createElement( 'div' )
  document.body.appendChild( container )

  var info = document.createElement( 'div' )
  info.style.position = 'absolute'
  info.style.top = '20px'
  info.style.width = '100%'
  info.style.textAlign = 'center'
  info.style.fontSize = "3em"
  info.innerHTML = '3D Tic Tac Toe'
  container.appendChild( info )

  var play = document.createElement( 'button' )
  play.style.position = 'absolute'
  play.style.top = '50%'
  play.style.left = '10%'
  play.style.backgroundColor = '#4CAF50'
  play.style.color = 'white'
  play.style.padding = '15px 32px'
  play.style.fontSize = '16px'
  play.style.borderRadius = '8px'
  play.style.margin = '0 auto'
  play.style.textAlign = 'center'
  play.innerHTML = "Reset"
  play.addEventListener('click', function(e){
    removeGameboard(cubes)
    createGameboard(blockArray)
  });
  container.appendChild( play )

  var p1 = document.createElement( 'button' )
  p1.style.position = 'absolute'
  p1.style.top = '20%'
  p1.style.left = '10%'
  p1.style.backgroundColor = '#f2c285'
  p1.style.color = 'white'
  p1.style.padding = '15px 15px'
  p1.style.fontSize = '16px'
  p1.style.margin = '0 auto'
  p1.style.textAlign = 'center'
  p1.innerHTML = "Player 1"
  container.appendChild( p1 )

  var p2 = document.createElement( 'button' )
  p2.style.position = 'absolute'
  p2.style.top = '30%'
  p2.style.left = '10%'
  p2.style.backgroundColor = '#75eeff'
  p2.style.color = 'white'
  p2.style.padding = '15px 15px'
  p2.style.fontSize = '16px'
  p2.style.margin = '0 auto'
  p2.style.textAlign = 'center'
  p2.innerHTML = "Player 2"
  container.appendChild( p2 )

}

function removeGameboard(cubes) {
  if (container) {
    while (container.hasChildNodes()) {
      container.removeChild(container.firstChild)
    }
  }
  for (i = 0; i < cubes.length; i++) {
    scene.remove(cubes[i])
  }
}

function win() {
  for (let i = 0; i < winArray.length; i++) {
    index0 = winArray[i][0]
    index1 = winArray[i][1]
    index2 = winArray[i][2]
    if ( cubes[index0].material.color.getHex() === player1 && cubes[index0].material.color.getHex() === cubes[index1].material.color.getHex() && cubes[index0].material.color.getHex() === cubes[index2].material.color.getHex() ) {
      var winner = document.createElement( 'div' )
      winner.style.position = 'absolute'
      winner.style.top = '41%'
      winner.style.left = '7%'
      winner.style.fontSize = '2em'
      winner.innerHTML = 'Player 1 Wins!'
      container.appendChild( winner )
    }
    if ( cubes[index0].material.color.getHex() === player2 && cubes[index0].material.color.getHex() === cubes[index1].material.color.getHex() && cubes[index0].material.color.getHex() === cubes[index2].material.color.getHex() ) {
      var winner = document.createElement( 'div' )
      winner.style.position = 'absolute'
      winner.style.top = '41%'
      winner.style.left = '7%'
      winner.style.fontSize = "2em"
      winner.innerHTML = 'Player 2 Wins!'
      container.appendChild( winner )
    }
  }
}
