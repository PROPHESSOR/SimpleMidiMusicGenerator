abstract class Class {
  abstract name: string;

  toString() {
    return `Music Class <${this.name}>`;
  }
}

// interface iSongConstructor {
//   harmony: Harmony;
// }

// class Song extends Class {
//   name = "Song";
//   harmony: Harmony;
//   // tracks: Array<Track>;
//   // measures: Array<Measure>;
//   notes: Array<OffsetNote>; // FIXME:

//   constructor({ harmony }: iSongConstructor) {
//     super();
//     this.harmony = harmony;
//   }
// }

enum HarmonyType {
  normal,
  major,
  minor
}

class Harmony extends Class {
  // song: Song;
  name = "Harmony";
  offset: number;
  type: HarmonyType;

  constructor(offset: number, type: HarmonyType = HarmonyType.normal) {
    super();
    // this.song = song;
    this.offset = offset;
    this.type = type;
  }

  newNote(note: number, octave: number): Note {
    if (this.type === HarmonyType.major) note = Harmony.majorNotes[note];
    else if (this.type === HarmonyType.minor) note = Harmony.minorNotes[note];

    return new Note(note, octave).shift(this.offset);
  }

  toArray() {
    const { noteLetters: letters } = Note;
    const array = [];

    letters.forEach((_, index) => {
      array.push(letters[(index + this.offset) % letters.length]);
    });
  }

  static majorNotes = [0, 2, 4, 5, 7, 9, 10];
  static minorNotes = [0, 2, 3, 5, 7, 8, 10];

  static naturalHarmony = new Harmony(0);
}

// class Track extends Class {
//   song: Song;
//   name = "Track";
//   measures: Array<Measure>;
// }

// class Measure extends Class {
//   track: Track;
//   harmony: Harmony;
//   song: Song;
//   name = "Measure";
// }

// class OffsetNote extends Class {
//   // measure: Measure; // Measure
//   // track: Track; // Track
//   harmony: Harmony; // Harmony
//   // song: Song; // Song
//   note

//   name = "Note";

//   get letter() {

//   }
// }

class Interval extends Class {
  name = "Interval";
  intname: string;
  offset: number;

  constructor(offset: number, name: string = "Unnamed") {
    super();
    this.offset = offset;
    this.intname = name;
  }

  buildUp(note: Note): Note {
    return note.shift(this.offset);
  }

  buildDown(note: Note): Note {
    return note.shift(-this.offset);
  }

  toString() {
    return `[Interval <${this.intname}> (+/- ${this.offset})]`;
  }
}

const intervals = {
  unison: new Interval(0, "perfect unison"),
  minsecond: new Interval(1, "minor second"),
  majsecond: new Interval(2, "major second"),
  minthird: new Interval(3, "minor third"),
  majthird: new Interval(4, "major third"),
  forth: new Interval(5, "perfect forth"),
  fifth: new Interval(7, "perfect fifth"),
  minsixth: new Interval(8, "minor sixth"),
  majsixth: new Interval(9, "major sixth"),
  minseventh: new Interval(10, "minor seventh"),
  majseventh: new Interval(11, "major seventh"),
  octave: new Interval(1, "perfect octave")
};

class Note {
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

function random(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

function randomChoice(...choices: Array<any>) {
  return choices[random(0, choices.length)];
}

/**
 * Note: Requires HarmonyType.minor!
 */
function getNextBetterNote(
  harmony: Harmony, // Unused
  prevNote: Note,
  prevNotes: Array<Note>
) {
  const interval = randomChoice(
    intervals.minthird,
    intervals.majsixth,
    intervals.forth,
    intervals.fifth
  );
  console.log(interval);
  const direction = randomChoice("Up", "Down");

  return interval[`build${direction}`](prevNote);
}

function generateFewNotes() {
  const harmony = new Harmony(9, HarmonyType.minor);

  const notes: Array<Note> = [];

  // for (let i = 0; i < 7; i++) {
  //   notes.push(harmony.newNote(i, 4));
  // }

  const note = harmony.newNote(0, 4);

  notes.push(note);

  // notes.push(getNextBetterNote(harmony, note, notes));

  //

  // notes.push(harmony.newNote(0, 4));
  // notes.push(harmony.newNote(3, 4));
  // notes.push(harmony.newNote(7, 4));

  //

  for (let i = 0; i < 10; i++) {
    notes.push(getNextBetterNote(harmony, note, notes));
  }

  return notes;
}

console.log(generateFewNotes().map(note => note.toLetter()));

window.Note = Note;
