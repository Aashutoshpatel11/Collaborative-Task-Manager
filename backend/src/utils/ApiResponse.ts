class ApiResponse<T = any>{
    public statusCode:number
    public data:object
    public message:string
    public success:boolean

    constructor(
        statusCode:number, data:object, message:string, success:boolean=true
    ){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = success
    }
}

export {ApiResponse}