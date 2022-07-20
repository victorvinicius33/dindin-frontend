/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import Header from '../../components/Header';
import UpArrow from '../../assets/upArrow.svg';
import AdicionarRegistro from '../../components/AdicionarRegistro/index';
import Registro from '../../components/Registros/index';
import { formatNumberToMoney } from '../../utils/formatters';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getItem, setItem } from '../../utils/localStorage';
import EditarPerfil from '../../components/EditarPerfil/index';
import FilterCategories from '../../components/FilterCategories';

function Home() {
  const token = getItem('token');
  const [defaultTransactions, setDefaultTransactions] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [extrato, setExtrato] = useState({});
  const [profileData, setProfileData] = useState({});
  const [mostrarAddRegistro, setMostrarAddRegistro] = useState(false);
  const [sortByDate, setSortByDate] = useState('crescente');
  const [openEditProfile, setOpenEditProfile] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get('/usuario', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status > 204) {
          return;
        }

        const profileName = response.data.name.split(' ');

        setItem('userName', profileName[0]);

        setProfileData({ ...response.data });
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    async function loadTransactions() {
      try {
        const response = await api.get('/transacao', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status > 204) return;

        setDefaultTransactions([...response.data]);
        sortByAscendingDate(response.data);
      } catch (error) {
        console.log(error.response.data.message);
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

        setExtrato({ ...response.data });
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

        response.data.forEach((category) => {
          category.selected = false;
        });

        setCategories([...response.data]);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    loadProfile();
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
    const sortedArray = arr.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    return setCurrentTransactions([...sortedArray]);
  }

  function sortByDescendingDate(arr) {
    const sortedArray = arr.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    return setCurrentTransactions([...sortedArray]);
  }

  function lidarComOrdenacaoPorData() {
    if (sortByDate === 'crescente') {
      setSortByDate('descrecente');
      sortByDescendingDate([...currentTransactions]);
    } else {
      setSortByDate('crescente');
      sortByAscendingDate([...currentTransactions]);
    }
  }

  return (
    <div className='main__container'>
      <Header setOpenEditProfile={setOpenEditProfile} />

      <div className='main__content'>
        <div className='main__left'>
          <FilterCategories
            categories={categories}
            setCategories={setCategories}
            setCurrentTransactions={setCurrentTransactions}
            defaultTransactions={defaultTransactions}
            sortByAscendingDate={sortByAscendingDate}
          />

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
            {currentTransactions.map((transaction) => (
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

      {openEditProfile && (
        <EditarPerfil
          setOpenEditProfile={setOpenEditProfile}
          profileData={profileData}
          setProfileData={setProfileData}
        />
      )}
    </div>
  );
}

export default Home;
