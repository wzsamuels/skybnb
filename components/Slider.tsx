import {ComponentPropsWithoutRef, useCallback, useEffect, useRef, useState} from "react";
import {number} from "prop-types";

interface ValuePair {
  min: number;
  max: number
}
interface Props extends ComponentPropsWithoutRef<"div"> {
  max: number;
  min: number;
  value: number | ValuePair;
}

const Slider = ({max, min, value, setValue}) => {
  const sliderRef = useRef<HTMLDivElement>();
  const barRef = useRef<HTMLDivElement>();
  const buttonRef1 = useRef<HTMLButtonElement>();
  const buttonRef2 = useRef<HTMLButtonElement>();
  const [buttonPosition1, setButtonPosition1] = useState(0);
  const [buttonPosition2, setButtonPosition2] = useState(0);
  const [buttonClicked1, setButtonClicked1] = useState(false)
  const [buttonClicked2, setButtonClicked2] = useState(false)

  const handleMouseMove = useCallback(event => {
    if(buttonClicked1)  {
      if(buttonPosition1 + event.movementX < sliderRef.current.clientWidth && buttonPosition1 + event.movementX >= 0  && !(buttonPosition2 && buttonPosition1 + event.movementX > buttonPosition2)) {
        setButtonPosition1(state => state + event.movementX)
        if(typeof value === "number") {
          setValue((buttonPosition1 + event.movementX) / sliderRef?.current?.clientWidth * max)
        } else {
          setValue({...value, min: (buttonPosition1 + event.movementX) / sliderRef?.current?.clientWidth * max})
        }
      }
    } else if(buttonClicked2) {
      if(buttonPosition2 + event.movementX < sliderRef.current.clientWidth && buttonPosition2 + event.movementX >= 0 && buttonPosition2 + event.movementX > buttonPosition1) {
        setButtonPosition2(state => state + event.movementX)
        if(typeof value === "number") {
          setValue((buttonPosition2 + event.movementX) / sliderRef?.current?.clientWidth * max)
        } else {
          setValue({...value, max: (buttonPosition2 + event.movementX) / sliderRef?.current?.clientWidth * max});
        }
        //setButtonPosition1(event.clientX - (event.screenX - event.pageX))
      }
    }
  }, [buttonClicked1, buttonClicked2, buttonPosition1, buttonPosition2, max, setValue, value]);

  useEffect(() => {
    const handleMouseDown = (event) => {
      if(buttonRef1.current === event.target) {
        setButtonClicked1(true);
      }
      if(buttonRef2.current === event.target) {
        setButtonClicked2(true);
      }
      if((sliderRef.current === event.target || barRef.current === event.target ) && typeof value === "number") {
        setButtonPosition1(event.offsetX);
        setValue(event.offsetX / sliderRef?.current?.clientWidth * max);
      }
      if(typeof value === "object") {
        if(sliderRef.current === event.target) {
          setButtonPosition1(event.offsetX);
          setValue({...value, min: event.offsetX / sliderRef?.current?.clientWidth * max})
        } else if(barRef.current === event.target) {
          setButtonPosition1(state => event.offsetX + state);
          setValue({...value, min: (event.offsetX + buttonPosition1) / sliderRef?.current?.clientWidth * max})
        }
      }
    }

    const handleMouseUp = () => {
      setButtonClicked1(false);
      setButtonClicked2(false);
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return() => {
      window.removeEventListener("mousemove",handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }


  }, [handleMouseMove, max, setValue, value])

  useEffect(() => {
    if(sliderRef?.current?.clientWidth) {
      if(typeof value === "number") {
        setButtonPosition1(sliderRef?.current?.clientWidth * (value / max));
      }
      else {
        setButtonPosition1(sliderRef?.current?.clientWidth * (value.min / max));
        setButtonPosition2(sliderRef?.current?.clientWidth * (value.max / max));
      }
    }
  }, [max, value])

  return (
    <div className={'px-2 mx-4 my-8'}>
      <div ref={sliderRef} className={'relative bg-gray-200 h-1 rounded flex items-center'}>
        { typeof value === "number" ?
          <>
            <div ref={barRef} style={{width: `${buttonPosition1}px`}} className={'bg-blue-500 h-1 rounded'}></div>
            <button ref={buttonRef1} style={{left: buttonPosition1}} className={'absolute -translate-x-2 h-4 w-4 bg-blue-500 rounded-full'}/>
          </>
          :
          <>
            <div ref={barRef} style={{left: buttonPosition1, width: `${buttonPosition2 - buttonPosition1}px`}} className={'bg-blue-500 h-1 absolute'}></div>
            <button  ref={buttonRef1} style={{left: buttonPosition1}} className={'absolute -translate-x-2 h-4 w-4 bg-blue-500 rounded-full'}/>
            <button ref={buttonRef2} style={{left: buttonPosition2}} className={'absolute -translate-x-2 h-4 w-4 bg-blue-500 rounded-full'}/>
          </>
        }
      </div>
      <div className={'flex justify-between text-sm'}>
        <div>
          {min}
        </div>
        <div>
          {max}
        </div>
      </div>
    </div>
  )
}

export default Slider