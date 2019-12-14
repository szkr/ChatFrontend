import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {ChatService} from './chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class RegisteredGuardService implements CanActivate {
  constructor(public chat: ChatService, public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.chat.isRegistered()) {
      this.router.navigate(['register']);
      return false;
    }
    return true;
  }
}
