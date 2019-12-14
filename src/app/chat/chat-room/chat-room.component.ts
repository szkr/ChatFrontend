import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatButton} from '@angular/material';
import {ChatService} from '../chat.service';
import {ChatRoom} from '../chatRoom';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnChanges {
  @ViewChild('messagesContainer', {static: false}) messagesContainer;


  @Input()
  private room: ChatRoom;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.scrollToBottom();
  }

  sendClicked(input: HTMLInputElement, button: MatButton) {
    input.disabled = true;
    button.disabled = true;
    this.chatService.sendMessage(input.value, this.room.id).subscribe(r => {
      input.disabled = false;
      button.disabled = false;
      input.focus();
      this.room.messages.push(r);
      this.scrollToBottom();
    });
    input.value = '';
  }


  private scrollToBottom() {
    setTimeout(() => {
        if (this.messagesContainer !== undefined) {
          this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        }
      },
      10);
  }
}
