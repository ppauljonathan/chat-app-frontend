import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectChatService } from '../../services/select-chat.service';
import { LeaveChatService } from '../../services/leave-chat.service';
import { NewMsgService } from "../../services/new-msg.service";
import { ApiService } from '../../services/api.service';
import { ChatInfoService } from "../../services/chat-info.service";
import { CookieService } from "ngx-cookie-service";
import { LoaderService } from "../../services/loader.service";
import { Msg } from '../../interfaces/Msg';
import { Socket } from "ngx-socket-io";
@Component({
  selector: 'app-chat-msgs-window',
  templateUrl: './chat-msgs-window.component.html',
  styleUrls: ['./chat-msgs-window.component.css']
})
export class ChatMsgsWindowComponent implements OnInit {

  shouldRender:boolean=false;
  subSel:Subscription=new Subscription;
  subDel:Subscription=new Subscription;
  subNew:Subscription=new Subscription;
  subInf:Subscription=new Subscription;
  currChatId:any;
  msgNew:Msg={};
  msgs:Msg[]=[];

  constructor(
    private selectChat:SelectChatService,
    private leaveChat:LeaveChatService,
    private api:ApiService,
    private newMsgService:NewMsgService,
    private cookie:CookieService,
    private chatInfo:ChatInfoService,
    private loader:LoaderService,
    private socket:Socket
  ) { }

  ngOnInit(): void {

    this.socket.on('mfd',(data:any)=>{
      if(data.chat.id!=this.currChatId){return;}
      data.msg.isUser=(this.cookie.get('loggedInUserEmail')===data.msg.senderEmail);
           
      this.msgs.push(Object.assign({},data.msg));
      
    })
    
    this.subDel=
    this
    .leaveChat
    .chat
    .subscribe(()=>{
      this.shouldRender=false;
    })

    this.subSel=
    this
    .selectChat
    .currChat
    .subscribe(chat=>{
      this.msgs=[];
      if(typeof chat.name==='undefined'){
        this.shouldRender=false;
        return;
      }
      this.currChatId=chat.id;
      this
      .api
      .getMsgInChat(this.currChatId)
      .subscribe(resp=>{
        this.msgs=[];
        this.loader.changeLoader(false);
        if(resp.errors){
          alert(resp.errors[0].message);
          return;
        }
        this.msgs
        .push(
          ...resp.data
          .getMsgInChat
        )
      })
      this.shouldRender=true;
    })

    this.subNew=this
    .newMsgService
    .msgObs
    .subscribe(newM=>{
      if(typeof newM.content==='undefined'){
        return;
      }
      newM.isUser=true;
      newM.senderEmail=this.cookie.get("loggedInUserEmail");
      this.msgs.push(Object.assign({}, newM));
      this.loader.changeLoader(false);
    })

    this.subInf=this
    .chatInfo
    .obs
    .subscribe(val=>{
      this.msgs=[];
      if(typeof val.chatId==="undefined"){return;}
      if(typeof val.val==='undefined'){
        this.shouldRender=false
        return;
      }
      if(typeof this.currChatId==='undefined'){
        return;
      }
      this
      .api
      .getMsgInChat(this.currChatId)
      .subscribe(resp=>{
        this.msgs=[];
        this.loader.changeLoader(false);
        if(resp.errors){
          alert(resp.errors[0].message);
          return;
        }
        this.msgs
        .push(
          ...resp.data
          .getMsgInChat
        )
      })
      this.shouldRender=!val.val;
    })
  }

}
