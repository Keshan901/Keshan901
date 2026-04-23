(() => {
  const isDesktop = window.matchMedia('(min-width: 900px)');

  const megaMenu = (() => {
    const menuRoot = document.getElementById('megaMenu');
    const trigger = document.querySelector('[data-mega="sections"]');
    const track = document.getElementById('megaTrack');
    const categoryButtons = Array.from(document.querySelectorAll('.category-link'));
    if (!menuRoot || !trigger || !track) return;

    let closeTimer;

    const panels = Array.from(document.querySelectorAll('.mega-panel'));
    const setActivePanel = (key) => {
      const index = panels.findIndex((panel) => panel.dataset.panel === key);
      if (index < 0) return;
      categoryButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.panel === key);
      });
      track.style.transform = `translateX(-${index * 100}%)`;
      const activePanel = panels[index];
      const panelHeight = activePanel.offsetHeight;
      menuRoot.style.maxHeight = `${panelHeight + 48}px`;
    };

    const open = () => {
      if (!isDesktop.matches) return;
      clearTimeout(closeTimer);
      menuRoot.classList.add('is-open');
      menuRoot.setAttribute('aria-hidden', 'false');
      const active = categoryButtons.find((button) => button.classList.contains('is-active'));
      setActivePanel(active?.dataset.panel || 'world');
    };

    const close = () => {
      closeTimer = setTimeout(() => {
        menuRoot.classList.remove('is-open');
        menuRoot.setAttribute('aria-hidden', 'true');
        menuRoot.style.maxHeight = '0';
      }, 140);
    };

    trigger.addEventListener('mouseenter', open);
    trigger.addEventListener('mouseleave', close);
    menuRoot.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    menuRoot.addEventListener('mouseleave', close);

    categoryButtons.forEach((button) => {
      button.addEventListener('mouseenter', () => setActivePanel(button.dataset.panel));
    });

    window.addEventListener('resize', () => {
      if (!isDesktop.matches) {
        menuRoot.classList.remove('is-open');
        menuRoot.style.maxHeight = '0';
      }
    });
  })();

  const heroSwitcher = (() => {
    const heroData = [
      {
        category: 'World',
        title: 'A new blueprint for climate-resilient city neighborhoods',
        excerpt: 'From transit to housing policy, local planners are testing low-cost resilience upgrades this year.',
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=300&q=80',
        readTime: '7 min read',
      },
      {
        category: 'Technology',
        title: 'Open-source AI teams prioritize transparency over speed',
        excerpt: 'A new wave of toolmakers is publishing model decisions in plain language for users and regulators.',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80',
        readTime: '5 min read',
      },
      {
        category: 'Business',
        title: 'Regional retailers rebuild supply chains closer to home',
        excerpt: 'Shorter procurement cycles are helping brands control inventory and reduce shipping risk.',
        image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=300&q=80',
        readTime: '6 min read',
      },
      {
        category: 'Culture',
        title: 'Why long-form podcasts are returning to scripted storytelling',
        excerpt: 'Writers and audio producers are reviving documentary formats that reward slower listening.',
        image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=300&q=80',
        readTime: '4 min read',
      },
    ];

    const heroImage = document.getElementById('heroImage');
    const heroCategory = document.getElementById('heroCategory');
    const heroTitle = document.getElementById('heroTitle');
    const heroExcerpt = document.getElementById('heroExcerpt');
    const heroList = document.getElementById('heroList');
    const heroFeature = document.getElementById('heroFeature');
    if (!heroImage || !heroList || !heroFeature) return;

    let current = 0;
    let interval;

    const renderList = () => {
      heroList.innerHTML = heroData
        .map(
          (item, index) => `
        <button type="button" class="hero-item ${index === current ? 'is-active' : ''}" data-index="${index}">
          <img src="${item.thumb}" alt="${item.title}" />
          <span>
            <small class="eyebrow">${item.category}</small>
            <strong>${item.title}</strong>
            <small class="meta">${item.readTime}</small>
          </span>
        </button>
      `
        )
        .join('');
    };

    const setHero = (index) => {
      const item = heroData[index];
      if (!item) return;
      heroFeature.classList.add('is-fading');
      window.setTimeout(() => {
        heroImage.src = item.image;
        heroCategory.textContent = item.category;
        heroTitle.textContent = item.title;
        heroExcerpt.textContent = item.excerpt;
        current = index;
        renderList();
        heroFeature.classList.remove('is-fading');
      }, 140);
    };

    const startAutoRotate = () => {
      interval = window.setInterval(() => {
        setHero((current + 1) % heroData.length);
      }, 5000);
    };

    setHero(0);
    startAutoRotate();

    heroList.addEventListener('click', (event) => {
      const item = event.target.closest('.hero-item');
      if (!item) return;
      setHero(Number(item.dataset.index));
    });

    heroList.addEventListener('mouseover', (event) => {
      const item = event.target.closest('.hero-item');
      if (!item) return;
      setHero(Number(item.dataset.index));
    });

    heroFeature.addEventListener('mouseenter', () => clearInterval(interval));
    heroFeature.addEventListener('mouseleave', startAutoRotate);
  })();

  void megaMenu;
  void heroSwitcher;
})();
