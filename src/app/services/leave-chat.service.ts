import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LeaveChatService {
  private del:BehaviorSubject<number>=new BehaviorSubject(-1);
  chat=this.del.asObservable();
  constructor() { }

  idToDelete(id:number){
    this.del.next(id);
  }
}
