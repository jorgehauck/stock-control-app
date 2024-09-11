import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: []
})
export class ToolbarNavigationComponent {

  constructor(
    private userService: UserService,
    private router: Router) { }

    public handleLogout(): void {
      this.userService.handleLogout();
      this.router.navigate(['/home']);
    }

}
