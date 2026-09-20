function initPublicationLists() {
  document.querySelectorAll('[data-publication-list]').forEach((list) => {
    const buttons = Array.from(list.querySelectorAll('[data-publication-filter]'));
    const items = Array.from(list.querySelectorAll('[data-publication-category]'));
    const itemContainer = list.querySelector('.publication-list');
    const sortSelect = list.querySelector('[data-publication-sort]');
    const emptyState = list.querySelector('[data-publication-empty]');
    let activeFilter = 'all';
    let activeSort = sortSelect?.value || 'year';

    const valueOf = (item, key) => Number(item.dataset[key] || 0);

    const render = () => {
      const sortedItems = [...items].sort((a, b) => {
        const yearDifference = valueOf(b, 'publicationYear') - valueOf(a, 'publicationYear');
        const citationDifference = valueOf(b, 'publicationCitations') - valueOf(a, 'publicationCitations');
        const originalDifference = valueOf(a, 'publicationOrder') - valueOf(b, 'publicationOrder');

        if (activeSort === 'citations') {
          return citationDifference || yearDifference || originalDifference;
        }
        return yearDifference || citationDifference || originalDifference;
      });

      let visibleCount = 0;
      sortedItems.forEach((item) => {
        itemContainer.appendChild(item);
        const visible = activeFilter === 'all' || item.dataset.publicationCategory === activeFilter;
        item.hidden = !visible;
        if (visible) {
          visibleCount += 1;
          const number = item.querySelector('[data-publication-number]');
          if (number) number.textContent = `${visibleCount}.`;
        }
      });

      if (emptyState) emptyState.hidden = visibleCount !== 0;
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.publicationFilter;
        buttons.forEach((candidate) => {
          candidate.setAttribute('aria-pressed', String(candidate === button));
        });
        render();
      });
    });

    sortSelect?.addEventListener('change', () => {
      activeSort = sortSelect.value;
      render();
    });

    render();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPublicationLists);
} else {
  initPublicationLists();
}
