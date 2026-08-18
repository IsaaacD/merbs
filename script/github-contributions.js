document.addEventListener('DOMContentLoaded', async function () {
    const container = document.querySelector('.contributions-grid');
    if (!container) return;

    const username = 'IsaaacD';
    const days = 90;

    try {
        const count = await countContributions(username, days);
        if (count !== null) {
            const div = document.createElement('div');
            div.className = 'contrib-summary';
            div.innerHTML = `
              <span class="contrib-text">
                <svg data-component="Octicon" aria-hidden="true" focusable="false" class="octicon octicon-mark-github" viewBox="0 0 24 24" width="32" height="32" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align:text-bottom"><path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943"></path></svg>
                <span class="contrib-count">${count}</span> contributions in the last ${days} days
              </span>
              <a class="contrib-link" href="https://github.com/${username}" target="_blank" rel="noopener">
                View on GitHub
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            `;
            container.appendChild(div);
        } else {
            container.innerHTML = '<p class="contrib-error">Unable to load contribution count.</p>';
        }
    } catch (err) {
        console.error('Failed to fetch contributions:', err);
        container.innerHTML = '<p class="contrib-error">Unable to load contribution count.</p>';
    }
});

async function countContributions(username, days) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    let total = 0;
    let page = 1;
    const perPage = 100;

    while (page <= 10) {
        const response = await fetch(
            `https://api.github.com/users/${username}/events?per_page=${perPage}&page=${page}`,
            { headers: { 'Accept': 'application/vnd.github+json' } }
        );

        if (!response.ok) {
            console.warn('API error:', response.status);
            if (response.status === 403) {
                const reset = response.headers.get('X-RateLimit-Reset');
                if (reset) {
                    const wait = Math.max(0, parseInt(reset) * 1000 - Date.now());
                    if (wait < 30000) { await new Promise(r => setTimeout(r, wait)); continue; }
                }
            }
            break;
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) break;

        for (const event of data) {
            const date = new Date(event.created_at);
            if (date < cutoff) continue;
            if (event.type === 'PushEvent') {
                total += (event.payload && event.payload.commits && event.payload.commits.length > 0) ? event.payload.commits.length : 1;
            } else if (event.type === 'CreateEvent' && event.payload && event.payload.ref_type === 'repository') {
                total++;
            } else if (event.type === 'PullRequestEvent' && event.payload && event.payload.action === 'opened') {
                total++;
            }
        }

        if (data.length < perPage) break;
        page++;
    }

    console.log('Contributions counted:', total);
    return total;
}
