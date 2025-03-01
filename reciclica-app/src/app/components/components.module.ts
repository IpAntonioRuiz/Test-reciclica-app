import { NgModule } from "@angular/core";
import { PickupCallCardComponent } from "./pickup-call-card/pickup-call-card.component";
import { fromEventPattern } from "rxjs";
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [PickupCallCardComponent],  
    exports: [PickupCallCardComponent]
})
export class ComponentsModule {}