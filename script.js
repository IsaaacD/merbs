document.addEventListener('DOMContentLoaded', function () {
    const projects = [
        // Add your projects here
        // Example:
        {
            title: 'Lemmy Nanny',
            description: 'A project mostly hand written to use AI (Ollama local models) to monitor Lemmy instances to add to a mod to a mod queue so moderators can keep their Lemmy instances tidy.',
            image: './images/LemmyNannyLogo.png',
            link: '#',
            githubLink: 'https://github.com/IsaaacD/LemmyNanny',
            template: 'LemmyNanny.html'
        },
        {
            title: 'Another Project',
            description: 'Description of another project.',
            image: './images/project.jpg',
            link: '#',
            githubLink: 'https://github.com/IsaaacD/LemmyNanny'
        }
    ];

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
        projectCard.className = 'project-card';

        let contentHtml = '';
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

    // Function to load external HTML template
    function loadTemplate(templateUrl) {
        fetch(templateUrl)
            .then(response => response.text())
            .then(html => {
                modalContent.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading template:', error);
                modalContent.innerHTML = '<p>Error loading project details. Please try again later.</p>';
            });
    }
});