import Loader from './Loader'
import { useForm } from 'react-hook-form'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { changePassword, updateUser } from '../api/user.api'
import { useAppSelector } from '../store/hooks'

type Inputs = {
    fullname: string
    email: string
}

type changePasswordInputs = {
    oldPassword: string
    newPassword: string
}

function Profile() {

    const user:any = useAppSelector( state => state.auth.userData)

    // const { handleSubmit, register, formState: {errors, isValid} } = useForm<Inputs>(
    const updateDetailsForm = useForm<Inputs>(
    {
        mode:"onChange",
        defaultValues: {
            fullname: user?.fullname,
            email: user?.email
        }
    })

    const changePasswordForm = useForm<changePasswordInputs>(
    {
        mode:"onChange",
        defaultValues: {
            oldPassword: "",
            newPassword: ""
        }
    })

    const queryClient = new QueryClient()

    const updateUserMutarion = useMutation({
        mutationFn: updateUser,
        mutationKey: ["Update User"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['Current User']
            })
        }
    })

    const changePasswordMutation = useMutation({
        mutationFn: changePassword,
        mutationKey: ["Change Password"],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['Current User']
            })
        }
    })

    return (
        <div className="min-w-full flex flex-col  justify-center items-center" >
            
            <form 
            onSubmit={ updateDetailsForm.handleSubmit( (data:Inputs) => updateUserMutarion.mutate(data) ) } 
            action="submit"
            className='flex flex-col md:flex-row justify-evenly w-full'
            >

                <div>
                    <label className=" text-sm font-medium text-gray-400 mb-1">Fullname</label>
                    <input 
                    {...updateDetailsForm.register("fullname", {
                        required: true
                    })} 
                    type="fullname" 
                    className="input" 
                    placeholder="John Snow" />
                </div>

                <div>
                    <label className=" text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input 
                    {...updateDetailsForm.register("email", {
                        required: true
                    })} 
                    type="email" 
                    className="input" />
                </div>

                <div className="flex justify-start items-center gap-3 pt-4">
                    <button 
                    type='submit'
                    disabled={!updateDetailsForm.formState.isValid}
                    className="btn btn-primary">Update</button>
                    {updateUserMutarion.isPending && <Loader />}
                </div>

            </form>

            <br /><br />

            <form 
            onSubmit={ changePasswordForm.handleSubmit( (data:changePasswordInputs) => changePasswordMutation.mutate(data) ) } 
            action="submit"
            className='flex flex-col md:flex-row justify-evenly w-full'
            >

                <div>
                    <label className=" text-sm font-medium text-gray-400 mb-1">Old Password</label>
                    <input 
                    {...changePasswordForm.register("oldPassword", {
                        required: true
                    })} 
                    type="oldPassword" 
                    className="input" 
                    placeholder="Enter old password..." />
                </div>

                <div>
                    <label className=" text-sm font-medium text-gray-400 mb-1">New Password</label>
                    <input 
                    {...changePasswordForm.register("newPassword", {
                        required: true
                    })} 
                    type="newPassword" 
                    className="input"
                    placeholder="Enter new password..." />
                </div>

                <div className="flex justify-start items-center gap-3 pt-4">
                    <button 
                    type='submit'
                    disabled={!changePasswordForm.formState.isValid}
                    className="btn btn-primary">Change</button>
                    {changePasswordMutation.isPending && <Loader />}
                </div>

            </form>
            {changePasswordMutation.isError && (
                <div className='text-red-500 p-10' >{changePasswordMutation.error?.response?.data?.message}</div>
            )}
        </div>
    )
}

export default Profile