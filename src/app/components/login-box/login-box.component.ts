import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import { User } from "../../interfaces/User";
import { ApiService } from "../../services/api.service";
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css']
})
export class LoginBoxComponent implements OnInit {
  formType:string="Login";
  @Input() email:string='';
  @Input() password:string='';
  @Input() cpassword:string='';
  @Output() isLoggedIn:EventEmitter<boolean>=new EventEmitter;
  user:User={email:'',password:''};
  constructor(
    private api:ApiService,
    private cookie:CookieService,
    private loader:LoaderService
  ) {
   }

  ngOnInit(): void {
  }

  switchForm():void{
    if(this.formType==='Login'){
      this.formType="Signup";
      return;
    }
    if(this.formType==='Signup'){
      this.formType="Login";
      return;
    }
  }

  resetForm():void{
    this.email='';
    this.password='';
    this.cpassword='';
  }

  submitForm():void{
    this.loader.changeLoader(true);
    if(this.formType==='Signup'){
      if(
        this.email===''||
        this.password===''||
        this.cpassword===''
      ){
        alert('Fill All Inputs');
        return;
      }
      if(this.cpassword!==this.password){
        alert('Passwords do not match');
        return;
      }
      this.user.email=this.email;
      this.user.password=this.password;
      this.user.cpassword=this.cpassword;
      this
      .api
      .signup(this.user)
      .subscribe(res=>{
        this.loader.changeLoader(false);
        if(res.errors){
          alert(res.errors[0].message);
          return;
        }
        this.resetForm();
        this.formType='Login';
      })
      return;
    }else{
      if(
        this.email===''||
        this.password===''
      ){
        alert('Fill All Inputs');
        return;
      }
      this.user.email=this.email;
      this.user.password=this.password;
      this
      .api
      .login(this.user)
      .subscribe(res=>{
        this.loader.changeLoader(false);
        if(res.errors){
          alert(res.errors[0].message);
          return;
        }
        this.cookie.set("jwt",res.data.login);
        this.cookie.set("loggedInUserEmail",this.user.email);
        this.isLoggedIn.emit(true);
      })
    }
    this.resetForm();
  }
}
