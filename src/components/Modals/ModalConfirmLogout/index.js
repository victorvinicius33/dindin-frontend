import './style.css';
import CloseIcon from '../../../assets/close-icon.svg';
import AlertYellowIcon from '../../../assets/alert-yellow-icon.svg';
import { clear } from '../../../utils/localStorage';
import { useNavigate } from 'react-router-dom';

export default function ModalConfirmLogout({ setOpenModalConfirmLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    clear();
    setOpenModalConfirmLogout(false);
    navigate('/');
  }

  return (
    <div className='modal-backdrop'>
      <div className='modal-confirm-logout__container modal-confirm-operation'>
        <button className='modal-confirm-logout__btn-close'>
          <img
            onClick={() => setOpenModalConfirmLogout(false)}
            src={CloseIcon}
            alt='fechar'
          />
        </button>
        <img
          className='modal-confirm-logout__alert-icon'
          src={AlertYellowIcon}
          alt='alerta'
        />
        <h1>Deseja encerrar a sessão?</h1>
        <div className='modal-confirm-logout__btns'>
          <button
            className='modal-confirm-logout__btn-cancel'
            onClick={() => setOpenModalConfirmLogout(false)}
          >
            Não
          </button>
          <button
            className='modal-delete-transaction__btn-confirm'
            onClick={handleLogout}
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}
