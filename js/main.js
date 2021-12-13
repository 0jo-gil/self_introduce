const infoSection = document.querySelector('#info');
const infoSectionCon = document.querySelectorAll('#info .contents-wrap');

// 윈도우 로딩 전 스크롤 상단
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}; 

// 스크롤 이벤트
window.addEventListener('scroll', e => {
    let y = document.querySelector('html, body').scrollTop;

    if(y > infoSection.offsetTop){
        // info 텍스트 이벤트
        infoSectionCon.forEach((el, index) => {
            if(y > window.pageYOffset + el.getBoundingClientRect().top){
                let infoPer = ((y - (window.pageYOffset + el.getBoundingClientRect().top)) / el.clientHeight) * 2;
                let infoOpc1 = el.children[0].querySelectorAll('.opc1');
                let infoOpc2 = el.children[0].querySelectorAll('.opc2');
                let infoOpc3 = el.children[0].querySelectorAll('.opc3');
                let infoOpc4 = el.children[0].querySelectorAll('.opc4');

                infoTxt(infoOpc1, infoPer, 2, 40);
                infoTxt(infoOpc2, infoPer, 3, 100);
                infoTxt(infoOpc3, infoPer, 5, 120);
                infoTxt(infoOpc4, infoPer, 4, 80);
            }
        });
    
    };

    if(y >  window.pageYOffset + document.querySelector('#story .link_wrap').getBoundingClientRect().top){
        document.querySelector('#story .list').classList.add('active');
    }

    if(y == document.body.scrollHeight){
        document.querySelector('.contact_slide_wrap').classList.add('active');
    }
});

// info 텍스트 함수
function infoTxt(el, per, num1, num2){
    el.forEach((ele, index) => {
        ele.style.opacity = `${1 - per * num1}`;
        ele.style.transform = `translateY(${-per * num2}%)`;
    });
}


const slide_wrap = document.querySelectorAll('.slide_wrap');
const workListLink = document.querySelectorAll('#work .content a');


let slideNum = 0;

window.onload = () => {
    slideInit();
};

// 마우스 커서 생성 및 제거 이벤트
workListLink.forEach((el, index) => {
    // 마우스 커서 태그 생성
    let createCursor = document.createElement('span');
    // 마우스 커서 클래스명 추가
    createCursor.classList.add('cursor');

    // 링크 마우스 진입시
    el.addEventListener('mouseenter', ()=>{
        // 링크 자식요소 커서 태그 생성
        el.append(createCursor);
        el.querySelector('.cursor').classList.add('active');
    });

    // 링크 마우스 벗어날시
    el.addEventListener('mouseleave', () => {
        let cursor = el.querySelector('.cursor');
        // 커서 태그 제거
        cursor.remove();
    });

    // 링크 내 마우스 움직일시
    el.addEventListener('mousemove', (e) => {
        // 마우스 x 좌표 변수
        let x = e.offsetX;
        // 마우스 y 좌표 변수
        let y = e.offsetY;
        let halfWid = document.querySelector('.cursor').clientWidth / 2;
        let halfHt = document.querySelector('.cursor').clientHeight / 2;

        // 마우스 위치에 따른 움직임 이벤트
        el.querySelector('.cursor').style.top = `${y - halfHt}px`;
        el.querySelector('.cursor').style.left = `${x - halfWid}px`;
    });
});


// 텍스트 슬라이드 설정 및 이벤트 함수
function slideInit(){
    slide_wrap.forEach((ele, index) => {
        let slide = ele.querySelector('.slide');
        let slide_txt = slide.querySelectorAll('span');
        let slide_txt_wid = slide_txt[0].clientWidth;

        // 슬라이더 너비 값 할당
        slide.style.width = `${slide_txt_wid * slide_txt.length + 40}px`;

        let slideAni = () =>{
            slideNum += 1;
            // slideNum이 슬라이드 텍스트 너비를 초과할시
            if(slideNum >= slide_txt_wid){
                // slideNum 값 0으로 초기화
                slideNum = 0;
                // 슬라이더 첫번째 자식 요소를 맨뒤로 보내고
                slide.append(slide.firstElementChild);
            }
            // 슬라이더 움직임 애니메이션
            slide.style.transform = `translate3d(${-slideNum}px,0,0)`;
            requestAnimationFrame(slideAni);
        };

        slideAni();
    });
};

