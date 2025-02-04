import {Label} from "../../components/ui/label.tsx";
import {Input} from "../../components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DatePickerDemo} from "@/components/ui/datepicker.tsx";
import {NavLink, useNavigate} from "react-router-dom";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const firstname = formData.get("firstname") as string;
        const lastname = formData.get("lastname") as string;
        const birthday = formData.get("birthday") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirm-password") as string;
        const data = {
            email,
            firstname,
            lastname,
            birthday,
            password,
            confirmPassword
        };
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        const token = result.token;
        localStorage.setItem("token", token);
        navigate("/");
    }
    return (
        <>
            <form onSubmit={handleSubmit} className={"flex flex-col gap-12 mx-auto w-2/3 bg-secondary p-6 rounded-2xl"}>
                <div className={"flex flex-col gap-4"}>
                    <div>
                        <Label htmlFor="email">Email <span className={"text-red-500"}>*</span></Label>
                        <Input type="email" id="email" name="email" placeholder="Email" required/>
                    </div>
                    <div>
                        <Label htmlFor="firstname">Name <span className={"text-red-500"}>*</span></Label>
                        <Input type="text" id="firstname" name="firstname" placeholder="Firstname" required/>
                    </div>
                    <div>
                        <Label htmlFor="lastname">Name <span className={"text-red-500"}>*</span></Label>
                        <Input type="text" id="lastname" name="lastnam" placeholder="Lastname" required/>
                    </div>
                    <div className={"flex items-center gap-4"}>
                        <Label htmlFor="birthday">Birthday <span className={"text-red-500"}>*</span></Label>
                        <DatePickerDemo></DatePickerDemo>
                    </div>
                    <div>
                        <Label htmlFor="password">Password <span className={"text-red-500"}>*</span></Label>
                        <Input type="password" id="password" name="password" placeholder="Password" required/>
                    </div>
                    <div>
                        <Label htmlFor="confirm-password">Confirm Password <span
                            className={"text-red-500"}>*</span></Label>
                        <Input type="password" id="confirm-password" name="confirm-password"
                               placeholder="Confirm Password" required/>
                    </div>
                </div>
                <div className={"flex-col flex gap-2 items-end w-full"}>
                    <Button className={"text-accent-foreground w-full"} type={"submit"}>Register</Button>
                    <NavLink to={"/login"} className={"text-center text-accent-foreground flex gap-1"}>Already have an account? <p className={"underline"}>Login here</p></NavLink>
                </div>
            </form>
        </>
    )
}