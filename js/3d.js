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

let line;
let parameters;

// 윈도우 로드 전 스크롤 상단 위치
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}; 

init();
animate();

function init() {
    // 카메라 설정
    camera = new THREE.PerspectiveCamera( 80, innerWidth / innerHeight, 1, 3000 );
    // 카메라 z축
    camera.position.z = 30;

    scene = new THREE.Scene();

    // line 배열 저장
    parameters = [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff9900, 1 ], [ 0.75, 0xffaa00, 0.75 ], [ 1, 0xffaa00, 0.5 ], [ 1.25, 0x000833, 0.8 ],
        [ 3.0, 0xaaaaaa, 0.75 ], [ 3.5, 0xffffff, 0.5 ], [ 4.5, 0xffffff, 0.25 ]];

    const geometry = createGeometry();

    // 구체 라인 반복문
    for ( let i = 0; i < parameters.length; ++ i ) {
        // line 배열 변수 할당
        const p = parameters[ i ];
        const material = new THREE.LineBasicMaterial( { color: p[ 1 ], opacity: p[ 2 ] } );

        line = new THREE.LineSegments( geometry, material );
        line.rotation.y = Math.random() * Math.PI;
        line.updateMatrix();
        scene.add( line );
    };

    // 사진 텍스쳐 원통
    const picGeometry = new THREE.CylinderGeometry(10, 10, 4, 30, 1, true, Math.PI * 1, Math.PI * 0.3);
    const picPlaneGeometry = new THREE.PlaneGeometry(15, 10);
  
    // 텍스쳐 및 material 배열 저장
    for(let i=0; i<6; i++){
        // 사진 텍스쳐 배열 저장
        textureArr.push(new THREE.TextureLoader().load(`img/work/${i}.png`));
        // material 배열 저장
        mater.push(new THREE.MeshBasicMaterial({map: textureArr[i], transparent: true, opacity: 1}));
        mater[i].side = THREE.DoubleSide;

        meshArr.push(new THREE.Mesh(picGeometry, mater[i]));
        planeArr.push(new THREE.Mesh(picPlaneGeometry, mater[i]));
    }

    // 텍스쳐 원형 배치
    meshArr.forEach((el, index) => {
        el.position.z = 10;
        el.rotation.y = index * 1.05;
        el.scale.set(0, 55, 0);
        scene.add(el);
    });
    planeArr.forEach((el, index) => {
        el.position.x =  -100 + (((Math.PI * 5)) * 2.5) * index;
        el.scale.set(0, 0, 0); 
        scene.add(el);
    });

    // 비디오 텍스쳐 만들기
    const video = document.getElementById('video');
    // 비디오 자동 재생
    video.play();
    // 비디오 텍스쳐 변수
    const videoTexture = new THREE.VideoTexture(video);
    const videoPlaneGeometry = new THREE.PlaneGeometry(15, 10);
    const videoMaterial = new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.FrontSide, toneMapped: false} );

    videoPlane = new THREE.Mesh(videoPlaneGeometry, videoMaterial);
    videoPlane.rotation.y = Math.PI * -2;
    videoPlane.scale.set(0,0,0);

    scene.add(videoPlane);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( innerWidth, innerHeight );
    document.querySelector('#webgl').appendChild( renderer.domElement );

    document.body.style.touchAction = 'none';

    // 마우스 위치 저장
    document.body.addEventListener( 'pointermove', onPointerMove );

    // 리사이즈 이벤트 비율 설정
    window.addEventListener( 'resize', onWindowResize );

}

// 라인 구형 생성
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

};

// 윈도우 사이즈 조절 함수
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
// 마우스 커서 위치 저장 함수
function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

// 애니메이션 함수
function animate() {

    requestAnimationFrame( animate );

    render();

}

// render 함수
function render() {
    rot += 0.0005;

    targetX = mouseX * .001;
    targetY = mouseY * .001;

    // 마우스 회전 애니메이션
    for ( let i = 0; i < 8; i ++ ) {
        scene.children[i].rotation.y += 0.05 * ( targetX - line.rotation.y );
        scene.children[i].rotation.x += 0.05 * ( targetY - line.rotation.x );
    };
    for(let i = 14; i<scene.children.length; i++){
        scene.children[i].rotation.x += 0.05 * ( targetY - line.rotation.x );
    };
       
    // 사진 텍스쳐 회전 애니메이션
    meshArr.forEach((el, index) => {
        el.rotation.y = index * 1.05 + rot;
    });
    
    camera.lookAt( scene.position );

    renderer.render( scene, camera );
};

let mainNum = 0;

// wheel 이벤트
window.addEventListener('wheel', (e) => {
    let wheel = e.deltaY;

    let y = document.querySelector('html, body').scrollTop;

    if(isScroll) return;

    if(wheel > 0) {
        mainAni();
        wheelDown();
        isScroll = true;
    } else {
        wheelUp(y);
    }
});

// 휠 내릴시 이벤트 함수
function wheelDown(){
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
// 휠 올릴시 이벤트 함수
function wheelUp(y){
    if(scrollNum >= 1 && scrollNum <= 3){
        scrollNum--;
    };
    if(y == 0){
        document.body.classList.add('hidden');
    };

    if(scrollNum == 0){
        document.querySelector('#main').classList.remove('after');
    };

    setTimeout(() => {
        isScroll = false;
    }, 1000);

};

// 메인 섹션 애니메이션
function mainAni(){
    mainNum += 0.01;

    if(mainNum > 1) return;
    // 카메라 애니메이션
    if(mainNum < 1){ 
        camera.position.z = mainNum * 1000;
    };

    // 구형 라인 애니메이션
    if(mainNum > 0.5){
        meshArr.forEach((el, index) => {
            el.rotation.y = (index * 1.05) + ((0.5 - mainNum) * 2) * 3.2;
            el.scale.set(((0.5 - mainNum) * 2)  * 55, 55, ((0.5 - mainNum) * 2) * 55);
        });
    };
    requestAnimationFrame(mainAni);
    renderer.render( scene, camera );
};

const storySection = document.querySelector('#story');
const contactSection = document.querySelector('#contact');

// 스크롤 이벤트
window.addEventListener('scroll', e => {
    // 스크롤 위치 변수
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
            el.scale.set(55 - (storyPer * 55), 55, 55 - (storyPer * 55));
            el.position.z = -storyPer * 2000;
        });

       
    };

    if(y > contactSection.offsetTop){
        let contactPer = (y - contactSection.offsetTop) / contactSection.clientHeight;
        let contactPicPer = ((y - (contactSection.offsetTop + innerHeight)) / (contactSection.clientHeight)) * 2;
        for ( let i = 0; i < 8; i ++ ) {
            scene.children[i].scale.set(1 + contactPer * 100, 1 + contactPer * 100, 1);
        }

        if(y > contactSection.offsetTop + innerHeight && y < document.querySelector('#footer').offsetTop){
            videoPlane.rotation.y = Math.PI * -contactPicPer;
            videoPlane.scale.set(0 + contactPicPer * 90, 0 + contactPicPer * 90, 1);

        } else {
            videoPlane.scale.set(0,0,0);
        }
    } else {
        for ( let i = 0; i < 8; i ++ ) {
            scene.children[i].scale.set(1, 1, 1);
        }
    }
  
});

