import {useNavigate} from "react-router-dom";
import { format } from "date-fns"
import {useEffect, useState} from "react";
import {CalendarIcon, EyeIcon, TrashIcon} from "lucide-react";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader, DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {toast} from "@/hooks/use-toast.ts";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import moment from "moment";

type MessageType = {
    id: number;
    subject: string;
    body: string;
    toSend: boolean;
}

type User = {
    email: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    birthDate: Date;
}

export const HomePage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [date, setDate] = useState<Date>()

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
        const fetchMessages = async () => {
            const response = await fetch("http://localhost:3001/messages", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            setMessages(result);
        }
        const fetchUsers = async () => {
            const response = await fetch("http://localhost:3001/users", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await response.json();
            setUsers(result);
        }
        fetchUsers();
        fetchMessages();
    }, [navigate]);

    const handleDeleteMessage = async (id: number) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3001/messages/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.statusCode === 500) {
                toast({
                    description: "An error occurred while deleting the message.",
                    variant: "destructive"
                })
                return;
            }
            setMessages(messages.filter(message => message.id !== id));
            toast({
                description: "Message deleted successfully."
            })
        } catch (error) {
            console.log(error);
            toast({
                description: "An error occurred while deleting the message.",
                variant: "destructive"
            })
        }
    }

    const handleCreateMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const subject = formData.get("subject") as string;
        const body = formData.get("body") as string;
        const toSend = formData.get("toSend") as string;
        const data = {
            subject,
            body,
            toSend: toSend === "on"
        };
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:3001/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.statusCode === 500) {
                toast({
                    description: "An error occurred while creating the message.",
                    variant: "destructive"
                })
                return;
            }
            setMessages([...messages, result]);
            toast({
                description: "Message created successfully."
            })
            setIsDialogOpen(false);
        } catch (error) {
            console.log(error);
            toast({
                description: "An error occurred while creating the message.",
                variant: "destructive"
            })
        }
    }

    const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!date) return;
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const firstname = formData.get("firstName") as string
        const lastname = formData.get("lastName") as string
        const phoneNumber = formData.get("phone") as string
        const birthDate = moment(date).toDate()
        console.log(birthDate)
        const data = {
            email,
            firstname,
            lastname,
            phoneNumber,
            birthDate
        }
        const token = localStorage.getItem("token")
        try {
            const response = await fetch("http://localhost:3001/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.statusCode === 500) {
                toast({
                    description: "An error occurred while adding the user.",
                    variant: "destructive"
                })
                return;
            }
            toast({
                description: "User added successfully."
            })
        } catch (error) {
            console.log(error);
            toast({
                description: "An error occurred while adding the user.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className={"flex justify-between"}>
            <div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant={"default"} className={"text-white"}>Create a new message</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Create a new message
                            </DialogTitle>
                            <DialogDescription asChild>
                                <form className={"mt-8"} onSubmit={(e) => handleCreateMessage(e)}>
                                    <div className={"flex flex-col gap-6 mt-6"}>
                                        <div className={"flex flex-col gap-4"}>
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input type="text" id="subject" name="subject" placeholder="Subject" required/>
                                        </div>
                                        <div className={"flex flex-col gap-4"}>
                                            <Label htmlFor="body">Body</Label>
                                            <Textarea id="body" name="body" placeholder="Body" required/>
                                        </div>
                                        <label className={"flex gap-2 cursor-pointer items-center"}>
                                            <Checkbox id="toSend" name="toSend"/>
                                            <span>Is email to send?</span>
                                        </label>
                                    </div>
                                    <div className={"flex gap-4 mt-4"}>
                                        <DialogClose asChild>
                                            <Button variant={"cancel"}>Cancel</Button>
                                        </DialogClose>
                                        <Button type={'submit'} variant={"default"} className={"text-white"}>Create</Button>
                                    </div>
                                </form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <h1 className={"mt-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"}>Messages' history</h1>
                <div className={"flex flex-col gap-4 mt-16"}>
                    {
                        messages.length > 0 ? (
                            messages.map((message, index) => (
                                <div className={"flex gap-4"} key={index}>
                                    <h3 className={"scroll-m-20 text-l font-regular tracking-tight opacity-75"}>{message.subject}</h3>
                                    <Dialog>
                                        <DialogTrigger>
                                            <EyeIcon size={24} className={"text-accent-foreground cursor-pointer opacity-75 transition hover:opacity-100"}/>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle asChild>
                                                    <h3 className={"scroll-m-20 text-xl font-semibold tracking-tight"}>{message.subject}</h3>
                                                </DialogTitle>
                                                <DialogDescription asChild>
                                                    <p className={"leading-7 mt-8"}>{message.body}</p>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                    {
                                        message.toSend ? (
                                            <Dialog>
                                                <DialogTrigger>
                                                    <TrashIcon size={24} className={"text-accent-foreground cursor-pointer"}/>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle asChild>
                                                        <p>Are you sure you want to delete this message?</p>
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        <div className={"flex gap-4"}>
                                                            <DialogClose asChild>
                                                                <Button variant={"cancel"}>Cancel</Button>
                                                            </DialogClose>
                                                            <Button onClick={() => handleDeleteMessage(message.id)} variant={"danger"}>Confirm</Button>
                                                        </div>
                                                    </DialogDescription>
                                                </DialogContent>
                                            </Dialog>
                                        ) : null
                                    }
                                </div>
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )
                    }
                </div>
            </div>
            <div className={"flex flex-col items-start"}>
                <Popover>
                    <PopoverTrigger>
                        <Button className={"text-white"}>Add user to the mailing list</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <form className={"flex flex-col gap-4"} onSubmit={(e) => handleAddUser(e)}>
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" type="email" placeholder="Email" required/>
                            <Label htmlFor="firstName">First name</Label>
                            <Input name="firstName" type="text" placeholder="First name" required/>
                            <Label htmlFor="lastName">Last name</Label>
                            <Input name="lastName" type="text" placeholder="Last name" required/>
                            <Label htmlFor="phone">Phone number</Label>
                            <Input name="phone" type="text" placeholder="Phone number" required/>
                            <Label htmlFor="birthDate">Birth date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={"text-white"}
                                    >
                                        <CalendarIcon />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Button variant={"default"} className={"text-white"}>Add</Button>
                        </form>
                    </PopoverContent>
                </Popover>
                <h1 className={"mt-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"}>Messages' history</h1>
                <div className={"flex flex-col gap-2 mt-16"}>
                    {
                        users.length > 0 ? (
                            users.map((user, index) => (
                                <div key={index} className={"flex gap-4"}>
                                    <h3 className={"scroll-m-20 text-l font-regular tracking-tight opacity-75"}>{user.firstname} {user.lastname}</h3>
                                    <Dialog>
                                        <DialogTrigger>
                                            <EyeIcon size={24} className={"text-accent-foreground cursor-pointer opacity-75"}/>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    <h3 className={"scroll-m-20 text-xl font-semibold tracking-tight"}>{user.firstname} {user.lastname}</h3>
                                                </DialogTitle>
                                                <DialogDescription >
                                                    <p className={"leading-7 mt-2"}>{user.email}</p>
                                                    <p className={"leading-7 mt-2"}>{user.phoneNumber}</p>
                                                    <p className={"leading-7 mt-2"}>{format(user.birthDate, "PPP")}</p>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            ))
                        ) : (
                            <p>No users available.</p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}