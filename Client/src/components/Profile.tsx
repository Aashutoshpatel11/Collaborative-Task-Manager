import Loader from './Loader'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changePassword, updateUser } from '../api/user.api'
import { useAppSelector } from '../store/hooks'
import { useEffect } from 'react'

type Inputs = {
    fullname: string
    email: string
}

type ChangePasswordInputs = {
    oldPassword: string
    newPassword: string
}

function Profile() {
    const queryClient = useQueryClient()
    
    const user: any = useAppSelector(state => state.auth.userData)

    const [enableUpdate, setEnableUpdate] = useState(false);

    const updateDetailsForm = useForm<Inputs>({
        mode: "onChange",
        defaultValues: {
            fullname: user?.fullname || "",
            email: user?.email || ""
        }
    })

    useEffect(() => {
        if (user) {
            updateDetailsForm.reset({
                fullname: user.fullname,
                email: user.email
            })
        }
    }, [user, updateDetailsForm])

    const changePasswordForm = useForm<ChangePasswordInputs>({
        mode: "onChange",
        defaultValues: {
            oldPassword: "",
            newPassword: ""
        }
    })

    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        mutationKey: ["Update User"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['Current User'],
                exact: true
            })
            alert("Profile updated successfully")
        }
    })

    const changePasswordMutation = useMutation({
        mutationFn: changePassword,
        mutationKey: ["Change Password"],
        onSuccess: () => {
            changePasswordForm.reset()
            alert("Password changed successfully")
            setEnableUpdate(false)
        }
    })

    return (
        <div className=" w-full flex flex-col justify-center items-center p-6 md:p-12">
            
            <h2 className="text-xl font-bold mb-4">Profile Details</h2>
            <form
                onSubmit={updateDetailsForm.handleSubmit((data) => updateUserMutation.mutate(data))}
                className='flex flex-col md:flex-row gap-4 justify-evenly w-full max-w-4xl'
            >
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Fullname</label>
                    <input
                        {...updateDetailsForm.register("fullname", { required: true })}
                        type="text"
                        disabled={!enableUpdate} // Fixed type
                        className="input w-full border p-2 rounded" 
                        placeholder="John Snow" 
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input
                        {...updateDetailsForm.register("email", { required: true })}
                        type="email"
                        disabled={!enableUpdate}
                        className="input w-full border p-2 rounded" 
                    />
                </div>

                <div className="flex justify-start items-end pb-1">
                    {
                        enableUpdate? (
                            <button
                                type='submit'
                                disabled={!updateDetailsForm.formState.isValid || updateUserMutation.isPending}
                                className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Process
                            </button>
                        ) : (
                            <button
                                onClick={() => setEnableUpdate(true)}
                                className="btn btn-secondary text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Update
                            </button>
                        )
                    }
                    {updateUserMutation.isPending && <div className="ml-2"><Loader /></div>}
                </div>
            </form>

            <div className="divider my-10 border-b w-full max-w-4xl"></div>

            <h2 className="text-xl font-bold mb-4">Security</h2>
            <form
                onSubmit={changePasswordForm.handleSubmit((data) => changePasswordMutation.mutate(data))}
                className='flex flex-col md:flex-row gap-4 justify-evenly w-full max-w-4xl'
            >
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Old Password</label>
                    <input
                        {...changePasswordForm.register("oldPassword", { required: true })}
                        type="password" // Fixed type
                        className="input w-full border p-2 rounded"
                        placeholder="Enter old password..." 
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                    <input
                        {...changePasswordForm.register("newPassword", { required: true })}
                        type="password" // Fixed type
                        className="input w-full border p-2 rounded"
                        placeholder="Enter new password..." 
                    />
                </div>

                <div className="flex justify-start items-end pb-1">
                    <button
                        type='submit'
                        disabled={!changePasswordForm.formState.isValid || changePasswordMutation.isPending}
                        className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        Change
                    </button>
                    {changePasswordMutation.isPending && <div className="ml-2"><Loader /></div>}
                </div>
            </form>

            {changePasswordMutation.isError && (
                <div className='text-red-500 mt-4'>
                    {(changePasswordMutation.error as any)?.response?.data?.message || "An error occurred"}
                </div>
            )}
        </div>
    )
}

export default Profile