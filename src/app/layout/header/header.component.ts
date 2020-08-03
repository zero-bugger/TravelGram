import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {Router } from '@angular/router'
import {ToastrService} from 'ngx-toastr'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  email=null;
  constructor(
    private auth:AuthService,
    private router:Router,
    private toastr:ToastrService
  ) { 
    auth.getUser().subscribe((user)=>{
      console.log("User is:"+user)
      this.email=user?.email;

    })

  }

  ngOnInit(): void {
  }

  async handlesignout(){
    try{
        await this.auth.signout();
        this.router.navigateByUrl("/signin");
        this.toastr.info("Logout Successful.");
        this.email=null;
    }  
    catch(err){
        this.toastr.error("Problem in signout");
    }
  }

}
