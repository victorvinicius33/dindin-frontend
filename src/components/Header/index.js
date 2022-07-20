/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import Profile from '../../assets/profile.svg';
import Logout from '../../assets/logout.svg';
import { getItem, clear } from '../../utils/localStorage';

export default function Header({setOpenEditProfile}) {
  const navigate = useNavigate();
  const userName = getItem('userName');

  async function handleLogout() {
    clear();
    navigate('/');
  }

  return (
    <header>
      <div className='header__container'>
        <img src={Logo} alt='dindin' className='header__logo' />

        <div className='header__profile-area'>
          <img
            src={Profile}
            alt='Profile'
            className='header__profile-logo'
            onClick={() => setOpenEditProfile(true)}
          />
          <h1 className='header__profile-name'>{userName}</h1>
          <img
            src={Logout}
            alt='Logout'
            className='header__logout'
            onClick={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}
