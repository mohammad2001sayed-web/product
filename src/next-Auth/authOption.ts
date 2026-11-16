import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginResponse } from "../app/account/login.api";


export const authOptions:NextAuthOptions = {
    providers:[
        Credentials({
            name:"mylogin",


            credentials:{
                email:{label:"Email",type:"text",placeholder:"john@example.com"},
                password:{label:"Password",type:"password",placeholder:"Your password"}
            },
          async  authorize (credentials){

  const response = await fetch(new URL("/api/v1/auth/signin", process.env.NEXT_PUBLIC_BASE_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: credentials?.email,
      password: credentials?.password,
    }),
    cache: "no-store",
  });
if  (!response.ok) { 
   
    throw new Error(response.statusText);
  }
  const result: LoginResponse = await response.json();
  console.log("....result" , result);
  



              return {
                id: '',
                name: result.user?.email,
                email: result.user?.email,
                token: result.token,
              }
          }
        })
    ],
    pages: {
        signIn: "/account",
    },
}
