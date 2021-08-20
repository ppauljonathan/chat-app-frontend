import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
import { User } from "../interfaces/User";
import { Chat } from "../interfaces/Chat";
import { Msg } from "../interfaces/Msg";


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl:string='URL'
  constructor(
    private http:HttpClient,
    private cookie:CookieService,
    private socket:Socket
  ) { }


  private sendRequest(body:object):Observable<any>{
    return this
    .http
    .post(
      this.apiUrl,
      body,
      {
        headers:{
          'Authorization':`Bearer ${this.cookie.get("jwt")}`
        }
      }
    );
  }

  signup(user:User):Observable<any>{
    const body={
      query:`
        mutation{
          signup(
            email:"${user.email}",
            password:"${user.password}"
          )
        }
      `
    }
    return this.http.post(this.apiUrl,body);
  }

  login(user:User):Observable<any>{
    const body={
      query:`
        mutation{
          login(
            email:"${user.email}",
            password:"${user.password}"
          )
        }
      `
    };
    return this.http.post(this.apiUrl,body);
  }

  getYourChats():Observable<any>{
    const body={
      query:`
        {
          getYourChats{
            name
            id
          }
        }
      `
    }

    return this.sendRequest(body);
  }

  createChat(chat:Chat):Observable<any>{
    const body={
      query:`
        mutation{
         createChat(
           name:"${chat.name}"
         ) 
        }
      `
    };
    
    return this.sendRequest(body);
  }

  leaveChat(chat:Chat):Observable<any>{
    const body={
      query:`
        mutation{
          leaveChat(
            chatId:"${chat.id}"
          )
        }
      `
    };
    
    return this.sendRequest(body);
  }

  createMsg(msg:Msg,chat:Chat):Observable<any>{
    const body={
      query:`
        mutation{
          createMsg(
            content:"${msg.content}",
            chatId:"${chat.id}"
          )
        }
      `
    };

    this.socket.emit('msg-sent',{chat:chat,msg:msg});

    return this.sendRequest(body);
  }

  getMsgInChat(chatId:any):Observable<any>{
    const body={
      query:`
        {
          getMsgInChat(chatId:"${chatId}"){
            content
            senderEmail
            isUser
          }
        }
      `
    }

    return this.sendRequest(body);
  }

  getUsersInChat(chatId:any):Observable<any>{
    const body={
      query:`
        {
          getUsersInChat(
            chatId:"${chatId}"
          ){
            email
            id
          }
        }
      `
    };

    return this.sendRequest(body);
  }

  getAllUsers():Observable<any>{
    const body={
      query:`
        {
          getAllUsers{
            email
            id
          }
        }
      `
    }

    return this.sendRequest(body);
  }

  addUserToChat(userId:any,chatId:any):Observable<any>{
    const body={
      query:`
        mutation{
          addUserToChat(
            userId:"${userId}",
            chatId:"${chatId}"
          )
        }
      `
    }

    return this.sendRequest(body);
  }
}
