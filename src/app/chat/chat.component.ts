import {Component, OnInit} from '@angular/core';
import {ChatService} from './chat.service';
import {ChatRoom} from './chatRoom';
import {MatDialog} from '@angular/material';
import {AddRoomComponent} from './add-room/add-room.component';
import {LeaveRoomComponent} from './leave-room/leave-room.component';
import {DeleteRoomComponent} from './delete-room/delete-room.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  selectedRoom: ChatRoom;
  sidenavOpened = true;

  constructor(private chatService: ChatService, public dialog: MatDialog) {
  }

  availableRoomsDialog(): void {
    const dialogRef = this.dialog.open(AddRoomComponent, {
      width: '380px',
      height: '400px'
    });
  }

  leaveRoomDialog(): void {
    const dialogRef = this.dialog.open(LeaveRoomComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.chatService.leaveRoom(this.selectedRoom).subscribe();
        this.selectedRoom = undefined;
      }
    });
  }

  deleteRoomDialog(): void {
    const dialogRef = this.dialog.open(DeleteRoomComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.chatService.deleteRoom(this.selectedRoom).subscribe();
        this.selectedRoom = undefined;
      }
    });
  }

  ngOnInit() {
  }

}
