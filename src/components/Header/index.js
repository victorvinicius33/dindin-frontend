/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import Logo from '../../assets/logo.svg';
import Profile from '../../assets/profile.svg';
import Logout from '../../assets/logout.svg';
import ModalConfirmLogout from '../Modals/ModalConfirmLogout';
import { getItem } from '../../utils/localStorage';
import { useEffect, useState } from 'react';

export default function Header({ setOpenModalEditProfile }) {
  const userName = getItem('userName');
  const [openModalConfirmLogout, setOpenModalConfirmLogout] = useState(false);

  useEffect(() => {
    if (openModalConfirmLogout) {
      document.documentElement.style.overflow = 'hidden';
      document.body.scroll = 'no';
    } else {
      document.documentElement.style.overflow = 'auto';
      document.body.scroll = 'yes';
    }
  }, [openModalConfirmLogout]);

  return (
    <header>
      <div className='header__container'>
        <img src={Logo} alt='dindin' className='header__logo' />

        <div className='header__profile-area'>
          <img
            src={Profile}
            alt='Profile'
            className='header__profile-logo'
            onClick={() => setOpenModalEditProfile(true)}
          />
          <h1 className='header__profile-name'>{userName}</h1>
          <img
            src={Logout}
            alt='Logout'
            className='header__logout'
            onClick={() => setOpenModalConfirmLogout(true)}
          />
        </div>
      </div>
      {openModalConfirmLogout && (
        <ModalConfirmLogout
          setOpenModalConfirmLogout={setOpenModalConfirmLogout}
        />
      )}
    </header>
  );
}
