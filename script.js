document.addEventListener('DOMContentLoaded', async function () {
    // Initialize Three.js floating text background
    if (typeof FloatingTextBackground !== 'undefined') {
        const bg = new FloatingTextBackground({
            mode: 'background',
            textCount: 20,
            particleCount: 200,
            bgColor: '#0a0a1a',
            textColor: '#c8d6e5',
            particleColor: '#6c5ce7',
            textSpeed: 0.12,
            textPool: [
                'DevOps Engineer',
                'Clean Code',
                'Solutions Developer',
                'Cloud Architecture',
                'CI/CD Pipelines',
                'Microservices',
                'Kubernetes',
                'Automation',
                'Full Stack',
                'System Design',
                'Performance Tuning',
                'Container Orchestration',
                'Monitoring & Observability',
                'GitOps',
                'Docker',
                'Linux Systems',
                'API Development',
                'Database Design'
            ]
        });
        bg.init();
        window.addEventListener('resize', () => bg.resize());
    }
    const projects = await fetch('projects/projects.json')
        .then(response => response.json())
        .then(data => {
            return data.projects;
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
            return [];
        });

    const projectsContainer = document.querySelector('.projects');
    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.querySelector('.close');

    // Close modal when clicking the X button
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the content
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'card project-card';

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
            footerHtml += '<a href="' + project.githubLink + '">Source Code</a>';
        }
        // if (project.link) {
        //     footerHtml += '<a class="proj-link" href="' + project.link + '" target="_blank">Learn more</a> ';
        // }
        footerHtml += '</div>'

        let html = '<div class="project-content">' + contentHtml + '</div>';
        if (footerHtml) {
            html += '<div class="project-footer">' + footerHtml + '</div>';
        }
        projectCard.innerHTML = html;

        // Make the entire card clickable to open the modal
        projectCard.style.cursor = 'pointer';
        projectCard.addEventListener('click', function () {
            if (project.template) {
                loadTemplate(project.template);
                modal.style.display = 'block';
            }
        });

        projectsContainer.appendChild(projectCard);
    });

    // Function to load and parse markdown template
    function loadTemplate(templateUrl) {
        fetch(templateUrl)
            .then(response => response.text())
            .then(md => {
                if (templateUrl.indexOf('.html') > -1) {
                    modalContent.innerHTML = md;
                } else {
                    modalContent.innerHTML = marked.parse(md);
                }
            })
            .catch(error => {
                console.error('Error loading template:', error);
                modalContent.innerHTML = '<p>Error loading project details. Please try again later.</p>';
            });
    }
});