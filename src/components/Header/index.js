/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from '../../assets/logo.svg';
import Profile from '../../assets/profile.svg';
import Logout from '../../assets/logout.svg';
import { getItem, clear } from '../../utils/localStorage';
import api from '../../services/api';
import EditarPerfil from '../EditarPerfil/index';

export default function Header() {
  const [profileData, setProfileData] = useState({});
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const token = getItem('token');

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get('/usuario', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status > 204) {
          return;
        }

        const profileFirstName = response.data.name.split(' ');

        setProfileData({...response.data, name: profileFirstName[0]});
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    loadProfile();
  }, []);

  async function lidarComLogout() {
    clear();
  }

  return (
    <header className='header'>
      <div className='header__container'>
        <img src={Logo} alt='dindin' className='header__logo' />

        <div className='header__profile-area'>
          <img
            src={Profile}
            alt='Profile logo'
            className='header__profile-logo'
            onClick={() => setEditandoPerfil(true)}
          />
          <h1 className='header__profile-name'>{profileData.name}</h1>

          <Link onClick={() => lidarComLogout()} to='/'>
            <img src={Logout} alt='Logout' className='logout-logo' />
          </Link>
        </div>
      </div>

      {editandoPerfil && (
        <EditarPerfil
          setEditandoPerfil={setEditandoPerfil}
          nomeUsuario={profileData.name}
          emailUsuario={profileData.email}
        />
      )}
    </header>
  );
}
