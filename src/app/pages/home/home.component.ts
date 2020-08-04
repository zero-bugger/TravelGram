import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users = [];
  posts = [];
  isLoading= false;
  constructor(
    private db:AngularFireDatabase,
    private toaster:ToastrService
  ) { 
    this.isLoading=true;
    db.object('/users')
    .valueChanges()
    .subscribe((user)=>{
      if(user){
        this.users=Object.values(user);
        this.isLoading=false;
      }
      else{
        this.isLoading=false;
        this.users=[];
        this.toaster.error("NO user available");
      }
    })
    db.object('/posts')
    .valueChanges()
    .subscribe((post)=>{
      if(post){
        this.posts=Object.values(post).sort((a,b)=>b.date-a.date)
        this.isLoading=false;
      }
      else{
        this.isLoading=false;
        this.posts=[];
        this.toaster.error("No posts available");
      }
    })
  }

  ngOnInit(): void {
  }

}
