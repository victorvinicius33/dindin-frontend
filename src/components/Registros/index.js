import './style.css';
import Lapis from '../../assets/pencil.svg';
import Lixeira from '../../assets/trash-bin.svg';
import BalaoApagar from '../../assets/baloon.svg';
import EditarRegistro from '../EditarRegistro/index';
import { useEffect, useRef, useState } from 'react';
import { getItem } from '../../utils/localStorage';
import api from '../../services/api';

export default function Registro({ id, data, descricao, categoria, valor, tipo }) {
    const [opcoes, setOpcoes] = useState('none');
    const [mostrarEditarRegistro, setMostrarEditarRegistro] = useState(false);
    const opcoesRef = useRef(null);
    const token = getItem('token');

    const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const dataDaTransacao = new Date(data);

    let mes = dataDaTransacao.getMonth() + 1;
    let dia = dataDaTransacao.getDate();

    if (mes < 10) {
        mes = '0' + mes;
    }

    if (dia < 10) {
        dia = '0' + dia;
    }

    const dataFormatada = `${dia}/${mes}/${dataDaTransacao.getFullYear()}`;
    const diaDaTransacao = diasDaSemana[dataDaTransacao.getDay()];


    function lidarComBotaoDeDeletar() {
        opcoes === 'none' ? setOpcoes('flex') : setOpcoes('none');
        opcoesRef.current.style.display = opcoes;
    }
    useEffect(() => {
        lidarComBotaoDeDeletar();
    }, []);

    useEffect((lidarComBotaoDeDeletar), []);

    async function lidarComConfirmacaoDeDeletar() {
        try {
            const response = await api.delete(`/transacao/${id}`, {
                headers: {
                    Authorization: token
                }
            });

            window.location.reload();

            return;
        } catch (error) {
            console.log(error.response.data);
        }
    }

    return (

        <div className='registro-container'>

            <div className='container-data'>
                <span className='registro-data'>{dataFormatada}</span>
            </div>

            <div className='registro-dia'>
                <span >{diaDaTransacao}</span>
            </div>

            <div className='registro-descricao'>
                <span>{!descricao ? '-' : descricao}</span>
            </div>

            <div className='registro-categoria'>
                <span>{categoria}</span>
            </div>

            <div>
                <span
                    className={`registro-valor ${tipo === 'entrada'
                        ?
                        'tipo-entrada'
                        :
                        'tipo-saida'}`}
                >
                    {valor}
                </span>
            </div>

            <div className='registro-opcoes'>
                <img
                    src={Lapis}
                    alt='Lápis'
                    onClick={() => setMostrarEditarRegistro(true)}
                />

                <img
                    src={Lixeira}
                    alt='Lixeira'
                    onClick={lidarComBotaoDeDeletar}
                />
                <div className='balao-apagar' ref={opcoesRef}>
                    <img src={BalaoApagar} alt='Botão de apagar' />
                    <div className='opcoes-apagar'>
                        <p>Apagar item?</p>
                        <div>
                            <button className='blue-color' onClick={lidarComConfirmacaoDeDeletar}>Sim</button>
                            <button className='red-color' onClick={lidarComBotaoDeDeletar}>Não</button>
                        </div>
                    </div>
                </div>
            </div>
            {mostrarEditarRegistro && <EditarRegistro id={id} setMostrarEditarRegistro={setMostrarEditarRegistro} />}
        </div>
    )

}