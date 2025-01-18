import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'https://adcorepaymentsystem-192f3b5c8700.herokuapp.com/payments';

  constructor(private http: HttpClient) {}

  createPayment(payment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, payment);
  }


  addPayment(payment: any): Observable<any> {
    return this.http.post(this.baseUrl, payment);
  }

  getPayments(search: string, status: string, page: number, size: number): Observable<any> {
    const params = { search, status, page: page.toString(), size: size.toString() };
    return this.http.get<any>(this.baseUrl, { params });
  }


  getPaymentById(paymentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${paymentId}`);
  }
  

  updatePayment(paymentId: string, payment: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${paymentId}`, payment);
  }


  deletePayment(paymentId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${paymentId}`);
  }


  uploadEvidence(paymentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/${paymentId}/upload_evidence/`, formData);
  }


  downloadEvidence(paymentId: string): void {
    const url = `${this.baseUrl}/${paymentId}/download_evidence/`;
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (blob) => {
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `evidence_${paymentId}`;
        a.click();
        window.URL.revokeObjectURL(fileUrl);
      },
      (error) => {
        console.error('Error downloading file:', error);
        alert('Failed to download evidence.');
      }
    );
  }

}
