import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/admin/user/user.component';
import { HeaderAdminComponent } from './components/admin/header-admin/header-admin.component';
import { OrderAdminComponent } from './components/admin/order-admin/order-admin.component';
import { ProductAdminComponent } from './components/admin/product-admin/product-admin.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { BlockParameter } from '@angular/compiler';
import { BlogComponent } from './components/admin/blog/blog.component';
import { ArticleComponent } from './components/article/article.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductComponent,
    ProductDetailComponent,
    LoginComponent,
    RegisterComponent,
    OrderComponent,
    OrderDetailComponent,
    UserProfileComponent,
    WishListComponent,
    AdminComponent,
    UserComponent,
    HeaderAdminComponent,
    OrderAdminComponent,
    ProductAdminComponent,
    BlogComponent,
    ArticleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbModule,
    EditorModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
