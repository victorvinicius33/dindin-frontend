import './style.css';
import Close from '../../assets/close.svg';
import { useState } from 'react';
import api from '../../services/api';
import { getItem } from '../../utils/localStorage';

export default function ModalAdicionarRegistro({ setOpenModalAddRegister, categories }) {
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('saida');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(0);
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState(true);
    const token = getItem('token');

    async function lidarComEnvio(e) {
        e.preventDefault();

        try {
            const response = await api.post('/transacao', {
                valor: valor,
                tipo,
                categoria_id: categoriaSelecionada,
                data,
                descricao
            }, {
                headers: {
                    Authorization: token
                }
            });

            if (response.status > 204) return;

            setOpenModalAddRegister(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
            setErro(error.response.data.mensagem);
        }
    }

    return (
        <div className="container-adicionar-registro">
            <div className='div-principal' >
                <div className='titulo-adicionar-registro'>
                    <h1>Adicionar Registro</h1>
                    <img
                        className='btn-close'
                        src={Close}
                        alt='Botão de fechar'
                        onClick={() => setOpenModalAddRegister(false)}
                    />
                </div>

                <div className='selecao-tipo'>
                    <span className={`selecoes-editar ${tipo === 'entrada' ? 'selecao-entrada-editar' : ''} `} onClick={() => setTipo('entrada')}>Entrada</span>
                    <span className={`selecoes-editar ${tipo === 'saida' ? 'selecao-saida-editar' : ''} `} onClick={() => setTipo('saida')}>Saída</span>
                </div>

                <form className='form-adicionar-registro' onSubmit={(e) => lidarComEnvio(e)}>
                    <label htmlFor='valor'>Valor</label>
                    <input type='text' id='valor' placeholder='RS 000.00' onChange={(e) => setValor(Number(e.target.value * 100))}/>

                    <label htmlFor='categoria'>Categoria</label>
                    <select id='categoria' className='seletor-categoria' onChange={(e) => setCategoriaSelecionada(e.target.value)}>
                        <option key={0} value=''></option>
                    {
                        categories.map((categoria) => {
                            return <option key={categoria.id} value={String(categoria.id)}>{categoria.descricao}</option>
                        })
                    }
                    </select>

                    <label htmlFor='data'>Data</label>
                    <input type='text' id='data' onChange={(e) => setData(e.target.value)} />

                    <label htmlFor='descricao'>Descrição</label>
                    <input type='text' id='descricao' onChange={(e) => setDescricao(e.target.value)} />

                    {erro && <p className='erro-adicionar-registro'>{erro}</p>}

                    <button className='enviar-registro'>Confirmar</button>
                </form>

            </div>
        </div>
    )
}