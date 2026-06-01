import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "@react-email/components";
import { Message } from "../model/User";
import axios from "axios";
import { ApiResponse } from "@/src/types/ApiResponse";
import { toast } from "sonner";

type MessageCardProps = {
    message: Message;
    OnMessageDelete: (messageId: string) => void;
}

const MessageCard = ({message, OnMessageDelete}:MessageCardProps) => {

    const handleDeleteConfirm = async () => {
     const response =  await axios.delete<ApiResponse>(`/api/delete-message.${message._id}`)

     toast.success(response.data.message);
     OnMessageDelete(message._id.toString())

    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
         <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button >Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
           message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
