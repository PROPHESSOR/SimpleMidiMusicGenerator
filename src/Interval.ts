import Note from "./Note";

export default class Interval {
  name = "Interval";
  intname: string;
  offset: number;

  constructor(offset: number, name: string = "Unnamed") {
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

export const intervals = {
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
