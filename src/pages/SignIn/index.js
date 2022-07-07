import './style.css';
import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setItem, getItem } from '../../utils/localStorage';
import api from '../../services/api';

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

    if (!email || !password) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    try {
      const response = await api.post('/login', {
        email,
        senha: password,
      });

      if (response.status > 204) return;

      const { token, usuario } = response.data;

      setItem('token', token);
      setItem('userId', usuario.id);

      handleClearForm();
      navigate('/main');
    } catch (error) {
      setError(error.response.data.mensagem);
    }
  }

  function handleClearForm() {
    setEmail('');
    setPassword('');
  }
  console.log(error);
  return (
    <div className='sign-in'>
      <header className='sign-in__logo'>
        <img src={Logo} alt='Logo' />
        <h1>Dindin</h1>
      </header>

      <main className='sign-in__main'>
        <div className='sign-in__left'>
          <h1>
            Controle suas <span>finanças</span>, sem planilha chata.
          </h1>
          <p>
            Organizar suas finanças nunca foi tão fácil, com o DINDIN, você tem
            tudo num único lugar e em um clique de distância.
          </p>
          <button onClick={() => navigate('/sign-up')}>Cadastre-se</button>
        </div>

        <div className='sign-in__right'>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <span className='sign-in__error-message'>{error}</span>}
            <span className='sign-in__error-message'>{error}</span>
            <button>Entrar</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SignIn;
