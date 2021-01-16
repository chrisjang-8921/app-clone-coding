(() => {
    let yOffset = 0; //window pageY 대신 사용할 변수
    let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = 0; //새로운 씬이 시작도는 순간

    const sceneInfo = [
        {
            //0
            type: "sticky",
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: [] //이미지 수백장 들어갈 자리 
            },
            values: {
                //투명도 시작값 - 끝값//start end - animation  시작 끝
                videoImageCount: 300, //이미지 갯수
                imageSequence: [0, 299],//이미지 순서
                canvas_opacity: [1, 0, {start: 0.9, end: 1 }], //1번째 이미지 자연스럽게 사라지기 적용 
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], //초기값, 최종값 
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
            }
        },
        {
            // 1
            type: 'normal',
            // heightNum: 5, // type normal에서는 필요 없음
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
                content: document.querySelector('#scroll-section-1 .description')
            }
        },
        {       
            // 2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
                canvas: document.querySelector('#video-canvas-1'),
                context: document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages: [] //이미지 수백장 들어갈 자리 
            },
            values: {
                videoImageCount: 960, //이미지 갯수
                imageSequence: [0, 959],//이미지 순서
                canvas_opacity_in: [0, 1, {start: 0, end: 0.1 }], //자연스럽게 들어오기
                canvas_opacity_out: [1, 0, {start: 0.95, end: 1 }], //자연스럽게 사라지기
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
                messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
                messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
                messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
                messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
                messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
                messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
                messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
                messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
                messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
                pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
            }
        },
        {
            //3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption')
            },
            values: {
            }
        }
    ];

    //이미치 처리 함수 
    function setCanvasImages() {
        let imgElem;
        for(let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            // imgElem = document.createElement('img');
            imgElem = new Image();
            imgElem.src = `./video/001/IMG_${6726 + i }.jpg`;
            sceneInfo[0].objs.videoImages.push(imgElem); //
        }
        let imgElem2;
        for(let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            // imgElem = document.createElement('img');
            imgElem2 = new Image();
            imgElem2.src = `./video/002/IMG_${7027 + i }.jpg`;
            sceneInfo[2].objs.videoImages.push(imgElem2); //
        }
    }
    setCanvasImages();

    function setLayout() {
        //각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            //sticky - normal 구분
            if(sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } 
            else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight; //컨테이너의 높이 가져와서 셋팅
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        //로드시 currentScene 셋팅
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;

        for (let i = 0; i< sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset) { 
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id',`show-scene-${currentScene}`);    
        const heightRatio = window.innerHeight / 1080; // 윈도우창 /캔버스 원래 Height
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`; //1 == 100% 의미
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`; 
    }
  
    function calcValues(values, currentYOffset) {
        let rv; 
        //현재 스크린에서 얼마나 스크롤 되었는지 비율을 구한다.
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if(values.length === 3) { 
            //Start ~ end 사이의 에니메이션 실행
            //구체적인 시작점 구하기
            //| 구간1 | 구간2 | (현재스크롤위치 [스타트][엔드]) 구간3| 구간4|
            const partScrollStart = values[2].start * scrollHeight; // 구간3에서 10%가 시작점  
            const partScrollEnd = values[2].end * scrollHeight; //구간 3에서 20% 완료지점
            const partScrollHeight = partScrollEnd - partScrollStart;

            //범위안 
            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0]; //투명도 적용
            //범위전
            }else if( currentYOffset < partScrollStart){
                rv = values[0]; //opacity 값  == 완전투명 
            }else if(currentYOffset > partScrollEnd){
                rv = values[1]; //투명도 없음 
            }
        }
        else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
    
        return rv; 
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight; //현재씬의 scrollHeight
        //현재 스크롤 위치 - 이전 스크롤 height / 
        // | 구간1 | 구간2 | ==> prevScrollHeight
        // | 구간1 | 구간2 | : 구간3| ==>  :표시가 현재 yoffset()
        // | 구간1 | 구간2 | : 구간3| ==> 구간 3 이 scrollHeight 의미 ==> 그러면 scrollRatio 비율 나옴
        const scrollRatio = currentYOffset / scrollHeight; // yoffset/현재씬의 scrollHeight ;

        switch (currentScene){
            case 0:
                // console.log('0 play');
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset)); 
                //캔버스에 그리기
                objs.context.drawImage(objs.videoImages[sequence], 0, 0); // 그릴이미지, x, y 위치
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
            break;
            
            case 2:
                // console.log('2 play');
                let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset)); 
                //캔버스에 그리기
                objs.context.drawImage(objs.videoImages[sequence2], 0, 0); // 그릴이미지, x, y 위치
                
                if (scrollRatio <= 0.5 ) { //화면을 그냥 절반으로 나눠서 적용해 버림
                    //in(등장)
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                }
                else{
                    //out(아웃)
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }
                
                if (scrollRatio <= 0.32) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.67) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }

                if (scrollRatio <= 0.93) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }
            break;

            case 3:
                //가로 세로 모두 꽉 차게 하기 위해서 여기서 세팅(계산 필요)
                
                
                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        //활성화시킬 Scene의 번호 결정
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }
        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
        if (currentScene === 0) return; //바운스 있을경우 종료
            currentScene--; 
            document.body.setAttribute('id',`show-scene-${currentScene}`);
        }

        if(enterNewScene) return;
        playAnimation();
    }   


    window.addEventListener("scroll", () => {
        yOffset = window.pageYOffset; //현재 스크롤한 위치
        scrollLoop();
    });
    
    window.addEventListener("load", () => {
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);//처음 로딩시 이미지 보여주기 셋팅
    });

  window.addEventListener("resize", setLayout);

})();
