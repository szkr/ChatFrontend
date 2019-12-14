import {Component, OnInit} from '@angular/core';
import {ChatService} from '../chat.service';
import {ChatRoom} from '../chatRoom';
import {tap} from 'rxjs/operators';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  roomForm: FormGroup;

  constructor(private fb: FormBuilder, private chatService: ChatService, private dialogRef: MatDialogRef<AddRoomComponent>) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      priv: false,
    });

  }

  availableRooms: ChatRoom[] = [];

  ngOnInit() {
    this.chatService.getAvailableRooms().pipe(tap(rs => {
      rs.forEach(r => {
        let add = true;
        this.chatService.joinedRooms.forEach(ro => {
          if (ro.id === r.id) {
            add = false;
          }
        });
        if (add) {
          this.availableRooms.push(r);
        }
      });
    })).subscribe();
  }

  joinRoom(id: number) {
    this.chatService.joinRoom(id).pipe(tap((r => this.dialogRef.close()))).subscribe();
  }

  createRoom(roomForm: FormGroup) {
    const room = {} as ChatRoom;
    room.name = roomForm.value.name;
    room.isPublic = !roomForm.value.priv;
    this.chatService.createRoom(room).pipe(tap((r => this.dialogRef.close()))).subscribe();
  }
}
