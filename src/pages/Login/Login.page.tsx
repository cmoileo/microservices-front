import {Label} from "../../components/ui/label.tsx";
import {Input} from "../../components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {NavLink} from "react-router-dom";

export const LoginPage = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const data = {
            email,
            password
        };
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
                        <Label htmlFor="password">Password <span className={"text-red-500"}>*</span></Label>
                        <Input type="password" id="password" name="password" placeholder="Password" required/>
                    </div>
                </div>
                <div className={"flex-col flex gap-2 items-end w-full"}>
                    <Button className={"text-accent-foreground w-full"} type={"submit"}>Login</Button>
                    <NavLink to={"/register"} className={"text-center text-accent-foreground flex gap-1"}>Don't have an account? <p className={"underline"}>Register here</p></NavLink>
                </div>
            </form>
        </>
    )
}