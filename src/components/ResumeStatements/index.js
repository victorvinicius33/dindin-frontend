import './style.css';

export default function ResumeStatements({
  statement,
  setOpenModalAddRegister,
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
          <p>{statement.balance}</p>
        </div>
      </div>

      <button
        onClick={() => setOpenModalAddRegister(true)}
        className='statement-summary__btn-add-register'
      >
        Adicionar Registro
      </button>
    </div>
  );
}
