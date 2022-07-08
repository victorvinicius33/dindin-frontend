/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from '../../assets/logo.svg';
import Profile from '../../assets/profile.svg';
import Logout from '../../assets/logout.svg';
import { getItem, clear } from '../../utils/localStorage';
import api from '../../services/api';
import EditarPerfil from '../EditarPerfil/index';

export default function Header() {
  const [perfilAtual, setPerfilAtual] = useState({});
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const token = getItem('token');

  useEffect(() => {
    async function carregarDadosDoUsuario() {
      try {
        const response = await api.get('/usuario', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status > 204) {
          return;
        }

        setPerfilAtual(response.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    carregarDadosDoUsuario();
  }, []);

  async function lidarComLogout() {
    clear();
  }

  return (
    <div>
      {editandoPerfil && (
        <EditarPerfil
          setEditandoPerfil={setEditandoPerfil}
          nomeUsuario={perfilAtual.nome}
          emailUsuario={perfilAtual.email}
        />
      )}
      <header className="container-header">
        <div className="logo-dindin">
          <img src={Logo} alt="Logo" className="logo" />
        </div>

        <div className="logged-info">
          <div>
            <img
              src={Profile}
              alt="Profile logo"
              className="profile-logo"
              onClick={() => setEditandoPerfil(true)}
            />
            <h1 className="profile-name">{perfilAtual.nome}</h1>

            <Link onClick={() => lidarComLogout()} to="/">
              <img src={Logout} alt="Logout" className="logout-logo" />
            </Link>
          </div>
        </div>
      </header>
      <div className="content-page">
        <Outlet />
      </div>
    </div>
  );
}
