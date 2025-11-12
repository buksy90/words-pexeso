import type { FontSizeOption } from './useGameSettings';

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { name: 'Small', value: 16 },
  { name: 'Medium', value: 20 },
  { name: 'Large', value: 24 },
  { name: 'Extra Large', value: 32 },
  { name: 'Huge', value: 40 }
];

export const FONT_OPTIONS: FontOption[] = [
  {
    name: 'Default',
    value: 'Roboto, sans-serif',
    preview: 'Abc'
  },
  {
    name: 'Ms Madi (Handwritten)',
    value: '"Ms Madi", cursive',
    preview: 'Abc'
  },
  {
    name: 'Comic Sans (Playful)',
    value: '"Comic Sans MS", "Comic Sans", cursive',
    preview: 'Abc'
  },
  {
    name: 'Arial (Simple)',
    value: 'Arial, sans-serif',
    preview: 'Abc'
  },
  {
    name: 'Georgia (Serif)',
    value: 'Georgia, serif',
    preview: 'Abc'
  },
  {
    name: 'Courier New (Monospace)',
    value: '"Courier New", Courier, monospace',
    preview: 'Abc'
  },
  {
    name: 'Verdana (Clear)',
    value: 'Verdana, sans-serif',
    preview: 'Abc'
  },
  {
    name: 'Trebuchet MS (Friendly)',
    value: '"Trebuchet MS", sans-serif',
    preview: 'Abc'
  },
  {
    name: 'Times New Roman (Classic)',
    value: '"Times New Roman", Times, serif',
    preview: 'Abc'
  }
];