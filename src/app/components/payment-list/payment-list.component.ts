import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css'],
})
export class PaymentListComponent implements OnInit {
  payments: any[] = [];
  search: string = '';
  status: string = '';
  page: number = 1;
  size: number = 10;
  totalPages: number = 0;

  constructor(private paymentService: PaymentService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPayments();
  }

  fetchPayments(): void {
    this.paymentService.getPayments(this.search, this.status, this.page, this.size).subscribe(
      (response: any) => {
        this.payments = response.data || [];
        this.totalPages = Math.ceil((response.total || 0) / this.size);
      },
      (error) => {
        console.error('Error fetching payments:', error);
        alert('Failed to load payments.');
      }
    );
  }

  onSearch(): void {
    this.page = 1; 
    this.fetchPayments();
  }

  onStatusChange(): void {
    this.page = 1; 
    this.fetchPayments();
  }

  uploadEvidence(paymentId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.paymentService.uploadEvidence(paymentId, file).subscribe(
        () => {
          alert('Evidence uploaded successfully!');
          this.fetchPayments();
        },
        (error) => {
          console.error('Error uploading evidence:', error);
          alert('Failed to upload evidence. Please try again.');
        }
      );
    }
  }
  editPayment(paymentId: string): void {
    console.log(paymentId)
    this.router.navigate(['/add', paymentId]); 
  }
  navigateToAddPayment(): void {
    this.router.navigate(['/add']);
  }

  downloadEvidence(paymentId: string): void {
    this.paymentService.downloadEvidence(paymentId);
  }

  deletePayment(paymentId: string): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.paymentService.deletePayment(paymentId).subscribe(
        () => {
          alert('Payment deleted successfully!');
          this.fetchPayments();
        },
        (error) => {
          console.error('Error deleting payment:', error);
          alert('Failed to delete payment. Please try again.');
        }
      );
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchPayments();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchPayments();
    }
  }
}
