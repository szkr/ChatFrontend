import {Component, Input, OnInit} from '@angular/core';
import {Message} from './message';
import {ChatService} from '../chat.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input()
  message: Message;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
  }

}
