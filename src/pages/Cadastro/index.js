import './style.css';
import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useState } from 'react';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  async function lidarComSubmissao(e) {
    e.preventDefault();

    try {

      if (senha !== confirmarSenha) return setErro('Senhas não conferem.'); 

      const response = await api.post('/usuario', {
        email,
        nome,
        senha
      });

      navigate('/login');
    } catch (error) {
      setErro(error.response.data.mensagem);
    }
  }

  return (
    <div className="container-cadastro">
      <header className='logo-cadastro'>
        <img src={Logo} alt='Logo' />
        <h1>Dindin</h1>
      </header>

      <main className='main-cadastro'>

        <div className='cadastro'>
          <h2>Cadastre-se</h2>
          <form onSubmit={lidarComSubmissao}>
            <label htmlFor='nome'>Nome</label>
            <input
              name='nome'
              type='text'
              id='nome'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label htmlFor='email'>Email</label>
            <input
              name='email'
              type="email"
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor='password' >Senha</label>
            <input
              name='senha'
              type="password"
              id='senha'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <label htmlFor='confirm-password' >Confirmação de senha</label>
            <input
              name='confirmarSenha'
              type="password"
              id='confirmar-senha'
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />

            {erro && <p className='mensagem-erro-cadastro'>{erro}</p>}

            <button className='btn-cadastrar'>Cadastrar</button>
          </form>
          <Link to='/' className='text-decoration-none'>Já tem cadastro? Clique aqui!</Link>
        </div>

      </main>
    </div>
  );
}

export default Cadastro;
