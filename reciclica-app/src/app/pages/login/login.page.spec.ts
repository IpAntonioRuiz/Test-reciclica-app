import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { loadingReducer } from 'src/store/loading/loading.reducers';
import { loginReducer } from 'src/store/login/login.reducers';
import { AppState } from 'src/store/AppState';
import { recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from 'src/store/login/login.actions';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { User } from 'src/app/model/user/User';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;
  let page: any;
  let store: Store<AppState>;
  let toastController:  ToastController;
  let authService: AuthService;

  beforeEach(() => {    
    
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    AppRoutingModule;
    ReactiveFormsModule;
    StoreModule.forRoot([]);
    StoreModule.forFeature("loading", loadingReducer);
    StoreModule.forFeature("login", loginReducer);


    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    toastController = TestBed.inject(ToastController);
    authService = TestBed.inject(AuthService);

    page = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should create form on init', () => {
    component.ngOnInit();

    expect(component.form).not.toBeUndefined();
  });

  it('shold go to register page on login', () => {
    spyOn(router, 'navigate');
    component.register();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });

  
  it('should recover email/password on forgot email/password',() => {
    fixture.detectChanges();
    component.form.get('email')?.setValue("valid@email.com");
    page.querySelector("#recoverPasswordButton").click();
    store.select('login').subscribe(loginState => {
      expect(loginState.isRecoveringPassword).toBeTruthy();
    })
  });

  it('should show loading when recovering password',() => {
    fixture.detectChanges();
    store.dispatch(recoverPassword());
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    })
  });

  it('should hide loading and show success message when has recovered the password', () => {
    spyOn(toastController, 'create').and.returnValue(<any> Promise.resolve({present: () => {}}));

    fixture.detectChanges();
    store.dispatch(recoverPassword());
    store.dispatch(recoverPasswordSuccess());

    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })
    expect(toastController.create).toHaveBeenCalledTimes(1);
  });

  it('should hide loading and show error message when error on recovered the password', () => {
    spyOn(toastController, 'create');

    fixture.detectChanges();
    store.dispatch(recoverPassword());
    store.dispatch(recoverPasswordFail({error: "message"}));
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })
    expect(toastController.create).toHaveBeenCalledTimes(1);
  })

  it('should show loading and start login when logging in', () => {
    fixture.detectChanges();
    component.form.get('email')!.setValue('valid@email.com');
    component.form.get('password')!.setValue('anyPassword');
    page.querySelector('#loginButton').click();
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    })
    store.select('login').subscribe(loginState => {
       expect(loginState.isLoggingIn).toBeTruthy();
    })
  })

  it('should hide loading and send user to the home page when user has logged in', () => {
    spyOn(router, 'navigate')
    spyOn(authService, 'login').and.returnValue(of(new User()));

    fixture.detectChanges();
    component.form.get('email')?.setValue('valid@email.com');
    component.form.get('password')?.setValue('anyPassword');
    page.querySelector('#loginButton').click();
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })
    store.select('login').subscribe(loginState => {
       expect(loginState.isLoggingIn).toBeFalsy();
    })
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  })

  it('should hide loading and show error when user couldnt logged in', () => {
    spyOn(authService, 'login').and.returnValue(throwError({message: 'error'}));
    spyOn(toastController, 'create').and.returnValue(<any> Promise.resolve({present: () => {}}));

    fixture.detectChanges();
    component.form.get('email')?.setValue('error@email.com');
    component.form.get('password')?.setValue('anyPassword');
    page.querySelector('#loginButton').click();
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })

    expect(toastController.create).toHaveBeenCalledTimes(1);
  })

});