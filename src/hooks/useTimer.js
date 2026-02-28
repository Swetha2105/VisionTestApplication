import { useState, useRef, useCallback } from 'react';

export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef(null);

  const start = useCallback(() => {
    if (ref.current) return;
    ref.current = setInterval(() => setSeconds(s => s + 1), 1000);
  }, []);

  const stop = useCallback(() => { clearInterval(ref.current); ref.current = null; }, []);
  const reset = useCallback(() => { stop(); setSeconds(0); }, [stop]);

  return { seconds, start, stop, reset };
}
