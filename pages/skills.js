// Load header
        fetch("../header.html")
            .then(response => response.text())
            .then(data => {
                document.getElementById("header-container").innerHTML = data;
                const hamburger = document.querySelector(".hamburger");
                const navLinks = document.querySelector(".nav-links");
                if (hamburger && navLinks) {
                    hamburger.addEventListener("click", () => {
                        navLinks.classList.toggle("active");
                        hamburger.classList.toggle("toggle");
                    });
                }
            })
            .catch(err => console.error("Error loading header:", err));
       
        // Skill Data
        const skillData = {
            programming: [
                { name: "C++", percent: 65, color: "#ffc669", icon: "devicon-cplusplus-plain" },
                { name: "C", percent: 50, color: "#ff5347", icon: "fa-solid fa-c" },
                { name: "Python", percent: 5, color: "#3572A5", icon: "fa-brands fa-python" }
            ],
            web: [
                { name: "HTML", percent: 50, color: "#4d29ff", icon: "fa-brands fa-html5" },
                { name: "CSS", percent: 45, color: "#fada21", icon: "fa-brands fa-css3-alt" }
            ],
            app: [
                { name: "Flutter", percent: 65, color: "#ff43d0", icon: "devicon-flutter-plain" },
                { name: "Dart", percent: 70, color: "#3dff3d", icon: "devicon-dart-plain" }
            ],
            database: [
                { name: "SQL", percent: 75, color: "#00758f", icon: "fa-solid fa-database" },
                { name: "MongoDB", percent: 65, color: "#4DB33D", icon: "devicon-mongodb-plain-wordmark colored" },
                { name: "Firebase", percent: 70, color: "#FFCA28", icon: "devicon-firebase-plain colored" }
            ],
            tools: [
                { name: "Git", percent: 40, color: "#F1502F", icon: "fa-brands fa-git-alt" },
                { name: "Docker", percent: 20, color: "#2496ED", icon: "fa-brands fa-docker" },
                { name: "VS Code", percent: 55, color: "#007ACC", icon: "devicon-vscode-plain colored" }
            ]
        };
        const sectionNames = {
            programming: "Programming Languages",
            web: "Web Development",
            app: "App Development",
            database: "Database Management",
            tools: "Software Tools"
        };
        const container = document.getElementById('skills-container');
        const keys = Object.keys(skillData);

        // Create dropdown sections
        keys.forEach(key => {
            const dropdown = document.createElement('div');
            dropdown.classList.add('dropdown');
            dropdown.innerHTML = `
                <button class="dropdown-btn" onclick="toggleDropdown(this)">
                    ${sectionNames[key]} <i class="fas fa-chevron-down arrow"></i>
                </button>
                <div class="dropdown-content">
                    ${skillData[key].map(skill => `
                        <div class="card">
                            <div class="percent" style="--clr:${skill.color}" data-pct="${skill.percent}">
                                <div class="dot"></div>
                                <svg>
                                    <circle class="bg" cx="70" cy="70" r="58"></circle>
                                    <circle class="fg" cx="70" cy="70" r="58"></circle>
                                </svg>
                                <div class="number">
                                    <h2 data-count="0">0%</h2>
                                    <p><i class="${skill.icon}"></i> ${skill.name}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(dropdown);
        });
        // Intersection Observer for animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                    entry.target.classList.add('visible');
                    animateProgress(entry.target);
                }
            });
        }, { threshold: 0.3 });

        // Attach observer AFTER dropdowns are created
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            observer.observe(dropdown);
        });
        // Dropdown toggle function
        window.toggleDropdown = function (btn) {
            const content = btn.nextElementSibling;
            const isOpen = content.classList.contains('show');
            // Close all
            document.querySelectorAll('.dropdown-content').forEach(el => {
                el.classList.remove('show');
                el.style.maxHeight = null;
                if (el.previousElementSibling) el.previousElementSibling.classList.remove('active');
            });
            // Toggle current
            if (!isOpen) {
                content.classList.add('show');
                btn.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
                animateProgress(btn.parentElement);
            } else {
                content.classList.remove('show');
                btn.classList.remove('active');
                content.style.maxHeight = null;
            }
        };

        // Animate circle stroke and number counter together
        function animateProgress(dropdown) {
            const circles = dropdown.querySelectorAll('.fg');
            const counters = dropdown.querySelectorAll('h2[data-count]');
            circles.forEach((circle, i) => {
                const percentEl = circle.closest('.percent');
                const target = +percentEl.getAttribute('data-pct');
                const counter = counters[i];
                const radius = 58;
                const circumference = 2 * Math.PI * radius;
                circle.style.strokeDasharray = circumference;
                const duration = 1500;
                const start = performance.now();
                const animate = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const value = Math.floor(progress * target);
                    counter.innerText = `${value}%`;
                    const offset = circumference * (1 - progress * (target / 100));
                    circle.style.strokeDashoffset = offset;
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            });
        }

        // (Duplicate Intersection Observer removed to fix redeclaration error)

        // Update maxHeight for open dropdowns on resize
        window.addEventListener('resize', () => {
            document.querySelectorAll('.dropdown-content.show').forEach(content => {
                content.style.maxHeight = content.scrollHeight + "px";
            });
        });