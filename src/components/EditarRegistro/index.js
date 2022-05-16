import './style.css';
import Close from '../../assets/close.svg';
import { useRef, useState, useEffect } from 'react';
import api from '../../services/api';
import { getItem } from '../../utils/localStorage';

export default function ModalEditarRegistro({ id, setMostrarEditarRegistro }) {
    const closeRef = useRef(null);
    const modalRef = useRef(null);
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState('saida');
    const [categoria, setCategoria] = useState(0);
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [erro, setErro] = useState(false);
    const token = getItem('token');

    async function lidarComEnvio(e) {
        e.preventDefault();

        try {
            const envio = await api.put(`transacao/${id}`, {
                valor,
                tipo,
                categoria_id: categoria,
                data,
                descricao
            }, {
                headers: {
                    Authorization: token
                }
            });

            if (envio.status > 204) return;

            setMostrarEditarRegistro(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
            setErro(error.response.data.mensagem);
        }
    }

    function atualizarCategoria(e) {
        setCategoria(e.target.value);
    }

    useEffect(() => {
        async function listarCategorias() {
            try {
                const response = await api.get('/categoria', {
                    headers: {
                        Authorization: token
                    }
                });

                setCategorias(response.data);
            } catch (error) {
                console.log(error.response.data.mensagem);
            }
        }


        listarCategorias();
    }, []);

    return (
        <div className="container-editar-registro" ref={modalRef}>
            <div className='div-formulario'>
                <div className='titulo-editar-registro'>
                    <h1>Editar Registro</h1>
                    <img
                        className='btn-close'
                        alt='Botão de fechar'
                        src={Close}
                        ref={closeRef}
                        onClick={() => setMostrarEditarRegistro(false)}
                    />
                </div>
                <div className='selecao-tipo-editar'>
                    <span
                        className={`selecoes-adicionar ${tipo === 'entrada'
                            ?
                            'selecao-entrada-adicionar'
                            :
                            ''} `}
                        onClick={() => setTipo('entrada')}
                    >
                        Entrada
                    </span>
                    <span
                        className={`selecoes-adicionar ${tipo === 'saida'
                            ?
                            'selecao-saida-adicionar'
                            : ''} `}
                        onClick={() => setTipo('saida')}
                    >
                        Saída
                    </span>
                </div>
                <form className='form-editar-registro' onSubmit={lidarComEnvio}>
                    <label htmlFor='valor'>Valor</label>
                    <input
                        type='text'
                        id='valor'
                        onChange={(e) => setValor(Number(e.target.value * 100))}
                    />

                    <label htmlFor='categoria' >Categoria</label>
                    <select id='categoria' onChange={(e) => atualizarCategoria(e)}>
                        <option value=''></option>
                        {
                            categorias.map((categoria) => {
                                return <option key={categoria.id} value={categoria.id}>{categoria.descricao}</option>
                            })
                        }
                    </select>

                    <label htmlFor='data'>Data</label>
                    <input
                        type='text'
                        id='data'
                        onChange={(e) => setData(e.target.value)}
                    />

                    <label htmlFor='descricao' >Descrição</label>
                    <input
                        type='text'
                        id='descricao'
                        onChange={(e) => setDescricao(e.target.value)}
                    />

                    {erro && <p className='erro-editar-registro'>{erro}</p>}

                    <button className='enviar-registro-editado' >Confirmar</button>
                </form>
            </div>
        </div>
    )
}