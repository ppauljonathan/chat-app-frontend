import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Chat } from 'src/app/interfaces/Chat';
import { ApiService } from "../../services/api.service";
import { SelectChatService } from "../../services/select-chat.service";
import { LeaveChatService } from "../../services/leave-chat.service";
import { ChatInfoService } from "../../services/chat-info.service";
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: 'app-chat-title',
  templateUrl: './chat-title.component.html',
  styleUrls: ['./chat-title.component.css']
})
export class ChatTitleComponent implements OnInit, OnDestroy{
  chat:Chat={ };
  dispB:boolean=false;
  switchToInfo:boolean=false;
  subscription:Subscription=new Subscription;
  constructor(
    private selectChat:SelectChatService,
    private api:ApiService,
    private leaveChatS:LeaveChatService,
    private chatInfo:ChatInfoService,
    private loader:LoaderService
  ) { }

  ngOnInit(): void {
    this.subscription= 
    this
    .selectChat
    .currChat
    .subscribe(ch=>{
      this.chat=ch;
      if(typeof ch.name!=='undefined'){
        this.dispB=true;
      }
    })
  }

  ngOnDestroy(): void{
    this.selectChat.dispChat({ });
    this.subscription.unsubscribe();
  }

  leaveChat(){
    this.loader.changeLoader(true);
    this
    .api
    .leaveChat(this.chat)
    .subscribe((resp)=>{
      if(resp.errors){
        alert(resp.errors[0].message);
        return;
      }
      this.dispB=false;
      this.chat={ };
      this.leaveChatS.idToDelete(resp.data.leaveChat);
      this.loader.changeLoader(false);
    })
  }
  
  toggleShow(){
    this.loader.changeLoader(true);
    this.switchToInfo=!this.switchToInfo;
    this.chatInfo.changer(this.switchToInfo,this.chat.id);
  }
}
