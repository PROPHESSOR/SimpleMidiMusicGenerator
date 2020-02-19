import Note from "./Note";

export enum HarmonyType {
  normal,
  major,
  minor
}

export default class Harmony {
  offset: number;
  type: HarmonyType;

  constructor(offset: number, type: HarmonyType = HarmonyType.normal) {
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