import 'temporal-polyfill';

declare global {
  interface Date {
    toTemporalInstant(): Temporal.Instant;
  }
}