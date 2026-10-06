import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 400));
    expect(result.current).toBe('initial');
  });

  it('should delay updating value until timeout expires', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebounce(val, delay),
      { initialProps: { val: 'first', delay: 400 } }
    );

    expect(result.current).toBe('first');

    // Change input
    rerender({ val: 'second', delay: 400 });

    // Value should not change immediately
    expect(result.current).toBe('first');

    // Advance 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('first');

    // Advance remaining 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('second');
  });

  it('should reset timer if value changes rapidly within delay window', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebounce(val, delay),
      { initialProps: { val: 'A', delay: 400 } }
    );

    // Keystroke sequence: A -> AI -> AIP -> AIPP
    rerender({ val: 'AI', delay: 400 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('A');

    rerender({ val: 'AIP', delay: 400 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('A');

    rerender({ val: 'AIPP', delay: 400 });
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe('AIPP');
  });
});
