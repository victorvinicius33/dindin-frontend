import './style.css';
import { useNavigate } from 'react-router-dom';
import BlockError from '../../assets/block.png';

export default function NotFound() {
  const nav = useNavigate();

  return (
    <div className='not-found__container'>
      <div className='not-found__message'>
        <img src={BlockError} alt='não encontrado' />
        <h1>Erro 404: Página não encontrada</h1>
      </div>

      <div className='not-found__redirect'>
        <div className='not-found__redirect-login'>
          <h2>Deseja fazer login?</h2>
          <button
            onClick={() => nav('/')}
            type='button'
          >
            Login
          </button>
        </div>

        <div className='not-found__redirect-signup'>
          <h2>Ainda não possui uma conta?</h2>
          <button
            onClick={() => nav('/sign-up')}
            type='button'
          >
            Cadastrar-se
          </button>
        </div>
      </div>
    </div>
  );
}
