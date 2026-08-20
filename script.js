let apiImpress;
let impressReady = false;

document.addEventListener('DOMContentLoaded', async function () {
    const isMobile = window.innerWidth <= 600;

    const projects = await fetch('projects/projects.json')
        .then(response => response.json())
        .then(data => data.projects)
        .catch(error => {
            console.error('Error fetching projects:', error);
            return [];
        });

    buildProjectCards(projects);
    buildProjectSlides(projects, isMobile);

    if (isMobile) adjustStepsForMobile();

    apiImpress = impress();

    document.addEventListener('impress:stepenter', function (e) {
        const step = e.target;
        const detailEl = step.querySelector('.project-detail-content');
        if (detailEl && detailEl.dataset.loaded === 'false') {
            const templateUrl = detailEl.dataset.template;
            if (templateUrl) {
                loadTemplate(templateUrl, detailEl);
                detailEl.dataset.loaded = 'true';
            }
        }
        updateMinimapActive(step.id);
    });

    document.addEventListener('impress:init', function () {
        impressReady = true;
        applyAccentColors();
        buildMinimap();
        colorHubCards();
        apiImpress.goto('overview');
    });

    apiImpress.init();

    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    if (btnPrev) btnPrev.addEventListener('click', function () {
        apiImpress.prev();
    });
    if (btnNext) btnNext.addEventListener('click', function () {
        apiImpress.next();
    });
});

function navigateTo(id) {
    if (!impressReady || !apiImpress) return;
    apiImpress.goto(id);
}

document.addEventListener('click', function (e) {
    const target = e.target.closest('[data-goto]');
    if (target) {
        e.preventDefault();
        e.stopPropagation();
        navigateTo(target.dataset.goto);
    }
}, true);

function buildProjectCards(projects) {
    const container = document.querySelector('#projects-hub .projects');
    if (!container) return;

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'card project-card';
        card.dataset.projectIndex = index;
        if (project['accent-color']) card.style.setProperty('--accent', project['accent-color']);

        let contentHtml = '<span class="click-me">☟</span>';
        if (project.image) {
            contentHtml += '<img class="proj-img" src="' + project.image + '" alt="' + project.title + '">';
        }
        contentHtml += '<h2>' + project.title + '</h2>';
        if (project.description) {
            contentHtml += '<p>' + project.description + '</p>';
        }

        let footerHtml = '<div class="footer">';
        if (project.githubLink) {
            footerHtml += '<a href="' + project.githubLink + '" target="_blank">Source Code</a>';
        }
        footerHtml += '</div>';

        card.innerHTML =
            '<div class="project-content">' + contentHtml + '</div>' +
            '<div class="project-footer">' + footerHtml + '</div>';

        card.addEventListener('click', function (e) {
            if (e.target.closest('a')) return;
            e.stopPropagation();
            navigateTo('project-' + index);
        }, true);

        container.appendChild(card);
    });
}


function loadTemplate(templateUrl, targetEl) {
    fetch(templateUrl)
        .then(response => response.text())
        .then(html => {
            if (templateUrl.indexOf('.html') > -1) {
                targetEl.innerHTML = extractBodyContent(html);
            } else {
                targetEl.innerHTML = marked.parse(html);
            }
            targetEl.dataset.loaded = 'true';
        })
        .catch(error => {
            console.error('Error loading template:', error);
            targetEl.innerHTML = '<p style="color: #e74c3c;">Error loading project details.</p>';
    });
}



function extractBodyContent(html) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
        let content = bodyMatch[1];
        content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        return content;
    }
    return html;
}

function buildProjectSlides(projects, isMobile) {
    const impressEl = document.getElementById('impress');
    if (!impressEl) return;

    projects.forEach((project, index) => {
        const slide = document.createElement('div');
        const yOff = index * 1200;
        slide.id = 'project-' + index;
        slide.className = 'step';
        slide.setAttribute('data-x', '-2000');
        slide.setAttribute('data-y', String(yOff));
        slide.setAttribute('data-rotate-y', '-180');
        slide.setAttribute('data-scale', '1');
        slide.setAttribute('data-accent', project['accent-color'] || '#6c5ce7');

        let inner = '<a class="back-nav" data-goto="projects-hub">&larr; Back to Projects</a>';
        inner += '<div class="card project-detail-content" data-template="' + project.template + '" data-loaded="false">';
        inner += '<p style="color: #888;">Loading project details...</p>';
        inner += '</div>';

        slide.innerHTML = inner;
        impressEl.appendChild(slide);
    });

    if (apiImpress) apiImpress.refresh();
}

function buildMinimap() {
    const minimap = document.getElementById('minimap');
    if (!minimap) return;

    const steps = document.querySelectorAll('.step');
    const coords = [];

    steps.forEach(step => {
        const id = step.id;
        const x = parseFloat(step.getAttribute('data-x') || '0');
        const y = parseFloat(step.getAttribute('data-y') || '0');
        coords.push({ id, x, y });
    });

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    coords.forEach(c => {
        if (c.x < minX) minX = c.x;
        if (c.x > maxX) maxX = c.x;
        if (c.y < minY) minY = c.y;
        if (c.y > maxY) maxY = c.y;
    });

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const padding = 18;
    const mapW = minimap.clientWidth - padding * 2;
    const mapH = minimap.clientHeight - padding * 2;
    const scaleX = mapW / rangeX;
    const scaleY = mapH / rangeY;
    const scale = Math.min(scaleX, scaleY);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    coords.forEach(c => {
        const dot = document.createElement('div');
        dot.className = 'minimap-dot';
        dot.dataset.stepId = c.id;
        dot.title = c.id.replace(/-/g, ' ');
        const stepEl = document.getElementById(c.id);
        const accent = stepEl ? stepEl.dataset.accent : null;
        if (accent) dot.style.background = accent;
        const dotX = padding + ((c.x - centerX) * scale) + (mapW / 2);
        const dotY = padding + ((c.y - centerY) * scale) + (mapH / 2);
        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';

        dot.addEventListener('click', () => navigateTo(c.id));
        minimap.appendChild(dot);
    });

    updateMinimapActive('overview');
}

function updateMinimapActive(id) {
    document.querySelectorAll('.minimap-dot').forEach(dot => {
        const isActive = dot.dataset.stepId === id;
        dot.classList.toggle('active', isActive);
        if (isActive) {
            const stepEl = document.getElementById(id);
            const accent = stepEl ? stepEl.dataset.accent : null;
            if (accent) dot.style.setProperty('--dot-accent', accent);
        }
    });
}

function applyAccentColors() {
    document.querySelectorAll('.step[data-accent]').forEach(step => {
        step.style.setProperty('--accent', step.dataset.accent);
    });
}

function adjustStepsForMobile() {
    const factor = 0.15;
    document.querySelectorAll('.step').forEach(step => {
        const x = step.getAttribute('data-x');
        const y = step.getAttribute('data-y');
        if (x) step.setAttribute('data-x', String(parseFloat(x) * factor));
        if (y) step.setAttribute('data-y', String(parseFloat(y) * factor));
        step.setAttribute('data-scale', '1');
    });
}

function colorHubCards() {
    const stepColors = {};
    document.querySelectorAll('.step[data-accent]').forEach(step => {
        stepColors[step.id] = step.dataset.accent;
    });
    document.querySelectorAll('.hub-card[data-goto]').forEach(card => {
        const targetId = card.dataset.goto;
        const color = stepColors[targetId];
        if (color) {
            card.style.borderTopColor = color;
            card.style.borderLeftColor = color;
        }
    });
}
