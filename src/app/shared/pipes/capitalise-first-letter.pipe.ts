import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitaliseFirstLetter',
})
export class CapitaliseFirstLetterPipe implements PipeTransform {
  transform(word: string): string {
    if (!word) {
      return word;
    }

    return word[0].toUpperCase() + word.slice(1);
  }
}
