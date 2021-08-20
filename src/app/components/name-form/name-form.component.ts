import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Chat } from "../../interfaces/Chat";
import { ApiService } from "../../services/api.service";
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.css']
})
export class NameFormComponent implements OnInit {
  @Input() chatName?:string='';
  @Output() done:EventEmitter<Chat>=new EventEmitter;
  chat:Chat={ };
  constructor(
    private api:ApiService,
    private loader:LoaderService  
  ) { }

  ngOnInit(): void {
  }
  newChat():void{
    if(this.chatName===''){
      alert('Chat Name Cannot be Empty');
      return;
    }
    this.loader.changeLoader(true);
    this.chat.name=this.chatName;
    this
    .api
    .createChat(this.chat)
    .subscribe(chatId=>{
      if(chatId.errors){
        alert(chatId.errors[0].message)
        return;
      }
      this.chat.id=chatId.data.createChat;
      this.done.emit(this.chat);
    })
  }
}
