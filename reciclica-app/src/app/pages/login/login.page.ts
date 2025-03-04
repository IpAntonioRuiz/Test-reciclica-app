import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageForm } from './login.page.form';
import { Store } from '@ngrx/store';
import { AppState } from 'src/store/AppState';
import { hide, show } from 'src/store/loading/loading.actions';
import { login, loginFail, loginSuccess, recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from 'src/store/login/login.actions';
import { ToastController } from '@ionic/angular';
import { LoginState } from 'src/store/login/LoginState';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit, OnDestroy {

  form!: FormGroup;
  loginStateSubscription!: Subscription;

  constructor(private router: Router, private formBuilder: FormBuilder, private store: Store<AppState>, private ToastController: ToastController, private authService: AuthService) { }

  ngOnInit() {
    this.form = new LoginPageForm(this.formBuilder).createForm();

    this.loginStateSubscription = this.store.select('login').subscribe(loginState => {
      this.onIsRecoveredPassword(loginState);
      this.onIsRecoveringPassword(loginState);
      this.onError(loginState);

      this.onIsLoggingIn(loginState);
      this.onIsLoggedIn(loginState);

      this.toggleloading(loginState);
    })
  }

  ngOnDestroy() {
    if(this.loginStateSubscription){
      this.loginStateSubscription.unsubscribe();
    }
  }

  private toggleloading(loginState: LoginState){
    if(loginState.isLoggingIn || loginState.isRecoveringPassword){
      this.store.dispatch(show())
    } else {
      this.store.dispatch(hide());
    }
  }

  private onIsLoggedIn(loginState: LoginState) {
    if (loginState.isLoggedIn) {
      this.router.navigate(['home']);
    } 
  }

  private async onError(loginState: LoginState){
    if(loginState.error){
      const toaster = await this.ToastController.create({
        position: "bottom",
        message: loginState.error.message,
        color: "danger"
      });
      toaster.present();
    }
  }

  private onIsRecoveringPassword(loginState: LoginState){
    if(loginState.isRecoveringPassword){
      this.authService.recoverEmailPassword(this.form.get('email')?.value).subscribe(() => {
        this.store.dispatch(recoverPasswordSuccess());
      }, error => this.store.dispatch(recoverPasswordFail({error}))
    )};
  }



  private onIsLoggingIn(loginState: LoginState){
    if(loginState.isLoggingIn){
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;

      this.authService.login(email, password).subscribe({
        next: user => {
          this.store.dispatch(loginSuccess({user}));
        },
        error: error => {
          this.store.dispatch(loginFail({error}));
        }
      })
    }
  }

  private async onIsRecoveredPassword(loginState: LoginState){
    if(loginState.isRecoveredPassword){
      const toaster = await this.ToastController.create({
        position: "bottom",
        message: "Recovery email sent",
        color: "primary"
      });
      toaster.present();
    }
  }

  forgotEmailPassword(){
    this.store.dispatch(recoverPassword());

    this.store.dispatch(show())

    setTimeout(()=> {
      this.store.dispatch(hide())
    }, 3000)
  }

  login() {
    this.store.dispatch(login());
  }

  register() {
    this.router.navigate(['register']);
  }
}
