import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading= false;
  constructor(public authService:AuthService) { }

  ngOnInit() {
  }

  signupForm(form:NgForm){
    
    console.log(form)
    if(form.invalid){
      return
    }
    else{
      this.isLoading= true;
      this.authService.createUser(form.value.email,form.value.password)
    }
    
  }
}
