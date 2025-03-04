import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/store/AppState';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoadingState } from 'src/store/loading/LoadingState';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: false
})
export class LoadingComponent  implements OnInit {

  loadingState$!: Observable<LoadingState>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.loadingState$ = this.store.select('loading');
  }

}
