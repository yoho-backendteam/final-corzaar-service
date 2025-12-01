
export const PermissionVerify=(resource=[])=>(req,res,next)=>{
    try {
             
        const user = JSON.parse(req.headers["user"])
        if (!user) {
            return res.status(500).json({ status: "failed", message: "Authentication credentials not provided" });
        }

        console.log(user)

        const userRole = user?.role
        if (userRole === "student" && resource.includes(userRole)) {
            req.userType = userRole
            req.user = user
            next()
        }else if (userRole === "noob" && resource.includes(userRole)) {
            req.userType = userRole
            req.user = user
            next()
        }else if(userRole === "merchant" && resource.includes(userRole)) {
            req.userType = userRole
            req.user = user
            next()
        }else if(userRole === "admin" && resource.includes(userRole)) {
            req.userType = userRole
            req.user = user
            next()
        }else if (userRole === "open" && resource.includes(userRole)) {
            next()
        }else {  
            return res.status(401).json({ message: "your not allow to access", status: "not_permitted" });
        }

    } catch (error) {
        console.log("merchant middelware error",error)
    }
}