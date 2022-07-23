import './style.css';
import SuccessGreen from '../../../assets/success-green-icon.svg';
import useGlobal from '../../../hooks/useGlobal';
import { useEffect } from 'react';

export default function ModalSuccess() {
  const { successMessage, openModalSuccess, setOpenModalSuccess } = useGlobal();

  useEffect(() => {
    if (openModalSuccess) {
      function handleSuccessModal() {
        const closeSuccessModal = setTimeout(() => {
          setOpenModalSuccess(false);
        }, 2000);

        return () => closeSuccessModal(successMessage);
      }

      handleSuccessModal();
    }
  }, [openModalSuccess, setOpenModalSuccess, successMessage]);

  return (
    <div className='modal-success'>
      <div className='modal-success__container'>
        <img src={SuccessGreen} alt='sucesso' />
        <h1 className='modal-success__message'>{successMessage}</h1>
      </div>
    </div>
  );
}
