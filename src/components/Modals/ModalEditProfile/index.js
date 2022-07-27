/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import Close from '../../../assets/close.svg';
import { useState } from 'react';
import api from '../../../services/api';
import { validationEditProfileForm } from '../../../validations/validationEditProfileForm';
import { getItem, setItem, clear } from '../../../utils/localStorage';
import useGlobal from '../../../hooks/useGlobal';

export default function ModalEditProfile({
  setOpenModalEditProfile,
  profileData,
  setProfileData,
}) {
  const {
    setOpenModalSuccess,
    setSuccessMessage,
    setLoadingProgress,
    setMessageAlert,
    setErrorAlert,
    setSnackbarOpen,
  } = useGlobal();
  const [name, setName] = useState(profileData.name);
  const [email, setEmail] = useState(profileData.email);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const token = getItem('token');

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');

    const formValidation = await validationEditProfileForm({
      name,
      email,
      password,
      repeatPassword,
    });

    if (formValidation.error) {
      return setError(formValidation.errorMessage);
    }

    try {
      setLoadingProgress(true);

      const response = await api.put(
        '/usuario',
        {
          name,
          email,
          password,
          repeatPassword,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status > 204) return;

      const profileName = name.split(' ');

      setItem('userName', profileName[0]);

      setProfileData({ ...profileData, name, email });

      setOpenModalEditProfile(false);

      setSuccessMessage('Usuário editado com sucesso!');
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
    <div className='modal-backdrop'>
      <div className='modal-form__container'>
        <div className='edit-profile__header'>
          <h1>Editar Perfil</h1>
          <img
            src={Close}
            alt='Botão de fechar'
            onClick={() => setOpenModalEditProfile(false)}
            className='edit-profile__btn-close'
          />
        </div>

        <form className='edit-profile__form' onSubmit={handleSubmit}>
          <label htmlFor='name'>Nome</label>
          <input
            value={name}
            id='name'
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor='email'>E-mail</label>
          <input
            value={email}
            type='email'
            id='email'
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor='password'>Senha</label>
          <input
            value={password}
            type='password'
            id='password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor='confirm-password'>Confirmação de Senha</label>
          <input
            value={repeatPassword}
            type='password'
            id='confirm-password'
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />

          {error && <p className='edit-profile__error'>{error}</p>}

          <button>Confirmar</button>
        </form>
      </div>
    </div>
  );
}
