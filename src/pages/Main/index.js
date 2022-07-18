import './style.css';
import Header from '../../components/Header';
import Filter from '../../assets/filter.svg';
import UpArrow from '../../assets/upArrow.svg';
import AdicionarRegistro from '../../components/AdicionarRegistro/index';
import Registro from '../../components/Registros/index';
import CategoriasFiltro from '../../components/CategoriasFiltro/index';
import { formatNumberToMoney } from '../../utils/formatters';
import { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import { getItem } from '../../utils/localStorage';

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [extrato, setExtrato] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('none');
  const [mostrarAddRegistro, setMostrarAddRegistro] = useState(false);
  const [sortByDate, setSortByDate] = useState('crescente');
  const categoryRef = useRef(null);
  const token = getItem('token');

  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await api.get('/transacao', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status > 204) return;

        sortByAscendingDate(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    async function loadUserStatement() {
      try {
        const response = await api.get('/transacao/extrato', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status > 204) return;

        setExtrato(response.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    async function loadCategories() {
      try {
        const response = await api.get('/categoria', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status > 204) return;

        setCategories(response.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    loadTransactions();
    loadUserStatement();
    loadCategories();
  }, []);

  function categoriaDoProduto(category_id) {
    const categoryName = categories.find((category) => {
      return category.id === category_id;
    });

    if (!categoryName) return '-';

    return categoryName.description;
  }

  function sortByAscendingDate(arr) {
    const arrOrdenado = arr.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    setTransactions(arrOrdenado);
    return;
  }

  function sortByDescendingDate(arr) {
    const arrOrdenado = arr.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    setTransactions(arrOrdenado);
    return;
  }

  function lidarComOrdenacaoPorData() {
    if (sortByDate === 'crescente') {
      setSortByDate('descrecente');
      sortByDescendingDate(transactions);
    } else {
      setSortByDate('crescente');
      sortByAscendingDate(transactions);
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
              {categories.map((category) => (
                <div key={category.id}>
                  <CategoriasFiltro
                    id={category.id}
                    categoria={category.description}
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
            {transactions.map((transaction) => (
              <div key={transaction.id}>
                <Registro
                  id={transaction.id}
                  data={transaction.date}
                  descricao={transaction.description}
                  categoria={categoriaDoProduto(transaction.category_id)}
                  valor={formatNumberToMoney(transaction.amount)}
                  tipo={transaction.tipo}
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
              <p>{formatNumberToMoney(extrato.cashIn)}</p>
            </div>
            <div className='resumo-saida'>
              <span>Saídas</span>
              <p>{formatNumberToMoney(extrato.cashOut)}</p>
            </div>
            <hr />
            <div className='resumo-saldo'>
              <span>Saldo</span>
              <p>{formatNumberToMoney(extrato.cashIn - extrato.cashOut)}</p>
            </div>
          </div>

          <button onClick={() => setMostrarAddRegistro(true)}>
            Adicionar Registro
          </button>
          {mostrarAddRegistro && (
            <AdicionarRegistro
              setMostrarAddRegistro={setMostrarAddRegistro}
              categorias={categories}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
