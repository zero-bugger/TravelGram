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





@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

picture :string= "https://dlscenter.com/wp-content/uploads/2017/06/real-madrid-logo.png";
  uploadPercent = null;  
  constructor(
    private router:Router,
    private auth:AuthService,
    private db:AngularFireDatabase,
    private storage:AngularFireStorage,
    private toaster:ToastrService
    ) { }

  ngOnInit(): void {
  }

  onSubmit(f:NgForm){
        
    const {email,name,username,bio,password,country} = f.form.value;
    this.auth.signup(email,password)
    .then((res)=>{
      console.log(res);
      const {uid} = res.user;
      this.db.object(`/users/${uid}`)
      .set({
        id:uid,
        name:name,
        instausername:username,
        bio:bio,
        country:country,
        picture:this.picture
      })
    })
    .then(()=>{
      this.router.navigateByUrl('/signin');
      this.toaster.success("Sign Up Success..!!")
    })
    .catch(err=>{
      this.toaster.error("Signup Failed")
      console.log(err);
    })
  }

  async uploadfile(event){
    console.log("File",event.target.files[0]);
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file, imageconfig);

    const filePath = file.name; // rename the image with TODO: UUID
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe((percetage) => {
      this.uploadPercent = percetage;
    });

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.picture = url;
            this.toaster.success("Image upload success");
          });
        }),
      )
      .subscribe();
  }
}
