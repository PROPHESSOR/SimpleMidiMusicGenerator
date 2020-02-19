import Harmony, { HarmonyType } from "./Harmony";
import Note from "./Note";
import { randomChoice } from "./Utils";
import { intervals } from "./Interval";

import fs from 'fs';

// @ts-ignore
import Midi from 'jsmidgen';

function main() {
  const file = new Midi.File();
  const track = new Midi.Track();
  file.addTrack(track);

  const notes = generateFewNotes(10);

  notes.forEach((note, index) => {
    track.addNote(0, note.toLetter().toLowerCase(), 64);
  })

  console.log(notes.map(note => note.toLetter()).join(' '));

  fs.writeFileSync('test.mid', file.toBytes(), 'binary');
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