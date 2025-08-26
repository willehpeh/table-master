import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-status-dot',
  template: `
		<div class="absolute top-3 right-3 w-3 h-3 rounded-full animate-pulse"
				 [class]="dotColor()">
		</div>
  `
})
export class TableStatusDotComponent {
  dotColor = input.required<string>();
}
