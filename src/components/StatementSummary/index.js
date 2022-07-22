import './style.css';

export default function StatementSummary({
  statement,
  setOpenModalAddTransaction,
}) {
  return (
    <div className='statement-summary__container'>
      <div className='statement-summary__box'>
        <h2>Resumo</h2>
        <div className='statement-summary__cash-in'>
          <span>Entradas</span>
          <p>{statement.cashIn}</p>
        </div>
        <div className='statement-summary__cash-out'>
          <span>Saídas</span>
          <p>{statement.cashOut}</p>
        </div>
        <hr />
        <div className='statement-summary__balance'>
          <span>Saldo</span>
          <p
            className={
              statement.balanceStatus === 'negativo'
                ? 'statement-summary__negative-balance'
                : 'statement-summary__positive-balance'
            }
          >
            {statement.balance}
          </p>
        </div>
      </div>

      <button
        onClick={() => setOpenModalAddTransaction(true)}
        className='statement-summary__btn-add-register'
      >
        Adicionar Registro
      </button>
    </div>
  );
}
