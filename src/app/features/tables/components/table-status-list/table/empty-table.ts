import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-table',
  template: `
		<div class="col-span-full text-center py-16" data-testid="no-tables-message">
			<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
				<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
				</svg>
			</div>
			<h3 class="text-lg font-medium text-gray-300 mb-2">No tables available</h3>
			<p class="text-gray-500">Tables will appear here once they're added to the system</p>
		</div>
  `
})
export class EmptyTable {}
