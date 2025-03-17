export interface SpeakerBlock {
  start_time: string; // Unix time in milliseconds
  end_time: string; // Unix time in milliseconds
  speaker: {
    name: string;
  };
  words: string;
}

export interface Transcript {
  speakers: { name: string }[];
  speaker_blocks: SpeakerBlock[];
}

export interface MeetingTranscript {
  title: string;
  transcript: Transcript;
  summary: string;
}
