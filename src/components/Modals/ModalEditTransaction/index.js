/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import { useEffect, useState } from 'react';
import Close from '../../../assets/close.svg';
import MaskedInputMoney from '../../MaskedInputMoney';
import { ValidationTransactionForm } from '../../../validations/validationTransactionForm';
import api from '../../../services/api';
import { getItem, clear } from '../../../utils/localStorage';
import {
  formatDate,
  formatNumberToMoney,
  maskMoneyToNumber,
} from '../../../utils/formatters';
import useGlobal from '../../../hooks/useGlobal';

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
  const {
    setOpenModalSuccess,
    setSuccessMessage,
    setLoadingProgress,
    setMessageAlert,
    setErrorAlert,
    setSnackbarOpen,
  } = useGlobal();
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

    if (!amount) {
      return setError('O campo valor é obrigatório.');
    }

    const formValidation = await ValidationTransactionForm({
      amount: maskMoneyToNumber(amount),
      date: new Date(date),
    });

    if (formValidation.error) {
      return setError(formValidation.errorMessage);
    }

    try {
      setLoadingProgress(true);

      const response = await api.put(
        `/transacao/${transactionId}`,
        {
          amount: maskMoneyToNumber(amount),
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

      const updatedCurrentTransactions = currentTransactions.map(
        (transaction) => {
          if (transaction.id === transactionId) {
            transaction.amount = maskMoneyToNumber(amount);
            transaction.transaction_type = transaction_type;
            transaction.category_id = category_id;
            transaction.date = new Date(date);
            transaction.description = description;

            return transaction;
          }

          return transaction;
        }
      );

      const updatedDefaultTransactions = defaultTransactions.map(
        (transaction) => {
          if (transaction.id === transactionId) {
            transaction.amount = maskMoneyToNumber(amount);
            transaction.transaction_type = transaction_type;
            transaction.category_id = category_id;
            transaction.date = new Date(date);
            transaction.description = description;

            return transaction;
          }

          return transaction;
        }
      );

      setCurrentTransactions([...updatedCurrentTransactions]);
      setDefaultTransactions([...updatedDefaultTransactions]);

      loadUserStatement();

      setOpenModalEditTransaction(false);

      setSuccessMessage('Registro editado com sucesso!');
      setOpenModalSuccess(true);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoadingProgress(false);
    }
  }

  useEffect(() => {
    async function loadTransaction() {
      try {
        setLoadingProgress(true);

        const response = await api.get(`/transacao/${transactionId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status > 204) return;

        const [day, month, year] = formatDate(response.data.date).split('/');

        const select = document.querySelector('#category');
        select.value = response.data.category_id;

        setTransaction_type(response.data.transaction_type);
        setAmount(formatNumberToMoney(response.data.amount));
        setDate(`${year}-${month}-${day}`);
        setCategory_id(response.data.category_id);
        setDescription(response.data.description);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoadingProgress(false);
      }
    }

    loadTransaction();
  }, []);

  function handleApiError(error) {
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

    setMessageAlert(error.response.data.message);
    setErrorAlert(true);
    setSnackbarOpen(true);
  }

  return (
    <div className='modal-backdrop'>
      <div className='modal-form__container'>
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
          <MaskedInputMoney
            name='amount'
            id='amount'
            setValue={setAmount}
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
            min='1900-01-01'
            max='2100-01-01'
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
