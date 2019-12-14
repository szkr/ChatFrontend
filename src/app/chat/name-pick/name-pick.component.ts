import {Component, OnInit} from '@angular/core';
import {MatButton} from '@angular/material';
import {ChatService} from '../chat.service';
import {finalize, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-name-pick',
  templateUrl: './name-pick.component.html',
  styleUrls: ['./name-pick.component.css']
})
export class NamePickComponent implements OnInit {

  constructor(private chatService: ChatService, private router: Router) {
  }

  ngOnInit() {
    if (!this.chatService.isRegistered()) {
      this.chatService.me().subscribe(u => {
        if (u !== null) {
          this.chatService.getRoomsJoined().pipe(tap(rj => this.chatService.joinedRooms = rj)).subscribe();
          this.router.navigateByUrl('home');
        }
      });
    } else {
      this.router.navigateByUrl('home');
    }

  }

  sendClicked(name: HTMLInputElement, url: HTMLInputElement, button: MatButton) {
    name.disabled = true;
    url.disabled = true;
    button.disabled = true;
    this.chatService.registerUser(name.value, url.value).pipe(tap(r => {
      this.router.navigateByUrl('home');
    }), finalize(() => {
      name.disabled = false;
      url.disabled = false;
      button.disabled = false;
    })).subscribe();
  }
}
