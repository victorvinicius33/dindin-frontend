import * as yup from 'yup';

export async function validationLoginForm(form) {
  const schema = yup.object().shape({
    password: yup
    .string()
    .required('O campo senha é obrigatório.'),
    email: yup
    .string()
    .email('Insira um email válido.')
    .required('O campo email é obrigatório.'),
  });

  try {
    await schema.validate(form);

    return { error: false };
  } catch (error) {
    return { error: true, errorMessage: error.message };
  }
}
