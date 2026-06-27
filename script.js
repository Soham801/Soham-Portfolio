/**
 * SOHAM.AI - PORTFOLIO SYSTEM SCRIPTS
 * Complete implementation of the Interactive Neural Canvas, Theme Engine, and System Diagnostic Logs.
 */

// Unified global mouse coordinates state tracking system to optimize render loops
const globalMouse = {
    x: null,
    y: null
};

window.addEventListener('mousemove', (e) => {
    globalMouse.x = e.clientX;
    globalMouse.y = e.clientY;
}, { passive: true });

window.addEventListener('mouseout', () => {
    globalMouse.x = null;
    globalMouse.y = null;
});

document.addEventListener('DOMContentLoaded', () => {
    initializeThemeEngine();
    initializeSpotlight();
    initializeNeuralBackground();
    initializeDiagnosticConsole();
    initializeAboutSection();
    initializePipelineAnimations();
    initializeTimeline();
    initializeSecondaryProjects();
    initializeAIAssistant();
    initializeContactSection();
});

/* ==========================================================================
   THEME SWITCHING ENGINE (Console vs Executive Mode)
   ========================================================================== */

function initializeThemeEngine() {
    const toggleBtn = document.getElementById('theme-toggle');
    const label = toggleBtn.querySelector('.toggle-label');
    const body = document.body;

    toggleBtn.addEventListener('click', () => {
        if (body.classList.contains('console-mode')) {
            body.classList.remove('console-mode');
            body.classList.add('executive-mode');
            label.textContent = 'EXECUTIVE';
            toggleBtn.setAttribute('aria-label', 'Switch to Developer Console Mode');
        } else {
            body.classList.remove('executive-mode');
            body.classList.add('console-mode');
            label.textContent = 'CONSOLE';
            toggleBtn.setAttribute('aria-label', 'Switch to Executive Print Mode');
        }
        // Force update canvas colors on theme change
        window.dispatchEvent(new CustomEvent('themechanged'));
    });
}

/* ==========================================================================
   CURSOR SPOTLIGHT GLOW
   ========================================================================== */

function initializeSpotlight() {
    const spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    // Smooth easing interpolation
    const ease = 0.08;

    function updateSpotlight() {
        if (globalMouse.x !== null && globalMouse.y !== null) {
            targetX = globalMouse.x;
            targetY = globalMouse.y;
            spotlight.style.opacity = '1';
        } else {
            spotlight.style.opacity = '0';
        }
        // Linear Interpolation (Lerp) for smooth lag effect
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;

        spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(updateSpotlight);
    }

    updateSpotlight();
}

/* ==========================================================================
   INTERACTIVE NEURAL NETWORK BACKGROUND (HTML5 Canvas Particles)
   ========================================================================== */

function initializeNeuralBackground() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    
    // Scale particle count for mobile performance
    let maxParticles = window.innerWidth < 768 ? 40 : 100;
    let connectionDistance = 110;
    
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    // Color definitions corresponding to HSL variables
    let themeColors = {
        node: 'rgba(34, 211, 238, 0.4)', // Electric Cyan
        line: 'rgba(34, 211, 238, 0.08)',
        nodeExecutive: 'rgba(30, 30, 35, 0.15)', // Subdued Slate
        lineExecutive: 'rgba(30, 30, 35, 0.03)'
    };

    let isExecutive = document.body.classList.contains('executive-mode');

    // Update active state when theme changes
    window.addEventListener('themechanged', () => {
        isExecutive = document.body.classList.contains('executive-mode');
    });



    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        maxParticles = window.innerWidth < 768 ? 35 : 110;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.vx = reducedMotion ? 0 : (Math.random() - 0.5) * 0.45;
            this.vy = reducedMotion ? 0 : (Math.random() - 0.5) * 0.45;
            this.radius = Math.random() * 2.5 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Cursor push force
            if (globalMouse.x !== null && globalMouse.y !== null) {
                let dx = this.x - globalMouse.x;
                let dy = this.y - globalMouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    // Push direction vectors
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = isExecutive ? themeColors.nodeExecutive : themeColors.node;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw nodes
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // Draw connecting edges
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    // Node proximity controls alpha opacity gradient
                    let alpha = (connectionDistance - dist) / connectionDistance;
                    let strokeColor = isExecutive
                        ? themeColors.lineExecutive.replace('0.03', (alpha * 0.05).toString())
                        : themeColors.line.replace('0.08', (alpha * 0.15).toString());
                        
                    ctx.strokeStyle = strokeColor;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();
    animate();
}

/* ==========================================================================
   SYSTEM DIAGNOSTICS LOG WRITER (Console Simulation)
   ========================================================================== */

function initializeDiagnosticConsole() {
    const output = document.getElementById('log-output');
    if (!output) return;

    // Log diagnostic steps array
    const logs = [
        { text: 'SYSTEM: Initializing proctor pose inference parameters...', type: 'muted', delay: 100 },
        { text: '[OK] Compiled TensorRT proctor engines to CUDA targets (FP16)', type: 'success', delay: 400 },
        { text: 'SYSTEM: Resolving multi-document embedding search channels...', type: 'muted', delay: 200 },
        { text: '[OK] Initialized hybrid vector queries on Qdrant local cluster', type: 'success', delay: 500 },
        { text: '[OK] Loaded sentence-transformers MiniLM Cross-Encoder re-ranker', type: 'success', delay: 400 },
        { text: 'SYSTEM: Bootstrapping diagnostic metrics logs...', type: 'muted', delay: 200 },
        { text: '[STATS] Pose proctor metrics: 90.2% Precision // 45ms latency', type: 'info', delay: 600 },
        { text: '[STATS] Hybrid RAG recall performance: 95.4% hit rate // <0.8s query', type: 'info', delay: 400 },
        { text: 'SYSTEM: Mounting career checkpoints...', type: 'muted', delay: 100 },
        { text: '[OK] Pur. BSc CS MGM Univ (Hons) // Intern @ BuildAI // Winner InnovateYou', type: 'success', delay: 500 },
        { text: 'SYSTEM: All deep learning subsystems nominal. Sandbox standby.', type: 'warning', delay: 300 }
    ];

    let logIndex = 0;

    function typeLogEntry() {
        if (logIndex >= logs.length) {
            // Append terminal prompt ready for user interaction
            const interactiveLine = document.createElement('div');
            interactiveLine.className = 'console-line';
            interactiveLine.innerHTML = `
                <span class="user-prompt">soham@ai:~$</span>
                <span class="command-active">playground --init</span>
                <span class="cursor" aria-hidden="true"></span>
            `;
            output.appendChild(interactiveLine);
            return;
        }

        const entry = logs[logIndex];
        const logLine = document.createElement('div');
        logLine.className = 'console-line';
        
        let typeClass = 'log-entry';
        if (entry.type === 'success') typeClass = 'log-success';
        if (entry.type === 'alert') typeClass = 'log-alert';
        if (entry.type === 'warning') typeClass = 'log-warning';
        if (entry.type === 'info') typeClass = 'log-info';
        if (entry.type === 'muted') typeClass = 'log-muted';

        logLine.innerHTML = `
            <span class="${typeClass}">➔ ${entry.text}</span>
        `;
        
        output.appendChild(logLine);
        
        // Auto scroll console container to follow new inputs
        const consoleBody = document.querySelector('.console-body');
        consoleBody.scrollTop = consoleBody.scrollHeight;

        logIndex++;
        setTimeout(typeLogEntry, entry.delay);
    }

    // Delay start of console simulation slightly for load pacing
    setTimeout(typeLogEntry, 600);

    // Primary CTA Button actions - simulates initializing playground
    const ctaBtn = document.getElementById('cta-initialize');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            const btnText = ctaBtn.querySelector('.btn-text');
            btnText.textContent = 'LOADING PLAYGROUND...';
            ctaBtn.classList.add('animate-pulse');
            
            // Append simulated deploy log in console
            const deployLog = document.createElement('div');
            deployLog.className = 'console-line log-info';
            deployLog.innerHTML = '<span>➔ Sandbox environment mounted. Initializing interactive playground...</span>';
            output.appendChild(deployLog);

            setTimeout(() => {
                btnText.textContent = 'EXPLORE_PROJECTS ➔';
                ctaBtn.classList.remove('animate-pulse');
                
                // Scroll smoothly to projects section
                const playgroundSec = document.getElementById('playground');
                if (playgroundSec) {
                    playgroundSec.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1200);
        });
    }
}

/* ==========================================================================
   ABOUT / BENTO GRID INTERACTIONS
   ========================================================================== */

function initializeAboutSection() {
    const cards = document.querySelectorAll('.bento-card');
    
    // 1. Mouse Coordinate Spotlights on Bento Cards
    cards.forEach(card => {
        let rect = null;
        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
        });
        card.addEventListener('mousemove', (e) => {
            if (!rect) {
                rect = card.getBoundingClientRect();
            }
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 2. Scroll Reveal & Stats Count-up & Gauge Fills
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
                
                // Trigger stats animations inside this section
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    animateNumber(stat);
                });

                // Trigger progress gauge animations
                const gauges = entry.target.querySelectorAll('.gauge-fill');
                gauges.forEach(gauge => {
                    const percent = gauge.style.getPropertyValue('--percent') || '0%';
                    gauge.style.width = percent;
                });

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // Numeric Count-up Utility
    function animateNumber(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        if (isNaN(target)) return; // Bypass non-numeric elements (like Rank 32)
        
        let start = 0;
        const duration = 1200; // ms
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Cubic Ease Out Easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * target);
            
            element.textContent = currentVal.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }
}

/* ==========================================================================
   INTERACTIVE PIPELINE ANIMATIONS
   ========================================================================== */

function initializePipelineAnimations() {
    const pipelines = document.querySelectorAll('.pipeline-flow');

    pipelines.forEach(pipeline => {
        const nodes = pipeline.querySelectorAll('.pipeline-node');
        let activeIndex = 0;
        let timer = null;

        function startFlowCycle() {
            timer = setInterval(() => {
                nodes[activeIndex].classList.remove('active');
                activeIndex = (activeIndex + 1) % nodes.length;
                nodes[activeIndex].classList.add('active');
            }, 2600);
        }

        function stopFlowCycle() {
            clearInterval(timer);
        }

        startFlowCycle();

        nodes.forEach((node, index) => {
            node.addEventListener('mouseenter', () => {
                stopFlowCycle();
                nodes.forEach(n => n.classList.remove('active'));
                node.classList.add('active');
                activeIndex = index;
            });

            node.addEventListener('mouseleave', () => {
                startFlowCycle();
            });
        });
    });
}

/* ==========================================================================
   AI-THEMED INTERACTIVE TIMELINE
   ========================================================================== */

function initializeTimeline() {
    const container = document.querySelector('.timeline-container');
    const progressBar = document.querySelector('.timeline-connector-progress');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.timeline-node-card');

    if (!container || !progressBar) return;

    // 1. Scroll-Driven Progress Connector Line
    function updateTimelineProgress() {
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Progress starts when the top of the container enters the middle of the viewport
        const startOffset = rect.top - (viewportHeight / 1.7);
        const totalHeight = rect.height;

        let progress = 0;
        if (startOffset < 0) {
            progress = Math.min(Math.abs(startOffset) / totalHeight * 100, 100);
        }

        progressBar.style.height = `${progress}%`;
    }

    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateTimelineProgress();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    updateTimelineProgress(); // Run once initially

    // 2. Timeline Filters
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });

            // Re-calculate height progress relative to filters hide
            setTimeout(updateTimelineProgress, 350);
        });
    });
}

/* ==========================================================================
   INTERACTIVE NEURAL SKILL CLUSTER GRAPH
   ========================================================================== */

// Skills matrix cluster function removed in favor of static high-readability skills inventory section.

/* ==========================================================================
   FLOATING AI ASSISTANT CHAT ENGINE
   ========================================================================== */

function initializeAIAssistant() {
    const widget = document.getElementById('ai-assistant-widget');
    const trigger = document.getElementById('assistant-trigger');
    const chatWindow = document.getElementById('assistant-chat-window');
    const closeBtn = document.getElementById('chat-close-btn');
    const form = document.getElementById('chat-input-form');
    const input = document.getElementById('chat-user-input');
    const messagesArea = document.getElementById('chat-messages-area');
    const actionChips = document.querySelectorAll('.action-chip');

    if (!widget || !trigger || !chatWindow || !form || !input || !messagesArea) return;

    // 1. Toggle Chat Window Active State
    function toggleChat(forceClose = false) {
        const isActive = chatWindow.classList.contains('active');
        if (isActive || forceClose) {
            chatWindow.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
            chatWindow.setAttribute('aria-hidden', 'true');
        } else {
            chatWindow.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
            chatWindow.setAttribute('aria-hidden', 'false');
            input.focus();
        }
    }

    trigger.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(true));

    // Handle clicks outside the chat window to close it
    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target) && chatWindow.classList.contains('active')) {
            toggleChat(true);
        }
    });

    // 2. Chat Query Response Engine (Local Mock LLM Agent)
    const qaDatabase = {
        skills: 'Soham Deshmukh specializes in: \n• Programming: Python, Dart, C++ \n• Frameworks: PyTorch, OpenCV, HuggingFace, FastAPI, Flask \n• AI/ML: Computer Vision, Langchain, RAG, Vector Search, Neural Networks, Agentic Systems \n• Mobile/Cloud: Flutter, Firebase, Supabase, Google Cloud.',
        cheat: 'The AI Cheat Detection System processes RTSP video streams on CUDA targets using optimized TensorRT engines (FP16 quantization). Calculates gaze-direction cross product similarity and skeletal shoulder vector ratios to detect exam room anomalies under 45ms latency with 90.2% precision.',
        rag: 'The Advanced RAG Notes Assistant implements hybrid vector search in local Qdrant collections. Features recursive token-overlapping splitter chunking and MiniLM cross-encoder candidate re-ranking, achieving a 95.4% retrieval recall hit rate with under 0.8s query latencies.',
        bot: 'The event-driven Discord automation bot handles 1,000+ commands daily, automating pipeline operational processes and routing tasks across 4 client company servers with 99.9% uptime.',
        filler: 'The Intelligent-Form-AutoFiller uses OCR frame segment mapping and LLMs to parse unstructured scan files and populate corporate database spreadsheets with 98% field accuracy.',
        hackathon: 'Soham led Pune\'s InnovateYou Hackathon team to a 1st place prototype demo in 24 hours, and was selected in the Top 32 nationwide teams out of 5,000+ teams competing at the VJ Hackathon Hyderabad.',
        experience: 'Soham worked as an AI Research Analyst at BuildAI (optimizing deep learning pipelines and driving operational workflow integrations across 4 companies) and as a Flutter Developer Intern at MeMatdar (delivering clean BLoC architecture sprints 20% ahead of schedule).',
        education: 'He is pursuing a Bachelor of Science (Hons.) in Computer Science from MGM University, with a graduation date expected in June 2027.',
        future: 'Soham\'s future trajectory is focused on Applied AI Engineering: designing zero-friction production-grade systems, optimizing model inference speeds, and orchestrating event-driven agentic architectures at scale.',
        resume: 'Initializing download parameters for: Soham-Resume-June-V4.pdf ...'
    };

    function appendMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `message message-${sender}`;
        bubble.innerHTML = `<div class="message-bubble"></div>`;
        messagesArea.appendChild(bubble);
        
        const bubbleContent = bubble.querySelector('.message-bubble');
        if (text) {
            bubbleContent.textContent = text;
        }
        
        messagesArea.scrollTop = messagesArea.scrollHeight;
        return bubbleContent;
    }

    function processQuery(queryText) {
        if (!queryText.trim()) return;

        // Append user prompt bubble
        appendMessage(queryText, 'user');

        const cleaned = queryText.toLowerCase();
        let answer = '';
        let triggerDownload = false;

        // Keyword router
        if (cleaned.includes('skill') || cleaned.includes('tech') || cleaned.includes('tool') || cleaned.includes('language')) {
            answer = qaDatabase.skills;
        } else if (cleaned.includes('cheat') || cleaned.includes('detector') || cleaned.includes('gaze') || cleaned.includes('vision') || cleaned.includes('camera')) {
            answer = qaDatabase.cheat;
        } else if (cleaned.includes('rag') || cleaned.includes('notes') || cleaned.includes('pdf') || cleaned.includes('vector')) {
            answer = qaDatabase.rag;
        } else if (cleaned.includes('bot') || cleaned.includes('discord') || cleaned.includes('route')) {
            answer = qaDatabase.bot;
        } else if (cleaned.includes('filler') || cleaned.includes('ocr') || cleaned.includes('form') || cleaned.includes('autofill')) {
            answer = qaDatabase.filler;
        } else if (cleaned.includes('hackathon') || cleaned.includes('win') || cleaned.includes('rank') || cleaned.includes('competition')) {
            answer = qaDatabase.hackathon;
        } else if (cleaned.includes('experience') || cleaned.includes('intern') || cleaned.includes('work') || cleaned.includes('job')) {
            answer = qaDatabase.experience;
        } else if (cleaned.includes('education') || cleaned.includes('university') || cleaned.includes('college') || cleaned.includes('study')) {
            answer = qaDatabase.education;
        } else if (cleaned.includes('goal') || cleaned.includes('future') || cleaned.includes('vision') || cleaned.includes('career')) {
            answer = qaDatabase.future;
        } else if (cleaned.includes('resume') || cleaned.includes('pdf') || cleaned.includes('download')) {
            answer = qaDatabase.resume;
            triggerDownload = true;
        } else {
            answer = "I parsed your query coordinates but couldn't locate a matching system weight. Try asking about /skills, /experience, /cheat-detector, or type 'download resume'.";
        }

        // Simulate typing animation
        const agentBubble = appendMessage('', 'agent');
        let index = 0;
        const speed = 6; // ms per char

        function type() {
            if (index < answer.length) {
                if (answer.charAt(index) === '\n') {
                    agentBubble.innerHTML += '<br>';
                } else {
                    agentBubble.textContent += answer.charAt(index);
                }
                index++;
                messagesArea.scrollTop = messagesArea.scrollHeight;
                setTimeout(type, speed);
            } else {
                if (triggerDownload) {
                    setTimeout(() => {
                        window.open('Soham-Resume-June-V4.pdf', '_blank');
                    }, 800);
                }
            }
        }

        setTimeout(type, 300);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value;
        if (!text) return;
        processQuery(text);
        input.value = '';
    });

    // 3. Quick Action Chips click triggers
    actionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.getAttribute('data-question');
            processQuery(question);
        });
    });
}

/* ==========================================================================
   CONTACT SECTION AND MODALS ENGINE
   ========================================================================== */

function initializeContactSection() {
    const calendarBtn = document.getElementById('calendar-trigger-btn');
    const calendarModal = document.getElementById('calendar-modal');
    const calendarClose = document.getElementById('calendar-close-btn');
    const calendarConfirm = document.getElementById('calendar-confirm-btn');
    
    const agentShortcut = document.getElementById('btn-agent-trigger');
    const chatWindow = document.getElementById('assistant-chat-window');
    const trigger = document.getElementById('assistant-trigger');
    const chatInput = document.getElementById('chat-user-input');

    const dispatchForm = document.getElementById('dispatch-form');
    const submitBtn = dispatchForm ? dispatchForm.querySelector('.dispatch-submit-btn') : null;

    if (!calendarModal) return;

    // 1. Calendar Schedule Modal triggers
    function closeModal() {
        calendarModal.classList.remove('active');
        calendarModal.setAttribute('aria-hidden', 'true');
        if (calendarBtn) calendarBtn.focus();
    }

    if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
            calendarModal.classList.add('active');
            calendarModal.setAttribute('aria-hidden', 'false');
            setTimeout(() => {
                if (calendarClose) calendarClose.focus();
            }, 50);
        });
    }

    if (calendarClose) {
        calendarClose.addEventListener('click', closeModal);
    }

    calendarModal.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            closeModal();
        }
    });

    calendarModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // A11y Focus Trap
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    calendarModal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        const focusable = calendarModal.querySelectorAll(focusableSelector);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    });

    const dayButtons = calendarModal.querySelectorAll('.day-btn');
    dayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dayButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const timeButtons = calendarModal.querySelectorAll('.time-btn');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            timeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    if (calendarConfirm) {
        calendarConfirm.addEventListener('click', () => {
            const activeDay = calendarModal.querySelector('.day-btn.active').textContent;
            const activeTime = calendarModal.querySelector('.time-btn.active').textContent;
            
            closeModal();

            if (chatWindow && trigger) {
                if (!chatWindow.classList.contains('active')) {
                    chatWindow.classList.add('active');
                    trigger.setAttribute('aria-expanded', 'true');
                    chatWindow.setAttribute('aria-hidden', 'false');
                }
                
                setTimeout(() => {
                    const messagesArea = document.getElementById('chat-messages-area');
                    const confirmationBubble = document.createElement('div');
                    confirmationBubble.className = 'message message-agent';
                    confirmationBubble.innerHTML = `
                        <div class="message-bubble" style="border-color: var(--accent-gold);">
                            📅 <strong>CAL.COM SCHEDULER DISPATCH:</strong><br>
                            Coordination brief successfully initialized for:<br>
                            <strong>July ${activeDay}, 2026 at ${activeTime}</strong>.<br>
                            Soham will contact you at your coordinates email.
                        </div>
                    `;
                    messagesArea.appendChild(confirmationBubble);
                    messagesArea.scrollTop = messagesArea.scrollHeight;
                }, 400);
            }
        });
    }

    // 2. AI Assistant Shortcut card trigger
    if (agentShortcut && chatWindow && trigger && chatInput) {
        agentShortcut.addEventListener('click', () => {
            if (!chatWindow.classList.contains('active')) {
                chatWindow.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                chatWindow.setAttribute('aria-hidden', 'false');
            }
            chatInput.value = 'What is Soham\'s availability for internships?';
            chatInput.focus();
        });
    }

    // 3. Dispatch form submit feedback (AJAX Formspree with validation & spam filtering)
    if (dispatchForm && submitBtn) {
        const btnText = submitBtn.querySelector('.btn-text');
        const statusEl = document.getElementById('dispatch-status');
        
        let lastSubmissionTime = 0;
        
        dispatchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Honeypot validation
            const honeypot = document.getElementById('form-honeypot');
            if (honeypot && honeypot.value.trim() !== '') {
                // Silent drop for automated bots
                if (statusEl) {
                    statusEl.className = 'dispatch-status status-success';
                    statusEl.textContent = '[OK] Transmission completed successfully.';
                }
                dispatchForm.reset();
                return;
            }
            
            // Client-side rate limiting (30 seconds restriction)
            const now = Date.now();
            if (now - lastSubmissionTime < 30000) {
                if (statusEl) {
                    statusEl.className = 'dispatch-status status-error';
                    statusEl.textContent = '[ERR] Transmission rate limit active. Please wait 30s.';
                }
                return;
            }
            
            // Read input values
            const nameVal = document.getElementById('form-name').value.trim();
            const emailVal = document.getElementById('form-email').value.trim();
            const messageVal = document.getElementById('form-message').value.trim();
            
            // Empty submissions validation
            if (!nameVal || !emailVal || !messageVal) {
                if (statusEl) {
                    statusEl.className = 'dispatch-status status-error';
                    statusEl.textContent = '[ERR] Missing required fields.';
                }
                return;
            }
            
            // Email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                if (statusEl) {
                    statusEl.className = 'dispatch-status status-error';
                    statusEl.textContent = '[ERR] Invalid email address.';
                }
                return;
            }
            
            // Lock submit triggers and configure loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('animate-pulse');
            if (btnText) btnText.textContent = 'DISPATCHING...';
            
            if (statusEl) {
                statusEl.className = 'dispatch-status status-loading';
                statusEl.textContent = '[WAIT] Transmitting secure message...';
            }
            
            // Collect Form data parameters
            const formData = new FormData(dispatchForm);
            formData.append('timestamp', new Date().toISOString());
            
            try {
                const response = await fetch(dispatchForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    lastSubmissionTime = Date.now();
                    
                    if (statusEl) {
                        statusEl.className = 'dispatch-status status-success';
                        statusEl.textContent = '[OK] Transmission completed successfully.';
                    }
                    
                    if (btnText) {
                        btnText.textContent = 'TRANSMISSION DISPATCHED ✓';
                    }
                    
                    const originalBackground = submitBtn.style.background;
                    const originalColor = submitBtn.style.color;
                    submitBtn.style.background = 'linear-gradient(135deg, var(--status-success) 0%, #1E822D 100%)';
                    submitBtn.style.color = '#FFFFFF';
                    
                    dispatchForm.reset();
                    
                    // Re-enable interface controls after display timer
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('animate-pulse');
                        if (btnText) btnText.textContent = 'DISPATCH_TRANSMISSION ➔';
                        submitBtn.style.background = originalBackground;
                        submitBtn.style.color = originalColor;
                    }, 4000);
                    
                } else {
                    throw new Error('Formspree returned failure status');
                }
            } catch (err) {
                if (statusEl) {
                    statusEl.className = 'dispatch-status status-error';
                    statusEl.textContent = '[ERR] Transmission failed. Please retry.';
                }
                
                if (btnText) btnText.textContent = 'DISPATCH_FAILED ✖';
                
                const originalBackground = submitBtn.style.background;
                const originalColor = submitBtn.style.color;
                submitBtn.style.background = 'linear-gradient(135deg, var(--status-error) 0%, #B81D1D 100%)';
                submitBtn.style.color = '#FFFFFF';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('animate-pulse');
                    if (btnText) btnText.textContent = 'DISPATCH_TRANSMISSION ➔';
                    submitBtn.style.background = originalBackground;
                    submitBtn.style.color = originalColor;
                }, 3000);
            }
        });
    }

    // 4. Contact Card Spotlights Trackers
    const channelCards = document.querySelectorAll('.channel-card');
    channelCards.forEach(card => {
        let rect = null;
        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
        });
        card.addEventListener('mousemove', (e) => {
            if (!rect) {
                rect = card.getBoundingClientRect();
            }
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   SECONDARY PROJECTS BENTO GRID EXPANSION
   ========================================================================== */
function initializeSecondaryProjects() {
    const expandBtn = document.getElementById('expand-projects-btn');
    const collapsedCards = document.querySelectorAll('.collapsed-project');
    
    if (!expandBtn || !collapsedCards.length) return;
    
    expandBtn.addEventListener('click', () => {
        const isExpanded = expandBtn.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            // Collapse
            collapsedCards.forEach(card => {
                card.classList.add('hidden');
            });
            expandBtn.setAttribute('aria-expanded', 'false');
            expandBtn.querySelector('span').textContent = '[EXPAND_DIRECTORY // VIEW_ALL_PROJECTS]';
            expandBtn.querySelector('svg').style.transform = 'rotate(0deg)';
        } else {
            // Expand
            collapsedCards.forEach(card => {
                card.classList.remove('hidden');
            });
            expandBtn.setAttribute('aria-expanded', 'true');
            expandBtn.querySelector('span').textContent = '[COLLAPSE_DIRECTORY // SHOW_FEWER]';
            expandBtn.querySelector('svg').style.transform = 'rotate(180deg)';
        }
    });
}
