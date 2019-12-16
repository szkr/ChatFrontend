import {Message} from './message';

export interface RoomMessages {
  roomId: number;
  messages: Message[];
}
