export function formatNumberToMoney(valueInCents) {
  let formatedValue = (valueInCents / 100).toFixed(2);
  formatedValue = formatedValue.replace(/\D/g, '');
  formatedValue = formatedValue.replace(/(\d)(\d{8})$/, '$1.$2');
  formatedValue = formatedValue.replace(/(\d)(\d{5})$/, '$1.$2');
  formatedValue = formatedValue.replace(/(\d)(\d{2})$/, '$1,$2');

  return valueInCents >= 0 ? `R$ ${formatedValue}` : `R$ -${formatedValue}`;
}

export function maskMoneyToNumber(str) {
  if (!str) return 0;

  return Number(str.replace(/\D/g, ''));
}

export function formatDate(date) {
  const currentDate = new Date(date);

  return currentDate.toLocaleDateString('pt-br');
}
