import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  subj:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  obs=this.subj.asObservable();
  
  constructor() { }

  changeLoader(val:boolean){
    this.subj.next(val);
  }
}
