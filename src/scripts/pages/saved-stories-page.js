import { getAllSavedStories, deleteStory } from '../utils/indexed-db.js';

export default class SavedStoriesPage {
    async render() {
        return `
      <section class="container">
        <h1>Saved Stories</h1>
        <div id="saved-stories-container" class="stories-container">
          <div class="loading">Loading saved stories...</div>
        </div>
      </section>
    `;
    }

    async afterRender() {
        const container = document.getElementById('saved-stories-container');
        try {
            const stories = await getAllSavedStories();
            if (stories.length === 0) {
                container.innerHTML = '<p>Tidak ada story yang disimpan.</p>';
                return;
            }

            container.innerHTML = stories
                .map(
                    (story) => `
          <article class="story-item" data-id="${story.id}">
            <h3>${story.name}</h3>
            <p>${story.description || ''}</p>
            <button class="delete-btn" data-id="${story.id}">Hapus</button>
          </article>
        `
                )
                .join('');

            const deleteButtons = container.querySelectorAll('.delete-btn');
            deleteButtons.forEach((btn) => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    await deleteStory(id);
                    this.afterRender();
                });
            });
        } catch (error) {
            container.innerHTML = `<p>Gagal memuat data: ${error}</p>`;
        }
    }

    async init() {
        const content = await this.render();

        // Sisipkan content ke DOM
        const appContainer = document.getElementById('pageContent');
        if (!appContainer) {
            throw new Error("Data Error: Container not found");
        }
        appContainer.innerHTML = content;

        await this.afterRender();

        return content;
    }

}
