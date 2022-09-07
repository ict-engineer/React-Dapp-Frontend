import React, { useEffect, useState } from 'react'

interface ClockTimerProps {
    startTime : number
}

const Timelapse = ({ startTime } : ClockTimerProps) => {
    var timer:any = null;
    var time:any = startTime;
    // const [remainTime, setRemainTime] = useState<number>(startTime);
    const decreaseTimeRemaining = () => {
        if(time > 0){
            // setRemainTime(time - 1);
            time -= 1;
        } else { 
            clearInterval(timer)
        }
    }
    useEffect(() => {
        timer = setInterval(() => {
            decreaseTimeRemaining();
        }, 1000)
    }, []);
    return(
        <div className="countdown-timer">
            <div className="countdown-timer__circle">
                <svg>
                <circle
                    r="24"
                    cx="8"
                    cy="8"
                    style={{
                        animation: `countdown-animation ${startTime}s linear`
                    }}
                />
                </svg>
            </div>
        </div>
    )
}

export default Timelapse;