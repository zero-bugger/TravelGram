import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostComponent } from './components/post/post.component';
import { AddpostComponent } from './pages/addpost/addpost.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import {
  redirectLoggedInTo,
  redirectUnauthorizedTo,
  AngularFireAuthGuard
} from '@angular/fire/auth-guard'
import { HomeComponent } from './pages/home/home.component';

const redirectLoggedInHome = ()=> redirectLoggedInTo([""]);
const redirectUnauthorizedTosigin = ()=> redirectUnauthorizedTo(['/signin']);

const routes: Routes = [
     {
       path:'signin',
       component:SigninComponent,
       canActivate:[AngularFireAuthGuard],
        data:{authGuardPipe:redirectLoggedInHome}   
     },
     {
      path:'signup',
      component:SignupComponent,
      canActivate:[AngularFireAuthGuard],
       data:{authGuardPipe:redirectLoggedInHome}   
    },
    {
      path:'addpost',
      component:AddpostComponent,
      canActivate:[AngularFireAuthGuard],
       data:{authGuardPipe:redirectUnauthorizedTosigin}   
    },
    {
      path:"",
      component:HomeComponent,
      canActivate:[AngularFireAuthGuard],
       data:{authGuardPipe:redirectUnauthorizedTosigin}   
    },

    {
      path:'**',
      component:PagenotfoundComponent,
     
    }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
