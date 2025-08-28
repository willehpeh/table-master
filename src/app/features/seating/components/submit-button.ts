import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="submit"
            [disabled]="disabled() || isLoading()"
            data-testid="assign-button"
            (click)="onSubmit()"
            class="relative w-full group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-600/25 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:hover:shadow-none">

      @if (isLoading()) {
        <div class="flex items-center justify-center space-x-3">
          <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                    stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loadingText() }}</span>
        </div>
      } @else {
        <div class="flex items-center justify-center space-x-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>{{ buttonText() }}</span>
        </div>
      }
      
      <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
    </button>
  `
})
export class SubmitButtonComponent {
  disabled = input<boolean>(false);
  isLoading = input<boolean>(false);
  buttonText = input<string>('Submit');
  loadingText = input<string>('Loading...');

  submit = output<void>();

  onSubmit(): void {
    if (this.disabled() || this.isLoading()) {
      return;
    }
    this.submit.emit();
  }
}
