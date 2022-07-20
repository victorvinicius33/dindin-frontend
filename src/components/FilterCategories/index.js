import './style.css';
import Filter from '../../assets/filter.svg';
import { useState } from 'react';

export default function FilterCategories({
  categories,
  setCategories,
  setCurrentTransactions,
  defaultTransactions,
  sortByAscendingDate
}) {
  const [openFilter, setOpenFilter] = useState(false);

  function handleSelectedCategory(id) {
    const allCategories = [...categories];

    allCategories.forEach((category) => {
      if (category.id === id) {
        category.selected = !category.selected;
      }
    });

    setCategories([...allCategories]);
  }

  function handleClearFilter() {
    const allCategories = [...categories];

    allCategories.forEach((category) => {
      category.selected = false;
    });

    setCategories([...allCategories]);
  }

  function handleApplyFilter() {
    const allCategories = [...categories];

    const selectedCategories = allCategories.filter((category) => {
      return category.selected === true;
    });

    if (!selectedCategories.length) {
      return sortByAscendingDate(defaultTransactions);
    }

    const filteredTransactions = [];

    defaultTransactions.forEach((transaction) => {
      selectedCategories.forEach((selectedCategory) => {
        if (transaction.category_id === selectedCategory.id) {
          filteredTransactions.push(transaction);
        }
      });
    });

    setCurrentTransactions([...filteredTransactions]);
  }

  return (
    <div className='filter-transactions__container'>
      <button
        className='filter-transactions__show-filters'
        onClick={() => setOpenFilter(!openFilter)}
      >
        <img src={Filter} alt='filtrar transação por categoria' />
        <span>Filtrar</span>
      </button>

      {openFilter && (
        <div className='filter-transactions__categories-container'>
          <h4>Categoria</h4>
          <div className='filter-transactions__categories-list'>
            {categories.map((category) => (
              <div
                key={category.id}
                className={`filter-transactions__category-item ${
                  category.selected ? 'selected' : 'not-selected'
                }`}
                onClick={() => handleSelectedCategory(category.id)}
              >
                <span>{category.description}</span>
                <span>{category.selected ? 'x' : '+'}</span>
              </div>
            ))}
          </div>

          <button
            className='filter-transactions__clear-filter'
            onClick={handleClearFilter}
          >
            Limpar Filtros
          </button>
          <button
            className='filter-transactions__apply-filter'
            onClick={handleApplyFilter}
          >
            Aplicar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
