import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:44353/api/orders'; 

  constructor(private http: HttpClient) { }

  // ✅ جلب كل الطلبات للـ Admin
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // ✅ تحديث حالة الطلب - FIXED with correct property name
  updateOrderStatus(orderId: string, newStatus: string): Observable<any> {
    console.log('📤 Updating order status:', orderId, 'to', newStatus);
    
    // ✅ CRITICAL: Property name must be "Status" (capital S) to match C# DTO
    const payload = { Status: newStatus };
    
    console.log('📦 Payload:', payload);
    
    return this.http.put(`${this.apiUrl}/${orderId}/status`, payload);
  }

  // ✅ حذف طلب
  deleteOrder(orderId: string): Observable<any> {
    console.log('🗑️ Deleting order:', orderId);
    return this.http.delete(`${this.apiUrl}/${orderId}`);
  }

  // ✅ جلب طلبات المستخدم
  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-orders`);
  }

  // ✅ جلب طلب واحد بالـ ID
  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`);
  }

  // ✅ إنشاء طلب جديد
  createOrder(customerInfo: any, userId: string): Observable<any> {
    const checkoutDto = {
      userId: userId,
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      email: customerInfo.email,
      address: customerInfo.address,
      extraMessage: customerInfo.extraMessage || customerInfo.message || ""
    };
    
    console.log('📤 Creating order:', checkoutDto);
    return this.http.post<any>(`${this.apiUrl}/checkout`, checkoutDto);
  }
}