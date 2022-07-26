/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import FilterCategories from '../../components/FilterCategories';
import TableTransactions from '../../components/TableTransactions';
import StatementSummary from '../../components/StatementSummary';
import ModalEditProfile from '../../components/Modals/ModalEditProfile/index';
import ModalAddTransaction from '../../components/Modals/ModalAddTransaction/index';
import ModalEditTransaction from '../../components/Modals/ModalEditTransaction';
import ModalDeleteTransaction from '../../components/Modals/ModalDeleteTransaction';
import useGlobal from '../../hooks/useGlobal';
import api from '../../services/api';
import { getItem, setItem, clear } from '../../utils/localStorage';
import { formatNumberToMoney } from '../../utils/formatters';

function Home() {
  const {
    setLoadingProgress,
    setSnackbarOpen,
    setErrorAlert,
    setMessageAlert,
    openModalSuccess
  } = useGlobal();
  const token = getItem('token');
  const [defaultTransactions, setDefaultTransactions] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statement, setStatement] = useState({});
  const [profileData, setProfileData] = useState({});
  const [openModalAddTransaction, setOpenModalAddTransaction] = useState(false);
  const [openModalEditProfile, setOpenModalEditProfile] = useState(false);
  const [openModalDeleteTransaction, setOpenModalDeleteTransaction] =
    useState(false);
  const [openModalEditTransaction, setOpenModalEditTransaction] =
    useState(false);
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
        handleApiError(error);
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
        handleApiError(error);
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
        handleApiError(error);
      }
    }

    setLoadingProgress(true);

    loadProfile();
    loadTransactions();
    loadUserStatement();
    loadCategories();

    setLoadingProgress(false);
  }, []);

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
        balance: formatNumberToMoney(
          response.data.cashIn - response.data.cashOut
        ),
      };

      formatedStatement.balanceStatus =
        response.data.cashIn - response.data.cashOut < 0
          ? 'negativo'
          : 'positivo';

      setStatement({ ...formatedStatement });
    } catch (error) {
      handleApiError(error);
    }
  }

  function handleApiError(error) {
    if (error.response.data === 'jwt expired') {
      clear();
      setMessageAlert('Sessão expirada, faça login novamente.');
      setErrorAlert(true);
      setSnackbarOpen(true);
      return;
    }

    if (error.response.status >= 500) {
      setMessageAlert('Erro interno, por favor tente novamente.');
      setErrorAlert(true);
      setSnackbarOpen(true);
      return;
    }

    setMessageAlert(error.response.data.message);
    setErrorAlert(true);
    setSnackbarOpen(true);
  }

  useEffect(() => {
    if (
      openModalAddTransaction ||
      openModalEditProfile ||
      openModalDeleteTransaction ||
      openModalEditTransaction || openModalSuccess
    ) {
      document.documentElement.style.overflow = 'hidden';
      document.body.scroll = 'no';
    } else {
      document.documentElement.style.overflow = 'auto';
      document.body.scroll = 'yes';
    }
  }, [
    openModalAddTransaction,
    openModalEditProfile,
    openModalDeleteTransaction,
    openModalEditTransaction,
    openModalSuccess
  ]);

  return (
    <div className='main__container'>
      <Header setOpenModalEditProfile={setOpenModalEditProfile} />

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
            setOpenModalEditTransaction={setOpenModalEditTransaction}
            setOpenModalDeleteTransaction={setOpenModalDeleteTransaction}
            setTransactionId={setTransactionId}
          />
        </section>

        <section className='main__right'>
          <StatementSummary
            statement={statement}
            setOpenModalAddTransaction={setOpenModalAddTransaction}
            loadUserStatement={loadUserStatement}
          />
        </section>
      </main>

      {openModalEditProfile && (
        <ModalEditProfile
          setOpenModalEditProfile={setOpenModalEditProfile}
          profileData={profileData}
          setProfileData={setProfileData}
        />
      )}

      {openModalAddTransaction && (
        <ModalAddTransaction
          setOpenModalAddTransaction={setOpenModalAddTransaction}
          categories={categories}
          defaultTransactions={defaultTransactions}
          setDefaultTransactions={setDefaultTransactions}
          currentTransactions={currentTransactions}
          setCurrentTransactions={setCurrentTransactions}
          loadUserStatement={loadUserStatement}
        />
      )}

      {openModalEditTransaction && (
        <ModalEditTransaction
          transactionId={transactionId}
          setOpenModalEditTransaction={setOpenModalEditTransaction}
          categories={categories}
          defaultTransactions={defaultTransactions}
          setDefaultTransactions={setDefaultTransactions}
          currentTransactions={currentTransactions}
          setCurrentTransactions={setCurrentTransactions}
          loadUserStatement={loadUserStatement}
        />
      )}

      {openModalDeleteTransaction && (
        <ModalDeleteTransaction
          transaction_id={transactionId}
          setOpenModalDeleteTransaction={setOpenModalDeleteTransaction}
          defaultTransactions={defaultTransactions}
          setDefaultTransactions={setDefaultTransactions}
          currentTransactions={currentTransactions}
          setCurrentTransactions={setCurrentTransactions}
          loadUserStatement={loadUserStatement}
        />
      )}
    </div>
  );
}

export default Home;
