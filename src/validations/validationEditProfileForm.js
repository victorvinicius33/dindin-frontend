import * as yup from 'yup';

export async function validationEditProfileForm(form) {
  const schema = yup.object().shape({
    name: yup.string().required('O campo nome é obrigatório.'),
    email: yup
      .string()
      .email('Insira um email válido.')
      .required('O campo email é obrigatório.'),
    password: yup
      .string()
      .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    repeatPassword: yup.string().oneOf(
      [yup.ref('password'), null],
      'As senhas devem ser iguais.'
    ),
  });

  try {
    await schema.validate(form);

    return { error: false };
  } catch (error) {
    return { error: true, errorMessage: error.message };
  }
}
