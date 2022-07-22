import './style.css';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Close from '../../../assets/close.svg';
import { ValidationAddTransactionForm } from '../../../validations/validationAddTransactionForm';
import api from '../../../services/api';
import { getItem } from '../../../utils/localStorage';
import { formatDate, formatNumberToMoney } from '../../../utils/formatters';

export default function ModalEditTransaction({
  transactionId,
  setOpenModalEditTransaction,
  categories,
  currentTransactions,
  setCurrentTransactions,
  defaultTransactions,
  setDefaultTransactions,
  loadUserStatement,
}) {
  const token = getItem('token');
  const [amount, setAmount] = useState(0);
  const [transaction_type, setTransaction_type] = useState('saída');
  const [category_id, setCategory_id] = useState(1);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(true);
  
  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    console.log(amount)
    if (!amount) {
       return setError('O campo valor é obrigatório.');
    }

    const formValidation = await ValidationAddTransactionForm({
      amount,
      date: new Date(date),
    });

    if (formValidation.error) {
      return setError(formValidation.errorMessage);
    }

    try {
      const response = await api.put(
        `/transacao/${transactionId}`,
        {
          amount,
          transaction_type,
          category_id,
          date: new Date(date),
          description,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status > 204) return;

      const updatedCurrentTransactions = currentTransactions.map((transaction) => {
        if (transaction.id === transactionId) {
          transaction.amount = amount;
          transaction.transaction_type = transaction_type;
          transaction.category_id = category_id;
          transaction.date = new Date(date);
          transaction.description = description;

          return transaction;
        }

        return transaction;
      });

      const updatedDefaultTransactions = defaultTransactions.map((transaction) => {
        if (transaction.id === transactionId) {
          transaction.amount = amount;
          transaction.transaction_type = transaction_type;
          transaction.category_id = category_id;
          transaction.date = new Date(date);
          transaction.description = description;

          return transaction;
        }

        return transaction;
      });

      setCurrentTransactions([...updatedCurrentTransactions]);
      setDefaultTransactions([...updatedDefaultTransactions]);

      loadUserStatement();

      setOpenModalEditTransaction(false);
    } catch (error) {
      if (error.response.status < 500) {
        setError(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    async function loadTransaction() {
      try {
        const response = await api.get(`/transacao/${transactionId}`, {
          headers: {
            Authorization: token,
          },
        });
        
        if (response.status > 204) return;

        const [ day, month, year] = formatDate(response.data.date).split('/');

        const select = document.querySelector('#category');
        select.value = response.data.category_id;

        setAmount(response.data.amount);
        setCategory_id(response.data.category_id);
        setDate(`${year}-${month}-${day}`);
      } catch (error) {
        console.log(error);
      }
    }

    loadTransaction();
  }, []);

  return (
    <div className='edit-transaction'>
      <div className='edit-transaction__container'>
        <div className='edit-transaction__header'>
          <h1>Editar Registro</h1>
          <img
            className='edit-transaction__btn-close'
            src={Close}
            alt='fechar'
            onClick={() => setOpenModalEditTransaction(false)}
          />
        </div>

        <div className='edit-transaction__select-type'>
          <button
            className={`edit-transaction__cash-in${
              transaction_type === 'entrada' ? '--selected' : ''
            } `}
            onClick={() => setTransaction_type('entrada')}
          >
            Entrada
          </button>
          <button
            className={`edit-transaction__cash-out${
              transaction_type === 'saída' ? '--selected' : ''
            }`}
            onClick={() => setTransaction_type('saída')}
          >
            Saída
          </button>
        </div>

        <form className='edit-transaction__form' onSubmit={handleSubmit}>
          <label htmlFor='amount'>Valor</label>
          <input
            name='amount'
            id='amount'
            type='text'
            placeholder='R$ 0,00'
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />

          <label htmlFor='category'>Categoria</label>
          <select
            name='category'
            id='category'
            onChange={(e) => setCategory_id(e.target.value)}
          >
            {categories.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.description}
                </option>
              );
            })}
          </select>

          <label htmlFor='date'>Data</label>
          <input
            name='date'
            id='date'
            type='date'
            min="1000-01-01"
            max="9999-01-01"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          />

          <label htmlFor='description'>Descrição</label>
          <input
            name='description'
            id='description'
            type='text'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />

          {error && <p className='edit-transaction__error'>{error}</p>}

          <button>Confirmar</button>
        </form>
      </div>
    </div>
  );
}
