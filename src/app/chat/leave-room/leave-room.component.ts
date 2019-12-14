import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-leave-room',
  templateUrl: './leave-room.component.html',
  styleUrls: ['./leave-room.component.css']
})
export class LeaveRoomComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LeaveRoomComponent>) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
