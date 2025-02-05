import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {EyeIcon, TrashIcon} from "lucide-react";
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

type MessageType = {
    id: number;
    subject: string;
    body: string;
    toSend: boolean;
}

export const HomePage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        const data = {
            subject,
            body,
            toSend: false
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

    return (
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
            <div className={"flex flex-col gap-4 mt-12"}>
                {
                    messages.length > 0 ? (
                        messages.map((message, index) => (
                            <div className={"flex gap-4"} key={index}>
                                <h3 className={"scroll-m-20 text-l font-semibold tracking-tight"}>{message.subject}</h3>
                                <Dialog>
                                    <DialogTrigger>
                                        <EyeIcon size={24} className={"text-accent-foreground cursor-pointer"}/>
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
                                                <DialogTitle>
                                                    Are you sure you want to delete this message?
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
    )
}