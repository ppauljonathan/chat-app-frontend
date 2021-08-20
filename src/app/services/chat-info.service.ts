import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { LoaderService } from "./loader.service";

interface ChatInfo{
  val?:boolean;
  chatId?:string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatInfoService {

  private func:BehaviorSubject<ChatInfo>=new BehaviorSubject({});
  obs=this.func.asObservable();  

  constructor(
    private loader:LoaderService
  ) { }

  changer(val:boolean,chatId:any){
    this.func.next({val:val,chatId:chatId});
  }
}
