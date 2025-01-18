import { Routes } from '@angular/router';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { PaymentAddComponent } from './components/payment-add/payment-add.component';


export const routes: Routes = [
  { path: '', component: PaymentListComponent },
  { path: 'add', component: PaymentAddComponent },
  { path: 'add/:id', component: PaymentAddComponent }
];
