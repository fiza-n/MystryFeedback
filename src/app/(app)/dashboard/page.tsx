'use client'
import { Message } from '@/src/model/User';
import { acceptMessagesSchema } from '@/src/Schema/acceptMessagesSchema';
import { signOut, useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/src/types/ApiResponse';
import { toast } from 'sonner';

export default function Dashboard() {
    const[messages,setMessages] = useState<Message[]>([]);
    const [ isLoading, setIsLoading] = useState(false)
    const [ isSwitchLoading, setIsSwitchLoading] = useState(false)

    const handleDeleteMessage = async(messageId: string) => {
        setMessages( messages.filter((message) => message._id.toString() !== messageId))
    }

    const {data: session} = useSession()
    const {register, watch, setValue} = useForm<z.infer<typeof acceptMessagesSchema>>({
        resolver: zodResolver(acceptMessagesSchema)
    })

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptingMessages = useCallback(async() => {
        setIsSwitchLoading(true)
        try{
           const response=  await axios.get<ApiResponse>(`/api/accept-messages`)
            setValue('acceptMessages', response.data.isAcceptingMessage )
        }
        catch(error){
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || 'Failed to fetch accepting messages status')
        }
        finally{
            setIsSwitchLoading(false)
        }
    },[setValue])

    return (
        <div>
            <h1>Dashboard Coming Soon!</h1>
            <button onClick={() => signOut()}>
                Sign Out
            </button>
        </div>
    )
}