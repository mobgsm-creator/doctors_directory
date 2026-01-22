import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

Object.defineProperty(global, 'TextDecoder', {
  value: TextDecoder,
});

Object.defineProperty(global, 'TextEncoder', {
  value: TextEncoder,
});