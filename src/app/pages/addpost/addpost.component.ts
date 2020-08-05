import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms'
import { finalize } from 'rxjs/operators'


//firebase
import { AngularFireStorage } from '@angular/fire/storage'
import { AngularFireDatabase } from '@angular/fire/database'

//imageresizer
import {readAndCompressImage} from 'browser-image-resizer'
import { imageconfig } from 'src/utils/config';

//uuid
import {v4  as uuidv4 } from 'uuid';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {
  user =null;
  locationName:string ;
  discription:string;
  uploadPercent:number=null;
  picture:string=null;

  constructor(
    private auth:AuthService,
    private router:Router,
    private toaster:ToastrService,
    private storage:AngularFireStorage,
    private db:AngularFireDatabase
  ) { 

    auth.getUser().subscribe((user)=>{
      this.db.object(`/users/${user.uid}`)
      .valueChanges()
      .subscribe(user=>{
        this.user=user;
      })
    })
  }

  ngOnInit(): void {
  }

  onSubmit(){
      const uid=uuidv4();
      this.db.object(`/posts/${uid}`)
      .set({
        id:uid,
        location:this.locationName,
        discription:this.discription,
        picture:this.picture,
        by:this.user.name,
        instaid:this.user.instausername,
        date:Date.now()
      })
      .then(()=>{
        this.toaster.success("Post Added Successfull");
        this.router.navigateByUrl("/");
      })
      .catch(err=>{
        this.toaster.error("NOt able to post...");
        console.log(err);
      })
  }

  async uploadFile(event){ 
      const file = event.target.files[0];
      const resizedImage = await readAndCompressImage(file,imageconfig);
      const filepath = file.name;
      const fileref= this.storage.ref(filepath);
      const task = this.storage.upload(filepath,resizedImage);
      task.percentageChanges().subscribe((percentage)=>{
        this.uploadPercent=percentage;
      })
      task.snapshotChanges().pipe(
        finalize(()=>{
          fileref.getDownloadURL().subscribe(url=>{
            this.picture=url;
            this.toaster.success("Image Upload Success");
          })
        })
      ).subscribe()
  }



}
