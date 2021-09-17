import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { User } from '../types/Entity.Types';

@Component({
  selector: 'app-auth-window',
  templateUrl: './auth-window.component.html',
  styleUrls: ['./auth-window.component.scss']
})
export class AuthWindowComponent implements OnInit {
  tabIndex = 0;;

  loginFormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  registerFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<AuthWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly userService: UserService,
    private _snakcBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  async onLogin() {
    const user = this.loginFormGroup.value;
    try {
      const tokenInformation = await this.userService.login(user.email, user.password).toPromise();
      localStorage.setItem('shoppr_access_token', btoa(JSON.stringify(tokenInformation)));
      const currentUser = await this.userService.currentUser().toPromise();
      localStorage.setItem('shoppr_session', btoa(JSON.stringify(currentUser)));
      this.loginFormGroup.reset();
      this.data.performPendingAction(user);
    } catch (e) {
      console.log('Error while logging in');
    }
  }

  async onRegister() {
    const user = Object.assign(new User(), this.registerFormGroup.value);
    try {
      await this.userService.register(user).toPromise();
      this.registerFormGroup.reset();
      this.tabIndex = 0;
      this._snakcBar.open('User has been registered successfully.', 'x', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['bg-success', 'bg-gradient']
      });
    } catch (e) {
      console.log('There has been some error while registering the user');
    }
  }
}
