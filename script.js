document.addEventListener('DOMContentLoaded', function () {
    const projects = [
        // Add your projects here
        // Example:
        {
            title: 'Lemmy Nanny',
            description: 'A project mostly hand written to use AI (Ollama local models) to monitor Lemmy instances to add to a mod to a mod queue so moderators can keep their Lemmy instances tidy.',
            image: './images/LemmyNannyLogo.png',
            link: '#',
            githubLink: 'https://github.com/IsaaacD/LemmyNanny'
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
            footerHtml += '<span class="github-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.495 0 2.866.62 3.307 1.232a9.549 9.549 0 0 1 .118 3.176C15.432 6.44 16.099 7.51 16.099 8.821c0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C18.566 21.797 22 17.299 22 12c0-6.627-5.373-12-12-12Z"/></svg><a href="' + project.githubLink + '" target="_blank">GitHub</a></span>';
        }
        if (project.link) {
            footerHtml += '<a class="proj-link" href="' + project.link + '" target="_blank">Learn more</a> ';
        }
        footerHtml += '</div>'

        let html = '<div class="project-content">' + contentHtml + '</div>';
        if (footerHtml) {
            html += '<div class="project-footer">' + footerHtml + '</div>';
        }
        projectCard.innerHTML = html;
        projectsContainer.appendChild(projectCard);
    });
});