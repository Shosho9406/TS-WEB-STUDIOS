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
});

function setupMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');

    if (!toggle || !nav) {
        return;
    }

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

function updateFooterYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll('.footer-year').forEach((item) => {
        item.textContent = year;
    });
}

function setupQuoteCalculator() {
    const form = document.getElementById('quoteForm');
    const result = document.getElementById('quoteResult');

    if (!form || !result) {
        return;
    }

    const basePrices = {
        landing: 1800,
        business: 3500,
        portfolio: 2500,
        ecommerce: 5200
    };

    const updateQuote = () => {
        const serviceType = form.serviceType.value;
        const pageCount = Math.max(Number(form.pageCount.value) || 1, 1);

        let total = basePrices[serviceType] || 0;
        total += Math.max(pageCount - 1, 0) * 250;

        if (form.branding.checked) total += 450;
        if (form.seo.checked) total += 600;
        if (form.maintenance.checked) total += 350;

        result.innerHTML = `<strong>Estimated total:</strong> R${total.toLocaleString()}<br><span>This instant estimate helps you budget before requesting a final quote.</span>`;
    };

    form.addEventListener('input', updateQuote);
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        updateQuote();
        result.innerHTML += '<br><strong>Great choice.</strong> Use the contact page to request your final price.';
        showToast('Instant estimate updated!');
    });

    updateQuote();
}

const portfolioData = [
    {
        category: 'all',
        tag: 'Brand Launch',
        title: 'Glow Beauty Studio',
        description: 'A soft and modern website layout for a beauty brand focused on trust, elegance, and bookings.',
        features: ['Service highlights', 'Clear contact section', 'Polished mobile design']
    },
    {
        category: 'business',
        tag: 'Corporate Site',
        title: 'NextPath Consulting',
        description: 'A structured multi-page business website built to communicate professionalism and expertise.',
        features: ['Service overview pages', 'Strong calls to action', 'Professional layout rhythm']
    },
    {
        category: 'portfolio',
        tag: 'Creative Portfolio',
        title: 'Mpho Visuals',
        description: 'A portfolio concept that puts the work first while keeping the overall experience stylish and simple.',
        features: ['Gallery-style presentation', 'Personal brand focus', 'Easy enquiry path']
    }
];

function renderPortfolioCards(data) {
    const container = document.getElementById('projectCards');
    if (!container) return;

    container.innerHTML = data.map((item, index) => `
        <article class="project-card" data-category="${item.category}" data-index="${index}">
            <span class="project-tag">${item.tag}</span>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <ul class="feature-list">
                ${item.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="btn secondary modal-trigger" type="button">View Details</button>
        </article>
    `).join('');

    // Add click handlers for modal
    container.querySelectorAll('.modal-trigger').forEach((button, index) => {
        button.addEventListener('click', () => openPortfolioModal(data[index]));
    });
}

function setupPortfolioFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card[data-category]');    

    if (!buttons.length || !cards.length) {
        return;
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            buttons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');

            cards.forEach((card) => {
                const matches = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !matches);
            });
        });
    });
}

function setupFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach((item) => {
        const button = item.querySelector('.faq-question');
        if (!button) {
            return;
        }

        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            items.forEach((entry) => entry.classList.remove('open'));
            item.classList.toggle('open', !isOpen);

            const symbol = button.querySelector('span');
            if (symbol) {
                symbol.textContent = item.classList.contains('open') ? '−' : '+';
            }
        });
    });
}

function setupCounters() {
    const counters = document.querySelectorAll('.count-up');

    if (!counters.length) {
        return;
    }

    const animateCounter = (counter) => {
        const target = Number(counter.dataset.target || 0);
        const suffix = counter.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();

        const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            counter.textContent = `${Math.round(progress * target)}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.35 });

    counters.forEach((counter) => observer.observe(counter));
}

function setupRevealEffects() {
    const elements = document.querySelectorAll(
        '.banner-card, .card, .mini-card, .info-panel, .project-card, .testimonial, .sample-card, .showcase-box, .contact-box, .contact-form, .stat-item, .faq-item'
    );

    if (!elements.length) {
        return;
    }

    elements.forEach((element) => element.classList.add('reveal-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        return;
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) {
        return;
    }

    const setMode = (mode) => {
        const body = document.body;
        if (mode === 'dark') {
            body.classList.add('dark-mode');
            toggle.textContent = 'Light Mode';
        } else {
            body.classList.remove('dark-mode');
            toggle.textContent = 'Dark Mode';
        }
        localStorage.setItem('tsTheme', mode);
    };

    // Get saved preference, or detect from device settings
    let saved = localStorage.getItem('tsTheme');
    if (!saved) {
        // Auto-detect based on device preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        saved = prefersDark ? 'dark' : 'light';
    }
    setMode(saved);

    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        setMode(isDark ? 'dark' : 'light');
        showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`);
    });
}

function setupSectionNav() {
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

    if (!sections.length || !navLinks.length) {
        return;
    }

    const sectionMap = new Map(sections.map((section) => [section.id, section]));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { threshold: 0.45 });

    sections.forEach((section) => observer.observe(section));
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    if (!form || !status) {
        return;
    }

    try {
        const savedLead = JSON.parse(localStorage.getItem('tsWebStudioLead') || 'null');
        if (savedLead) {
            form.name.value = savedLead.name || '';
            form.email.value = savedLead.email || '';
            form.service.value = savedLead.service || 'Landing Page';
            form.message.value = savedLead.message || '';
        }
    } catch (error) {
        console.warn('Unable to load saved lead:', error);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const service = form.service.value;
        const message = form.message.value.trim();
        const emailPattern = /^[^\s@]+@[^ -\s@]+\.[^\s@]+$/;

        if (name.length < 2 || !emailPattern.test(email) || message.length < 10) {
            status.className = 'form-status error';
            status.textContent = 'Please enter a valid name, email address, and a few project details.';
            return;
        }

        const lead = {
            name,
            email,
            service,
            message,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('tsWebStudioLead', JSON.stringify(lead));

        const subject = encodeURIComponent(`${service} enquiry from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${message}`
        );
        const mailLink = `mailto:hello@tswebstudio.com?subject=${subject}&body=${body}`;
        const whatsappText = encodeURIComponent(
            `Hi TS Web Studio, my name is ${name}. I need a ${service}. Email: ${email}. Details: ${message}`
        );
        const whatsappLink = `https://wa.me/27784078575?text=${whatsappText}`;

        status.className = 'form-status success';
        status.innerHTML = `
            Thanks ${name}! Your enquiry is ready. Choose how you want to send it:
            <div class="status-links">
                <a href="${mailLink}" class="btn primary">Open Email Draft</a>
                <a href="${whatsappLink}" class="btn secondary" target="_blank" rel="noreferrer">Send on WhatsApp</a>
            </div>`;
        showToast('Your lead is saved! Email or WhatsApp sender is ready.');
    });
}

function openPortfolioModal(item) {
    const modal = document.getElementById('portfolioModal');
    const title = document.getElementById('modalTitle');
    const description = document.querySelector('.modal-description');
    const features = document.querySelector('.modal-features');

    if (!modal || !title || !description || !features) return;

    title.textContent = item.title;
    description.textContent = item.description;
    features.innerHTML = item.features.map(feature => `<li>${feature}</li>`).join('');

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

// Add modal event listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('portfolioModal');
    const closeBtn = document.querySelector('.modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closePortfolioModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePortfolioModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closePortfolioModal();
        }
    });
});
