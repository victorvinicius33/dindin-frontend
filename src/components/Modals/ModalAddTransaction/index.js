import './style.css';
import { useState } from 'react';
import Close from '../../../assets/close.svg';
import MaskedInputMoney from '../../MaskedInputMoney';
import { ValidationTransactionForm } from '../../../validations/validationTransactionForm';
import api from '../../../services/api';
import { getItem, clear } from '../../../utils/localStorage';
import { maskMoneyToNumber } from '../../../utils/formatters';
import useGlobal from '../../../hooks/useGlobal';

export default function ModalAddTransaction({
  setOpenModalAddTransaction,
  categories,
  currentTransactions,
  setCurrentTransactions,
  defaultTransactions,
  setDefaultTransactions,
  loadUserStatement,
}) {
  const {
    setOpenModalSuccess,
    setSuccessMessage,
    setLoadingProgress,
    setMessageAlert,
    setErrorAlert,
    setSnackbarOpen,
  } = useGlobal();
  const token = getItem('token');
  const [amount, setAmount] = useState('');
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

    const formValidation = await ValidationTransactionForm({
      amount: maskMoneyToNumber(amount),
      date: formatedDate,
    });

    if (formValidation.error) {
      return setError(formValidation.errorMessage);
    }

    try {
      setLoadingProgress(true);

      const response = await api.post(
        '/transacao',
        {
          amount: maskMoneyToNumber(amount),
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
      setSuccessMessage('Registro adicionado com sucesso!');
      setOpenModalSuccess(true);
    } catch (error) {
      if (error.response.data === 'jwt expired') {
        clear();
        setMessageAlert('Sessão expirada, faça login novamente.');
        setErrorAlert(true);
        setSnackbarOpen(true);
        return;
      }

      if (error.response.status >= 500) {
        setMessageAlert('Erro interno, por favor tente novamente.');
        setErrorAlert(true);
        setSnackbarOpen(true);
        return;
      }

      setError(error.response.data.message);
    } finally {
      setLoadingProgress(false);
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
          <MaskedInputMoney
            name='amount'
            id='amount'
            value={amount}
            setValue={setAmount}
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
            min="1900-01-01"
            max="2100-01-01"
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
