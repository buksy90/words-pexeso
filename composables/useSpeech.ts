import { ref, watch } from 'vue';

export interface VoiceOption {
  label: string;
  value: string;
  voice: SpeechSynthesisVoice | null;
}

export function useSpeech(storageKey: string = 'speech_voice') {
  const availableVoices = ref<VoiceOption[]>([]);
  const selectedVoice = ref<string>('');
  const speechSynthesis = ref<SpeechSynthesis | null>(null);

  // Load available voices
  const loadVoices = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    speechSynthesis.value = synth;

    const voices = synth.getVoices();

    // Filter and format voices
    const voiceOptions: VoiceOption[] = voices.map(voice => ({
      label: `${voice.name} (${voice.lang})`,
      value: voice.name,
      voice: voice
    }));

    availableVoices.value = voiceOptions;

    // Set default voice (prefer Slovak, then Czech, then first available)
    if (voiceOptions.length > 0) {
      const defaultVoice =
        voiceOptions.find(v => v.voice?.lang.startsWith('sk')) ||
        voiceOptions.find(v => v.voice?.lang.startsWith('cs')) ||
        voiceOptions[0];
      selectedVoice.value = defaultVoice?.value || '';

      // Load from localStorage
      const savedVoice = localStorage.getItem(storageKey);
      if (savedVoice && voiceOptions.find(v => v.value === savedVoice)) {
        selectedVoice.value = savedVoice;
      }
    }
  };

  // Save voice preference
  watch(selectedVoice, (newVoice) => {
    if (typeof window !== 'undefined' && newVoice) {
      localStorage.setItem(storageKey, newVoice);
    }
  });

  // Speak a word
  const speak = (text: string) => {
    if (typeof window === 'undefined' || !speechSynthesis.value || !text) return;

    // Cancel any ongoing speech
    speechSynthesis.value.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Find and set the selected voice
    const voiceOption = availableVoices.value.find(v => v.value === selectedVoice.value);
    if (voiceOption?.voice) {
      utterance.voice = voiceOption.voice;
    }

    // Adjust speech parameters for children
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    speechSynthesis.value.speak(utterance);
  };

  // Initialize voices if available
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  return {
    availableVoices,
    selectedVoice,
    loadVoices,
    speak,
  } as const;
}
