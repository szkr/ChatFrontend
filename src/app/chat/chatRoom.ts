import {Message} from './message/message';
import {ChatUser} from './name-pick/chatUser';

export interface ChatRoom {
  name: string;
  id: number;
  messages: Message[];
  users: ChatUser[];
  isPublic: boolean;
  ownerId: number;
}
