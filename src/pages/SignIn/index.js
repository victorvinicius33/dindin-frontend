/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from '../../assets/logo.svg';
import { setItem, getItem } from '../../utils/localStorage';
import api from '../../services/api';
import { validationLoginForm } from '../../validations/validationLoginForm';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getItem('token');

    if (token) {
      navigate('/main');
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');

    const formValidation = await validationLoginForm({
      email,
      password,
    });
    
    if (formValidation.error) {
      return setError(formValidation.errorMessage);
    }

    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      if (response.status > 204) return;

      const { token, user } = response.data;

      setItem('token', token);
      setItem('userId', user.id);

      handleClearForm();
      navigate('/main');
    } catch (error) {
      if (error.response.status < 500) {
        setError(error.response.data.message);
      }
    }
  }

  function handleClearForm() {
    setEmail('');
    setPassword('');
  }
  
  return (
    <div className="sign-in">
      <img src={Logo} alt="logo" className="sign-in__logo" />

      <main className="sign-in__main">
        <div className="sign-in__left">
          <h1>
            Controle suas
            {' '}
            <span>finanças</span>
            , sem planilha chata.
          </h1>
          <p>
            Organizar suas finanças nunca foi tão fácil, com o DINDIN, você tem
            tudo num único lugar e em um clique de distância.
          </p>
          <button onClick={() => navigate('/sign-up')}>Cadastre-se</button>
        </div>

        <div className="sign-in__right">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <span className="sign-in__error-message">{error}</span>}
            <span className="sign-in__error-message">{error}</span>
            <button className="sign-in__btn-submit">Entrar</button>
          </form>
          <Link className="sign-in__link-to-sign-up" to="/sign-up">
            Não tem conta? clique para cadastrar!
          </Link>
        </div>
      </main>
    </div>
  );
}

export default SignIn;
