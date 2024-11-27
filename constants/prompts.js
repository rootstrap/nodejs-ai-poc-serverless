const AUDIO_DESCRIBE_SONG_PROMPT =
  'Analyze this audio file to identify the instruments used in the song. Provide a list of instruments you hear in the song and a brief description of the song genre. The goal is to accurately identify the instruments and genre based on the audio content, including the melody, rhythm, and overall sound of the song.';
const AUDIO_DESCRIBRE_DISCUSSION_PROMPT =
  'Analyze this audio file to create a detailed summary of the discussion. The summary should capture the key points, topics, and themes discussed in the audio, including important dialogues, arguments, and conclusions. Identify and highlight the main ideas and arguments presented in the discussion, ensuring that the summary reflects the overall message and important details effectively.';

const VIDEO_TIMELINE_PROMPT =
  'Analyze this video file to create a detailed YouTube timeline based on its content. The timeline should highlight the key moments, chapters, and segments of the video, taking into account both the visual elements and the audio narrative. Identify and timestamp important topics, scenes. The goal is to generate a comprehensive and engaging timeline that can be used as a video description or chapter marker list on YouTube, making it easier for viewers to navigate and understand the video content.';
const VIDEO_SUMMARIZE_PROMPT =
  'Analyze this video file and generate a comprehensive summary that captures the key points and essential content. The summary should take into account both the visual elements and the audio narrative, including important dialogues, changes in tone, background music, and any other significant auditory cues. Additionally, identify and highlight the main topics, themes, and scenes presented in the video, ensuring that the summary reflects the overall message and important details effectively.';

const PDF_SUMMARIZE_PROMPT =
  'Analyze this PDF file and generate a detailed summary that captures the key points, arguments, and conclusions. The summary should provide an overview of the main topics, themes, and ideas presented in the document, including any supporting evidence, data, or references. Identify and highlight the most important sections, key arguments, and relevant conclusions, ensuring that the summary is concise yet informative.';

const DEFAULT_ANALYZE_PROMPT =
  "Please analyze the provided file and generate a detailed summary of its content. The summary should highlight the most important points, key ideas, and provide a clear description of what the file is about. If it's an audio or video file, include the topics discussed, the tone, and the main conclusions. If it's a document, describe its purpose, the main arguments, and any relevant conclusions. Make sure the summary is concise yet informative.";

module.exports = {
  mp3: {
    song: AUDIO_DESCRIBE_SONG_PROMPT,
    discussion: AUDIO_DESCRIBRE_DISCUSSION_PROMPT,
  },
  pdf: {
    summarize: PDF_SUMMARIZE_PROMPT,
  },
  mp4: {
    summarize: VIDEO_SUMMARIZE_PROMPT,
    timeline: VIDEO_TIMELINE_PROMPT,
  },
  default: DEFAULT_ANALYZE_PROMPT,
};
