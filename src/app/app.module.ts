import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";

import { AppComponent } from './app.component';
import { LoginBoxComponent } from './components/login-box/login-box.component';
import { ListComponent } from './components/list/list.component';
import { CookieService } from 'ngx-cookie-service';
import { NameFormComponent } from './components/name-form/name-form.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ChatTitleComponent } from './components/chat-title/chat-title.component';
import { MsgSenderComponent } from './components/msg-sender/msg-sender.component';
import { ChatMsgsWindowComponent } from './components/chat-msgs-window/chat-msgs-window.component';
import { ChatInfoComponent } from './components/chat-info/chat-info.component';
import { LoaderComponent } from './components/loader/loader.component';

const config:SocketIoConfig={
  url:'URL',
  options:{}
} 

@NgModule({
  declarations: [
    AppComponent,
    LoginBoxComponent,
    ListComponent,
    NameFormComponent,
    ChatWindowComponent,
    ChatTitleComponent,
    MsgSenderComponent,
    ChatMsgsWindowComponent,
    ChatInfoComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
