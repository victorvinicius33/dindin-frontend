import * as yup from 'yup';

export async function validationSignUpForm(form) {
  const schema = yup.object().shape({
    repeatPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'As senhas devem ser iguais.'),
    password: yup
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres.')
    .max(20, 'Sua senha deve ter no máximo 20 caracteres.')
    .required('O campo senha é obrigatório.'),
    email: yup
    .string()
    .email('Insira um email válido.')
    .required('O campo email é obrigatório.'),
    name: yup.string().required('O campo nome é obrigatório.'),
  });

  try {
    await schema.validate(form);

    return { error: false };
  } catch (error) {
    return { error: true, errorMessage: error.message };
  }
}
