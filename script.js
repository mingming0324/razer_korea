gsap.registerPlugin(ScrollTrigger);


// Header
// 헤더 사라지고 생기기
const group = document.querySelector('.top-bar');
console.log(group.offsetWidth);

let lastScrollTop = 0;
const header = document.querySelector('.top-bar');
const threshold = 50; // 스크롤이 이 정도 이상 내려가야 반응
const minScrollDelta = 5; // 변화폭 민감도 ↑

window.addEventListener('scroll', function () {
  const currentScroll = window.scrollY;
  const delta = Math.abs(currentScroll - lastScrollTop);

  if (delta < minScrollDelta) return;

  if (currentScroll > lastScrollTop && currentScroll > threshold) {
    header.classList.add('hide-header');
  } else if (currentScroll < lastScrollTop) {
    header.classList.remove('hide-header');
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});


//main
var swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
      delay: 4000, // 자동 넘김 시간 (4초)
      disableOnInteraction: false, // 유저가 스와이프해도 자동 재생 유지
    },
    effect: 'fade', // 페이드 전환 (slide, fade, cube 등 가능)
    speed: 1000, // 전환 속도 (1초)
    allowTouchMove: true, // 스와이프 제스처 허용
});

//sec-1
var swiper = new Swiper(".mySwiper-1", {
    direction: "vertical",
    loop: true,
    autoplay: {
      delay: 4000, // 자동 넘김 시간 (4초)
      disableOnInteraction: false, // 유저가 스와이프해도 자동 재생 유지
    },
    pagination: {
    el: ".swiper-pagination",
    clickable: true,
    },
});

// sec-2
let sec_2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".sec-2",       
    start: "top 25%",   
    end: "bottom 90%",  
    scrub: 1,         // ✅ 스크롤과 동기화 (위로 올리면 역재생)    
    // markers: true 
  },
  
  defaults: {
    ease: "power4.out" 
  }
});
// 1️⃣ 첫 번째 박스 등장
sec_2.from(".sec-2_item-box1", {
  y: 150,
  opacity: 0,
  duration: .8,
  ease: "power4.out"
});

// 2️⃣ 첫 번째 박스가 위로 사라짐
sec_2.to(".sec-2_item-box1", {
  y: -200,
  opacity: 0,
  duration: .8,
  ease: "power4.inOut"
});

// 3️⃣ 두 번째 박스 자연스럽게 등장
sec_2.fromTo(".sec-2_item-box2", 
  {display: "none", opacity: 0, y: 200}, 
  {display: "flex", opacity: 1, y: 0, duration: .8, ease: "power4.out"},
  "<0.2" // 이전 애니메이션 끝나기 직전부터 살짝 겹쳐서 시작
);

// sec-3
document.addEventListener("DOMContentLoaded", function () {
    const sec3 = document.querySelector(".sec-3");

    const swiper = new Swiper(".mySwiper-2", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    on: {
        init() {
        changeBackground(this);
        },
        slideChange() {
        changeBackground(this);
        },
    },
    });

    function changeBackground(swiper) {
      // 현재 활성 슬라이드에 있는 data-bg 속성 가져오기
    const currentSlide = swiper.slides[swiper.activeIndex];
    const bg = currentSlide.getAttribute("data-bg");
    if (bg) {
        sec3.style.backgroundImage = `url(${bg})`;
    }
    }
});

// sec-4 
document.addEventListener('DOMContentLoaded', () => {
  (function(){
    const wrap   = document.querySelector('.collab-warp');
    const tabs   = document.querySelector('.tabs');
    const imgs   = Array.from(document.querySelectorAll('.collab-img .img'));
    let labels   = Array.from(tabs.querySelectorAll('label'));
    let currentImg = 0;
    let shift = 0;

    function stepSize(){
      const gap = parseFloat(getComputedStyle(tabs).rowGap) || 0; // gap 사용시 OK
      return labels[0].offsetHeight + gap;
    }

    function animateStep(dir){
      return new Promise(resolve=>{
        const h = stepSize();
        tabs.style.transition = 'transform .45s ease';
        shift += dir * (-h);
        tabs.style.setProperty('--shift', `${shift}px`);

        const onEnd = (e)=>{
          if (e.propertyName !== 'transform') return;
          tabs.removeEventListener('transitionend', onEnd);
          tabs.style.transition = 'none';
          if (dir === 1) {
            tabs.appendChild(labels[0]);
          } else {
            tabs.insertBefore(labels[labels.length-1], labels[0]);
          }
          shift -= dir * (-h);
          tabs.style.setProperty('--shift', `${shift}px`);
          labels = Array.from(tabs.querySelectorAll('label'));
          requestAnimationFrame(resolve);
        };
        tabs.addEventListener('transitionend', onEnd, {once:true});
      });
    }

    async function rotateToCenter(target){
      const mid = Math.floor(labels.length/2);
      let idx   = labels.indexOf(target);
      if (idx === -1) return;
      while (idx !== mid) {
        if (idx > mid) { await animateStep(1); idx--; }
        else           { await animateStep(-1); idx++; }
      }
    }

    function swapImage(next){
      if (next === currentImg) return;
      const curEl = imgs[currentImg];
      const nxtEl = imgs[next];
      gsap.to(curEl, {
        opacity:0, duration:.4,
        onComplete(){
          curEl.classList.remove('active');
        }
      });
      nxtEl.classList.add('active');
      gsap.fromTo(nxtEl, {opacity:0}, {opacity:1, duration:.4});
      currentImg = next;
    }

    labels[2].classList.add('active');

    labels.forEach(label=>{
      label.addEventListener('click', async ()=>{
        await rotateToCenter(label);
        document.querySelector('.tabs label.active')?.classList.remove('active');
        label.classList.add('active');
        const idx = Number(label.dataset.idx) || 0;
        swapImage(idx);
      });
    });
  })();
});
