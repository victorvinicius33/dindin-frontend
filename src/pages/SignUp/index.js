import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../../services/api';
import Logo from '../../assets/logo.svg';
import { validationSignUpForm } from '../../validations/validationSignUpForm';
import useGlobal from '../../hooks/useGlobal';

function SignUp() {
  const {
    setLoadingProgress,
    setMessageAlert,
    setErrorAlert,
    setSnackbarOpen,
  } = useGlobal();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');

    const formValidation = await validationSignUpForm({
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

      const response = await api.post('/usuario', {
        name,
        email,
        password,
        repeatPassword,
      });

      if (response.status > 204) return;

      handleClearForm();
      navigate('/');
    } catch (error) {
      if (error.response.status >= 500) {
        setMessageAlert('Erro interno, por favor tente novamente.');
        setErrorAlert(true);
        setSnackbarOpen(true);
        return;
      }

      setError(error.response.data);
    } finally {
      setLoadingProgress(false);
    }
  }

  function handleClearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  }

  return (
    <div className='sign-up'>
      <img className='sign-up__header' src={Logo} alt='logo' />

      <div className='sign-up__form'>
        <h2>Cadastre-se</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor='name'>Nome</label>
          <input
            id='name'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor='password'>Senha</label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor='confirm-password'>Confirmação de senha</label>
          <input
            id='confirm-password'
            type='password'
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />

          {error && <p className='sign-up__error-message'>{error}</p>}

          <button>Cadastrar</button>
        </form>

        <Link to='/' style={{ textDecoration: 'none' }}>
          Já tem cadastro? Clique aqui!
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
