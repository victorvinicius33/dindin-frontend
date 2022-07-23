/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';
import useGlobal from '../../hooks/useGlobal';

function AlertToast() {
  const { 
    snackbarOpen, 
    setSnackbarOpen, 
    setErrorAlert, 
    messageAlert 
} = useGlobal();

  const [errorTheme] = useState({
    alertState: 'error',
    messageAlert: messageAlert,
    color: 'error',
    positionVertical: 'top',
    positonHorizontal: 'right',
  });

  function handleCloseError() {
    setSnackbarOpen(false);
    setErrorAlert(false);
  }

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={handleCloseError}
      sx={{ width: '50vh', bgcolor: '#C3D4FE' }}
      anchorOrigin={{
        vertical: errorTheme.positionVertical,
        horizontal: errorTheme.positonHorizontal,
      }}
    >
      <Alert
        onClose={handleCloseError}
        severity={errorTheme.alertState}
        color={errorTheme.color}
        sx={{ fontSize: '1.8rem', width: '100%' }}
      >
        Mensagem : {messageAlert}
      </Alert>
    </Snackbar>
  );
}

export default AlertToast;
