/* 
 * Side-by-side comparison engine
 * Cache-Buster: 20260903
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.comp-filter-btn');
  const rows = document.querySelectorAll('.comp-row');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      
      rows.forEach(r => {
        if (cat === 'all' || r.getAttribute('data-category') === cat) {
          r.style.display = '';
        } else {
          r.style.display = 'none';
        }
      });
    });
  });
});
