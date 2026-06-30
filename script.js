document.addEventListener('DOMContentLoaded', function() {
    const projects = [
        // Add your projects here
        // Example:
        // {
        //     title: 'Project Title',
        //     description: 'Brief description of the project.',
        //     link: '#'
        // }
    ];

    const projectsContainer = document.querySelector('.projects');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        let html = '<h2>' + project.title + '</h2>';
        if (project.description) {
            html += '<p>' + project.description + '</p>';
        }
        if (project.link) {
            html += '<a href="' + project.link + '" target="_blank">View Project</a>';
        }
        
        projectCard.innerHTML = html;
        projectsContainer.appendChild(projectCard);
    });
});