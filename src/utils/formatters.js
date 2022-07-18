export function formatNumberToMoney(valueInCents) {
  const ValueinReais = `R$ ${(valueInCents / 100).toFixed(2)}`;

  return ValueinReais.replace('.', ',');
}
