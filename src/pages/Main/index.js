/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import AdicionarRegistro from '../../components/AdicionarRegistro/index';
import ModalEditProfile from '../../components/Modals/ModalEditProfile/index';
import FilterCategories from '../../components/FilterCategories';
import TableTransactions from '../../components/TableTransactions';
import ModalDeleteTransaction from '../../components/Modals/ModalDeleteTransaction';
import ResumeStatements from '../../components/ResumeStatements';
import api from '../../services/api';
import { getItem, setItem } from '../../utils/localStorage';
import { formatNumberToMoney } from '../../utils/formatters';

function Home() {
  const token = getItem('token');
  const [defaultTransactions, setDefaultTransactions] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statement, setStatement] = useState({});
  const [profileData, setProfileData] = useState({});
  const [openModalAddRegister, setOpenModalAddRegister] = useState(false);
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

        if (response.status > 204) return;

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

        const formatedStatement = {
          cashIn: formatNumberToMoney(response.data.cashIn),
          cashOut: formatNumberToMoney(response.data.cashOut),
          balance: formatNumberToMoney(response.data.cashOut),
        };

        setStatement({ ...formatedStatement });
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

      <main className='main__content'>
        <section className='main__left'>
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
        </section>

        <section className='main__right'>
          <ResumeStatements
            statement={statement}
            setOpenModalAddRegister={setOpenModalAddRegister}
          />
        </section>
      </main>

      {openModalAddRegister && (
        <AdicionarRegistro
          setOpenModalAddRegister={setOpenModalAddRegister}
          categories={categories}
        />
      )}
      {openEditProfile && (
        <ModalEditProfile
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
          currentTransactions={currentTransactions}
          setCurrentTransactions={setCurrentTransactions}
          setStatement={setStatement}
        />
      )}
    </div>
  );
}

export default Home;
