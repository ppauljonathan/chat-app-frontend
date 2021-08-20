import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatInfoService } from "../../services/chat-info.service";
import { ApiService } from "../../services/api.service";
import { LeaveChatService } from "../../services/leave-chat.service";
import { User } from "../../interfaces/User";
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.css']
})
export class ChatInfoComponent implements OnInit {

  subInfo:Subscription=new Subscription;
  subLeave:Subscription=new Subscription;
  currChatId:any='';
  chatMems:User[]=[];
  allMems:User[]=[];
  shouldRender:any=false;
  shouldShowAddMems:any=false;
  shouldShowAddButton:any=false;

  constructor(
    private chatInfo:ChatInfoService,
    private api:ApiService,
    private leave:LeaveChatService,
    private cookie:CookieService,
    private loader:LoaderService
  ) { }

  ngOnInit(): void {
    this.subInfo=this
    .chatInfo
    .obs
    .subscribe(obj=>{
      if(typeof obj.chatId==="undefined"){return;}
      this.shouldRender=obj.val;
      this.shouldShowAddMems=obj.val;
      if(this.shouldRender){
        this.currChatId=obj.chatId;
        this.api
        .getUsersInChat(this.currChatId)
        .subscribe(resp=>{
          if(resp.errors){
            alert(resp.errors[0].message);
          }
          this.chatMems.push(
            ...resp
            .data
            .getUsersInChat
          )
          this.shouldShowAddButton=this.chatMems[0].email===this.cookie.get("loggedInUserEmail");
          this.loader.changeLoader(false);
        })
      }
      else{
        this.chatMems=[];
      }
    })
    
    this.subLeave=this
    .leave
    .chat
    .subscribe(s=>{
      this.shouldRender=false;
      this.shouldShowAddMems=false;
    })
  }

  showAllMems(){
    this.shouldShowAddMems=!this.shouldShowAddMems;
    if(this.shouldShowAddMems){
      this.loader.changeLoader(true);
      this.api
      .getAllUsers()
      .subscribe(users=>{
        if(users.errors){
          alert(users.errors[0].message);
          return;
        }
        function comparer(otherArray:any){
          return function(current:any){
            return otherArray.filter(function(other:any){
              return other.id===current.id&&
              other.email===current.email
            }).length===0
          }
        }
        let difference=users.data.getAllUsers.filter(comparer(this.chatMems));

        this.allMems.push(...difference);
        this.loader.changeLoader(false);
      })
    }
    else{
      this.allMems=[];
    }
  }

  addUser(uId:any){
    this.loader.changeLoader(true);
    this.api
    .addUserToChat(uId,this.currChatId)
    .subscribe(resp=>{
      if(resp.errors){
        alert(resp.errors[0].message);
        return;
      }
      this.chatMems.push(
        ...this.allMems.splice(uId,1)
      );
      this.loader.changeLoader(false);
    });
  }
}
