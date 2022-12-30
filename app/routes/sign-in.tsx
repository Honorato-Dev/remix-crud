import { ActionFunction, json,  redirect } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { auth } from "../../lib/cookies.server"
import { getModels } from '../../lib/db.server'
import { User} from 'models/User'

import { signToken } from "lib/jwt.server"

//action to setting cookie 
export const   action: ActionFunction = async({ request }) => {
    //use formData to grab input name im Form
   const formData = await   request.formData()
   const email = formData.get('email') as string ||''
   const passwd = formData.get('passwd') as string || ''  
   console.log(email, passwd)

//grab model interface em db.server
const  { User } = await getModels()
//take input data in Form
const user = await User.findOne({ email })
console.log({user})
// if be user in databank fall in second condition
if(user){
    //if passwd is correct
    if(user.passwd === passwd){
        //put data in  object payload
        const payload = {
            id: user.id,
            email:user.email
            
        }
            //turn data from input in token auth
    const token = signToken(payload)
    //use token auth as a password access
    const cookie = {id:user.id,user:user.email, token:token}
    return redirect('/admin', {
        headers: {
           'Set-Cookie': await auth.serialize(cookie)
        }
    })
    }
}

    

    


    

    return json({})
}

const SignIn = () => {
    return (
        <>
        <h1 className="text-3xl font-bold text-teal-600" >Sign-in</h1>
        
         <Form method="post">
         <input name='email' type="email" placeholder="email"/>
         <input name= 'passwd' type="password" placeholder="password"/>
         <button type='submit'>Sign-in</button>


         


         </Form>
        </>
    )
}
export default SignIn