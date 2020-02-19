export default class Note {
  octave: number;
  note: number; // 0 - 11
  rotation: number;

  constructor(note: number, octave: number = 4, rotation: number = 0) {
    Note.validateNoteNumber(note);
    Note.validateOctave(octave);

    this.note = note;
    this.octave = octave;
    this.rotation = rotation;
  }

  shift(offset: number) {
    return Note.intToNote(Note.noteToInt(this) + offset);
  }

  toLetter() {
    return Note.noteLetters[this.note] + this.octave;
  }

  toRotatedLetter() {
    return Note.noteLetters[
      (this.note + this.rotation) % Note.noteLetters.length
    ];
  }

  toString() {
    this.toLetter();
  }

  [Symbol.toStringTag]() {
    this.toLetter();
  }

  get sharp(): boolean {
    return [1, 3, 7, 9, 11].includes(this.note);
  }

  static letters: Array<string> = ["C", "D", "E", "F", "G", "A", "H"];
  static noteLetters = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "H"
  ];

  static fromLetter(abbreviation: string) {
    let letter, octave, sharp;

    if (abbreviation.length === 2) {
      [letter, octave] = abbreviation.split("");
    } else if (abbreviation.length === 3) {
      [letter, sharp, octave] = abbreviation.split("");
    } else {
      throw new Error(
        'Note abbreviation must be like "C4" or "A#5" (note letter[sharp]octave)!'
      );
    }

    let note = Note.getNoteNumberByLetter(letter);

    if (sharp) note++;

    return new Note(note, Number(octave));
  }

  static noteToInt(
    note: Note,
    misc: { notesInOctave: number } = { notesInOctave: 12 }
  ): number {
    return Note.noteParamsToInt(note.note, note.octave, misc);
  }

  static noteParamsToInt(
    note: number,
    octave: number,
    { notesInOctave = 12 } = {}
  ): number {
    return octave * notesInOctave + note;
  }

  static intToNote(int: number, { notesInOctave = 12 } = {}): Note {
    return new Note(int % notesInOctave, ~~(int / notesInOctave));
  }

  static getNoteNumberByLetter(letter: string): number {
    Note.validateLetter(letter);

    return Note.letters.indexOf(letter);
  }

  static validateNoteNumber(note: number): void {
    if (Number.isInteger(note) && note >= 0 && note <= 11) return;
    throw new Error(`Note number must be between 0 and 11! [${note}]`);
  }

  static validateOctave(octave: number): void {
    if (Number.isInteger(octave) && octave >= 1 && octave <= 7) return;
    throw new Error(`Octave number must be between 1 and 7! [${octave}]`);
  }

  static validateLetter(letter: string): void {
    if (letter.length === 1 && Note.letters.includes(letter)) return;
    throw new Error(
      `Note letter must be one of (${Note.letters})! [${letter}]`
    );
  }
}
