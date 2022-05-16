import './style.css';
import Close from '../../assets/close.svg';
import { useState } from 'react';
import api from '../../services/api';
import { getItem } from '../../utils/localStorage';

export default function ModalEditarPerfil({ setEditandoPerfil, nomeUsuario, emailUsuario }) {
    const [form, setForm] = useState({
        nome: nomeUsuario,
        email: emailUsuario,
        senha: '',
        confirmarSenha: ''
    });
    const [erro, setErro] = useState('');
    const token = getItem('token');

    async function lidarComEditarPerfil(e) {
        e.preventDefault();

        try {
            if (form.senha !== form.confirmarSenha) {
                return setErro('As senhas não conferem.');
            }

            const response = await api.put('/usuario', {
                nome: form.nome,
                email: form.email,
                senha: form.senha
            }, {
                headers: {
                    Authorization: token
                }
            });

            if (response.status > 204) {
                return setErro(response.data.mensagem);
            }

            setEditandoPerfil(false);
            window.location.reload();
        } catch (error) {
            setErro(error.response.data.mensagem);
        }
    }

    function lidarComMudancaNoForm(e) {
        const value = e.target.value;

        setForm({ ...form, [e.target.name]: value });
    }

    function lidarComBotaoDeFechar() {
        setEditandoPerfil(false);

        setForm({
            nome: nomeUsuario,
            email: emailUsuario,
            senha: '',
            confirmarSenha: ''
        });
    }

    return (
        <div className="container-editar-perfil">
            <div className='div-form-perfil'>
                <div className='titulo-editar-perfil'>
                    <h1>Editar Perfil</h1>
                    <img
                        src={Close}
                        alt='Botão de fechar'
                        onClick={() => lidarComBotaoDeFechar()}
                        className='btn-close'
                    />
                </div>

                <form className='form-editar-perfil' onSubmit={lidarComEditarPerfil}>
                    <label htmlFor='nome'>Nome</label>
                    <input
                        value={form.nome}
                        name='nome'
                        id='nome'
                        onChange={(e) => lidarComMudancaNoForm(e)}
                        required
                    />

                    <label htmlFor='email'>E-mail</label>
                    <input
                        value={form.email}
                        name='email'
                        type='email'
                        id='email'
                        onChange={(e) => lidarComMudancaNoForm(e)}
                        required
                    />

                    <label htmlFor='senha'>Senha</label>
                    <input
                        value={form.senha}
                        name='senha'
                        type='password'
                        id='senha'
                        onChange={(e) => lidarComMudancaNoForm(e)}
                        required
                    />

                    <label htmlFor='confirm-senha' >Confirmação de Senha</label>
                    <input
                        value={form.confirmarSenha}
                        name='confirmarSenha'
                        type='password'
                        id='confirm-senha'
                        onChange={(e) => lidarComMudancaNoForm(e)}
                        required
                    />

                    {erro && <p className='erro-editar-perfil'>{erro}</p>}

                    <button className='enviar-perfil-editado' >Confirmar</button>
                </form>
            </div>
        </div>
    )
}