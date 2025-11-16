import DBconnection from "@/lib/Connection";
import userModel, { User } from "@/models/user.model";
import bcrypt from 'bcrypt'
import { NextResponse } from "next/server";

await DBconnection()
export async function POST(request:Request){
    try {
        const {email,password,specialties,role}= await request.json()
        if(!password || !email || !role){
            return NextResponse.json({
                status:400,
                message:"Some credentials are missing"
            })
        }
        const user:any=await userModel.findOne({email})
        if(!user){
          throw new Error("No user found")
        }
        const ispassword= await bcrypt.compare(password,user?.password)
        if(!ispassword){
          throw new Error("Incorrect Password")
        }
        if(user.role!=role){
          throw new Error("Incorrect role")
        }
        if(user.specialties[0]!=specialties && user.role==='judge'){
          throw new Error("Incorrect specialities")
        }
        const safeUser = {
          id:         user._id.toString(),
          email:      user.email,
          name:       user.username,
          isverified: user.isverified,
          role:       user.role
        };
        return NextResponse.json({status:200,message:"Logined successfully",safeUser})
    } catch (error) {
        console.log(error)
        return NextResponse.json({status:500,message:"Logined falied"})
    }
}