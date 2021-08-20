import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { LoaderService } from "../../services/loader.service";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  shouldRenderLoader:boolean=false;
  shouldShowSub:Subscription=new Subscription;

  constructor(
    private loader:LoaderService
  ) { }

  ngOnInit(): void {
    this.shouldShowSub=this
    .loader
    .obs
    .subscribe(val=>{
      this.shouldRenderLoader=val;
    })
  }

}
