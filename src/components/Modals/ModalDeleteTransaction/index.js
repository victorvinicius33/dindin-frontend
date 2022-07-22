import './style.css';
import CloseIcon from '../../../assets/close-icon.svg';
import AlertYellowIcon from '../../../assets/alert-yellow-icon.svg';
import api from '../../../services/api';
import { getItem } from '../../../utils/localStorage';
import { formatNumberToMoney } from '../../../utils/formatters';

export default function ModalDeleteTransaction({
  transaction_id,
  setOpenDeleteTransaction,
  defaultTransactions,
  currentTransactions,
  setCurrentTransactions,
  setStatement,
}) {
  const token = getItem('token');

  async function handleDeleteTransaction() {
    try {
      const response = await api.delete(`/transacao/${transaction_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status > 204) return;

      const updateTransactions = defaultTransactions.filter((transaction) => {
        return transaction.id !== transaction_id;
      });

      setCurrentTransactions([...updateTransactions]);

      let cashIn = 0;
      let cashOut = 0;

      currentTransactions.forEach((transaction) => {
        if (transaction.transaction_type === 'entrada') {
          cashIn += transaction.amount;
        } else if (transaction.transaction_type === 'saída') {
          cashOut += transaction.amount;
        }
      });

      setStatement({
        cashIn: formatNumberToMoney(cashIn),
        cashOut: formatNumberToMoney(cashOut),
        balance: formatNumberToMoney(cashIn - cashOut),
      });
      
      setOpenDeleteTransaction(false);
    } catch (error) {
      console.log(error.response.message);
    }
  }

  return (
    <div className='modal-delete-transaction'>
      <div className='modal-delete-transaction__container'>
        <button className='modal-delete-transaction__btn-close'>
          <img
            onClick={() => setOpenDeleteTransaction(false)}
            src={CloseIcon}
            alt='fechar'
          />
        </button>
        <img
          className='modal-delete-transaction__alert-icon'
          src={AlertYellowIcon}
          alt='alerta'
        />
        <h1>Tem certeza que deseja excluir essa transação?</h1>
        <div className='modal-delete-transaction__btns'>
          <button
            className='modal-delete-transaction__btn-cancel'
            onClick={() => setOpenDeleteTransaction(false)}
          >
            Não
          </button>
          <button
            className='modal-delete-transaction__btn-confirm'
            onClick={() => handleDeleteTransaction()}
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}
