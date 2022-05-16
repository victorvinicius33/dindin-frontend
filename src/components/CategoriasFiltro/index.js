import './style.css';
import Sinal from '../../assets/plus-sign.svg';
import Fechar from '../../assets/close-category.svg';
import { useEffect, useRef, useState } from 'react';

export default function CategoriaFiltro({ categoria, id }) {
    const marcadoRef = useRef(null);
    const sinalRef = useRef(null);
    const [marcado, setMarcado] = useState(false);

    function lidarComCategoriaSelecionada() {
        const clicado = true;
        marcado ? setMarcado(!clicado) : setMarcado(clicado);

        if (marcado) {
            marcadoRef.current.style.backgroundColor = '#7978D9';
            marcadoRef.current.style.color = '#FFFFFF';
            sinalRef.current.src = Fechar;
        } else {
            marcadoRef.current.style.backgroundColor = '#FAFAFA';
            marcadoRef.current.style.color = '#000000';
            sinalRef.current.src = Sinal;
        }
    }

    useEffect((lidarComCategoriaSelecionada), []);

    return (
        <span
            className='filtro-container'
            ref={marcadoRef}
            onClick={lidarComCategoriaSelecionada}
            id={id}
        >
            {categoria}
            <img ref={sinalRef} src={Sinal} alt='sinal' />
        </span>
    )
}