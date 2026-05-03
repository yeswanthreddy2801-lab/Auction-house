import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endTime: Date;
  className?: string;
}

const CountdownTimer = ({ endTime, className = "" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = endTime.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ hours, minutes, seconds });
      setIsUrgent(diff < 600000);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className={`flex items-center gap-1 font-mono text-sm ${isUrgent ? "text-destructive animate-glow-pulse" : "text-muted-foreground"} ${className}`}>
      <span className="glass rounded px-1.5 py-0.5 text-xs font-semibold">{pad(timeLeft.hours)}</span>
      <span>:</span>
      <span className="glass rounded px-1.5 py-0.5 text-xs font-semibold">{pad(timeLeft.minutes)}</span>
      <span>:</span>
      <span className="glass rounded px-1.5 py-0.5 text-xs font-semibold">{pad(timeLeft.seconds)}</span>
    </div>
  );
};

export default CountdownTimer;
