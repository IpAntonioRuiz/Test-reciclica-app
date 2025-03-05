import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { loadingReducer } from 'src/store/loading/loading.reducers';
import { loginReducer } from 'src/store/login/login.reducers';
import { AppState } from 'src/store/AppState';
import { login, loginFail, loginSuccess, recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from 'src/store/login/login.actions';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/model/user/User';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;
  let page: any;
  let store: Store<AppState>;
  let toastController:  ToastController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('loading', loadingReducer),
        StoreModule.forFeature('login', loginReducer),
        AngularFireModule.initializeApp(environment.firebaseConfig)
      ],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ToastController, useValue: { create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: () => {} })) } }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    AppRoutingModule;
    ReactiveFormsModule;
    StoreModule.forRoot([]);
    StoreModule.forFeature("loading", loadingReducer);
    StoreModule.forFeature("login", loginReducer);
    AngularFireModule.initializeApp(environment.firebaseConfig);


    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    toastController = TestBed.inject(ToastController);

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
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    })
  });

  it('given user is recovering password, when success, then hide loading and show success message', () => {
    spyOn(toastController, 'create').and.returnValue(<any> Promise.resolve({present: () => {}}));

    fixture.detectChanges();
    store.dispatch(recoverPassword({email: "any@email.com"}));
    store.dispatch(recoverPasswordSuccess());

    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })
    expect(toastController.create).toHaveBeenCalledTimes(1);
  });

  it('given user is recovering password, when fail, then hide loading and show error message', () => {
    spyOn(toastController, 'create');

    fixture.detectChanges();
    store.dispatch(recoverPassword({email: "any@email.com"}));
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

  it('given user us logging in, when success, then hide loading and send user to home page', () => {
    spyOn(router, 'navigate')

    fixture.detectChanges();
    store.dispatch(login({email: "valid@email.com", password: "anyPassword"}));
    store.dispatch(loginSuccess({user: new User()}));

    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })
    store.select('login').subscribe(loginState => {
       expect(loginState.isLoggedIn).toBeFalsy();
    })
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  })

  it('guven user us logging in, when error, then hide loading and show error message', () => {
    spyOn(toastController, 'create').and.returnValue(<any> Promise.resolve({present: () => {}}));

    fixture.detectChanges();
    store.dispatch(login({email: "valid@email.com", password: "anyPassword"}));
    store.dispatch(loginFail({error: {message: 'error message'}}));

    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })

    expect(toastController.create).toHaveBeenCalledTimes(1);
  })

});