import * as yup from 'yup';

export async function ValidationAddTransactionForm(form) {
  const schema = yup.object().shape({
    date: yup.date().nullable().typeError('Insira um formato de data válido.'),
    amount: yup
      .number()
      .min(1, 'Digite um valor maior que zero')
      .required('O campo valor é obrigatório.'),
  });

  try {
    await schema.validate(form);

    return { error: false };
  } catch (error) {
    return { error: true, errorMessage: error.message };
  }
}
