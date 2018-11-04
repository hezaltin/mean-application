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
  private userId : string;
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
  getUserId(){
    return this.userId;
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
    this.http.post<{token:string,message:string,expiresIn:number,userId:string}>("http://localhost:3000/api/users/login",authDataLogin).subscribe((response)=>{
      const token = response.token;
      this.token = token;
      if(token){
        const expiresDuration = response.expiresIn;
        this.setAuthTimer(expiresDuration);
        this.isAuthenticated = true;
        this.userId = response.userId
        this.authStatusListener.next(true)
      // construct the expiration date
        const now = new Date();
        const expiresDate = new Date(now.getTime() + expiresDuration * 1000);
        console.log(expiresDate);
        //saving into local storage;
        console.log(token)
        this.saveAuthData(token, expiresDate,this.userId);
        this.router.navigate(['/']);
      }
    
      console.log(response);
    })
  }


  //calling the app loading check whether the auth expiration date is valid or not
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true)
    }
  }

  logout(){
    this.token= null;
    this.isAuthenticated = false;
    this.userId = null; // compare the user Id to enable / disabled the particular user
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
    
  }
// set the timer values
  private setAuthTimer(duration:number){
    console.log('settinTimer:',duration);
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    },duration*1000);
  }
//save into the local storage
  private saveAuthData(token:string, expiresDate:Date,userId:string){
    localStorage.setItem("userToken", token)
    localStorage.setItem("expiration", expiresDate.toISOString());
    localStorage.setItem("userId", userId)
    console.log(localStorage.getItem("userToken"))
    console.log(localStorage.getItem("expiration"))
  }
//clear the local storage auth values
  private clearAuthData(){
    localStorage.removeItem("userToken");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId")
  }
  // get the auth data from the local storage;
  private getAuthData(){

    const token = localStorage.getItem("userToken");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId")
    if(!token || !expirationDate){
      return;
    }
    return {
      token : token,
      expirationDate : new Date(expirationDate),
      userId: userId
    }
  }
}
