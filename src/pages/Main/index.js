/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import Header from '../../components/Header';
import AdicionarRegistro from '../../components/AdicionarRegistro/index';
import { formatNumberToMoney } from '../../utils/formatters';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getItem, setItem } from '../../utils/localStorage';
import EditarPerfil from '../../components/EditarPerfil/index';
import FilterCategories from '../../components/FilterCategories';
import TableTransactions from '../../components/TableTransactions';
import ModalDeleteTransaction from '../../components/Modals/ModalDeleteTransaction';

function Home() {
  const token = getItem('token');
  const [defaultTransactions, setDefaultTransactions] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statement, setStatement] = useState({});
  const [profileData, setProfileData] = useState({});
  const [mostrarAddRegistro, setMostrarAddRegistro] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openDeleteTransaction, setOpenDeleteTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

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

        const sortedArray = response.data.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        setDefaultTransactions([...sortedArray]);
        setCurrentTransactions([...sortedArray]);
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

        setStatement({ ...response.data });
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
          />

          <TableTransactions
            currentTransactions={currentTransactions}
            setCurrentTransactions={setCurrentTransactions}
            categories={categories}
            setTransactionId={setTransactionId}
            setOpenDeleteTransaction={setOpenDeleteTransaction}
          />
        </div>
        <div className='resumo-container'>
          <div className='resumo'>
            <h2>Resumo</h2>
            <div className='resumo-entrada'>
              <span>Entradas</span>
              <p>{formatNumberToMoney(statement.cashIn)}</p>
            </div>
            <div className='resumo-saida'>
              <span>Saídas</span>
              <p>{formatNumberToMoney(statement.cashOut)}</p>
            </div>
            <hr />
            <div className='resumo-saldo'>
              <span>Saldo</span>
              <p>{formatNumberToMoney(statement.cashIn - statement.cashOut)}</p>
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
      {openDeleteTransaction && (
        <ModalDeleteTransaction
          transaction_id={transactionId}
          setOpenDeleteTransaction={setOpenDeleteTransaction}
          defaultTransactions={defaultTransactions}
          setCurrentTransactions={setCurrentTransactions}
        />
      )}
    </div>
  );
}

export default Home;
