import { useState } from 'react';

export default function useGlobalProvider() {
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [messageAlert, setMessageAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  return {
    snackbarOpen,
    setSnackbarOpen,
    messageAlert,
    setMessageAlert,
    errorAlert,
    setErrorAlert,
    loadingProgress,
    setLoadingProgress,
    openModalSuccess,
    setOpenModalSuccess,
    successMessage,
    setSuccessMessage
  };
}
