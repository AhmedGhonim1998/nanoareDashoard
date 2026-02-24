import { Component } from '@angular/core';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-admin-layout.',
  imports: [],
  templateUrl: './admin-layout..component.html',
  styleUrl: './admin-layout..component.css'
})
export class AdminLayoutComponent {
orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Error fetching orders', err)
    });
  }

  getCountByStatus(status: string): number {
    return this.orders.filter(o => o.status === status).length;
  }

  getTotalSales(): number {
    return this.orders.reduce((sum, order) => sum + order.totalPrice, 0);
  }

  updateStatus(id: string, newStatus: string) {
    this.orderService.updateOrderStatus(id, newStatus).subscribe(() => {
      this.ngOnInit(); // إعادة تحميل الجدول
    });
  }

  deleteOrder(id: string) {
    if(confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
       // نادى على ميثود الحذف هنا
    }
  }

  viewDetails(order: any) {
    alert(`تفاصيل المنتجات: \n` + order.items.map((i: any) => i.productName).join(', '));
  }
}
