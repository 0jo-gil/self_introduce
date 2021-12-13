const infoSection = document.querySelector('#info');
const infoSectionCon = document.querySelectorAll('#info .contents-wrap');


window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}; 

window.addEventListener('scroll', e => {
    let y = document.querySelector('html, body').scrollTop;

    if(y > infoSection.offsetTop){

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

function infoTxt(el, per, num1, num2){
    el.forEach((ele, index) => {
        ele.style.opacity = `${1 - per * num1}`;
        ele.style.transform = `translateY(${-per * num2}%)`;
    });
}


const slide_wrap = document.querySelectorAll('.slide_wrap');
// const slide_txt = slide.querySelectorAll('span');

const workListLink = document.querySelectorAll('#work .content a');

let slideNum = 0;

window.onload = () => {
    slideInit();
};

workListLink.forEach((el, index) => {
    let createCursor = document.createElement('span');
    createCursor.classList.add('cursor');

    el.addEventListener('mouseenter', ()=>{
        el.append(createCursor);
        el.querySelector('.cursor').classList.add('active');
    });

    el.addEventListener('mouseleave', () => {
        let cursor = el.querySelector('.cursor');
        cursor.remove();

    });

    el.addEventListener('mousemove', (e) => {
        let x = e.offsetX;
        let y = e.offsetY;
        let halfWid = document.querySelector('.cursor').clientWidth / 2;
        let halfHt = document.querySelector('.cursor').clientHeight / 2;

        el.querySelector('.cursor').style.top = `${y - halfHt}px`;
        el.querySelector('.cursor').style.left = `${x - halfWid}px`;
    });
});


function slideInit(){
    slide_wrap.forEach((ele, index) => {
        let slide = ele.querySelector('.slide');
        let slide_txt = slide.querySelectorAll('span');
        let slide_txt_wid = slide_txt[0].clientWidth;

        slide.style.width = `${slide_txt_wid * slide_txt.length + 100}px`;

        let slideAni = () =>{
            slideNum += 1;
            if(slideNum >= slide_txt_wid){
                slideNum = 0;
                slide.append(slide.firstElementChild);
            }
             slide.style.transform = `translate3d(${-slideNum}px,0,0)`;
            requestAnimationFrame(slideAni);
        };

        slideAni();
    });
};

