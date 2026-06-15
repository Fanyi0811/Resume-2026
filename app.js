(function () {
  const data = typeof RESUME !== "undefined" ? RESUME : {};

  document.title = `${data.name || "个人简历"} · 个人简历`;

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
  }

  function renderNav() {
    setText("nav-name", data.name);
    const links = document.getElementById("nav-links");
    if (!links || !data.nav) return;
    links.innerHTML = data.nav
      .map(
        (item) =>
          `<li><a href="${item.href}" class="nav-link">${item.label}</a></li>`
      )
      .join("");
  }

  function renderHero() {
    const avatar = document.getElementById("hero-avatar");
    if (avatar) {
      if (data.avatar) {
        avatar.innerHTML = `<img src="${data.avatar}" alt="${data.name}">`;
      } else {
        avatar.textContent = (data.name || "?").charAt(0);
      }
    }
    setText("hero-name", data.name);
    setText("hero-title", data.title);
    setText("hero-summary", data.summary);

    const actions = document.getElementById("hero-actions");
    if (actions && data.actions) {
      actions.innerHTML = data.actions
        .map(
          (a) =>
            `<a href="${a.href}" class="btn ${a.primary ? "btn-primary" : "btn-outline"}">${a.label}</a>`
        )
        .join("");
    }
  }

  function renderAbout() {
    const about = data.about || {};
    setText("about-title", about.title);
    setText("about-text", about.text);

    const highlights = document.getElementById("about-highlights");
    if (highlights && about.highlights) {
      highlights.innerHTML = about.highlights
        .map(
          (h) =>
            `<div class="highlight-card"><span class="highlight-value">${h.value}</span><span class="highlight-label">${h.label}</span></div>`
        )
        .join("");
    }
  }

  function renderExperience() {
    const exp = data.experience || {};
    setText("experience-title", exp.title);

    const list = document.getElementById("experience-list");
    if (!list || !exp.items) return;

    list.innerHTML = exp.items
      .map(
        (item) => `
        <article class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <time class="timeline-period">${item.period}</time>
            <h3 class="timeline-role">${item.role}</h3>
            <p class="timeline-company">${item.company}</p>
            ${
              item.achievements?.length
                ? `<ul class="timeline-achievements">${item.achievements.map((a) => `<li>${a}</li>`).join("")}</ul>`
                : ""
            }
          </div>
        </article>`
      )
      .join("");
  }

  function renderProjects() {
    const projects = data.projects || {};
    setText("projects-title", projects.title);

    const list = document.getElementById("projects-list");
    if (!list || !projects.items) return;

    list.innerHTML = projects.items
      .map(
        (item) => `
        <article class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <time class="timeline-period">${item.period}</time>
            <h3 class="timeline-role">${item.name}</h3>
            ${
              item.achievements?.length
                ? `<ul class="timeline-achievements">${item.achievements.map((a) => `<li>${a}</li>`).join("")}</ul>`
                : ""
            }
          </div>
        </article>`
      )
      .join("");
  }

  function renderSkills() {
    const skills = data.skills || {};
    setText("skills-title", skills.title);

    const list = document.getElementById("skills-list");
    if (!list || !skills.categories) return;

    list.innerHTML = skills.categories
      .map(
        (cat) => `
        <div class="skill-category">
          <h3 class="skill-category-name">${cat.name}</h3>
          <div class="skill-tags">
            ${cat.items.map((s) => `<span class="skill-tag">${s}</span>`).join("")}
          </div>
        </div>`
      )
      .join("");
  }

  function renderEducation() {
    const edu = data.education || {};
    setText("education-title", edu.title);

    const list = document.getElementById("education-list");
    if (!list || !edu.items) return;

    list.innerHTML = edu.items
      .map(
        (item) => `
        <article class="education-item">
          <time class="education-period">${item.period}</time>
          <div class="education-body">
            <h3 class="education-degree">${item.degree}</h3>
            <p class="education-school">${item.school}</p>
            ${item.detail ? `<p class="education-detail">${item.detail}</p>` : ""}
          </div>
        </article>`
      )
      .join("");
  }

  function renderContact() {
    const contact = data.contact || {};
    setText("contact-title", contact.title);
    setText("contact-intro", contact.intro);

    const list = document.getElementById("contact-list");
    if (!list || !contact.items) return;

    list.innerHTML = contact.items
      .map((item) => {
        const inner = `
          <span class="contact-icon">${item.icon}</span>
          <span class="contact-label">${item.label}</span>
          <span class="contact-value">${item.value}</span>`;
        return item.link
          ? `<a href="${item.link}" class="contact-card" target="_blank" rel="noopener">${inner}</a>`
          : `<div class="contact-card">${inner}</div>`;
      })
      .join("");
  }

  function renderFooter() {
    setText("footer-text", data.footer);
  }

  function initNavScroll() {
    const nav = document.getElementById("nav");
    const links = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
      nav?.classList.toggle("nav-scrolled", window.scrollY > 40);
    });

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        target?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("nav-links")?.classList.remove("open");
      });
    });
  }

  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");
    toggle?.addEventListener("click", () => links?.classList.toggle("open"));
  }

  renderNav();
  renderHero();
  renderAbout();
  renderExperience();
  renderProjects();
  renderSkills();
  renderEducation();
  renderContact();
  renderFooter();
  initNavScroll();
  initMobileNav();
})();
