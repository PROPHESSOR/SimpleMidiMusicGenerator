var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Class = /** @class */ (function () {
    function Class() {
    }
    Class.prototype.toString = function () {
        return "Music Class <" + this.name + ">";
    };
    return Class;
}());
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
var HarmonyType;
(function (HarmonyType) {
    HarmonyType[HarmonyType["normal"] = 0] = "normal";
    HarmonyType[HarmonyType["major"] = 1] = "major";
    HarmonyType[HarmonyType["minor"] = 2] = "minor";
})(HarmonyType || (HarmonyType = {}));
var Harmony = /** @class */ (function (_super) {
    __extends(Harmony, _super);
    function Harmony(offset, type) {
        if (type === void 0) { type = HarmonyType.normal; }
        var _this = _super.call(this) || this;
        // song: Song;
        _this.name = "Harmony";
        // this.song = song;
        _this.offset = offset;
        _this.type = type;
        return _this;
    }
    Harmony.prototype.newNote = function (note, octave) {
        if (this.type === HarmonyType.major)
            note = Harmony.majorNotes[note];
        else if (this.type === HarmonyType.minor)
            note = Harmony.minorNotes[note];
        return new Note(note, octave).shift(this.offset);
    };
    Harmony.prototype.toArray = function () {
        var _this = this;
        var letters = Note.noteLetters;
        var array = [];
        letters.forEach(function (_, index) {
            array.push(letters[(index + _this.offset) % letters.length]);
        });
    };
    Harmony.majorNotes = [0, 2, 4, 5, 7, 9, 10];
    Harmony.minorNotes = [0, 2, 3, 5, 7, 8, 10];
    Harmony.naturalHarmony = new Harmony(0);
    return Harmony;
}(Class));
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
var Interval = /** @class */ (function (_super) {
    __extends(Interval, _super);
    function Interval(offset, name) {
        if (name === void 0) { name = "Unnamed"; }
        var _this = _super.call(this) || this;
        _this.name = "Interval";
        _this.offset = offset;
        _this.intname = name;
        return _this;
    }
    Interval.prototype.buildUp = function (note) {
        return note.shift(this.offset);
    };
    Interval.prototype.buildDown = function (note) {
        return note.shift(-this.offset);
    };
    Interval.prototype.toString = function () {
        return "[Interval <" + this.intname + "> (+/- " + this.offset + ")]";
    };
    return Interval;
}(Class));
var intervals = {
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
var Note = /** @class */ (function () {
    function Note(note, octave, rotation) {
        if (octave === void 0) { octave = 4; }
        if (rotation === void 0) { rotation = 0; }
        Note.validateNoteNumber(note);
        Note.validateOctave(octave);
        this.note = note;
        this.octave = octave;
        this.rotation = rotation;
    }
    Note.prototype.shift = function (offset) {
        return Note.intToNote(Note.noteToInt(this) + offset);
    };
    Note.prototype.toLetter = function () {
        return Note.noteLetters[this.note] + this.octave;
    };
    Note.prototype.toRotatedLetter = function () {
        return Note.noteLetters[(this.note + this.rotation) % Note.noteLetters.length];
    };
    Note.prototype.toString = function () {
        this.toLetter();
    };
    Note.prototype[Symbol.toStringTag] = function () {
        this.toLetter();
    };
    Object.defineProperty(Note.prototype, "sharp", {
        get: function () {
            return [1, 3, 7, 9, 11].includes(this.note);
        },
        enumerable: true,
        configurable: true
    });
    Note.fromLetter = function (abbreviation) {
        var _a, _b;
        var letter, octave, sharp;
        if (abbreviation.length === 2) {
            _a = abbreviation.split(""), letter = _a[0], octave = _a[1];
        }
        else if (abbreviation.length === 3) {
            _b = abbreviation.split(""), letter = _b[0], sharp = _b[1], octave = _b[2];
        }
        else {
            throw new Error('Note abbreviation must be like "C4" or "A#5" (note letter[sharp]octave)!');
        }
        var note = Note.getNoteNumberByLetter(letter);
        if (sharp)
            note++;
        return new Note(note, Number(octave));
    };
    Note.noteToInt = function (note, misc) {
        if (misc === void 0) { misc = { notesInOctave: 12 }; }
        return Note.noteParamsToInt(note.note, note.octave, misc);
    };
    Note.noteParamsToInt = function (note, octave, _a) {
        var _b = (_a === void 0 ? {} : _a).notesInOctave, notesInOctave = _b === void 0 ? 12 : _b;
        return octave * notesInOctave + note;
    };
    Note.intToNote = function (int, _a) {
        var _b = (_a === void 0 ? {} : _a).notesInOctave, notesInOctave = _b === void 0 ? 12 : _b;
        return new Note(int % notesInOctave, ~~(int / notesInOctave));
    };
    Note.getNoteNumberByLetter = function (letter) {
        Note.validateLetter(letter);
        return Note.letters.indexOf(letter);
    };
    Note.validateNoteNumber = function (note) {
        if (Number.isInteger(note) && note >= 0 && note <= 11)
            return;
        throw new Error("Note number must be between 0 and 11! [" + note + "]");
    };
    Note.validateOctave = function (octave) {
        if (Number.isInteger(octave) && octave >= 1 && octave <= 7)
            return;
        throw new Error("Octave number must be between 1 and 7! [" + octave + "]");
    };
    Note.validateLetter = function (letter) {
        if (letter.length === 1 && Note.letters.includes(letter))
            return;
        throw new Error("Note letter must be one of (" + Note.letters + ")! [" + letter + "]");
    };
    Note.letters = ["C", "D", "E", "F", "G", "A", "H"];
    Note.noteLetters = [
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
    return Note;
}());
function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}
function randomChoice() {
    var choices = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        choices[_i] = arguments[_i];
    }
    return choices[random(0, choices.length)];
}
/**
 * Note: Requires HarmonyType.minor!
 */
function getNextBetterNote(harmony, // Unused
prevNote, prevNotes) {
    var interval = randomChoice(intervals.minthird, intervals.majsixth, intervals.forth, intervals.fifth);
    console.log(interval);
    var direction = randomChoice("Up", "Down");
    return interval["build" + direction](prevNote);
}
function generateFewNotes() {
    var harmony = new Harmony(9, HarmonyType.minor);
    var notes = [];
    // for (let i = 0; i < 7; i++) {
    //   notes.push(harmony.newNote(i, 4));
    // }
    var note = harmony.newNote(0, 4);
    notes.push(note);
    // notes.push(getNextBetterNote(harmony, note, notes));
    //
    // notes.push(harmony.newNote(0, 4));
    // notes.push(harmony.newNote(3, 4));
    // notes.push(harmony.newNote(7, 4));
    //
    for (var i = 0; i < 10; i++) {
        notes.push(getNextBetterNote(harmony, note, notes));
    }
    return notes;
}
console.log(generateFewNotes().map(function (note) { return note.toLetter(); }));
window.Note = Note;
