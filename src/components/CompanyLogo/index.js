import "./style.css";
import Logo from "../../assets/logo.svg";

export default function CompanyLogo() {
    return (
        <div className="logo">
            <img src={Logo} alt="Logo" />
            <h1>Dindin</h1>
        </div>
    );
}
