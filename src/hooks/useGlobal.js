import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

export default function useGlobal() {
    return useContext(GlobalContext);
}