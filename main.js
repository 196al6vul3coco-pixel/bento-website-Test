/* -----------------------------
     JavaScript 功能區
  ------------------------------ */
  
document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------
     1. 進場動畫
  ------------------------------ */
  const bentoCards = document.querySelectorAll('.bento-card');
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  bentoCards.forEach(card => cardObserver.observe(card));

  /* -----------------------------
     2. 視差卡片
  ------------------------------ */
  const parallaxCard = document.querySelector('.parallax-card');
  if(parallaxCard){
    window.addEventListener('scroll', () => {
      parallaxCard.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    });
  }

  /* -----------------------------
     3. 可展開卡片
  ------------------------------ */
  document.querySelectorAll('.expandable-card .toggle-btn')
    .forEach(btn => btn.addEventListener('click', () => {
      btn.closest('.expandable-card').classList.toggle('active');
    }));

  /* -----------------------------
     4. 表單送出
  ------------------------------ */
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('表單已送出！💌');
    });
  }

  /* -----------------------------
     5. 卡片互動（光暈 / 翻轉）
  ------------------------------ */
  bentoCards.forEach(card => {

    // tracking-card 光點追蹤
    if(card.classList.contains('tracking-card')){
      const light = card.querySelector('.light');
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        light.style.left = `${e.clientX - rect.left}px`;
        light.style.top = `${e.clientY - rect.top}px`;
        light.style.opacity = 1;
      });
      card.addEventListener('mouseleave', () => light.style.opacity = 0);
    }

    // glow-card 光暈效果
    if(card.classList.contains('glow-card')){
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--y', `${e.clientY - rect.top}px`);
      });
    }

    // flip-card 翻轉
    if(card.classList.contains('flip-card')){
      card.addEventListener('mouseenter', () => card.classList.add('flipped'));
      card.addEventListener('mouseleave', () => card.classList.remove('flipped'));
    }

  });

  /* -----------------------------
     6. 篩選卡片
  ------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  filterButtons.forEach(btn =>
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      bentoCards.forEach(card => {
        card.style.display =
          (filter === 'all' || card.dataset.category === filter)
          ? 'flex'
          : 'none';
      });
    })
  );

  /* -----------------------------
     7. 技能條動畫
  ------------------------------ */
  document.querySelectorAll('.stats-card .skill').forEach(skill => {
    const fill = skill.querySelector('.fill');
    const percent = skill.dataset.percent;
    fill.style.width = '0';

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          fill.style.width = percent + '%';
        }
      });
    }, { threshold: 0.5 });

    observer.observe(skill);
  });

  /* -----------------------------
     8. 彩蛋 Modal
  ------------------------------ */
  const eggCard = document.getElementById('easter-egg-card');
  const modal = document.getElementById('egg-modal');

  if(eggCard && modal){
    const closeBtn = modal.querySelector('.close');

    eggCard.addEventListener('click', () => modal.style.display = 'flex');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');

    window.addEventListener('click', e => {
      if(e.target === modal) modal.style.display = 'none';
    });
  }

  /* -----------------------------
     9. 主題切換
  ------------------------------ */
  const toggleBtn = document.getElementById("theme-toggle");

  function applyTheme(theme){
    document.body.classList.remove("light","dark");
    document.body.classList.add(theme);

    toggleBtn.style.transform = "scale(0.2) rotate(180deg)";
    setTimeout(()=>{
      toggleBtn.textContent = theme === "dark" ? "🌙" : "☀️";
      toggleBtn.style.transform = "scale(1) rotate(0deg)";
    }, 200);

    localStorage.setItem("theme", theme);
  }

  let savedTheme = localStorage.getItem("theme") ||
                   (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  applyTheme(savedTheme);

  toggleBtn.addEventListener("click", () =>
    applyTheme(document.body.classList.contains("dark") ? "light" : "dark")
  );

  /* -----------------------------
     10. 自動生成 .clX 顏色 class
  ------------------------------ */
  function generateGradientClasses(max = 20){
    const style = document.createElement('style');
    let css = '';
    for(let i = 1; i <= max; i++){
      css += `
        .cl${i} {
          background: linear-gradient(135deg,
            var(--cl${i}-start, #ccc),
            var(--cl${i}-end, #999)
          );
        }
      `;
    }
    style.innerHTML = css;
    document.head.appendChild(style);
  }
  generateGradientClasses(20);

  /* -----------------------------
     11. data-href 按鈕跳轉
  ------------------------------ */
  document.querySelectorAll('button[data-href]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.href;
      if(url && url !== "https://"){
        window.open(url, '_blank');
      } else {
        alert("連結尚未設定！");
      }
    });
  });

    /* -----------------------------
     12. youtube影片彈跳
  ------------------------------ */
  // 選取所有有 data-youtube 的卡片
  const cards = document.querySelectorAll('.bento-card[data-youtube]');
  const videoModal = document.getElementById('video-container');
  const videoWrapper = document.getElementById('video-wrapper');
  const closeBtn = document.getElementById('close-video');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.getAttribute('data-youtube');
      videoWrapper.innerHTML = `<iframe width="100%" height="100%" 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
        </iframe>`;
      videoModal.classList.add('active');
    });
  });

  // 關閉影片
  closeBtn.addEventListener('click', () => {
    videoWrapper.innerHTML = '';
    videoModal.classList.remove('active');
  });

  // 點空白處也可以關閉
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      videoWrapper.innerHTML = '';
      videoModal.classList.remove('active');
    }
  });

      /* -----------------------------
     13. youtube影片彈跳-共用彈窗播放
  ------------------------------ */



});

