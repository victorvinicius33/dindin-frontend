import './style.css';
import Header from '../../components/Header';
import Filter from '../../assets/filter.svg';
import UpArrow from '../../assets/upArrow.svg';
import AdicionarRegistro from '../../components/AdicionarRegistro/index';
import Registro from '../../components/Registros/index';
import CategoriasFiltro from '../../components/CategoriasFiltro/index';
import { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import { getItem } from '../../utils/localStorage';

function Home() {
  const [transacoes, setTransacoes] = useState([]);
  const [extrato, setExtrato] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filter, setFilter] = useState('none');
  const [mostrarAddRegistro, setMostrarAddRegistro] = useState(false);
  const [ordenarPorData, setOrdenarPorData] = useState('crescente');
  const categoryRef = useRef(null);
  const token = getItem('token');

  useEffect(() => {
    async function carregarTransacoes() {
      try {
        const response = await api.get('/transacao', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status > 204) return;

        ordenarPorDataCrescente(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    async function entradasESaidas() {
      try {
        const response = await api.get('/extrato', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status > 204) return;

        setExtrato(response.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    async function listarCategorias() {
      try {
        const response = await api.get('/categoria', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status > 204) return;

        setCategorias(response.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    carregarTransacoes();
    entradasESaidas();
    listarCategorias();
  }, []);

  function categoriaDoProduto(categoria_id) {
    const categoria = categorias.find((categoria) => {
      return categoria.id === categoria_id;
    });

    if (!categoria) return '-';

    return categoria.descricao;
  }

  function converterCentavosEmReais(valorEmCentavos) {
    const valorEmReais = 'R$ ' + (valorEmCentavos / 100).toFixed(2);

    return valorEmReais.replace('.', ',');
  }

  function ordenarPorDataCrescente(arr) {
    const arrOrdenado = arr.sort((a, b) => {
      return new Date(a.data) - new Date(b.data);
    });

    setTransacoes(arrOrdenado);
    return;
  }

  function ordenarPorDataDecrescente(arr) {
    const arrOrdenado = arr.sort((a, b) => {
      return new Date(b.data) - new Date(a.data);
    });

    setTransacoes(arrOrdenado);
    return;
  }

  function lidarComOrdenacaoPorData() {
    if (ordenarPorData === 'crescente') {
      setOrdenarPorData('descrecente');
      ordenarPorDataDecrescente(transacoes);
    } else {
      setOrdenarPorData('crescente');
      ordenarPorDataCrescente(transacoes);
    }
  }

  function lidarComMostrarFiltros() {
    filter === 'none' ? setFilter('block') : setFilter('none');

    categoryRef.current.style.display = filter;
  }

  useEffect(lidarComMostrarFiltros, []);

  return (
    <div>
      <Header />
      <div className='main-home-container'>
        <div className='main-home'>
          <div className='div-filter'>
            <span className='filter-button' onClick={lidarComMostrarFiltros}>
              <img src={Filter} alt='Imagem de filtro' />
              Filtrar
            </span>
          </div>

          <div className='filter-list' ref={categoryRef}>
            <p className='category-list-title'>Categoria</p>
            <div className='container-filters'>
              {categorias.map((categoria) => (
                <div key={categoria.id}>
                  <CategoriasFiltro
                    id={categoria.id}
                    categoria={categoria.descricao}
                  />
                </div>
              ))}
            </div>

            <button className='btn-clear-filter'>Limpar Filtros</button>
            <button className='btn-apply-filter'>Aplicar Filtros</button>
          </div>

          <div className='table-header'>
            <span
              onClick={() => lidarComOrdenacaoPorData()}
              className='cursor-pointer'
            >
              Data <img src={UpArrow} alt='seta para cima' />
            </span>
            <span>Dia da semana</span>
            <span>Descrição</span>
            <span>Categoria</span>
            <span>Valor</span>
          </div>
          <div>
            {transacoes.map((transacao) => (
              <div key={transacao.id}>
                <Registro
                  id={transacao.id}
                  data={transacao.data}
                  descricao={transacao.descricao}
                  categoria={categoriaDoProduto(transacao.categoria_id)}
                  valor={converterCentavosEmReais(transacao.valor)}
                  tipo={transacao.tipo}
                />
              </div>
            ))}
          </div>
        </div>
        <div className='resumo-container'>
          <div className='resumo'>
            <h2>Resumo</h2>
            <div className='resumo-entrada'>
              <span>Entradas</span>
              <p>{converterCentavosEmReais(extrato.entrada)}</p>
            </div>
            <div className='resumo-saida'>
              <span>Saídas</span>
              <p>{converterCentavosEmReais(extrato.saida)}</p>
            </div>
            <hr />
            <div className='resumo-saldo'>
              <span>Saldo</span>
              <p>{converterCentavosEmReais(extrato.entrada - extrato.saida)}</p>
            </div>
          </div>

          <button onClick={() => setMostrarAddRegistro(true)}>
            Adicionar Registro
          </button>
          {mostrarAddRegistro && (
            <AdicionarRegistro
              setMostrarAddRegistro={setMostrarAddRegistro}
              categorias={categorias}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
