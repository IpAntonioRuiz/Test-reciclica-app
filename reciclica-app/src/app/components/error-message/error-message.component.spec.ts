import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ErrorMessageComponent } from './error-message.component';
import { FormGroup } from '@angular/forms';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorMessageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message on field touched and error present', () => {
    component.field = new FormGroup({anyField: new FormGroup('')});

    component.field.markAsTouched();
    component.field.setErrors({anyError: true});
    component.error = 'anyError';

    expect(component.shouldShowComponent()).toBeTruthy();
  });

  it('should not show error message on field not touched', () => {
    component.field = new FormGroup({anyField: new FormGroup('')});

    component.field.setErrors({anyError: true});
    component.error = 'anyError';

    expect(component.shouldShowComponent()).toBeFalsy();
  });

  it('should not show error message on error not present', () => {
    component.field = new FormGroup({anyField: new FormGroup('')});

    component.field.markAsTouched();
    component.error = 'anyError';

    expect(component.shouldShowComponent()).toBeFalsy();
  });

  it('should hide error message on field touched and has error, but it is a different error', () => {
    component.field = new FormGroup({anyField: new FormGroup('')});

    component.field.markAsTouched();
    component.field.setErrors({anyError: true});
    component.error = 'anotherError';

    expect(component.shouldShowComponent()).toBeFalsy();
  });

});
