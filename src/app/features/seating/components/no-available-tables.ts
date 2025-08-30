import { Component, input } from '@angular/core';

@Component({
  selector: 'app-no-available-tables',
  template: `
		<div class="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4" data-testid="no-available-tables">
			<div class="flex items-center space-x-3">
				<div class="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
					<svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
					</svg>
				</div>
				<div>
					<p class="text-yellow-400 font-medium">No suitable tables available</p>
					<p class="text-yellow-400/70 text-sm">No tables can accommodate a party of {{ partySize() }} guests</p>
				</div>
			</div>
		</div>
  `
})
export class NoAvailableTables {
  partySize = input<number>(0);
}
