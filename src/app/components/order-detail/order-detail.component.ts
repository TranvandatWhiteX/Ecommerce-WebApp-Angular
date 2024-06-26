import { CommentDTO } from './../../dtos/comment.dto';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageResponse } from '../../responses/storage.response';
import { OrderDetailResponse } from '../../responses/order-detail.response';
import { ProductService } from '../../services/product.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  now: Date;
  userId: string = '';
  orderDetailResponses?: OrderDetailResponse[];
  currentPage: number = 1;
  itemsPerPage: number = 1;
  ratingControl = new FormControl(0);
  commentControl = new FormControl('');
  commentForm: FormGroup;
  constructor(private router: ActivatedRoute, private orderService: OrderService, private fb: FormBuilder
    , private proudctService: ProductService, private toastr: ToastrService
  ) {
    this.commentForm = this.fb.group({
      comments: this.fb.array([])
    })
    this.now = new Date();
  }
  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      this.userId = params.get('userId') ?? '';
    });
    this.getOrderDetail(this.userId);

    // this.populateForm();
  }
  cancelOrder(orderId: string) {
    this.orderService.cancelOrder(orderId).subscribe({
      next: (apiResponse: ApiResponse<any>) => {
        this.toastr.success("Hủy đơn hàng thành công", "Thành công");
        window.location.reload()
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error("Hủy đơn hàng thất bại", "Thất bại");
      }
    })
  }
  formatPrice(price: number | undefined): string {
    if (price === undefined) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
  get comments(): FormArray {
    return this.commentForm.get('comments') as FormArray;
  }
  populateForm() {
    this.orderDetailResponses!.forEach(orderDetailResponse => {
      if (!orderDetailResponse.order.isCommented) {
        orderDetailResponse.detailResponses.forEach(detailResponse => {
          this.comments.push(this.fb.group({
            productName: detailResponse.productName,
            productThumbnail: detailResponse.productThumbnail,
            rating: [0, Validators.required],
            content: ['', Validators.required],
            productId: detailResponse.productId,
            userId: this.userId,
            orderId: orderDetailResponse.order.id
          }));
        });
      }
    });
  }
  getOrderDetail(userId: string) {
    this.orderService.getOrderDetail(userId).subscribe({
      next: (apiResponse: ApiResponse<StorageResponse<OrderDetailResponse[]>>) => {
        this.orderDetailResponses = apiResponse.data.orderDetails;
        this.populateForm();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    })
  }
  comment() {
    const request: CommentDTO[] = [];
    type CommentFormControl = {
      productName: string;
      productThumbnail: string;
      rating: number;
      content: string;
      productId: string;
      userId: string;
      orderId: string;
    }
    const commentFormControls = this.commentForm.get('comments')?.value as CommentFormControl[];
    commentFormControls.map(commentFormControl => {
      let commentDTO: CommentDTO = {
        star: commentFormControl.rating,
        content: commentFormControl.content,
        productId: commentFormControl.productId,
        userId: commentFormControl.userId,
        orderId: commentFormControl.orderId
      }
      request.push(commentDTO);
    })
    // request.push(commentFormControls.map(({ productName, productThumbnail, ...rest }) => rest));
    console.log(request);
    console.log(this.commentForm.value, request);
    this.proudctService.createListComment(request).subscribe({
      next: (apiResponse: ApiResponse<any>) => {
        this.toastr.success("Nhận xét thành công", "Thành công");
        console.log(apiResponse);
        // this.commentForm.reset();
        // this.commentForm.get('comments')?.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error("Nhận xét thất baị", "Thất bại");
        console.error(error?.error?.message ?? 'An error occurred during registration');
      }
    })
  }
  generateInvoice() {
    const invoice: any = document.getElementById("invoice");
    html2canvas(invoice).then((canvas) => {
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
      pdf.save('invoice.pdf');
    })
  }
}