import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecase'
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    
    return value.toLowerCase().split(' ').map(word => {
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    }).join(' ');
  }
}