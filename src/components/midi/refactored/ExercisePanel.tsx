import React, { useState, useEffect } from 'react';
import { 
  Music, 
  BookOpen, 
  ListMusic, 
  Grid2X2, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  PracticeMode, 
  ScaleExercise,
  ChordExercise,
  IntervalExercise,
  SightReadingExercise
} from './types';

interface ExercisePanelProps {
  onExpectedNotesChange: (notes: number[]) => void;
  onExerciseModeChange: (mode: PracticeMode | null) => void;
  onNotePlay: (note: number, velocity: number, duration: number) => void;
  activeNotes: Set<number>;
}

// Define scales
const SCALES: ScaleExercise[] = [
  {
    name: 'C Major',
    notes: [60, 62, 64, 65, 67, 69, 71, 72],
    root: 60,
    type: 'major'
  },
  {
    name: 'A Minor',
    notes: [57, 59, 60, 62, 64, 65, 67, 69],
    root: 57,
    type: 'minor'
  },
  {
    name: 'G Major',
    notes: [55, 57, 59, 60, 62, 64, 66, 67],
    root: 55,
    type: 'major'
  },
  {
    name: 'F Major',
    notes: [53, 55, 57, 58, 60, 62, 64, 65],
    root: 53,
    type: 'major'
  },
  {
    name: 'D Minor',
    notes: [50, 52, 53, 55, 57, 58, 60, 62],
    root: 50,
    type: 'minor'
  }
];

// Define common chords
const CHORDS: ChordExercise[] = [
  {
    name: 'C Major',
    notes: [60, 64, 67],
    root: 60,
    type: 'major'
  },
  {
    name: 'G Major',
    notes: [55, 59, 62],
    root: 55,
    type: 'major'
  },
  {
    name: 'F Major',
    notes: [53, 57, 60],
    root: 53,
    type: 'major'
  },
  {
    name: 'A Minor',
    notes: [57, 60, 64],
    root: 57,
    type: 'minor'
  },
  {
    name: 'D Minor',
    notes: [50, 53, 57],
    root: 50,
    type: 'minor'
  },
  {
    name: 'C Major 7',
    notes: [60, 64, 67, 71],
    root: 60,
    type: 'major7'
  },
  {
    name: 'G Dominant 7',
    notes: [55, 59, 62, 65],
    root: 55,
    type: 'dominant7'
  }
];

// Define intervals
const INTERVALS: IntervalExercise[] = [
  { rootNote: 60, intervalSize: 1, intervalName: 'Minor 2nd' },
  { rootNote: 60, intervalSize: 2, intervalName: 'Major 2nd' },
  { rootNote: 60, intervalSize: 3, intervalName: 'Minor 3rd' },
  { rootNote: 60, intervalSize: 4, intervalName: 'Major 3rd' },
  { rootNote: 60, intervalSize: 5, intervalName: 'Perfect 4th' },
  { rootNote: 60, intervalSize: 7, intervalName: 'Perfect 5th' },
  { rootNote: 60, intervalSize: 8, intervalName: 'Minor 6th' },
  { rootNote: 60, intervalSize: 9, intervalName: 'Major 6th' },
  { rootNote: 60, intervalSize: 10, intervalName: 'Minor 7th' },
  { rootNote: 60, intervalSize: 11, intervalName: 'Major 7th' },
  { rootNote: 60, intervalSize: 12, intervalName: 'Octave' }
];

// Define simple sight reading exercises
const SIGHT_READING: SightReadingExercise[] = [
  {
    notes: [
      { note: 60, duration: 500 },
      { note: 62, duration: 500 },
      { note: 64, duration: 500 },
      { note: 65, duration: 500 },
      { note: 67, duration: 500 },
    ],
    currentNote: 0
  },
  {
    notes: [
      { note: 67, duration: 500 },
      { note: 65, duration: 500 },
      { note: 64, duration: 500 },
      { note: 62, duration: 500 },
      { note: 60, duration: 500 },
    ],
    currentNote: 0
  },
  {
    notes: [
      { note: 60, duration: 500 },
      { note: 64, duration: 500 },
      { note: 67, duration: 500 },
      { note: 64, duration: 500 },
      { note: 60, duration: 500 },
    ],
    currentNote: 0
  }
];

// Get interval note from root
function getIntervalNote(rootNote: number, intervalSize: number): number {
  return rootNote + intervalSize;
}

export function ExercisePanel({
  onExpectedNotesChange,
  onExerciseModeChange,
  onNotePlay,
  activeNotes
}: ExercisePanelProps) {
  // Practice mode state with localStorage persistence
  const [practiceMode, setPracticeMode] = useLocalStorage<PracticeMode | null>('midi.practiceMode', null);
  
  // Exercise state
  const [selectedScale, setSelectedScale] = useLocalStorage<number>('midi.selectedScale', 0);
  const [selectedChord, setSelectedChord] = useLocalStorage<number>('midi.selectedChord', 0);
  const [selectedInterval, setSelectedInterval] = useLocalStorage<number>('midi.selectedInterval', 0);
  const [selectedSightReading, setSelectedSightReading] = useLocalStorage<number>('midi.selectedSightReading', 0);
  const [tempo, setTempo] = useLocalStorage<number>('midi.tempo', 120);
  
  // Feedback state
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);

  // Exercise helper functions
  const playScale = () => {
    const scale = SCALES[selectedScale];
    if (!scale) return;
    
    let delay = 0;
    const noteDuration = 60000 / tempo / 2; // quarter note duration in ms
    
    scale.notes.forEach(note => {
      setTimeout(() => {
        onNotePlay(note, 80, noteDuration);
      }, delay);
      delay += noteDuration;
    });
    
    // Optionally play back down the scale
    scale.notes.slice().reverse().slice(1).forEach(note => {
      setTimeout(() => {
        onNotePlay(note, 80, noteDuration);
      }, delay);
      delay += noteDuration;
    });
  };
  
  const playChord = () => {
    const chord = CHORDS[selectedChord];
    if (!chord) return;
    
    // Play chord notes simultaneously
    chord.notes.forEach(note => {
      onNotePlay(note, 80, 1000);
    });
  };
  
  const playInterval = () => {
    const interval = INTERVALS[selectedInterval];
    if (!interval) return;
    
    // Play root note
    onNotePlay(interval.rootNote, 80, 500);
    
    // Play second note after a short delay
    setTimeout(() => {
      onNotePlay(getIntervalNote(interval.rootNote, interval.intervalSize), 80, 500);
    }, 700);
  };
  
  const playSightReadingNote = (index: number = 0) => {
    const exercise = SIGHT_READING[selectedSightReading];
    if (!exercise || index >= exercise.notes.length) return;
    
    const note = exercise.notes[index];
    onNotePlay(note.note, 80, note.duration);
    
    // Update the current note pointer
    const updatedExercise = { ...exercise, currentNote: index };
    SIGHT_READING[selectedSightReading] = updatedExercise;
  };

  // Update expected notes whenever the exercise mode or selection changes
  useEffect(() => {
    if (!practiceMode) {
      onExpectedNotesChange([]);
      onExerciseModeChange(null);
      return;
    }
    
    onExerciseModeChange(practiceMode);
    
    switch (practiceMode) {
      case 'scales':
        onExpectedNotesChange(SCALES[selectedScale]?.notes || []);
        break;
      case 'chords':
        onExpectedNotesChange(CHORDS[selectedChord]?.notes || []);
        break;
      case 'intervals':
        const interval = INTERVALS[selectedInterval];
        if (interval) {
          onExpectedNotesChange([
            interval.rootNote,
            getIntervalNote(interval.rootNote, interval.intervalSize)
          ]);
        }
        break;
      case 'sight-reading':
        const exercise = SIGHT_READING[selectedSightReading];
        if (exercise) {
          onExpectedNotesChange([exercise.notes[exercise.currentNote]?.note || 0]);
        }
        break;
      default:
        onExpectedNotesChange([]);
    }
  }, [
    practiceMode, 
    selectedScale, 
    selectedChord, 
    selectedInterval, 
    selectedSightReading,
    onExpectedNotesChange,
    onExerciseModeChange
  ]);

  // Check if the user played the correct notes (for intervals and sight reading)
  useEffect(() => {
    if (practiceMode === 'sight-reading') {
      const exercise = SIGHT_READING[selectedSightReading];
      if (!exercise) return;
      
      const currentNoteValue = exercise.notes[exercise.currentNote]?.note;
      if (!currentNoteValue) return;
      
      // Check if the user played the correct note
      if (activeNotes.has(currentNoteValue)) {
        setFeedback('correct');
        setScore(prev => prev + 1);
        
        // Move to the next note after a short delay
        setTimeout(() => {
          setFeedback(null);
          
          // Advance to the next note if available
          if (exercise.currentNote < exercise.notes.length - 1) {
            const updatedExercise = { 
              ...exercise, 
              currentNote: exercise.currentNote + 1 
            };
            SIGHT_READING[selectedSightReading] = updatedExercise;
            
            // Update expected notes
            onExpectedNotesChange([updatedExercise.notes[updatedExercise.currentNote].note]);
          }
        }, 500);
      } else if (activeNotes.size > 0) {
        // User played a wrong note
        setFeedback('incorrect');
        setMistakes(prev => prev + 1);
        
        // Reset feedback after a short delay
        setTimeout(() => {
          setFeedback(null);
        }, 500);
      }
    }
  }, [activeNotes, practiceMode, selectedSightReading]);

  // Render the exercise panel with tabs
  return (
    <div className="bg-[#121212] border border-white/10 rounded-lg overflow-hidden w-[350px]">
      {/* Mode tabs */}
      <div className="flex border-b border-white/10">
        <button
          className={`flex-1 py-2 px-3 text-sm flex items-center justify-center gap-1 ${
            practiceMode === 'free-play' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
          }`}
          onClick={() => setPracticeMode('free-play')}
        >
          <Music size={16} />
          <span>Free Play</span>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-sm flex items-center justify-center gap-1 ${
            practiceMode === 'scales' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
          }`}
          onClick={() => setPracticeMode('scales')}
        >
          <ListMusic size={16} />
          <span>Scales</span>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-sm flex items-center justify-center gap-1 ${
            practiceMode === 'chords' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
          }`}
          onClick={() => setPracticeMode('chords')}
        >
          <Grid2X2 size={16} />
          <span>Chords</span>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-sm flex items-center justify-center gap-1 ${
            practiceMode === 'intervals' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
          }`}
          onClick={() => setPracticeMode('intervals')}
        >
          <ArrowRight size={16} />
          <span>Intervals</span>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-sm flex items-center justify-center gap-1 ${
            practiceMode === 'sight-reading' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'
          }`}
          onClick={() => setPracticeMode('sight-reading')}
        >
          <BookOpen size={16} />
          <span>Sight</span>
        </button>
      </div>

      {/* Content area */}
      <div className="p-4">
        {!practiceMode && (
          <div className="text-white/50 text-center py-8">
            Select a practice mode to begin
          </div>
        )}

        {practiceMode === 'free-play' && (
          <div className="text-center py-4 text-white/80">
            <p>Free Play Mode</p>
            <p className="text-white/50 text-sm mt-2">
              Play anything you like on the keyboard
            </p>
          </div>
        )}

        {practiceMode === 'scales' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white/70 text-sm">Select Scale:</label>
              <select
                className="bg-[#1e293b] text-white text-sm px-3 py-1.5 rounded-md border border-[#334155]"
                value={selectedScale}
                onChange={(e) => setSelectedScale(parseInt(e.target.value))}
              >
                {SCALES.map((scale, index) => (
                  <option key={scale.name} value={index}>
                    {scale.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-white/70 text-sm">
              <p>Notes: {SCALES[selectedScale]?.notes.length || 0}</p>
              <p>Type: {SCALES[selectedScale]?.type || ''}</p>
            </div>

            <div className="flex justify-center pt-2">
              <button
                className="px-4 py-2 bg-[#4d97ff]/20 text-[#4d97ff] rounded-md hover:bg-[#4d97ff]/30 transition-colors"
                onClick={playScale}
              >
                Play Scale
              </button>
            </div>
          </div>
        )}

        {practiceMode === 'chords' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white/70 text-sm">Select Chord:</label>
              <select
                className="bg-[#1e293b] text-white text-sm px-3 py-1.5 rounded-md border border-[#334155]"
                value={selectedChord}
                onChange={(e) => setSelectedChord(parseInt(e.target.value))}
              >
                {CHORDS.map((chord, index) => (
                  <option key={chord.name} value={index}>
                    {chord.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-white/70 text-sm">
              <p>Notes: {CHORDS[selectedChord]?.notes.length || 0}</p>
              <p>Type: {CHORDS[selectedChord]?.type || ''}</p>
            </div>

            <div className="flex justify-center pt-2">
              <button
                className="px-4 py-2 bg-[#4d97ff]/20 text-[#4d97ff] rounded-md hover:bg-[#4d97ff]/30 transition-colors"
                onClick={playChord}
              >
                Play Chord
              </button>
            </div>
          </div>
        )}

        {practiceMode === 'intervals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white/70 text-sm">Select Interval:</label>
              <select
                className="bg-[#1e293b] text-white text-sm px-3 py-1.5 rounded-md border border-[#334155]"
                value={selectedInterval}
                onChange={(e) => setSelectedInterval(parseInt(e.target.value))}
              >
                {INTERVALS.map((interval, index) => (
                  <option key={interval.intervalName} value={index}>
                    {interval.intervalName}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-white/70 text-sm">
              <p>Root Note: C4</p>
              <p>Interval: {INTERVALS[selectedInterval]?.intervalName || ''}</p>
            </div>

            <div className="flex justify-center pt-2">
              <button
                className="px-4 py-2 bg-[#4d97ff]/20 text-[#4d97ff] rounded-md hover:bg-[#4d97ff]/30 transition-colors"
                onClick={playInterval}
              >
                Play Interval
              </button>
            </div>
          </div>
        )}

        {practiceMode === 'sight-reading' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white/70 text-sm">Exercise:</label>
              <div className="flex items-center gap-1">
                <button
                  className="px-2 py-1 bg-[#1e293b] text-white/70 rounded hover:bg-[#2d4a76]"
                  onClick={() => {
                    if (selectedSightReading > 0) {
                      setSelectedSightReading(selectedSightReading - 1);
                    }
                  }}
                  disabled={selectedSightReading === 0}
                >
                  <ArrowLeft size={14} />
                </button>
                <span className="text-white/70 text-sm px-2">
                  {selectedSightReading + 1} / {SIGHT_READING.length}
                </span>
                <button
                  className="px-2 py-1 bg-[#1e293b] text-white/70 rounded hover:bg-[#2d4a76]"
                  onClick={() => {
                    if (selectedSightReading < SIGHT_READING.length - 1) {
                      setSelectedSightReading(selectedSightReading + 1);
                    }
                  }}
                  disabled={selectedSightReading === SIGHT_READING.length - 1}
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-md p-3 flex items-center justify-between">
              <div className="text-white/70 text-sm">
                <p>Notes: {SIGHT_READING[selectedSightReading]?.notes.length || 0}</p>
                <p>
                  Progress: {SIGHT_READING[selectedSightReading]?.currentNote || 0} / 
                  {SIGHT_READING[selectedSightReading]?.notes.length || 0}
                </p>
              </div>
              
              <div>
                <button
                  className="px-3 py-1.5 bg-[#4d97ff]/20 text-[#4d97ff] rounded-md hover:bg-[#4d97ff]/30 transition-colors"
                  onClick={() => playSightReadingNote(SIGHT_READING[selectedSightReading]?.currentNote || 0)}
                >
                  Play Note
                </button>
              </div>
            </div>

            {/* Feedback area */}
            <div className="pt-2">
              {feedback === 'correct' && (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Check size={18} />
                  <span>Correct!</span>
                </div>
              )}
              {feedback === 'incorrect' && (
                <div className="flex items-center justify-center gap-2 text-red-400">
                  <AlertCircle size={18} />
                  <span>Try again!</span>
                </div>
              )}
            </div>
            
            {/* Score display */}
            <div className="flex justify-between pt-2 text-sm">
              <div className="text-green-400">
                Score: {score}
              </div>
              <div className="text-red-400">
                Mistakes: {mistakes}
              </div>
            </div>
          </div>
        )}

        {/* Tempo control (for scales and intervals) */}
        {(practiceMode === 'scales' || practiceMode === 'intervals') && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/70 text-sm">Tempo: {tempo} BPM</label>
              <input
                type="range"
                min={40}
                max={240}
                value={tempo}
                onChange={(e) => setTempo(parseInt(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExercisePanel;
