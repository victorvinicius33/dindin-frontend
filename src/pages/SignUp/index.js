import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useState } from "react";
import CompanyLogo from "../../components/CompanyLogo";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        const formError = formValidation();

        if (formError) return setError(formError);

        try {
            const response = await api.post("/usuario", {
                email,
                nome: name,
                senha: password,
            });

            navigate("/login");
        } catch (error) {
            setError(error.response.data.mensagem);
        }
    }

    function formValidation() {
        if (!name) {
            return "O campo 'Nome' é obrigatório.";
        } else if (!email) {
            return "O campo 'Email' é obrigatório.";
        } else if (!email.includes("@" && ".")) {
            return "Insira um email válido";
        } else if (!password) {
            return "O campo 'Senha' é obrigatório.";
        } else if (password !== confirmPassword) {
            return "Senhas não conferem.";
        }

        return "";
    }

    return (
        <div className="sign-up">
            <header className="sign-up__header">
                <CompanyLogo />
            </header>

            <main className="sign-up__main">
                <div className="sign-up__form">
                    <h2>Cadastre-se</h2>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Nome</label>
                        <input
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password">Senha</label>
                        <input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <label htmlFor="confirm-password">
                            Confirmação de senha
                        </label>
                        <input
                            name="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {error && (
                            <p className="sign-up__error-message">{error}</p>
                        )}

                        <button className="sign-up__btn">Cadastrar</button>
                    </form>

                    <Link to="/" style={{ textDecoration: "none" }}>
                        Já tem cadastro? Clique aqui!
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default SignUp;
