(() => {
  let yOffset = 0; //window pageY 대신 사용할 변수
  let prevScrollHeight = 0; //현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; //현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)

  const sceneInfo = [
    {
      //0
      type: "sticky",
      heighNum: 5, //브라우저 높이의 5배로 ScrollHeigh 세팅
      scrollHeigh: 0,
      objs: {
        //html 객체 모아놓기
        container: document.querySelector("#scroll-section-0"),
      },
    },
    {
      //1
      type: "normal",
      heighNum: 5,
      scrollHeigh: 0,
      objs: {
        //html 객체 모아놓기
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      //2
      type: "sticky",
      heighNum: 5,
      scrollHeigh: 0,
      objs: {
        //html 객체 모아놓기
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      //3
      type: "sticky",
      heighNum: 5,
      scrollHeigh: 0,
      objs: {
        //html 객체 모아놓기
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  function setLayout() {
    //각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeigh = sceneInfo[i].heighNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height =
        "${sceneInfo[i].scrollHeight}px";
    }
    //console.log(sceneInfo);
  }

  function scrollLoop() {
    //활성화시킬 Scene의 번호 결정
    prevScrollHeight = 0;
    for (let i = 0; i < curre; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeigh;
    }
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeigh) {
      currentScene++;
    }
    if (yOffset < prevScrollHeight) {
      if (currentScene === 0) return; //바운스 있을경우 종료
      currentScene--;
    }
  }

  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset; //현재 스크롤한 위치
    scrollLoop();
  });
})();