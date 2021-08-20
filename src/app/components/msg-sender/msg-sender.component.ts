import { Component, OnInit,Input } from '@angular/core';
import { Subscription } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { SelectChatService } from "../../services/select-chat.service";
import { LeaveChatService } from "../../services/leave-chat.service";
import { NewMsgService } from "../../services/new-msg.service";
import { ChatInfoService } from "../../services/chat-info.service";
import { ApiService } from "../../services/api.service";
import { LoaderService } from "../../services/loader.service";
import { Chat } from "../../interfaces/Chat";
import { Msg } from "../../interfaces/Msg";

@Component({
  selector: 'app-msg-sender',
  templateUrl: './msg-sender.component.html',
  styleUrls: ['./msg-sender.component.css']
})
export class MsgSenderComponent implements OnInit {

  shouldRender:boolean=false;
  selSub:Subscription=new Subscription;
  delSub:Subscription=new Subscription;
  cinSub:Subscription=new Subscription;
  selectedChat:Chat={ };
  newMsg:Msg={
    isUser:true,
    senderEmail:this.cookie.get('loggedInUserEmail')
  };
  @Input() msg:string='';

  constructor(
    private selectChat:SelectChatService,
    private leaveChat:LeaveChatService,
    private api:ApiService,
    private newMsgService:NewMsgService,
    private chatInfo:ChatInfoService,
    private loader:LoaderService,
    private cookie:CookieService
  ) { }

  ngOnInit(): void {
    this.delSub=
    this
    .leaveChat
    .chat
    .subscribe(()=>{
      this.shouldRender=false;
    })
    this.selSub=
    this
    .selectChat
    .currChat
    .subscribe(chat=>{
      if(typeof chat.name!=='undefined'){
        this.selectedChat=chat;
        this.shouldRender=true;
        return;
      }
      this.shouldRender=false;
      this.selectedChat={ };
    })

    this.cinSub=this
    .chatInfo
    .obs
    .subscribe(val=>{
      if(typeof val.chatId==="undefined"){return;}
      if(typeof val.val==='undefined'){
        this.shouldRender=false
        return;
      }
      this.shouldRender=!val.val;
    })
  }

  sendMsgToChat(){
    if(this.msg===''){
      return;
    }
    this.loader.changeLoader(true);
    this.newMsg.content=this.msg
    this.msg='';
    this
    .api
    .createMsg(this.newMsg,this.selectedChat)
    .subscribe(resp=>{
      this.msg='';
      if(resp.errors){
        alert(resp.errors[0].message);
        return;
      }
      this
      .newMsgService
      .newMsg(this.newMsg);  
    })
  }
}
