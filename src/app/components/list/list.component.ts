import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Subscription } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { ApiService } from "../../services/api.service";
import { SelectChatService } from "../../services/select-chat.service";
import { Chat } from "../../interfaces/Chat";
import { LeaveChatService } from '../../services/leave-chat.service';
import { ChatInfoService } from '../../services/chat-info.service';
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  chats:Chat[]=[];
  subscription:Subscription=this.leaveChat.chat.subscribe(id=>{
    this.chats.splice(id,1)
  });
  @Output() isLoggedIn:EventEmitter<boolean>=new EventEmitter;
  loggedInUser:string=this.cookie.get("loggedInUserEmail");
  crech:boolean=false;
  constructor(
    private api:ApiService,
    private selectChat:SelectChatService,
    private leaveChat:LeaveChatService,
    private cookie:CookieService,
    private chatInfo:ChatInfoService,
    private loader:LoaderService
  ) { }

  ngOnInit(): void {
    this.loader.changeLoader(true);
    this.api
    .getYourChats()
    .subscribe(res=>{
      this.loader.changeLoader(false);
      if(res.errors){
        alert(res.errors);
        return;
      }
      this.chats.push(...res.data.getYourChats);      
    })
  }
  toggleNew(){
    this.crech=!this.crech;
  }
  newChat(chat:Chat):void{
    this.toggleNew();
    this.chats.push(chat);
    this.loader.changeLoader(false);
  }
  getChat(chatId:any){
    this.loader.changeLoader(true);
    const id=this.chats.findIndex(chat=>chatId===chat.id)||0;
    const chats=document.getElementsByClassName("chat-menu-wrapper");
    const schat=document.getElementsByClassName("chat-menu-selected");
    if(schat.length>=1){
      schat[0].classList.remove("chat-menu-selected");
    }
    chats[id].classList.add("chat-menu-selected"); 
    this.chatInfo.changer(false,"");
    this.selectChat.dispChat(this.chats[id]);
  }
}
