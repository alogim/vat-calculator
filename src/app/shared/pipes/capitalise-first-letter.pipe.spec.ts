import { CapitaliseFirstLetterPipe } from './capitalise-first-letter.pipe';

describe('CapitaliseFirstLetterPipe', () => {
  let pipe: CapitaliseFirstLetterPipe;

  beforeEach(() => {
    pipe = new CapitaliseFirstLetterPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should capitalise the first letter of a word and keep the rest of the word unchanged', () => {
    const word: string = 'test';

    const actualWord: string = pipe.transform(word);
    const expectedWord: string = 'Test';

    expect(expectedWord).toEqual(actualWord);
  });

  it('should capitalise only the first letter of a word and keep the rest of the words unchanged', () => {
    const word: string = 'test with a string';

    const actualWord: string = pipe.transform(word);
    const expectedWord: string = 'Test with a string';

    expect(expectedWord).toEqual(actualWord);
  });
});
