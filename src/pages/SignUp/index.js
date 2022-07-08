import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../../services/api';
import Logo from '../../assets/logo.svg';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');

    const formError = formValidation();

    if (formError) return setError(formError);

    try {
      const response = await api.post('/usuario', {
        email,
        nome: name,
        senha: password,
      });

      if (response.status > 204) return;

      handleClearForm();
      navigate('/login');
    } catch (error) {
      setError(error.response.data.mensagem);
    }
  }

  function formValidation() {
    if (!name) {
      return "O campo 'Nome' é obrigatório.";
    }
    if (!email) {
      return "O campo 'Email' é obrigatório.";
    }
    if (!email.includes('@' && '.')) {
      return 'Insira um email válido';
    }
    if (!password) {
      return "O campo 'Senha' é obrigatório.";
    }
    if (password !== confirmPassword) {
      return 'Senhas não conferem.';
    }

    return '';
  }

  function handleClearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  }

  return (
    <div className="sign-up">
      <img className="sign-up__header" src={Logo} alt="logo" />

      <div className="sign-up__form">
        <h2>Cadastre-se</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirm-password">Confirmação de senha</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="sign-up__error-message">{error}</p>}

          <button>Cadastrar</button>
        </form>

        <Link to="/" style={{ textDecoration: 'none' }}>
          Já tem cadastro? Clique aqui!
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
