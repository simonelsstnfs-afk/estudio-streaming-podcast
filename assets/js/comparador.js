document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = [...document.querySelectorAll('.comp-filter-btn')];
  const products = [...document.querySelectorAll('.comp-row')];
  const status = document.querySelector('[data-compare-status]');
  const openComparison = document.querySelector('[data-compare-open]');
  const comparisonResult = document.querySelector('[data-comparison-result]');
  const comparisonTable = document.querySelector('[data-comparison-table]');
  const selected = [];

  const productName = (product) => product.querySelector('.card-title')?.textContent?.trim() || 'Equipo seleccionado';
  const productPrice = (product) => product.querySelector('.price-display')?.textContent?.trim() || 'Consulta la oferta';

  const createComparisonColumn = (product) => {
    const column = document.createElement('article');
    const title = document.createElement('h3');
    const price = document.createElement('p');
    const specs = document.createElement('dl');

    column.className = 'premium-comparison-column';
    title.textContent = productName(product);
    price.className = 'premium-comparison-column__price';
    price.textContent = productPrice(product);

    product.querySelectorAll('.spec-row').forEach((row) => {
      const item = document.createElement('div');
      const key = document.createElement('dt');
      const value = document.createElement('dd');

      key.textContent = row.querySelector('.spec-key')?.textContent?.trim() || 'Dato';
      value.textContent = row.querySelector('.spec-value')?.textContent?.trim() || 'No disponible';
      item.append(key, value);
      specs.append(item);
    });

    column.append(title, price, specs);
    return column;
  };

  const updateComparison = () => {
    products.forEach((product) => {
      const button = product.querySelector('.premium-compare-toggle');
      const isSelected = selected.includes(product);

      if (!button) return;

      button.setAttribute('aria-pressed', String(isSelected));
      button.textContent = isSelected ? 'Quitar de la comparación' : 'Añadir a la comparación';
      button.disabled = selected.length === 2 && !isSelected;
    });

    if (!status || !openComparison || !comparisonResult || !comparisonTable) return;

    if (selected.length === 0) {
      status.textContent = 'Elige hasta dos equipos';
      openComparison.disabled = true;
      comparisonResult.hidden = true;
      comparisonTable.replaceChildren();
      return;
    }

    if (selected.length === 1) {
      status.textContent = `Añade un segundo equipo para comparar con ${productName(selected[0])}`;
      openComparison.disabled = true;
      comparisonResult.hidden = true;
      comparisonTable.replaceChildren();
      return;
    }

    status.textContent = `${productName(selected[0])} y ${productName(selected[1])}`;
    openComparison.disabled = false;
    comparisonResult.hidden = false;
    comparisonTable.replaceChildren(...selected.map(createComparisonColumn));
  };

  products.forEach((product) => {
    const actions = product.querySelector('.bento-card-inner > div:last-child');
    if (!actions) return;

    const button = document.createElement('button');
    button.className = 'premium-compare-toggle';
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.textContent = 'Añadir a la comparación';
    button.addEventListener('click', () => {
      const position = selected.indexOf(product);

      if (position >= 0) {
        selected.splice(position, 1);
      } else if (selected.length < 2) {
        selected.push(product);
      }

      updateComparison();
    });

    actions.before(button);
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      products.forEach((product) => {
        const isVisible = category === 'all' || product.dataset.category === category;
        product.hidden = !isVisible;

        if (!isVisible) {
          const selectedIndex = selected.indexOf(product);
          if (selectedIndex >= 0) selected.splice(selectedIndex, 1);
        }
      });

      updateComparison();
    });
  });

  openComparison?.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    comparisonResult?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  updateComparison();
});
