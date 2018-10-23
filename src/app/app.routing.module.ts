import {NgModule} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';

import {PostListComponent} from './posts/post-list/post-list.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import { AuthGaurd } from './services/auth-gaurd';

const routes:Routes = [
    {path: '' , component:PostListComponent},
    {path: 'create' , component:PostCreateComponent, canActivate:[AuthGaurd]},
    {path: 'login' , component:LoginComponent},
    {path: 'signup' , component:SignupComponent},
    {path: 'edit/:postId' , component:PostCreateComponent, canActivate:[AuthGaurd]}
]

@NgModule({
    declarations :[],
    imports :[RouterModule.forRoot(routes)],
    exports:[RouterModule],
    providers :[AuthGaurd]
})

export class AppROutingModule{}