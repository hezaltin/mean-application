import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading= false;
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  loginFrom(form:NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading= true;
    this.authService.loginUser(form.value.email,form.value.password)
    console.log(form)
  }

}
