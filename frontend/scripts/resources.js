document.addEventListener('DOMContentLoaded', () => {
    const resourcesData = [
        { title: "5-Minute Breathing Exercise", description: "Quick stress relief technique perfect between classes.", type: "exercise", duration: "5 min", category: "Beginner", icon: "wind" },
        { title: "Managing Academic Stress", description: "A guide to handling pressure and preventing burnout.", type: "article", duration: "8 min read", category: "Intermediate", icon: "book-open" },
        { title: "Sleep Better Tonight", description: "Guided meditation for better sleep and reduced anxiety.", type: "audio", duration: "15 min", category: "Beginner", icon: "moon" },
        { title: "Social Anxiety Toolkit", description: "Practical strategies for social situations and confidence.", type: "article", duration: "12 min read", category: "Advanced", icon: "users" },
        { title: "Building Resilience", description: "Learn to bounce back from setbacks and build mental strength.", type: "video", duration: "10 min", category: "Advanced", icon: "shield" },
        { title: "Progressive Muscle Relaxation", description: "A deep relaxation technique to release physical tension.", type: "exercise", duration: "20 min", category: "Intermediate", icon: "activity" }
    ];

    const grid = document.getElementById('resource-grid');
    const filtersContainer = document.getElementById('resource-filters');

    function getCategoryStyle(category) {
        switch (category) {
            case 'Beginner': return 'bg-wellness/20 text-wellness';
            case 'Intermediate': return 'bg-warning/20 text-warning';
            case 'Advanced': return 'bg-destructive/20 text-destructive';
            default: return 'bg-muted text-muted-foreground';
        }
    }

    function renderResources(filter = 'all') {
        grid.innerHTML = '';
        const filteredResources = filter === 'all' 
            ? resourcesData 
            : resourcesData.filter(r => r.type === filter);
        
        if (filteredResources.length === 0) {
            grid.innerHTML = `<p class="lg:col-span-3 text-center text-muted-foreground">No resources found for this category.</p>`;
            return;
        }
        
        filteredResources.forEach(resource => {
            const card = document.createElement('div');
            card.className = 'wellness-card resource-card p-0';
            card.innerHTML = `
                <div class="card-content p-6">
                    <div class="flex items-start justify-between gap-4 mb-4">
                        <h3 class="card-title text-lg">${resource.title}</h3>
                        <div class="p-2 rounded-full bg-primary/20 text-primary">
                            <i data-lucide="${resource.icon}" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <p class="card-description mb-4">${resource.description}</p>
                    <div class="flex items-center gap-3">
                        <span class="resource-tag ${getCategoryStyle(resource.category)}">${resource.category}</span>
                        <span class="text-xs text-muted-foreground">${resource.duration}</span>
                    </div>
                </div>
                <div class="card-footer p-4 border-t">
                    <button class="btn btn-wellness w-full">Start Now</button>
                </div>
            `;
            grid.appendChild(card);
        });
        lucide.createIcons();
    }

    filtersContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderResources(e.target.dataset.filter);
        }
    });

    // Initial render
    renderResources();
});