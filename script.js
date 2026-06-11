document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupThemeToggle();
    setupSectionNav();
    updateFooterYear();
    setupQuoteCalculator();
    renderPortfolioCards(portfolioData);
    setupPortfolioFilters();
    setupContactForm();
    setupFaqAccordion();
    setupCounters();
    setupRevealEffects();
    setupModalListeners();
});

// ─── Mobile Menu ───────────────────────────────────────────────
function setupMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav    = document.querySelector('.nav-links');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        const isOpen = nav.classList.contains('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.textContent = isOpen ? '✕' : '☰';
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.textContent = '☰';
        });
    });
}

// ─── Footer Year ───────────────────────────────────────────────
function updateFooterYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll('.footer-year').forEach((el) => { el.textContent = year; });
}

// ─── Quote Calculator ──────────────────────────────────────────
function setupQuoteCalculator() {
    const form   = document.getElementById('quoteForm');
    const result = document.getElementById('quoteResult');
    if (!form || !result) return;

    const basePrices  = { landing: 1800, business: 3500, portfolio: 2500, ecommerce: 5200, 'digital-card': 980 };
    const comboPrices = { landing: 2500, business: 3500, portfolio: 2500 };

    const pageCountLabel = form.querySelector('label[for="pageCount"]');
    const comboDetails   = document.getElementById('comboDetails');

    const updateFormVisibility = () => {
        const isDigital = form.serviceType.value === 'digital-card';
        if (comboDetails)   comboDetails.hidden = !isDigital;
        if (pageCountLabel) pageCountLabel.textContent = isDigital ? 'Estimated website pages for combo deal' : 'Estimated Pages';
    };

    const updateQuote = () => {
        const serviceType = form.serviceType.value;
        const pageCount   = Math.max(Number(form.pageCount.value) || 1, 1);
        let total = basePrices[serviceType] || 0;

        if (serviceType === 'digital-card' && form.comboDeal && form.comboDeal.checked) {
            const comboType = form.comboWebsiteType.value;
            total += comboPrices[comboType] || comboPrices.landing;
            total -= 600;
            total += Math.max(pageCount - 1, 0) * 250;
        } else if (serviceType !== 'digital-card') {
            total += Math.max(pageCount - 1, 0) * 250;
        }

        if (form.branding.checked)    total += 450;
        if (form.seo.checked)         total += 600;
        if (form.maintenance.checked) total += 350;

        const note = serviceType === 'digital-card'
            ? 'Digital business cards start from R980. Check the combo option to add a discounted website bundle.'
            : 'This is a quick estimate to help you budget before requesting a final quote.';

        result.innerHTML = `<strong>Estimated total: R${total.toLocaleString()}</strong><span>${note}</span>`;
    };

    form.addEventListener('input', () => { updateFormVisibility(); updateQuote(); });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateQuote();
        result.innerHTML += '<br><strong style="color:var(--blue)">Great choice!</strong> Head to the contact page to request your final price.';
        showToast('Instant estimate updated!');
    });

    updateFormVisibility();
    updateQuote();
}

// ─── Portfolio Data ─────────────────────────────────────────────
const portfolioData = [
    {
        category: 'brand',
        tag: 'Brand Launch',
        title: 'Glow Beauty Studio',
        description: 'A soft and modern website layout for a beauty brand focused on trust, elegance, and online bookings.',
        features: ['Service highlights section', 'Clear contact & booking CTA', 'Polished mobile-first design'],
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&auto=format&fit=crop&q=80'
    },
    {
        category: 'business',
        tag: 'Corporate Site',
        title: 'NextPath Consulting',
        description: 'A structured multi-page business website built to communicate professionalism and expertise.',
        features: ['Service overview pages', 'Strong calls to action', 'Professional layout rhythm'],
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'
    },
    {
        category: 'portfolio',
        tag: 'Creative Portfolio',
        title: 'Mpho Visuals',
        description: 'A portfolio concept that puts the work first while keeping the overall experience stylish and simple.',
        features: ['Gallery-style presentation', 'Personal brand focus', 'Easy enquiry path'],
        image: 'https://images.unsplash.com/photo-1452457807411-4979b707c5be?w=600&auto=format&fit=crop&q=80'
    }
];

function renderPortfolioCards(data) {
    const container = document.getElementById('projectCards');
    if (!container) return;

    container.innerHTML = data.map((item, index) => `
        <article class="project-card reveal-in" data-category="${item.category}" data-index="${index}">
            <img class="project-card-img" src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="project-card-body">
                <span class="project-tag">${item.tag}</span>
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <ul class="feature-list">
                    ${item.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <button class="btn btn-outline modal-trigger" type="button" style="font-size:0.88rem;padding:0.6rem 1.1rem">View Details →</button>
            </div>
        </article>
    `).join('');

    container.querySelectorAll('.modal-trigger').forEach((btn, i) => {
        btn.addEventListener('click', () => openPortfolioModal(data[i]));
    });

    // Re-run reveal on new cards
    setupRevealEffects();
}

// ─── Portfolio Filters ──────────────────────────────────────────
function setupPortfolioFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            buttons.forEach((b) => b.classList.remove('active'));
            button.classList.add('active');

            document.querySelectorAll('.project-card[data-category]').forEach((card) => {
                const matches = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !matches);
            });
        });
    });
}

// ─── FAQ Accordion ─────────────────────────────────────────────
function setupFaqAccordion() {
    document.querySelectorAll('.faq-item').forEach((item) => {
        const button = item.querySelector('.faq-question');
        if (!button) return;
        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach((i) => {
                i.classList.remove('open');
                const s = i.querySelector('.faq-question span');
                if (s) s.textContent = '+';
            });
            item.classList.toggle('open', !isOpen);
            const sym = button.querySelector('span');
            if (sym) sym.textContent = item.classList.contains('open') ? '−' : '+';
        });
    });
}

// ─── Count-up Counters ─────────────────────────────────────────
function setupCounters() {
    const counters = document.querySelectorAll('.count-up');
    if (!counters.length) return;

    const animate = (counter) => {
        const target   = Number(counter.dataset.target || 0);
        const suffix   = counter.dataset.suffix || '';
        const duration = 1400;
        const start    = performance.now();
        const step = (ts) => {
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = `${Math.round(eased * target)}${suffix}`;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach((c) => observer.observe(c));
}

// ─── Reveal on Scroll ──────────────────────────────────────────
function setupRevealEffects() {
    const els = document.querySelectorAll('.reveal-in:not(.visible)');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    els.forEach((el) => observer.observe(el));
}

// ─── Toast ─────────────────────────────────────────────────────
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── Theme Toggle ──────────────────────────────────────────────
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const setMode = (mode) => {
        if (mode === 'dark') {
            document.body.classList.add('dark-mode');
            toggle.textContent = '☀ Light';
        } else {
            document.body.classList.remove('dark-mode');
            toggle.textContent = '🌙 Dark';
        }
        try { localStorage.setItem('tsTheme', mode); } catch(e) {}
    };

    let saved;
    try { saved = localStorage.getItem('tsTheme'); } catch(e) {}
    if (!saved) saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setMode(saved);

    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        setMode(isDark ? 'dark' : 'light');
        showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`);
    });
}

// ─── Section Nav Highlight ─────────────────────────────────────
function setupSectionNav() {
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const links    = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.45 });

    sections.forEach((s) => observer.observe(s));
}

// ─── Contact Form ──────────────────────────────────────────────
function setupContactForm() {
    const form   = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form || !status) return;

    try {
        const saved = JSON.parse(localStorage.getItem('tsWebStudioLead') || 'null');
        if (saved) {
            form.name.value    = saved.name    || '';
            form.email.value   = saved.email   || '';
            form.service.value = saved.service || 'Landing Page';
            form.message.value = saved.message || '';
        }
    } catch (e) {}

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name    = form.name.value.trim();
        const email   = form.email.value.trim();
        const service = form.service.value;
        const message = form.message.value.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (name.length < 2 || !emailOk || message.length < 10) {
            status.className = 'form-status error';
            status.textContent = 'Please enter a valid name, email address, and a few project details.';
            return;
        }

        const lead = { name, email, service, message, createdAt: new Date().toISOString() };
        try { localStorage.setItem('tsWebStudioLead', JSON.stringify(lead)); } catch(e) {}

        const subject     = encodeURIComponent(`${service} enquiry from ${name}`);
        const body        = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${message}`);
        const mailLink    = `mailto:hello@tswebstudio.com?subject=${subject}&body=${body}`;
        const waText      = encodeURIComponent(`Hi TS Web Studio, my name is ${name}. I need a ${service}. Email: ${email}. Details: ${message}`);
        const waLink      = `https://wa.me/27784078575?text=${waText}`;

        status.className = 'form-status success';
        status.innerHTML = `Thanks ${name}! Your enquiry is ready. Choose how to send it:`;

        const wrap = document.createElement('div');
        wrap.className = 'status-links';

        const emailBtn = document.createElement('a');
        emailBtn.href = mailLink;
        emailBtn.className = 'btn btn-primary';
        emailBtn.textContent = 'Open Email Draft';

        const waBtn = document.createElement('a');
        waBtn.href = waLink;
        waBtn.className = 'btn btn-outline';
        waBtn.target = '_blank';
        waBtn.rel = 'noopener noreferrer';
        waBtn.textContent = 'Send on WhatsApp';

        wrap.appendChild(emailBtn);
        wrap.appendChild(waBtn);
        status.appendChild(wrap);

        showToast('Message ready — email or WhatsApp it now!');
    });
}

// ─── Portfolio Modal ───────────────────────────────────────────
function openPortfolioModal(item) {
    const modal       = document.getElementById('portfolioModal');
    const titleEl     = document.getElementById('modalTitle');
    const descEl      = document.querySelector('.modal-description');
    const featureEl   = document.querySelector('.modal-features');
    if (!modal || !titleEl || !descEl || !featureEl) return;

    titleEl.textContent   = item.title;
    descEl.textContent    = item.description;
    featureEl.innerHTML   = item.features.map(f => `<li>${f}</li>`).join('');

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function setupModalListeners() {
    const modal    = document.getElementById('portfolioModal');
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closePortfolioModal);
    if (modal)    modal.addEventListener('click', (e) => { if (e.target === modal) closePortfolioModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) closePortfolioModal();
    });
}
