import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService:AuthService) { }

  ngOnInit() {
     this.authListenerSubs = this.authService.getAuthListener().subscribe((iAuthenticated)=>{
        this.userIsAuthenticated = iAuthenticated;
      })
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

}
