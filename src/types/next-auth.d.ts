import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface User{
        isverified?:boolean,
        role?:string
    }
    interface Session{
        user:{
            isverified?:boolean
            role?:string
        } & DefaultSession['user']
    }
}