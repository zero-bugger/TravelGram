import { Component, OnInit, Input ,OnChanges } from '@angular/core';
import {
  faThumbsDown,
  faThumbsUp,
  faShareSquare

} from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit ,OnChanges {
  @Input() post;
  faThumbsDown=faThumbsDown;
  faThumbsUp=faThumbsUp;
  faShareSquare=faShareSquare;
  upvote=0;
  downvote=0;
  uid=null;
   constructor(
     private auth:AuthService,
     private db:AngularFireDatabase
   ) {
     this.auth.getUser().subscribe((user)=>{
       this.uid=user?.uid;
     })
    }

  ngOnInit(): void {
  }
  ngOnChanges():void{
    if(this.post.vote){
      Object.values(this.post.vote).map((value:any)=>{
        if(value.upvote){
          this.upvote +=1;
        }
        if(value.downvote){
          this.downvote+=1;
        }
      })
    }
  }
  upvotePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      upvote:1,
    })
  }
  downvotePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      downvote:1,
    })
  }
  getInstaUrl(){
    return `https://instagram.com/${this.post.instaId}`
  }

}
