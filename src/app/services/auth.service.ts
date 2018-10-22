import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from '../models/auth-data.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   

  constructor(private http: HttpClient, private router: Router) { }

  createUser(email:string, password:string){
    const authData : AuthData ={
      email:email,
      password:password
    }
    this.http.post("http://localhost:3000/api/users/signup",authData).subscribe((response)=>{
      console.log(response);
    })
  }

  loginUser(email:string,password:string){
    const authDataLogin : AuthData ={
      email:email,
      password:password
    }
    this.http.post("http://localhost:3000/api/users/login",authDataLogin).subscribe((response)=>{
      console.log(response);
    })
  }
}
