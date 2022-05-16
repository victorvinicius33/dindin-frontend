import './style.css';
import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setItem, getItem } from '../../utils/localStorage';
import api from '../../services/api';

function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getItem('token');

    if (token) {
      navigate('/main');
    }
  }, []);

  async function lidarComSubmissao(e) {
    e.preventDefault();

    try {
      const response = await api.post('/login', {
        email,
        senha
      });

      const { token, usuario } = response.data;

      setItem('token', token);
      setItem('userId', usuario.id);

      navigate('/main');
    } catch (error) {
      setErro(error.response.data.mensagem);
    }
  }

  return (
    <div className="container-login">
      <header className='login-logo'>
        <img src={Logo} alt='Logo' />
        <h1>Dindin</h1>
      </header>

      <main className='main-login'>

        <div className='apresentacao-login'>
          <h1>Controle suas <span>finanças</span>, sem planilha chata.</h1>
          <p>
            Organizar suas finanças nunca foi tão fácil, com o DINDIN, você tem tudo num único lugar e em um clique de distância.
          </p>
          <Link to='/sign-up' className='text-decoration-none'>
            <button className='btn-cadastre-se'>Cadastre-se</button>
          </Link>
        </div>

        <div className='login'>
          <h2>Login</h2>
          <form onSubmit={lidarComSubmissao}>
            <label htmlFor='email'>Email</label>
            <input
              type="email"
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor='password' >Password</label>
            <input
              type="password"
              id='password'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro && <p className='mensagem-erro-autenticacao'>{erro}</p>}

            <button className='btn-entrar'>Entrar</button>
          </form>
        </div>

      </main>
    </div>
  );
}

export default App;
