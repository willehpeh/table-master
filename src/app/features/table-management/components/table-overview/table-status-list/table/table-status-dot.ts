import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-status-dot',
  template: `
		<div class="absolute top-3 right-3 w-3 h-3 rounded-full animate-pulse"
				 [class]="dotColorClass()">
		</div>
  `
})
export class TableStatusDot {
  dotColorClass = input.required<string>();
}
