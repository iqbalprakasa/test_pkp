import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, NgZone, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  searchQuery: string = '';
  filteredProducts: any[] = [];
  isModalOpen: boolean = false;
  selectedProduct: any = null;

  // Signal untuk status loading
  isLoading = signal<boolean>(false);
  isLoadingDetail = signal<boolean>(false);

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  ngOnInit(): void {
    this.fetchInitialProducts();
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.isLoading.set(true); 
        return this.productService.getProducts(query);
      })
    ).subscribe({
      next: (response: any) => {
        this.zone.run(() => {
          this.filteredProducts = response.products;
          this.isLoading.set(false);
          this.cdr.detectChanges(); 
        }); 
      },
      error: (err) => {
        console.error('Gagal memuat pencarian produk:', err);
        this.zone.run(() => {
          this.isLoading.set(false);
          this.cdr.detectChanges();
        });
      }
    });
  }

  fetchInitialProducts(): void {
    this.isLoading.set(true);

    this.productService.getProducts('').subscribe({
      next: (response: any) => {
        this.zone.run(() => {
          this.filteredProducts = response.products;
          this.isLoading.set(false);
          this.cdr.detectChanges(); 
        });
      },
      error: (err) => {
        console.error(err);
        this.zone.run(() => {
          this.isLoading.set(false);
          this.cdr.detectChanges();
        });
      }
    });
  }

  onSearchChange(): void {
    const query = this.searchQuery.trim();
    this.searchSubject.next(query);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.fetchInitialProducts();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  getDiscountedPrice(price: number, discount: number): number {
    return price - (price * (discount / 100));
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  viewProductDetail(id: number): void {
    this.isLoadingDetail.set(true);
    this.isModalOpen = true;
    this.cdr.detectChanges();

    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
        this.zone.run(() => {
          this.selectedProduct = response;
          this.isLoadingDetail.set(false);
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Gagal mengambil detail produk:', err);
        this.zone.run(() => {
          this.isLoadingDetail.set(false);
          this.closeModal();
          this.cdr.detectChanges();
        });
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
    this.cdr.detectChanges();
  }
}