import Loader from './Loader'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../api/user.api'
import { useNavigate } from 'react-router-dom'

type Inputs = {
  fullname: string
  email: string
  password: string
}

function Register() {
  const { handleSubmit, register, formState: {errors, isValid} } = useForm<Inputs>({mode:"onChange"})
  const navigate = useNavigate()
  
  const registerUserMutation:any = useMutation({
    mutationFn: registerUser,
    mutationKey: ["registerUser"]
  })

  if(registerUserMutation.isSuccess){
    navigate('/login')
  }


  return (
    <div className="w-full max-w-sm space-y-4 p-6 relative">
      <div className=" mb-4">
        <h2 className="text-2xl font-semibold text-white">Register</h2>
        <p className="text-sm text-gray-400 mt-1">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>


      <form onSubmit={ handleSubmit( (data:Inputs) => registerUserMutation.mutate(data) ) } action="submit">

        <div>
          <label className=" text-sm font-medium text-gray-400 mb-1">Fullname</label>
          <input 
          {...register("fullname", {
            required: true
          })} 
          type="fullname" 
          className="input" 
          placeholder="John Snow" />
        </div>

        <div>
          <label className=" flex items-center text-sm font-medium text-gray-400 mb-1">Email<p className='text-xs text-red-500 font-thin pl-4' >{errors.email && "*Invalid email or domain*"}</p></label>
          <input 
          {...register("email", {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/
          })} 
          type="email" 
          className="input" 
          placeholder="example@gmail.com" />
        </div>

        <div>
          <label className=" text-sm font-medium flex items-center text-gray-400 mb-1">Password <p className='text-xs text-red-500 font-thin pl-4' >{errors.password && "*Must include upper, lower, number & special.*"}</p></label>
          <input 
          {...register("password", {
            required: true, 
            minLength:8,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
          })} 
          type="password" 
          className="input" 
          placeholder="Password@123" />
        </div>

        <div className="flex justify-start items-center gap-3 pt-4">
          <button 
          type='submit'
          disabled={!isValid}
          className="btn btn-primary w-1/2">Register</button>
          {registerUserMutation.isPending && <Loader />}
        </div>

      </form>

      { registerUserMutation.isError && <span className='w-full absolute text-sm font-light text-red-500' >{registerUserMutation.error?.response?.data?.message}</span>}

    </div>
  )
}

export default Register