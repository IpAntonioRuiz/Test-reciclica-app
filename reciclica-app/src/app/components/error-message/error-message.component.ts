import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  standalone: false
})
export class ErrorMessageComponent  implements OnInit {

  @Input() message?: string;
  @Input() field: AbstractControl | null = null;
  @Input() error?: string;

  constructor() { }

  ngOnInit() {}

  shouldShowComponent(){
    //form.get('staffid').touched && form.get('staffid').errors?.required
    if (this.field && this.field.touched && this.error && this.field.errors?.[this.error]) {
      return true;
    }
    return false;
  }
}
