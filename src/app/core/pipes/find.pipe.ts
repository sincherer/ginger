import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'find',
  standalone: true
})
export class FindPipe implements PipeTransform {
  transform(array: any[] | null, value: any, field: string = 'id'): any {
    if (!array) return null;
    return array.find(item => item[field] === value);
  }
}
