/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import Close from '../../assets/close.svg';
import { useState } from 'react';
import api from '../../services/api';
import { getItem, setItem } from '../../utils/localStorage';

export default function ModalEditarPerfil({
  setOpenEditProfile,
  profileData,
  setProfileData,
}) {
  const [name, setName] = useState(profileData.name);
  const [email, setEmail] = useState(profileData.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const token = getItem('token');

  async function lidarComEditarPerfil(e) {
    e.preventDefault();

    try {
      const response = await api.put(
        '/usuario',
        {
          name,
          email,
          password,
          confirmPassword,
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

      setOpenEditProfile(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  return (
      <div className='edit-profile'>
        <div className='edit-profile__container'>
          <div className='edit-profile__header'>
            <h1>Editar Perfil</h1>
            <img
              src={Close}
              alt='Botão de fechar'
              onClick={() => setOpenEditProfile(false)}
              className='edit-profile__btn-close'
            />
          </div>

          <form className='edit-profile__form' onSubmit={lidarComEditarPerfil}>
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
              value={confirmPassword}
              type='password'
              id='confirm-password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <p className='edit-profile__error'>{error}</p>}

            <button>Confirmar</button>
          </form>
        </div>
      </div>
  );
}
