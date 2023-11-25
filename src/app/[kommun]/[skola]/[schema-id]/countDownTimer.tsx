"use client";
import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  timeUntilStart: number; // time in minutes
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeUntilStart }) => {
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState(
    timeUntilStart * 60,
  );

  useEffect(() => {
    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeLeftInSeconds((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000); // 1000 milliseconds = 1 second

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Update timeLeftInSeconds when timeUntilStart prop changes
    setTimeLeftInSeconds(timeUntilStart * 60);
  }, [timeUntilStart]);

  const minutes = Math.floor(timeLeftInSeconds / 60);
  const seconds = Math.floor(timeLeftInSeconds % 60);

  return (
    <div>
      {timeLeftInSeconds > 0 ? (
        <h3 className=" font-mono">
          Nästa lektion börjar om <br />
          <span className="text-4xl">{minutes}</span>{" "}
          <span className="text-lg font-bold">minuter och</span> <br />
          <span className="text-4xl">{seconds}</span>{" "}
          <span className="text-lg font-bold">sekunder</span>
        </h3>
      ) : (
        <h3>Lektionen har börjat!</h3>
      )}
    </div>
  );
};

export default CountdownTimer;
