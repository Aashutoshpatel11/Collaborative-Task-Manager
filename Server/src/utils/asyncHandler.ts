const asyncHandler = (fn:any) => (async(req:any, res:any, next:any) => {
    try {
        await fn(req, res, next)
    } catch (error: unknown) {
        if( error instanceof Error ){
            console.error("ERROR OBJECT :: ", error);
            res.status( 500 ).json({
                message: error.message || "something went wrong",
                success: false
            }
        )
        }else{
            console.error("UNKNOWN ERROR :: ", error);
        }

        

    }
})

export {asyncHandler}