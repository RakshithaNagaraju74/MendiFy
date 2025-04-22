# File: transcribe.py
import sys
from faster_whisper import WhisperModel

def transcribe_audio(file_path):
    model = WhisperModel("base", compute_type="int8")
    segments, info = model.transcribe(file_path)
    transcription = " ".join([segment.text for segment in segments])
    return transcription.strip()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe.py <path_to_audio_file>")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    try:
        text = transcribe_audio(audio_path)
        print(text)
    except Exception as e:
        print(f"Error: {e}")
