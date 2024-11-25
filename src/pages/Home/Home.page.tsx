import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
            navigate("/login");
        }
    });

    return (
        <div>
            <h1>Home Page</h1>
        </div>
    )
}