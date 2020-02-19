import Harmony, { HarmonyType } from "./Harmony";
import Note from "./Note";
import { randomChoice } from "./Utils";
import { intervals } from "./Interval";

import fs from 'fs';

import Midi from 'midi-writer-js';

function main() {
  const track = new Midi.Track();

  const notes = generateFewNotes(10);

  track.addEvent(notes.map(note => new Midi.NoteEvent({pitch: note.toLetter(), duration: "2"})));

  console.log(notes.map(note => note.toLetter()).join(' '));

  const writer = new Midi.Writer(track);
  fs.writeFileSync('test.mid', writer.buildFile());
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

function generateFewNotes(number: number) {
  const harmony = new Harmony(9, HarmonyType.minor);

  const notes: Array<Note> = [];

  let prevNote = harmony.newNote(0, 4);

  notes.push(prevNote);

  for (let i = 0; i < number; i++) {
    const newNote = getNextBetterNote(harmony, prevNote, notes);
    notes.push(newNote);
    prevNote = newNote;
  }

  return notes;
}

main();