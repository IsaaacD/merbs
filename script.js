document.addEventListener('DOMContentLoaded', function() {
    const projects = [
        // Add your projects here
        // Example:
        {
            title: 'Project Title',
            description: 'Brief description of the project.',
            image: 'path/to/image.jpg',
            link: '#'
        }
    ];

    const projectsContainer = document.querySelector('.projects');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        let html = '';
        if (project.image) {
            html += '<img src="' + project.image + '" alt="' + project.title + '" style="width:100%; height:200px; object-fit:cover; border-radius:8px 8px 0 0;">';
        }
        html += '<h2>' + project.title + '</h2>';
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