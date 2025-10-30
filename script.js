/* Averix Solutions — Interactive JS
   - Preloader
   - Theme toggle with localStorage
   - Smooth scroll with offset
   - Navbar show/hide on scroll
   - Intersection Observer reveal
   - Project filters + modal with focus trap
   - Testimonials slider (auto + manual)
   - Contact form validation + newsletter
   - Footer year auto-update
   - Chat widget
   - Scroll progress bar
   - Typing effect
   - Send contact form to Google Sheet (Apps Script Web App)
*/

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // 0) CONFIG — Google Apps Script Web App URL
  const SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzKqFef6J-MUqOek7FpH4yNZiBKWUNAIYllJjB7PdBx1YH0mOX3Pf-fFg3B2YN3g0OW/exec';

  // 1) Preloader
  window.addEventListener('load', () => {
    const preloader = $('#preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 450);
    }
  });

  // 2) Theme toggle (default dark, remember preference)
  const themeToggle = $('#themeToggle');
  const userTheme = localStorage.getItem('theme');
  const applyTheme = (mode) => {
    document.body.classList.toggle('light', mode === 'light');
    localStorage.setItem('theme', mode);
  };
  applyTheme(userTheme || 'dark');
  if (themeToggle) {
    themeToggle.checked = document.body.classList.contains('light');
    themeToggle.addEventListener('change', () => {
      applyTheme(themeToggle.checked ? 'light' : 'dark');
    });
  }

  // 3) Smooth scrolling with header offset
  const header = $('#header');
  const headerHeight = () => (header ? header.getBoundingClientRect().height : 0);
  const smoothScrollTo = (targetId) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - headerHeight() + 4;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      if (hash.length > 1) {
        const id = hash.slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          navMenu?.classList.remove('open');
          navToggle?.setAttribute('aria-expanded', 'false');
          smoothScrollTo(id);
        }
      }
    });
  });

  // 4) Scroll progress bar (defined early to avoid reference errors)
  const progress = $('#scroll-progress');
  function updateScrollProgress() {
    if (progress) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progress.style.width = percent + '%';
    }
  }

  // 5) Navbar hide/show on scroll (reuse header from line 49)
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const currentY = window.scrollY;
    if (currentY > lastY && currentY > 120) header.classList.add('nav-up');
    else header.classList.remove('nav-up');
    lastY = currentY;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        updateScrollProgress();
      });
      ticking = true;
      setTimeout(() => (ticking = false), 50);
    }
  });

  // 5) Mobile nav toggle
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // 6) Intersection Observer reveal
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 }
  );
  $$('.reveal').forEach((el) => io.observe(el));

  // 7) Typing effect on hero headline
  const typedEl = $('#typed');
  const fullText = 'Empowering Innovation with Software, AI & Intelligent Design.';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typedEl && !prefersReduced) {
    typedEl.textContent = '';
    let idx = 0;
    const type = () => {
      if (idx <= fullText.length) {
        typedEl.textContent = fullText.slice(0, idx++);
        setTimeout(type, 28);
      }
    };
    setTimeout(type, 400);
  } else if (typedEl) {
    typedEl.textContent = fullText;
  }

  // 8) Project filters
  const filterButtons = $$('.filter-btn');
  const projectCards = $$('.project-card');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const c = (card.dataset.category || '').toLowerCase();
        const match = filter === 'all' || c.includes(filter);
        card.style.display = match ? '' : 'none';
        if (match) {
          card.classList.remove('show');
          setTimeout(() => card.classList.add('show'), 20);
        }
      });
    });
  });

  // 9) Project modal logic + focus trap
  const modal = $('#projectModal');
  const modalOverlay = $('.modal-overlay', modal);
  const modalCloseBtn = $('.modal-close', modal);
  const modalTitle = $('#modalTitle');
  const modalDesc = $('#modalDesc');
  const modalTech = $('#modalTech');
  const modalResults = $('#modalResults');
  const modalLink = $('#modalLink');
  const modalImage = $('#modalImage');
  let lastFocused = null;

  const openModal = (data) => {
    lastFocused = document.activeElement;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalTech.textContent = data.tech;
    modalResults.textContent = data.results;
    modalLink.href = data.link || '#';
    modalLink.style.display = data.link ? 'inline-flex' : 'none';
    modalImage.src = data.image;
    modalImage.alt = data.title + ' preview';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    trapFocus(modal);
  };
  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    releaseFocusTrap();
    if (lastFocused) lastFocused.focus();
  };

  projectCards.forEach((card) => {
    const open = () => {
      openModal({
        title: card.dataset.title,
        desc: card.dataset.desc,
        tech: card.dataset.tech,
        results: card.dataset.results,
        link: card.dataset.link,
        image: card.dataset.image,
      });
    };
    card.addEventListener('click', open);
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); open();
      }
    });
    $('.view-project', card)?.addEventListener('click', (e) => { e.stopPropagation(); open(); });
  });

  [modalOverlay, modalCloseBtn].forEach((el) => el?.addEventListener('click', (e) => {
    if (e.target.dataset.close === 'modal' || e.currentTarget === modalCloseBtn) closeModal();
  }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  // Focus trap helpers
  let trapHandler = null;
  function trapFocus(container) {
    const selectors = [
      'a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])',
      'button:not([disabled])', 'iframe', 'object', 'embed', '[tabindex]:not([tabindex="-1"])', '[contenteditable]'
    ];
    const focusables = $$(selectors.join(','), container).filter(el => el.offsetParent !== null);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();
    trapHandler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    container.addEventListener('keydown', trapHandler);
  }
  function releaseFocusTrap() { modal.removeEventListener('keydown', trapHandler); trapHandler = null; }

  // 10) Testimonials slider
  const track = $('#testimonialTrack');
  const slides = $$('.testimonial', track);
  const dotsWrap = $('#testimonialDots');
  const prevBtn = $('.slider-btn.prev');
  const nextBtn = $('.slider-btn.next');
  let idx = 0, timer = null;

  const renderDots = () => {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === idx) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });
  };
  const goTo = (i, manual = false) => {
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    renderDots();
    if (manual) restartAuto();
  };
  const next = () => goTo(idx + 1);
  const prev = () => goTo(idx - 1);
  const startAuto = () => timer = setInterval(next, 5000);
  const stopAuto = () => { if (timer) clearInterval(timer); };
  const restartAuto = () => { stopAuto(); startAuto(); };

  prevBtn?.addEventListener('click', () => prev());
  nextBtn?.addEventListener('click', () => next());
  $('.testimonial-slider')?.addEventListener('mouseenter', stopAuto);
  $('.testimonial-slider')?.addEventListener('mouseleave', startAuto);

  renderDots();
  startAuto();

  // 11) Contact form validation + send to Google Sheet
  const form = $('#contactForm');
  const nameEl = $('#name');
  const emailEl = $('#email');
  const messageEl = $('#message');
  const purposeEl = $('#purpose');
  const formSuccess = $('#formSuccess');

  const setError = (input, msg) => {
    const field = input.closest('.form-field');
    const err = $('.error', field);
    err.textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  };
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function sendLeadToSheet(data) {
    try {
      const body = new URLSearchParams(data).toString();
      await fetch(SHEET_WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body
      });
    } catch (err) {
      console.warn('Failed to send to sheet:', err);
    }
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    if (!nameEl.value.trim()) { setError(nameEl, 'Please enter your name'); ok = false; } else setError(nameEl);
    if (!emailEl.value.trim() || !validateEmail(emailEl.value)) { setError(emailEl, 'Enter a valid email'); ok = false; } else setError(emailEl);
    if (!messageEl.value.trim() || messageEl.value.length < 10) { setError(messageEl, 'Message should be at least 10 characters'); ok = false; } else setError(messageEl);

    if (ok) {
      const payload = {
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        purpose: purposeEl?.value || '',
        message: messageEl.value.trim(),
        page: location.href,
        userAgent: navigator.userAgent
      };

      formSuccess.hidden = false;
      formSuccess.textContent = 'Thank you! We’ll get back within 24–48 hours.';

      await sendLeadToSheet(payload);

      form.reset();
      setTimeout(() => (formSuccess.hidden = true), 5000);
    }
  });

  // 12) Newsletter subscription
  const newsletterForm = $('#newsletterForm');
  const newsletterEmail = $('#newsletterEmail');
  const newsletterMsg = $('#newsletterMsg');
  const newsletterBtn = newsletterForm?.querySelector('button[type="submit"]');

  newsletterForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = newsletterEmail.value.trim();
    
    if (!email || !validateEmail(email)) {
      newsletterMsg.textContent = 'Please enter a valid email address.';
      newsletterMsg.style.color = 'var(--danger)';
      return;
    }

    // Show loading state
    const originalText = newsletterBtn.innerHTML;
    newsletterBtn.disabled = true;
    newsletterBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';
    newsletterBtn.style.opacity = '0.7';
    newsletterBtn.style.cursor = 'not-allowed';

    // Send newsletter subscription to Google Sheet
    const payload = {
      email: email,
      type: 'newsletter',
      page: location.href,
      timestamp: new Date().toISOString()
    };

    try {
      await sendLeadToSheet(payload);
      newsletterBtn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
      newsletterBtn.style.opacity = '1';
      newsletterMsg.textContent = '✓ Check your inbox for confirmation.';
      newsletterMsg.style.color = 'var(--success)';
      newsletterForm.reset();
      
      // Reset button after delay
      setTimeout(() => {
        newsletterBtn.innerHTML = originalText;
        newsletterBtn.disabled = false;
        newsletterBtn.style.cursor = 'pointer';
        newsletterMsg.textContent = '';
      }, 5000);
    } catch (err) {
      newsletterBtn.innerHTML = originalText;
      newsletterBtn.disabled = false;
      newsletterBtn.style.opacity = '1';
      newsletterBtn.style.cursor = 'pointer';
      newsletterMsg.textContent = 'Subscription failed. Please try again.';
      newsletterMsg.style.color = 'var(--danger)';
    }
  });

  // 13) Footer year auto-update
  const yearElement = $('#year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 14) AI Chat Widget with Gemini API
  console.log('=== CHAT WIDGET INITIALIZATION ===');
  
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  console.log('Chat Elements Found:', {
    chatToggle: chatToggle ? 'YES' : 'NO',
    chatPanel: chatPanel ? 'YES' : 'NO',
    chatClose: chatClose ? 'YES' : 'NO',
    chatInput: chatInput ? 'YES' : 'NO',
    chatSend: chatSend ? 'YES' : 'NO',
    chatMessages: chatMessages ? 'YES' : 'NO'
  });

  // Gemini API Configuration
  const GEMINI_API_KEY = 'AIzaSyD_DUHYBXNGLDtBJ-ovDOlTYMMJurVCrXs';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  // Toggle chat panel
  function toggleChat() {
    console.log('toggleChat() called');
    console.log('chatPanel exists:', !!chatPanel);
    if (chatPanel) {
      console.log('Before toggle - has open class:', chatPanel.classList.contains('open'));
      chatPanel.classList.toggle('open');
      console.log('After toggle - has open class:', chatPanel.classList.contains('open'));
      if (chatPanel.classList.contains('open')) {
        console.log('Chat opened, focusing input');
        if (chatInput) chatInput.focus();
      }
    } else {
      console.error('chatPanel is null!');
    }
  }

  // Add message to chat
  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Show typing indicator
  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'typing-indicator';
    typingContent.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(typingContent);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Remove typing indicator
  function hideTyping() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // Send message to Gemini API
  async function sendToGemini(userMessage) {
    const prompt = `You are Averix AI Assistant, a helpful and knowledgeable assistant for Averix Solutions, a technology company based in Solapur, Maharashtra, India.

Company Information:
- Services: Software Development, Web Development (React, Next.js), AI & ML Solutions, Mobile App Development, Cloud Integration, Data Analytics, Student Project Mentorship
- Contact: averixsolutions001@gmail.com | +91 90285 33147
- Location: Solapur, Maharashtra, India

Your role:
- Answer questions about software development, AI/ML, web technologies, and programming
- Provide information about Averix Solutions' services
- Offer technical guidance and best practices
- Be professional, helpful, and concise
- For pricing or detailed project discussions, encourage users to contact via email or phone

User Question: ${userMessage}

Provide a helpful, clear response:`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          }
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 
             'Sorry, I couldn\'t process that. Please try again or contact us directly.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      return 'I\'m having trouble connecting right now. Please email us at averixsolutions001@gmail.com or call +91 90285 33147.';
    }
  }

  // Handle sending message
  async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    chatInput.value = '';

    // Show typing indicator
    showTyping();

    // Get AI response
    const response = await sendToGemini(message);

    // Hide typing and show response
    hideTyping();
    addMessage(response, false);
  }

  // Event listeners
  console.log('=== ATTACHING EVENT LISTENERS ===');
  
  if (chatToggle) {
    console.log('✓ Attaching click event to chatToggle');
    chatToggle.addEventListener('click', function(event) {
      console.log('🔵 CHAT BUTTON CLICKED!', event);
      toggleChat();
    });
    console.log('✓ Event listener attached successfully');
  } else {
    console.error('✗ chatToggle not found - cannot attach event listener');
  }

  if (chatClose) {
    console.log('✓ Attaching click event to chatClose');
    chatClose.addEventListener('click', () => {
      console.log('Close button clicked');
      chatPanel.classList.remove('open');
    });
  } else {
    console.warn('✗ chatClose not found');
  }

  if (chatSend) {
    console.log('✓ Attaching click event to chatSend');
    chatSend.addEventListener('click', handleSendMessage);
  } else {
    console.warn('✗ chatSend not found');
  }

  if (chatInput) {
    console.log('✓ Attaching keypress event to chatInput');
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
      }
    });
  } else {
    console.warn('✗ chatInput not found');
  }
  
  console.log('=== CHAT WIDGET SETUP COMPLETE ===');

  // 16) Services mobile flip support — tap/keyboard to flip on touch devices
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) {
    const serviceCards = $$('.service-card');
    serviceCards.forEach((card) => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('click', (e) => {
        if (e.target.closest('.learn-more')) return;
        card.classList.toggle('flipped');
      });
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      });
    });
  }
})();
