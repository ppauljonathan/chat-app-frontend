import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { Msg } from "../interfaces/Msg";

@Injectable({
  providedIn: 'root'
})
export class NewMsgService {

  private msgBehSub:BehaviorSubject<Msg>=new BehaviorSubject({});
  msgObs=this.msgBehSub.asObservable();

  constructor() { }

  newMsg(msg:Msg){
    this.msgBehSub.next(msg);
  }
}
