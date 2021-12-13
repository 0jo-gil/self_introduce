import * as THREE from '../build/three.module.js';


const r = 450;
let rot = 0;
let isScroll = false;
let scrollNum = 0;

let mouseX = 0,
    mouseY = 0,

    windowHalfX = innerWidth / 2,
    windowHalfY = innerHeight / 2,

    targetX, targetY,

    camera, scene, renderer;

let meshArr = [];
let textureArr = [];
let mater = [];
let planeArr = [];
let vertex = new THREE.Vector3();
let vertices = [];

let videoPlane;
let videoClone;

let line;
let parameters;
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}; 
init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 80, innerWidth / innerHeight, 1, 3000 );
    camera.position.z = 30;

    scene = new THREE.Scene();

    parameters = [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff9900, 1 ], [ 0.75, 0xffaa00, 0.75 ], [ 1, 0xffaa00, 0.5 ], [ 1.25, 0x000833, 0.8 ],
        [ 3.0, 0xaaaaaa, 0.75 ], [ 3.5, 0xffffff, 0.5 ], [ 4.5, 0xffffff, 0.25 ]];

    const geometry = createGeometry();

    for ( let i = 0; i < parameters.length; ++ i ) {

        const p = parameters[ i ];

        const material = new THREE.LineBasicMaterial( { color: p[ 1 ], opacity: p[ 2 ] } );

        line = new THREE.LineSegments( geometry, material );
        line.rotation.y = Math.random() * Math.PI;
        line.updateMatrix();
        scene.add( line );

    }

    const picGeometry = new THREE.CylinderGeometry(10, 10, 4, 30, 1, true, Math.PI * 1, Math.PI * 0.3);
    const picPlaneGeometry = new THREE.PlaneGeometry(15, 10);
  

    for(let i=0; i<6; i++){
        textureArr.push(new THREE.TextureLoader().load(`img/work/${i}.png`));
        mater.push(new THREE.MeshBasicMaterial({map: textureArr[i], transparent: true, opacity: 1}));
        mater[i].side = THREE.DoubleSide;

        meshArr.push(new THREE.Mesh(picGeometry, mater[i]));
        planeArr.push(new THREE.Mesh(picPlaneGeometry, mater[i]));
    }

    meshArr.forEach((el, index) => {
        el.position.z = 10;
        el.rotation.y = index * 1.05;
        el.scale.set(0, 55, 0); // animate로 55로 만들어

        scene.add(el);
    });

    planeArr.forEach((el, index) => {
        el.position.x =  -100 + (((Math.PI * 5)) * 2.5) * index;
        // el.position.z = -10 * index;
        // el.rotation.y = Math.PI * 0.05;
        el.scale.set(0, 0, 0); 
        scene.add(el);
    })

    const video = document.getElementById('video');
    video.play();
    const videoTexture = new THREE.VideoTexture(video);
    const videoPlaneGeometry = new THREE.PlaneGeometry(15, 10);
    const videoMaterial = new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.FrontSide, toneMapped: false} );

    videoPlane = new THREE.Mesh(videoPlaneGeometry, videoMaterial);
    videoPlane.rotation.y = Math.PI * -2;
    videoPlane.scale.set(0,0,0);

    videoClone = videoPlane.clone();
    
    videoClone.scale.set(0,0,0);
    videoClone.rotation.x = Math.PI * -0.5;
    videoClone.position.set(0, -500, 0);
    

    // scene.add(videoClone);

    scene.add(videoPlane);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( innerWidth, innerHeight );
    document.querySelector('#webgl').appendChild( renderer.domElement );

    document.body.style.touchAction = 'none';
    document.body.addEventListener( 'pointermove', onPointerMove );

    window.addEventListener( 'resize', onWindowResize );

}

function createGeometry() {

    const geometry = new THREE.BufferGeometry();

    for ( let i = 0; i < 1000; i ++ ) {

        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.normalize();
        vertex.multiplyScalar( r );

        vertices.push( vertex.x, vertex.y, vertex.z );

        vertex.multiplyScalar( Math.random() * 0.05 + 1 );

        vertices.push( vertex.x, vertex.y, vertex.z );

    }



    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    return geometry;

}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {
    rot += 0.0005;

    targetX = mouseX * .001;
    targetY = mouseY * .001;

    for ( let i = 0; i < 8; i ++ ) {
        // scene.children[i].rotation.y -= rot / 20;
        scene.children[i].rotation.y += 0.05 * ( targetX - line.rotation.y );
        scene.children[i].rotation.x += 0.05 * ( targetY - line.rotation.x );
    }

    for(let i = 14; i<scene.children.length; i++){
        // scene.children[i].rotation.y += 0.05 * ( targetX - line.rotation.y );
        scene.children[i].rotation.x += 0.05 * ( targetY - line.rotation.x );
    }
       
    
    meshArr.forEach((el, index) => {
        el.rotation.y = index * 1.05 + rot;
    });
     
    
    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}
let mainNum = 0;

window.addEventListener('wheel', (e) => {
    let wheel = e.deltaY;

    let y = document.querySelector('html, body').scrollTop;

    if(isScroll) return;

    if(wheel > 0) {
        mainAni();
        wheelUp();
        isScroll = true;
    } else {
        wheelDown(y);
    }

    console.log(scrollNum);
});

function wheelUp(){
    if(scrollNum >= 0 && scrollNum <= 2){
        scrollNum++;
    }

    if(scrollNum == 1){
        document.querySelector('#main').classList.add('after');
    };

    if(scrollNum == 2){
        document.body.classList.remove('hidden');
    };



    setTimeout(() => {
        isScroll = false;
    }, 1000);


};

function wheelDown(y){
    if(scrollNum >= 1 && scrollNum <= 3){
        scrollNum--;
    }
    if(y == 0){
        document.body.classList.add('hidden');
    }

    if(scrollNum == 0){
        document.querySelector('#main').classList.remove('after');
    }

    if(scrollNum == 1){
        // mainMinAni();
        
    }

    setTimeout(() => {
        isScroll = false;
    }, 1000);

};
// function mainMinAni(){
//     mainNum = 0;
//     mainNum += 0.01;
    
//     if(mainNum < 1){
//         camera.position.z = 1000 - mainNum * 1000;
//     }

//     requestAnimationFrame(mainMinAni);
// }

function mainAni(){
    mainNum += 0.01;

    if(mainNum > 1) return;
    if(mainNum < 1){ 
        camera.position.z = mainNum * 1000;
    }

    if(mainNum > 0.5){
        meshArr.forEach((el, index) => {
            el.rotation.y = (index * 1.05) + ((0.5 - mainNum) * 2) * 3.2;
            el.scale.set(((0.5 - mainNum) * 2)  * 55, 55, ((0.5 - mainNum) * 2) * 55);
        })
    };


    requestAnimationFrame(mainAni);
    renderer.render( scene, camera );

};

const storySection = document.querySelector('#story');
const contactSection = document.querySelector('#contact');

window.addEventListener('scroll', e => {
    let y = document.querySelector('html, body').scrollTop;

    if(y < document.querySelector('#info').offsetTop && y > storySection.offsetTop){
        meshArr.forEach((el, index) => {   
            el.scale.set(0, 0, 0);
        });
    } else {
        meshArr.forEach((el, index) => {   
            el.scale.set(54, 55, 54);
        });
    }

    if(y > storySection.offsetTop - innerHeight * 2 && y < storySection.offsetTop){
        let storyPer = ((y - storySection.offsetTop + innerHeight * 2) / (storySection.clientHeight / 2));
        
        camera.position.z = 1000 - (storyPer * 970);
        meshArr.forEach((el, index) => {
            // el.rotation.y = index * 1.05 + workPer;
            el.scale.set(55 - (storyPer * 55), 55, 55 - (storyPer * 55));
            el.position.z = -storyPer * 2000;
        });

       
    } else {
        // meshArr.forEach((el, index) => {   
        //     el.scale.set(0, 0, 0);
        // });
    }

    if(y > contactSection.offsetTop){
        let contactPer = (y - contactSection.offsetTop) / contactSection.clientHeight;
        let contactPicPer = ((y - (contactSection.offsetTop + innerHeight)) / (contactSection.clientHeight)) * 2;
        // camera.position.z = 1000 - (contactPer * 2000);
        for ( let i = 0; i < 8; i ++ ) {
            scene.children[i].scale.set(1 + contactPer * 100, 1 + contactPer * 100, 1);
        }

        if(y > contactSection.offsetTop + innerHeight && y < document.querySelector('#footer').offsetTop){

            videoPlane.rotation.y = Math.PI * -contactPicPer;
            videoPlane.scale.set(0 + contactPicPer * 90, 0 + contactPicPer * 90, 1);

            videoClone.rotation.z = Math.PI * -contactPicPer;
            videoClone.scale.set(0 + contactPicPer * 90, 0 + contactPicPer * 90, 1);

        } else {
            videoPlane.scale.set(0,0,0);
            videoClone.scale.set(0,0,0);
        }
    } else {
        for ( let i = 0; i < 8; i ++ ) {
            scene.children[i].scale.set(1, 1, 1);
        }
    }
  
});

