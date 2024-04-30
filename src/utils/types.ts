import { InstrumentName, Player } from "soundfont-player";

export type NoteData = {
    row: number;
    column: number;
    note: string;
    units: number;
    velocity: number;
    pan: number;
    id: number;
    selected: boolean;
};
export type Position = {
    x: number;
    y: number;
}

export type Direction = 'top' | 'bottom' | 'left' | 'right';

export type InstrumentOptions = {
    name: string;
    value: InstrumentName
}

export type PositionRefs = {
    pianoRollRef: React.RefObject<HTMLDivElement>;
    gridRef: React.RefObject<HTMLDivElement>;
}

export enum FileFormat {
    //MP3 = "mp3",
    WAV = "wav",
    //MIDI = "midi",
}

export type Instrument = {
    name: InstrumentName;
    player?: Player;
    clientName: InstrumentOptions['name'];
}

export type Layer = {
    id: number;
    name: string;
    notes: NoteData[];
    instrument: Instrument;
};

export enum PlayingType {
    TRACK = "track",
    SONG = "song",
}

export enum FileOptions {
    IMPORT_MIDI = "Import MIDI file",
    EXPORT = "Export",
}

export enum SetMidi {
    SET_MIDI_IMPORT = "Import set MIDI file"
}