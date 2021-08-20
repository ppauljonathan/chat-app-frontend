import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Chat } from "../interfaces/Chat";

@Injectable({
  providedIn: 'root'
})
export class SelectChatService {
  private sourceChat=new BehaviorSubject<Chat>({ });
  currChat=this.sourceChat.asObservable();
  constructor() { }

  dispChat(chat:Chat):any{
    this.sourceChat.next(chat)
  }

}
