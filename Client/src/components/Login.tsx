import Loader from './Loader'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '../api/user.api'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'

type Inputs = {
  email: string
  password: string
}

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { handleSubmit, register, formState: {errors, isValid} } = useForm<Inputs>({mode:"onChange"})
  
  // const {data: resData, isPending, isError, error, isSuccess, mutate} = useMutation({
  const loginUserMutation:any = useMutation({
    mutationFn: loginUser,
    mutationKey: ["loginUser"]
  })


  if(loginUserMutation.isSuccess){
    console.log(loginUserMutation.data)
    dispatch( login({userData: loginUserMutation.data.data}) )
    navigate('/')
  }


  return (
    <div className="w-full max-w-sm space-y-4 p-6 relative">
      <div className=" mb-4">
        <h2 className="text-2xl font-semibold text-white">Login</h2>
        <p className="text-sm text-gray-400 mt-1">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>


      <form onSubmit={ handleSubmit( (data:Inputs) => loginUserMutation.mutate(data) ) } action="submit">

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
          className="btn btn-primary w-1/2">Loign</button>
          {loginUserMutation.isPending && <Loader />}
        </div>

      </form>

      { loginUserMutation.isError && <span className='w-full absolute text-sm font-light text-red-500' >{loginUserMutation.error?.response?.data?.message}</span>}

    </div>
  )
}

export default Login