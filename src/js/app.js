/**
 * Shiv Restaurant — Core Application Logic
 * Interactive 3D Menu, Tilt Cards, Lightbox, Atmosphere Controller & Form Handlers
 * Vanilla JavaScript (ES Module)
 */

import { Scene3D } from './scene3d.js';
import { MENU_ITEMS } from './menu-data.js';

class App {
  constructor() {
    this.scene3d = null;
    this.activeDish = MENU_ITEMS[0];
    this.init();
  }

  init() {
    // 1. Initialize 3D Scene
    try {
      this.scene3d = new Scene3D('webgl-canvas-container');
    } catch (err) {
      console.warn('Three.js 3D initialization fallback:', err);
    }

    // 2. Render Dynamic Components
    this.renderDishSelector();
    this.renderMenuCards();
    this.renderGalleryGrid();

    // 3. Bind UI Interactivity
    this.bindHeaderScroll();
    this.bindMobileNav();
    this.bindAtmosphereController();
    this.bindLightbox();
    this.bindContactActions();
    this.bindInquiryForm();
    this.bindTiltEffects();
    this.bindScrollObserver();
  }

  // --- Render Dish Selector in 3D Menu Section ---
  renderDishSelector() {
    const listEl = document.getElementById('dish-selector-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    MENU_ITEMS.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `dish-selector-btn ${item.id === this.activeDish.id ? 'active' : ''}`;
      btn.setAttribute('data-dish-id', item.id);

      btn.innerHTML = `
        <div class="selector-left">
          <span class="selector-index">${String(index + 1).padStart(2, '0')}</span>
          <div class="selector-info">
            <h4>${item.name}</h4>
            <p>${item.category} · ${item.spiceLevel}</p>
          </div>
        </div>
        <div class="selector-right">
          <span>View 3D</span>
        </div>
      `;

      btn.addEventListener('click', () => {
        this.selectDish(item.id);
      });

      listEl.appendChild(btn);
    });

    this.updateSpotlightCard(this.activeDish);
  }

  selectDish(dishId) {
    const dish = MENU_ITEMS.find((d) => d.id === dishId);
    if (!dish) return;

    this.activeDish = dish;

    // Update active button state
    document.querySelectorAll('.dish-selector-btn').forEach((btn) => {
      const id = btn.getAttribute('data-dish-id');
      btn.classList.toggle('active', id === dishId);
    });

    // Update spotlight display
    this.updateSpotlightCard(dish);

    // Notify 3D scene
    if (this.scene3d) {
      this.scene3d.focusDish(dishId);
    }
  }

  updateSpotlightCard(dish) {
    const spotlightEl = document.getElementById('menu-spotlight-card');
    if (!spotlightEl) return;

    spotlightEl.innerHTML = `
      <div class="spotlight-media-frame">
        <img src="${dish.image}" alt="${dish.name} — Shiv Restaurant" loading="lazy" />
        <span class="spotlight-badge">${dish.category}</span>
      </div>

      <div class="spotlight-header">
        <h3 class="spotlight-dish-name">${dish.name}</h3>
      </div>

      <div class="spotlight-meta-row">
        <span>Spice Profile: ${dish.spiceLevel}</span>
        <span aria-hidden="true">·</span>
        <span>Authentic Recipe</span>
      </div>

      <p class="spotlight-desc">${dish.longDescription}</p>

      <div class="spotlight-ingredients-wrap">
        <div class="spotlight-ingredients-title">Key Spices & Ingredients</div>
        <div class="ingredients-list">
          ${dish.ingredients.map((ing) => `<span>${ing}</span>`).join('')}
        </div>
      </div>

      <div class="spotlight-footer">
        <div class="pairing-note">${dish.pairingRecommendation}</div>
        <button type="button" class="btn btn-outline btn-sm zoom-dish-btn" data-img="${dish.image}" data-name="${dish.name}">
          Inspect Image
        </button>
      </div>
    `;

    // Re-bind zoom button
    const zoomBtn = spotlightEl.querySelector('.zoom-dish-btn');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        this.openLightbox(dish.image, dish.name, dish.category);
      });
    }
  }

  // --- Render Responsive 3D Tilt Menu Cards Grid ---
  renderMenuCards() {
    const gridEl = document.getElementById('menu-cards-grid');
    if (!gridEl) return;

    gridEl.innerHTML = '';
    MENU_ITEMS.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'menu-card tilt-target';
      card.setAttribute('data-dish-id', item.id);

      card.innerHTML = `
        <div class="card-image-box">
          <img src="${item.image}" alt="${item.name} at Shiv Restaurant" loading="lazy" />
        </div>
        <div class="card-body">
          <div class="card-meta-line">${item.category} · ${item.spiceLevel}</div>
          <h3 class="card-title">${item.name}</h3>
          <p class="card-description">${item.description}</p>
          <div class="card-footer">
            <span class="card-spice">${item.preparationNote}</span>
            <button type="button" class="card-inspect-btn" data-dish-id="${item.id}">
              Focus 3D
            </button>
          </div>
        </div>
      `;

      // Click to focus in 3D
      const focusBtn = card.querySelector('.card-inspect-btn');
      if (focusBtn) {
        focusBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectDish(item.id);
          const menuSection = document.getElementById('menu');
          if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }

      card.addEventListener('click', () => {
        this.selectDish(item.id);
      });

      gridEl.appendChild(card);
    });
  }

  // --- Render Food Showcase Gallery Grid ---
  renderGalleryGrid() {
    const galleryEl = document.getElementById('gallery-grid');
    if (!galleryEl) return;

    const galleryItems = [
      {
        span: 'col-span-6',
        name: 'Royal Kadai Paneer',
        tag: 'High Heat Iron Karahi Preparation',
        image: '/src/assets/images/dish_kadai_paneer_1791443877999.jpg'
      },
      {
        span: 'col-span-6',
        name: 'Sizzling Daal Tadka',
        tag: 'Golden Lentils with Pure Desi Ghee Sizzle',
        image: '/src/assets/images/dish_daal_tadka_1791443891919.jpg'
      },
      {
        span: 'col-span-4',
        name: 'Aromatic Mix Veg Curry',
        tag: 'Fresh Farm Produce Slow Simmered',
        image: '/src/assets/images/dish_mix_veg_1791443902039.jpg'
      },
      {
        span: 'col-span-4',
        name: 'Crisp Tawa Aloo Paratha',
        tag: 'Served with Melting Artisanal Butter',
        image: '/src/assets/images/dish_aloo_paratha_1791443913904.jpg'
      },
      {
        span: 'col-span-4',
        name: 'Crisp Pakodas & Kulhad Chai',
        tag: 'Authentic Uttar Pradesh Evening Pairing',
        image: '/src/assets/images/dish_pakoda_chai_1791443923768.jpg'
      }
    ];

    galleryEl.innerHTML = '';
    galleryItems.forEach((g) => {
      const itemEl = document.createElement('div');
      itemEl.className = `gallery-item ${g.span} tilt-target`;

      itemEl.innerHTML = `
        <img src="${g.image}" alt="${g.name}" loading="lazy" />
        <div class="gallery-overlay">
          <h4 class="gallery-item-name">${g.name}</h4>
          <span class="gallery-item-tag">${g.tag}</span>
        </div>
      `;

      itemEl.addEventListener('click', () => {
        this.openLightbox(g.image, g.name, g.tag);
      });

      galleryEl.appendChild(itemEl);
    });
  }

  // --- 3D Card Tilt Micro-Interactions ---
  bindTiltEffects() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    const targets = document.querySelectorAll('.tilt-target');
    targets.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6.5;
        const rotateY = ((x - centerX) / centerX) * 6.5;

        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // --- Atmosphere Preset Controller ---
  bindAtmosphereController() {
    const buttons = document.querySelectorAll('.preset-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mood = btn.getAttribute('data-mood');
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        if (this.scene3d && mood) {
          this.scene3d.setAtmosphereMood(mood);
        }
        this.showToast(`Atmosphere set to ${mood.toUpperCase()} mode`);
      });
    });
  }

  // --- Lightbox Modal ---
  bindLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.classList.remove('active');
      });
    }
  }

  openLightbox(imgSrc, name, category) {
    const modal = document.getElementById('lightbox-modal');
    const imgEl = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const tagEl = document.getElementById('lightbox-category');

    if (!modal || !imgEl || !titleEl) return;

    imgEl.src = imgSrc;
    imgEl.alt = name;
    titleEl.textContent = name;
    if (tagEl) tagEl.textContent = category;

    modal.classList.add('active');
  }

  // --- Sticky Header Scroll ---
  bindHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      },
      { passive: true }
    );
  }

  // --- Mobile Drawer Navigation ---
  bindMobileNav() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close-btn');

    if (!toggleBtn || !drawer || !backdrop) return;

    const openDrawer = () => {
      drawer.classList.add('open');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    document.querySelectorAll('.mobile-nav-item').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // --- Contact Actions & Copy to Clipboard ---
  bindContactActions() {
    const copyPhoneBtn = document.getElementById('copy-phone-btn');
    const copyEmailBtn = document.getElementById('copy-email-btn');

    if (copyPhoneBtn) {
      copyPhoneBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('8832556011');
        this.showToast('Phone number 8832556011 copied to clipboard');
      });
    }

    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('ry9218977@gmail.com');
        this.showToast('Email ry9218977@gmail.com copied to clipboard');
      });
    }

    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // --- Inquiry Form Submission Handler ---
  bindInquiryForm() {
    const form = document.getElementById('inquiry-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('inq-name');
      const phoneInput = document.getElementById('inq-phone');
      const guestsInput = document.getElementById('inq-guests');
      const notesInput = document.getElementById('inq-notes');

      const name = nameInput?.value || 'Valued Guest';
      const phone = phoneInput?.value || '8832556011';
      const guests = guestsInput?.value || 'Family Table';
      const notes = notesInput?.value || '';

      const subject = encodeURIComponent(`Dining Inquiry from ${name} (${guests})`);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nParty Size: ${guests}\nSpecial Requests: ${notes}\n\nSent from Shiv Restaurant Online Showcase`
      );

      window.location.href = `mailto:ry9218977@gmail.com?subject=${subject}&body=${body}`;

      this.showToast('Opening email client to connect with Shiv Restaurant.');
      form.reset();
    });
  }

  // --- Toast Notification ---
  showToast(message) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast?.classList.remove('show');
    }, 3200);
  }

  // --- Active Nav Link Scroll Spy ---
  bindScrollObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              link.classList.toggle('active', href === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((s) => observer.observe(s));
  }
}

// Start application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
