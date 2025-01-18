import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  templateUrl: './payment-add.component.html',
  styleUrls: ['./payment-add.component.css']
})
export class PaymentAddComponent implements OnInit {
  addPaymentForm: FormGroup;
  isEditMode = false;
  paymentId: string | null = null;
  addressSuggestions: string[] = [];
  countries: string[] = [];
  cities: string[] = [];
  currencies: string[] = [];
  statusOptions: string[] = ['completed', 'due_now', 'overdue', 'pending'];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountries();
    this.loadCurrencies();
    this.route.paramMap.subscribe((params) => {
      this.paymentId = params.get('id');
      this.isEditMode = !!this.paymentId;
      this.initializeForm();
      if (this.isEditMode) {
        this.fetchPaymentDetails(this.paymentId!);
      }
    });
  }

  initializeForm(): void {
    this.addPaymentForm = this.fb.group({
      payee_first_name: [{ value: '', disabled: this.isEditMode }, Validators.required],
      payee_last_name: [{ value: '', disabled: this.isEditMode }, Validators.required],
      due_amount: [, [Validators.required, Validators.min(0)]],
      payee_due_date: ['', Validators.required],
      payee_address_line_1: [{ value: '', disabled: this.isEditMode }, Validators.required],
      payee_city: [{ value: '', disabled: this.isEditMode }, Validators.required],
      payee_country: [{ value: '', disabled: this.isEditMode }, Validators.required],
      payee_postal_code: [{ value: '', disabled: this.isEditMode }, Validators.required],
      payee_phone_number: [{ value: '', disabled: this.isEditMode }, Validators.required],
      payee_email: [{ value: '', disabled: this.isEditMode }, [Validators.required, Validators.email]],
      currency: [{ value: '', disabled: this.isEditMode }, Validators.required],
      payee_payment_status: [{ value: 'pending', disabled: !this.isEditMode }, Validators.required]
    });
  }

  loadCountries(): void {
    this.http.get<any>('https://countriesnow.space/api/v0.1/countries/positions').subscribe(
      (response) => {
        this.countries = response.data.map((country: any) => country.name);
      },
      (error) => console.error('Error loading countries:', error)
    );
  }

  loadCities(country: string): void {
    if (country) {
      this.http.post<any>('https://countriesnow.space/api/v0.1/countries/cities', { country }).subscribe(
        (response) => {
          this.cities = response.data || [];
        },
        (error) => console.error('Error loading cities:', error)
      );
    }
  }

  loadCurrencies(): void {
    this.http.get<any>('https://countriesnow.space/api/v0.1/countries/currency').subscribe(
      (response) => {
        this.currencies = response.data.map((item: any) => item.currency);
      },
      (error) => console.error('Error loading currencies:', error)
    );
  }

  onCountryChange(): void {
    const selectedCountry = this.addPaymentForm.get('payee_country')?.value;
    this.loadCities(selectedCountry);
  }

  fetchPaymentDetails(id: string): void {
    this.paymentService.getPaymentById(id).subscribe((payment) => {
      this.addPaymentForm.patchValue(payment);
    });
  }

  handleError(error: any): void {
    console.error('Error:', error);
    if (error.status === 400 && error.error?.detail) {
      alert(error.error.detail);
    } else {
      alert('An unexpected error occurred. Please try again later.');
    }
  }
  
  submitPayment(): void {
    if (this.addPaymentForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }
    const paymentStatus = this.addPaymentForm.get('payee_payment_status')?.value;
    const dueAmount = this.addPaymentForm.get('due_amount')?.value;

    if (paymentStatus === 'completed' && dueAmount !== 0) {
      alert('Due amount must be 0 before marking the payment as completed.');
      return;
    }
    this.isLoading = true;

    const paymentData = {
      ...this.addPaymentForm.getRawValue(),
      payee_due_date: formatDate(this.addPaymentForm.get('payee_due_date')?.value, 'yyyy-MM-dd', 'en-US')
    };

    if (this.isEditMode && this.paymentId) {
      this.paymentService.updatePayment(this.paymentId, paymentData).subscribe(
        () => {
          alert('Payment updated successfully!');
          this.router.navigate(['/']);
        },
        (error) => {
          this.handleError(error);
        },
        () => {
          this.isLoading = false;
        }
      );
    } else {
      this.paymentService.addPayment(paymentData).subscribe(
        () => {
          alert('Payment added successfully!');
          this.router.navigate(['/']);
        },
        (error) => {
          this.handleError(error);
        },
        () => {
          this.isLoading = false;
        }
      );
    }
  }
}