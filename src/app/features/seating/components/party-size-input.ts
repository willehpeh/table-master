import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-party-size-input',
  imports: [ReactiveFormsModule],
  template: `
			<label for="partySize" class="block mb-2 text-sm font-medium text-gray-300">
				<span>Party Size</span>
			</label>
			<div class="relative">
				<input type="number"
							 id="partySize"
							 [formControl]="partySizeCtrl()"
							 min="1"
							 max="12"
							 data-testid="party-size-input"
							 placeholder="How many guests?"
							 class="w-full px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm">
				<div class="absolute inset-y-0 right-0 flex items-center pr-4">
					<svg class="w-5 h-5 text-gray-400" stroke="currentColor" viewBox="0 0 24 24">
						<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
					</svg>
				</div>
			</div>
  `
})
export class PartySizeInputComponent {
  partySizeCtrl = input.required<FormControl>();
}
