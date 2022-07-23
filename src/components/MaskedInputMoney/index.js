const MaskMoney = (value) => {
  let formattedValue = value;
  formattedValue = formattedValue.replace(/\D/g, '');
  formattedValue = (Number(formattedValue)/100).toFixed(2);
  formattedValue = formattedValue.replace('.', ',').replace(/(\d)(?=(\d{3})+,)/g, '$1.');

  return 'R$ ' + formattedValue;
};

export default function MaskedInputMoney({ id, name, value, setValue }) {
  function handleChange(event) {
    setValue(MaskMoney(event.target.value));
  }

  return (
    <input
      id={id}
      name={name}
      type='text'
      placeholder='R$ 0,00'
      value={value}
      onChange={handleChange}
    />
  );
}
