import { Component } from '@angular/core';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-front';
  isLoggedIn:boolean=false;
  constructor(private cookie:CookieService){
    if(cookie.get("isLoggedIn")==='true'){
      this.isLoggedIn=true;
    }
  }
  loginState(val:boolean){
    this.cookie.set("isLoggedIn",val.toString());
    this.isLoggedIn=val;
  }
}
