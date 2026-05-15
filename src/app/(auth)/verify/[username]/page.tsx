'use client'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { verifySchema } from '@/src/Schema/verifySchema'
import * as z from 'zod'
import { ApiResponse } from '@/src/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })
            toast.success('Success', {
                description: response.data.message
            })
            router.replace('/sign-in') // ✅ fixed!
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('Verification failed', {
                description: axiosError.response?.data.message ?? 'Please try again later.'
            })
        }
    } // ✅ onSubmit closes here!

    return ( // ✅ return is outside onSubmit!
        <div className="min-h-screen w-full flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-4">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Verify Your Account</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the verification code sent to your email
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="code" className="block text-sm font-medium">
                            Verification Code
                            <span className="text-destructive ml-1">*</span>
                        </label>
                        <Input
                            id="code"
                            placeholder="Enter 6 digit code"
                            type="text"
                            {...register('code')} // ✅ registered!
                        />
                        {errors.code && (
                            <p className="text-xs text-destructive">
                                {errors.code.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full"> 
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default VerifyAccount