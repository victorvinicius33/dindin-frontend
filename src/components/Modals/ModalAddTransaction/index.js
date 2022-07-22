import './style.css';
import { useState } from 'react';
import Close from '../../../assets/close.svg';
import { ValidationAddTransactionForm } from '../../../validations/validationAddTransactionForm';
import api from '../../../services/api';
import { getItem } from '../../../utils/localStorage';

export default function ModalAddTransaction({
  setOpenModalAddTransaction,
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

    const [day, month, year] = date.split('/');
    const formatedDate = new Date(`${year}-${month}-${day}`);

    const formValidation = await ValidationAddTransactionForm({
      amount,
      date: formatedDate,
    });

    if (formValidation.error) {
      return setError(formValidation.errorMessage);
    }

    try {
      const response = await api.post(
        '/transacao',
        {
          amount,
          transaction_type,
          category_id,
          date: formatedDate,
          description,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status > 204) return;

      setCurrentTransactions([...currentTransactions, response.data]);
      setDefaultTransactions([...defaultTransactions, response.data]);

      loadUserStatement();

      setOpenModalAddTransaction(false);
    } catch (error) {
      if (error.response.status < 500) {
        setError(error.response.data.message);
      }
    }
  }

  return (
    <div className='add-transaction'>
      <div className='add-transaction__container'>
        <div className='add-transaction__header'>
          <h1>Adicionar Registro</h1>
          <img
            className='add-transaction__btn-close'
            src={Close}
            alt='fechar'
            onClick={() => setOpenModalAddTransaction(false)}
          />
        </div>

        <div className='add-transaction__select-type'>
          <button
            className={`add-transaction__cash-in${
              transaction_type === 'entrada' ? '--selected' : ''
            } `}
            onClick={() => setTransaction_type('entrada')}
          >
            Entrada
          </button>
          <button
            className={`add-transaction__cash-out${
              transaction_type === 'saída' ? '--selected' : ''
            }`}
            onClick={() => setTransaction_type('saída')}
          >
            Saída
          </button>
        </div>

        <form className='add-transaction__form' onSubmit={handleSubmit}>
          <label htmlFor='amount'>Valor</label>
          <input
            name='amount'
            id='amount'
            type='text'
            placeholder='R$ 0,00'
            onChange={(e) => setAmount(e.target.value)}
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
            type='text'
            onChange={(e) => setDate(e.target.value)}
          />

          <label htmlFor='description'>Descrição</label>
          <input
            name='description'
            id='description'
            type='text'
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <p className='add-transaction__error'>{error}</p>}

          <button>Confirmar</button>
        </form>
      </div>
    </div>
  );
}