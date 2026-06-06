'use client'
import { Message } from '@/src/model/User';
import { acceptMessagesSchema } from '@/src/Schema/acceptMessagesSchema';
import { signOut, useSession } from 'next-auth/react'
import { useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/src/types/ApiResponse';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


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

    const fetchMessages = useCallback( async(refresh: boolean = false)=>{
        setIsLoading(true);
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>(`/api/get-messages`)
            setMessages(response.data.messages || [])
            if(refresh){
              toast.success( 'showing latest messages')
                }
            } 
         catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || 'Failed to fetch accepting messages status')
        }
        finally{
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    },[setMessages, setIsLoading])

    useEffect(()=>{
        if(!session || !session.user) return;

        fetchAcceptingMessages();
        fetchMessages();

    },[session,fetchAcceptingMessages, setValue, fetchMessages])

    //handle switch change
    const handleSwitchChange = async() =>{
        
        try{
           const response= await axios.post<ApiResponse>(`/api/accept-messages`,{
            acceptMessages: !acceptMessages
           }) 
           setValue('acceptMessages', !acceptMessages)
           toast.success(response.data.message)      
         }
         catch(error){
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || 'Failed to switch to accepting messages')
         }
        
    }

    const {username} = session?.user

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success('Copied to clipboard')
    }
    if(!session || !session.user){
        return (
            <div>
                <h1>Unauthorized</h1>
                <p>Please sign in to access the dashboard.</p>
            </div>
        )
    }

    return (
        <div>
            <h1>Dashboard Coming Soon!</h1>
            <button onClick={() => signOut()}>
                Sign Out
            </button>
        </div>
    )
}