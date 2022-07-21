import './style.css';
import { useState } from 'react';
import UpArrow from '../../assets/upArrow.svg';
import Pencil from '../../assets/pencil.svg';
import Trash from '../../assets/trash-bin.svg';
import { formatNumberToMoney, formatDate } from '../../utils/formatters';

export default function TableTransactions({
  currentTransactions,
  setCurrentTransactions,
  categories,
  setOpenDeleteTransaction,
  setTransactionId
}) {
  const [sortByDate, setSortByDate] = useState('ascending');
  const daysOfTheWeek = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];

  function getDayOfTheWeek(date) {
    const currentDate = new Date(date);
    return daysOfTheWeek[currentDate.getDay()];
  }

  function getTransactionCategory(id) {
    const categoryName = categories.find((category) => {
      return category.id === id;
    });

    if (!categoryName) return '-';

    return categoryName.description;
  }

  function sortByAscendingDate(arr) {
    const sortedArray = arr.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    return setCurrentTransactions([...sortedArray]);
  }

  function sortByDescendingDate(arr) {
    const sortedArray = arr.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    return setCurrentTransactions([...sortedArray]);
  }

  function handleOrderByDate() {
    if (sortByDate === 'ascending') {
      setSortByDate('descending');
      sortByDescendingDate([...currentTransactions]);
    } else {
      setSortByDate('ascending');
      sortByAscendingDate([...currentTransactions]);
    }
  }

  function handleDeleteTransaction(id) {
    setOpenDeleteTransaction(true);
    setTransactionId(id);
  }

  return (
    <table className='table-transactions'>
      <thead>
        <tr>
          <th onClick={handleOrderByDate}>
            Data{' '}
            <img
              src={UpArrow}
              alt='seta'
              className={
                sortByDate === 'descending'
                  ? 'table-transactions__descending-arrow'
                  : ''
              }
            />
          </th>
          <th>Dia da semana</th>
          <th>Descrição</th>
          <th>Categoria</th>
          <th>Valor</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {currentTransactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{formatDate(transaction.date)}</td>
            <td>{getDayOfTheWeek(transaction.date)}</td>
            <td>{transaction.description}</td>
            <td>{getTransactionCategory(transaction.category_id)}</td>
            <td>{formatNumberToMoney(transaction.amount)}</td>
            <td>
              <img src={Pencil} alt='editar' />
              <img
                src={Trash}
                alt='deletar'
                onClick={() => handleDeleteTransaction(transaction.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
      
    </table>
  );
}
