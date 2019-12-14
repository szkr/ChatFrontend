import {ChatUser} from '../name-pick/chatUser';

export interface Message {
  content: string;
  senderId: number;
  timestamp: number;
  sender: ChatUser;
}
