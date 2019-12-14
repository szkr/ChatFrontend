import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule, MatCheckboxModule, MatDialogModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule, MatTabsModule, MatTooltipModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MessageComponent} from './chat/message/message.component';
import {ChatComponent} from './chat/chat.component';
import {NamePickComponent} from './chat/name-pick/name-pick.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {HttpRequestInterceptor} from './HttpRequestInterceptor';
import {ChatRoomComponent} from './chat/chat-room/chat-room.component';
import {RegisteredGuardService} from './registered-guard.service';
import { AddRoomComponent } from './chat/add-room/add-room.component';
import { LeaveRoomComponent } from './chat/leave-room/leave-room.component';
import {ReactiveFormsModule} from '@angular/forms';
import { DeleteRoomComponent } from './chat/delete-room/delete-room.component';


const appRoutes: Routes = [
  {path: 'register', component: NamePickComponent},
  {path: '', redirectTo: 'register', pathMatch: 'full'},
  {
    path: '', canActivate: [RegisteredGuardService], children: [
      {path: 'home', component: ChatComponent}
    ]
  }];


@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    ChatComponent,
    NamePickComponent,
    ChatRoomComponent,
    AddRoomComponent,
    LeaveRoomComponent,
    DeleteRoomComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    ),
    MatSidenavModule,
    MatListModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true}],
  bootstrap: [AppComponent],
  entryComponents: [AddRoomComponent, LeaveRoomComponent, DeleteRoomComponent],
})
export class AppModule {
}
