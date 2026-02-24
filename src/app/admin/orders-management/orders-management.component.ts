import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../service/order.service';
import { Router } from '@angular/router'; // تأكد من الـ Import ده
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-management.component.html',
  styleUrls: ['./orders-management.component.css']
})
export class OrdersManagementComponent implements OnInit {
  orders: any[] = [];      // دي اللي معروضة في الـ HTML حالياً
allOrders: any[] = [];     // 👈 دي النسخة الأصلية اللي هنرجع لها دايماً
searchTerm: string = '';
  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit() {
    this.loadOrders(); // بننادي الدالة أول ما الكومبوننت يفتح
  }

  // الدالة اللي الـ HTML بيدور عليها (الزرار)
  loadOrders() {
  this.orderService.getAllOrders().subscribe({
    next: (res) => {
      this.orders = res;      // بنعرض البيانات
      this.allOrders = res;   // 👈 بنحتفظ بنسخة "خام" هنا للبحث
    },
    error: (err) => console.error(err)
  });
}

// في ملف الـ .ts

// ميثود البحث المعدلة
onSearch(term: string) {
  const normalizedTerm = term?.toLowerCase().trim();

  if (!normalizedTerm) {
    this.orders = [...this.allOrders];
    return;
  }

  this.orders = this.allOrders.filter(order => {
    try {
      // تحويل أي قيمة لنص "String" إجبارياً مهما كان نوعها لتجنب الـ Crash
      const id = String(order?.id || '').toLowerCase();
      const email = String(order?.customerEmail || '').toLowerCase();
      
      // الدخول بحذر شديد للـ ShippingDetails
      const shipping = order?.shippingDetails;
      const fName = String(shipping?.firstName || '').toLowerCase();
      const lName = String(shipping?.lastName || '').toLowerCase();

      // دمجهم في نص واحد للبحث الشامل
      const searchPool = `${id} ${email} ${fName} ${lName}`;

      return searchPool.includes(normalizedTerm);

    } catch (error) {
      // لو فيه أوردر واحد "بايظ" في الداتابيز، السطر ده هيطبعهولك في الـ Console عشان تعرفه
      console.error("أوردر فيه بيانات غريبة تسببت في خطأ:", order);
      return false; // كمل بحث في الباقي وتجاهل ده
    }
  });
}



  
  // تعديل الـ Counter عشان ميعتمدش على الـ status اللي مسحناها
  getCountByStatus(status: string): number {
    // لو إنت لسه محتاج تعد حاجة معينة عدها هنا، حالياً هنرجع الإجمالي
    return this.orders.length;
  }

  getTotalSales(): number {
    // حساب المبيعات من حقل الـ totalPrice
    return this.orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  }

  // دالة الحذف (تأكد إنها موجودة في الـ OrderService)
  deleteOrder(id: string) {
    if(confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.loadOrders(); // تحديث الجدول بعد الحذف
          alert('تم حذف الطلب بنجاح');
        },
        error: (err) => alert('حدث خطأ أثناء الحذف')
      });
    }
  }

  viewDetails(order: any) {
    // عرض المنتجات بشكل أشيك شوية
    if (order.items && order.items.length > 0) {
      const itemNames = order.items.map((i: any) => `${i.productName} (x${i.quantity})`).join('\n');
      alert(`منتجات الطلب:\n${itemNames}`);
    } else {
      alert('لا توجد منتجات مسجلة لهذا الطلب');
    }
  }

  logout() {
  // 1. امسح التوكن من الـ Local Storage
  localStorage.removeItem('adminToken');
  
  // 2. (اختياري) لو كنت مخزن بيانات تانية زي اسم الإدمن امسحها
  // localStorage.clear(); // دي بتمسح كل حاجة تماماً

  // 3. روح لصفحة اللوجين
  this.router.navigate(['/login']);
}


// orders-management.component.ts

// ميثود لتغيير الحالة
onStatusChange(orderId: string, event: any) {
  const newStatus = event.target.value;
  
  this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
    next: () => {
      // ✅ السطر ده هو "كلمة السر" عشان الحالة تثبت في الـ UI
      // بنلف على المصفوفة ونحدث الأوردر اللي اتعدل بس
      const orderIndex = this.orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        this.orders[orderIndex].status = newStatus;
      }

      alert('Order status updated successfully! ✅');
    },
    error: (err: any) => {
      console.error('Error:', err);
      // في حالة الفشل، بنرجع الداتا زي ما كانت عشان الـ UI ميكدبش على اليوزر
      this.loadOrders(); 
      alert('Failed to update status ❌');
    }
  });
}

// ميثود لشياكة الألوان (Badge Colors)

}