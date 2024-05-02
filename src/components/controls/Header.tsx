import { useContext } from "react";
import { BiMagnet } from "react-icons/bi";
import { FaLayerGroup } from "react-icons/fa";
import { MdPiano, MdPageview } from "react-icons/md";
import {
    TbPlayerPauseFilled,
    TbPlayerPlayFilled,
    TbPlayerStopFilled,
} from "react-icons/tb";
import {
    HEADER_HEIGHT,
    INSTRUMENT_OPTIONS,
    PIANO_WIDTH,
} from "../../utils/constants";
import {
    BPMContext,
    DarkModeContext,
    NotesContext,
    PlayingContext,
    SnapValueContext,
} from "../../utils/context";
import { FileFormat, FileOptions, SetMidi, PlayingType } from "../../utils/types";
import DraggableNumInput from "../draggable-num-input/DraggableNumInput";
import { DownloadFileDialog } from "./DownloadFileDialog";
import { AiOutlineFileText } from "react-icons/ai";
import { CgDarkMode } from "react-icons/cg";
import { DropDown } from "../dropdown/DropDown";
import Soundfont, { InstrumentName } from "soundfont-player";
import { audioContext } from "../../utils/globals";
import ClickAwayListener from "react-click-away-listener";

const toolStyle = "text-white";

interface HeaderProps {
    togglePlay: () => void;
    handleStop: () => void;
    handleBPMChange: (value: number) => void;
    handleSnapValueChange: (value: number) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    exportPianoRoll: (format: FileFormat, filename: string) => Promise<void>;
    downloadFileDialogOpen: boolean;
    handleToggleDownloadFileDialog: () => void;
    handleToggleSideBar: () => void;
    playingType: PlayingType;
    setPlayingType: (playingType: PlayingType) => void;
    handleToggleDarkMode: () => void;
}

export const Header = ({
    togglePlay,
    handleStop,
    handleBPMChange,
    handleSnapValueChange,
    fileInputRef,
    exportPianoRoll,
    downloadFileDialogOpen,
    handleToggleDownloadFileDialog,
    handleToggleSideBar,
    playingType,
    setPlayingType,
    handleToggleDarkMode,
}: HeaderProps): JSX.Element => {
    const { BPM } = useContext(BPMContext);
    const { playing } = useContext(PlayingContext);
    const { snapValue } = useContext(SnapValueContext);
    const { notes, setNotes } = useContext(NotesContext);
    const darkMode = useContext(DarkModeContext);
    const clickImportFile = () => {
        fileInputRef.current?.click();
    };

    // const importSetFile = () => {
    //     // set fileInputRef to a local file, not a clicked file, using fileInputRef
    //     if (fileInputRef.current){
    //         fileInputRef.current.value = './1.mid'
    //     }
    // };

    const handleFileOptionChange = (option: FileOptions) => {
        switch (option) {
            case FileOptions.IMPORT_MIDI:
                return clickImportFile();
            case FileOptions.EXPORT:
                return handleToggleDownloadFileDialog();
        }
    };

    // async function setMidiImport (midiId: number): Promise<any>{
    //     // switch (option) {
    //     //     case SetMidi.SET_MIDI_IMPORT:
    //     //         return importSetFile;
    //     // }
    //     const url = `http://127.0.0.1:6030/midi/2`;
    //     try {
    //         const response = await fetch(url);
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }
    //         const data = await response.json();  // Assuming the server sends JSON
    //         console.log(data);  // Log data to see what is returned from the server
    //         return data;
    //     } catch (error) {
    //         console.error("Error fetching MIDI data:", error);
    //         throw error;  // Optionally re-throw the error for handling higher up
    //     }
        
    // };

    async function setMidiImport (midiId: number) {
        const url = `http://127.0.0.1:6030/midi/1`;
    try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); // Assuming the server sends JSON with a base64 encoded string
            console.log(data["encoded_midi"]);
            if (!data["encoded_midi"]) {
                throw new Error('Base64 string is missing from the response');
            }
    
            
            // Convert base64 to a Blob
            const binaryString = window.atob(data["encoded_midi"]);
            console.log(binaryString);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], {type: 'audio/midi'});
    
            // Save the Blob as a MIDI file
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'downloadedMidiFile.mid'; // Set the file name for download
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Optionally, if you want to store the file on the server, you'll need to upload the blob
            // uploadBlob(blob);
    
        } catch (error) {
            console.error("Failed to fetch or save MIDI file:", error);
        }
    }

    const handleChangeInstrument = async (instrument: InstrumentName) => {
        const newNotes = { ...notes };
        const index = INSTRUMENT_OPTIONS.findIndex(
            (option) => option.value === instrument
        );
        newNotes.instrument = {
            name: instrument,
            player: await Soundfont.instrument(audioContext, instrument),
            clientName: INSTRUMENT_OPTIONS[index].name,
        };
        setNotes(newNotes);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center w-full bg-slate-200 dark:bg-slate-600"
                    style={{
                        height: HEADER_HEIGHT + "px",
                    }}
                >
                    <div
                        style={{ width: PIANO_WIDTH + "px" }}
                        className="flex justify-center text-xl font-bold text-slate-700 dark:text-slate-200"
                    >
                        Piano Roll
                    </div>
                    <div
                        onClick={togglePlay}
                        className="flex items-center justify-center w-8 h-8 ml-2 bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        {playing ? (
                            <TbPlayerPauseFilled
                                color="white"
                                className="w-6 h-6"
                            />
                        ) : (
                            <TbPlayerPlayFilled
                                color="white"
                                className="w-6 h-6"
                            />
                        )}
                    </div>
                    <div
                        onClick={handleStop}
                        className="flex items-center justify-center w-8 h-8 mx-2 bg-red-500 rounded-md hover:bg-red-600"
                    >
                        <TbPlayerStopFilled color="white" className="w-6 h-6" />
                    </div>
                    <div className="flex items-center">
                        <p className="mr-1 dark:text-slate-200">BPM</p>
                        <DraggableNumInput
                            value={BPM}
                            min={10}
                            max={500}
                            onChange={handleBPMChange}
                        />
                    </div>

                    <div className="flex flex-col justify-center w-12 ml-2 rounded-md h-2/3 bg-slate-300 dark:bg-slate-600">
                        <div
                            onClick={() => setPlayingType(PlayingType.SONG)}
                            className={`
                                flex justify-center items-center h-1/2 rounded-t-md
                                ${
                                    playingType === PlayingType.SONG
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-slate-300 hover:bg-slate-400 text-black"
                                }
                            `}
                        >
                            <p className="text-xs text-center">Song</p>
                        </div>
                        <div
                            onClick={() => setPlayingType(PlayingType.TRACK)}
                            className={`
                                flex justify-center items-center h-1/2 rounded-b-md
                                ${
                                    playingType === PlayingType.TRACK
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-slate-300 hover:bg-slate-400 text-black"
                                }
                            `}
                        >
                            <p className="text-xs text-center">Track</p>
                        </div>
                    </div>

                    <div className="ml-2" title="Snap to Note Interval">
                        <DropDown
                            selectable
                            icon={
                                <BiMagnet className={"w-6 h-6 " + toolStyle} />
                            }
                            onChange={handleSnapValueChange}
                            options={[
                                { label: "1/8", value: 1 },
                                { label: "1/4", value: 2 },
                                { label: "1/2", value: 4 },
                                { label: "1/1", value: 8 },
                            ]}
                            defaultValue={snapValue}
                        />
                    </div>

                    {/* <div className="ml-2" title="Page View">
                        <DropDown
                            icon={
                                <MdPageview
                                    className={"w-5 h-5 " + toolStyle}
                                />
                            }
                            onChange={() => {}}
                            options={[
                                { label: "Piano Roll", value: 1 },
                                { label: "Sheet Music", value: 2 },
                                { label: "Guitar Tab", value: 3 },
                                { label: "Falling Piano", value: 4 },
                            ]}
                        />
                    </div> */}

                    <div className="ml-2" title="File Options">
                        <DropDown
                            icon={
                                <AiOutlineFileText
                                    className={"w-5 h-5 " + toolStyle}
                                />
                            }
                            onChange={handleFileOptionChange}
                            options={Object.values(FileOptions).map(
                                (option) => ({
                                    label: option,
                                    value: option,
                                })
                            )}
                        />
                        <ClickAwayListener
                            onClickAway={() =>
                                downloadFileDialogOpen &&
                                handleToggleDownloadFileDialog()
                            }
                        >
                            <div style={{ position: "relative" }}>
                                <DownloadFileDialog
                                    exportPianoRoll={exportPianoRoll}
                                    open={downloadFileDialogOpen}
                                />
                            </div>
                        </ClickAwayListener>
                    </div>

                    <div className="ml-2" title="File Options">
                        <DropDown
                            icon={
                                <AiOutlineFileText
                                    className={"w-5 h-5 " + toolStyle}
                                />
                            }
                            onChange={setMidiImport}
                            options={Object.values(SetMidi).map(
                                (option) => ({
                                    label: option,
                                    value: option,
                                })
                            )}
                        />
                    </div>

                    <div className="ml-2" title="Instrument">
                        <DropDown
                            selectable
                            icon={
                                <div className="flex px-1">
                                    <MdPiano
                                        className={"w-6 h-6 " + toolStyle}
                                    />
                                    <p className="text-white ">
                                        {notes.instrument.clientName}
                                    </p>
                                </div>
                            }
                            defaultValue={notes.instrument.name}
                            onChange={handleChangeInstrument}
                            options={INSTRUMENT_OPTIONS.map((option) => ({
                                label: option.name,
                                value: option.value,
                            }))}
                        />
                    </div>
                </div>
                <div className="flex items-center mr-4">
                    <div className="flex items-center [&>*]:mx-4">
                        <div
                            className="p-1 rounded-md hover:bg-slate-300 hover:dark:bg-slate-700"
                            onClick={handleToggleDarkMode}
                            title={darkMode ? "Light Mode" : "Dark Mode"}
                        >
                            <CgDarkMode className="w-6 h-6 dark:text-slate-200 text-slate-700" />
                        </div>
                    </div>
                    <div
                        onClick={handleToggleSideBar}
                        className="p-1 rounded-md hover:bg-slate-300 hover:dark:bg-slate-700"
                        title="Open Layers"
                    >
                        <FaLayerGroup className="w-6 h-6 dark:text-slate-200 text-slate-700" />
                    </div>
                </div>
            </div>
            <input
                className="absolute w-0 h-0 opacity-0"
                ref={fileInputRef}
                type="file"
            />
        </>
    );
};
