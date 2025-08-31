import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PartyIcon } from './party-icon';

@Component({
  selector: 'app-party-size-input',
  imports: [ReactiveFormsModule, PartyIcon],
  template: `
		<label for="partySize" class="block mb-2 text-sm font-medium text-gray-300">
			<span>Party Size</span>
		</label>
		<div class="relative">
			<input type="number"
						 id="partySize"
						 [formControl]="partySizeCtrl()"
						 data-testid="party-size-input"
						 placeholder="How many guests?"
						 class="w-full px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm">
			<div class="absolute inset-y-0 right-0 flex items-center pr-4">
				<app-party-icon/>
			</div>
		</div>
  `
})
export class PartySizeInput {
  partySizeCtrl = input.required<FormControl>();
}
