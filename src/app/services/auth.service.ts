import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from '../models/auth-data.model'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   
  private token:string
  isAuthenticated = false;
  private tokenTimer:any;
  private authStatusListener = new Subject<boolean>()
  constructor(private http: HttpClient, private router: Router) { }

  getToken(){
    return this.token;
  }
  getAuthListener(){
    return this.authStatusListener.asObservable();
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
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
    this.http.post<{token:string,message:string,expiresIn:number}>("http://localhost:3000/api/users/login",authDataLogin).subscribe((response)=>{
      const token = response.token;
      this.token = token;
      if(token){
        const expiresDuration = response.expiresIn;
        this.tokenTimer = setTimeout(()=>{
          this.logout();
        },expiresDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true)
        this.router.navigate(['/']);
      }
    
      console.log(response);
    })
  }

  logout(){
    this.token= null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer)
  }
}
