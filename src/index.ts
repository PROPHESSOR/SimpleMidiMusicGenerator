import Harmony, { HarmonyType } from "./Harmony";
import Note from "./Note";
import { randomChoice } from "./Utils";
import { intervals } from "./Interval";

function main() {
  const notes = generateFewNotes();

  console.log(notes.map(note => note.toLetter()).join(' '));
}

/**
 * Note (not now): Requires HarmonyType.minor!
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

main();