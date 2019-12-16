import {Injectable} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {Message} from './message/message';
import {HttpClient} from '@angular/common/http';
import {ChatUser} from './name-pick/chatUser';
import {tap} from 'rxjs/operators';
import {ChatRoom} from './chatRoom';
import {RoomTime} from './message/room-time';
import {RoomMessages} from './message/room-messages';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public localUser: ChatUser;
  public users: Map<number, ChatUser> = new Map<number, ChatUser>();
  public joinedRooms: ChatRoom[] = [];

  private host = window.location.hostname + ':8080';

  public onNameSet() {

  }

  constructor(private http: HttpClient) {
    interval(1000).subscribe(() => {
      if (this.joinedRooms.length === 1) {
        this.joinedRooms.forEach(r => this.checkForMessages(r));
      } else if (this.joinedRooms.length > 1) {
        this.checkForMessagesMulti(this.joinedRooms);
      }
    });
  }


  sendMessage(msg: string, roomId: number): Observable<Message> {
    const m = {} as Message;
    m.timestamp = 1;
    m.content = msg;
    return this.http.post<Message>('http://' + this.host + '/chat/send/' + roomId, m).pipe(tap(me => me.sender = this.localUser));
  }

  joinRoom(id: number): Observable<ChatRoom> {
    return this.http.get<ChatRoom>('http://' + this.host + '/chat/join/' + id).pipe(tap(r => {
      if (r !== null) {
        r.messages = [];
        r.users = [];
        this.joinedRooms.push(r);
      }
    }));
  }

  createRoom(room: ChatRoom): Observable<ChatRoom> {
    return this.http.post<ChatRoom>('http://' + this.host + '/chat/create', room).pipe(tap(r => {
      if (r !== null) {
        r.messages = [];
        r.users = [];
        this.joinedRooms.push(r);
      }
    }));
  }

  leaveRoom(room: ChatRoom): Observable<any> {
    return this.http.get<ChatRoom>('http://' + this.host + '/chat/leave/' + room.id).pipe(tap(() => {
      this.joinedRooms = this.joinedRooms.filter(ele => {
        return ele !== room;
      });
    }));
  }

  deleteRoom(room: ChatRoom): Observable<any> {
    return this.http.get<ChatRoom>('http://' + this.host + '/chat/delete/' + room.id).pipe(tap(() => {
      this.joinedRooms = this.joinedRooms.filter(ele => {
        return ele !== room;
      });
    }));
  }

  registerUser(name: string, image: string): Observable<ChatUser> {
    const c = {} as ChatUser;
    c.name = name;
    c.pictureUrl = image;
    return this.http.post<ChatUser>('http://' + this.host + '/chat/register', c).pipe(tap(cu => {
      this.localUser = cu;
      this.getAvailableRooms().pipe(tap(rooms => {
        if (rooms.length > 0) {
          this.joinRoom(rooms[0].id).subscribe();
        }
      })).subscribe();
    }));
  }

  me(): Observable<ChatUser> {
    return this.http.get<ChatUser>('http://' + this.host + '/chat/me').pipe(tap(u => {
      if (u !== null) {
        this.localUser = u;
      }
    }));
  }

  getAvailableRooms(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>('http://' + this.host + '/chat/getAvailableRooms');
  }

  getRoomsJoined(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>('http://' + this.host + '/chat/getRoomsJoined').pipe(tap(rooms => {
      rooms.forEach(room => {
        room.users = [];
        room.messages = [];
      });
    }));
  }

  private getUser(id: number): ChatUser {
    if (!this.users.has(id)) {
      let user = {} as ChatUser;
      user.id = id;
      this.users.set(user.id, user);
      this.http.get<ChatUser>('http://' + this.host + '/chat/user/' + id)
        .pipe(tap(u => {
          user.name = u.name;
          user.pictureUrl = u.pictureUrl;
        })).subscribe();
    }
    return this.users.get(id);
  }

  isRegistered(): boolean {
    return this.localUser !== undefined;
  }

  isOwnMessage(m: Message): boolean {
    return m.senderId === this.localUser.id;
  }

  checkForMessages(room: ChatRoom) {
    this.getNewMessages(room.messages.length ? room.messages[room.messages.length - 1].timestamp : 0, room).pipe(tap(ms => {
        if (ms.length) {
          room.messages = room.messages.concat(ms);
          room.messages.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
        }
      }
      )
    ).subscribe();
  }

  getNewMessages(from: number, room: ChatRoom): Observable<Message[]> {
    return this.http.get<Message[]>('http://' + this.host + '/chat/messages/' + room.id + '/' + from).pipe(tap(ml => {
      ml.forEach(m => {
        m.sender = this.getUser(m.senderId);
      });
    }));
  }

  checkForMessagesMulti(rooms: ChatRoom[]) {
    this.http.post<RoomMessages[]>('http://' + this.host + '/chat/messages', rooms.map(r => {
      const rq = {} as RoomTime;
      rq.roomId = r.id;
      rq.timeFrom = r.messages.length ? r.messages[r.messages.length - 1].timestamp : 0;
      return rq;
    })).pipe(tap(resp => {
      resp.forEach(rm => {
        const room = this.findLocalRoomById(rm.roomId);
        if (room !== null) {
          rm.messages.forEach(m => {
            m.sender = this.getUser(m.senderId);
          });
          room.messages = room.messages.concat(rm.messages);
          room.messages.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
        }
      });
    })).subscribe();
  }

  private findLocalRoomById(id: number): ChatRoom {
    let r: ChatRoom = null;
    this.joinedRooms.forEach(ro => {
      if (ro.id === id) {
        r = ro;
      }
    });
    return r;
  }
}
