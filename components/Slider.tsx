import {useEffect, useRef, useState} from "react";

const Slider = ({max, min, value, setValue}) => {
  const sliderRef = useRef<HTMLDivElement>();     // The whole slider bar
  const barRef = useRef<HTMLDivElement>();        // Just the colored part of the slider
  const buttonRef1 = useRef<HTMLButtonElement>();
  const buttonRef2 = useRef<HTMLButtonElement>();
  const [sliderWidth, setSliderWidth] = useState(0)
  const [buttonPosition1, setButtonPosition1] = useState(0);
  const [buttonPosition2, setButtonPosition2] = useState(0);
  const [buttonClicked1, setButtonClicked1] = useState(false)
  const [buttonClicked2, setButtonClicked2] = useState(false)

  useEffect(() => {
    console.log("width", sliderRef.current.clientWidth)
    setSliderWidth(sliderRef.current.clientWidth);
  }, [])

  useEffect(() => {
    /*
    * Handle moving the slider buttons. Uses Mouse Move Event and manually tracks button ups and downs so that the buttons
    * will move along the slider bar when the mouse button is held down but the cursor is not over the slider component.
    */
    const handleMouseMove = event => {
      if(buttonClicked1)  {
        // Check that the button isn't past the edges or the second button
        if(buttonPosition1 + event.movementX < sliderWidth && buttonPosition1 + event.movementX >= 0  && !(buttonPosition2 && buttonPosition1 + 5 + event.movementX > buttonPosition2)) {
          setButtonPosition1(state => state + event.movementX)
          if(typeof value === "number") {
            setValue((buttonPosition1 + event.movementX) / sliderWidth * max)
          } else {
            setValue({...value, min: (buttonPosition1 + event.movementX) / sliderWidth * max})
          }
        }
      } else if(buttonClicked2) {
        if(buttonPosition2 + event.movementX < sliderWidth && buttonPosition2 + event.movementX >= 0 && (buttonPosition2 + event.movementX - 5 > buttonPosition1)) {
          setButtonPosition2(state => state + event.movementX)
          if(typeof value === "number") {
            setValue((buttonPosition2 + event.movementX) / sliderWidth * max)
          } else {
            setValue({...value, max: (buttonPosition2 + event.movementX) / sliderWidth * max});
          }
        }
      }
    }
    
    /* Handle clicking the slider buttons, the empty slider bar, and the filled slider bar*/
    const handleMouseDown = (event) => {
      if(buttonRef1.current === event.target) {
        setButtonClicked1(true);
      }
      if(buttonRef2.current === event.target) {
        setButtonClicked2(true);
      }
      // Clicking any part of the slider has the same effect when there is only one button (moving the button to that point
      if((sliderRef.current === event.target || barRef.current === event.target ) && typeof value === "number") {
        setButtonPosition1(event.offsetX);
        setValue(event.offsetX / sliderWidth * max);
        setButtonClicked1(true);
      }
      // If there are two buttons, behavior depends on positions of buttons
      if(typeof value === "object") {
        if(sliderRef.current === event.target) {
          // When clicking on the slider past the 2nd button sets the 2nd button position
          if(event.offsetX > buttonPosition2) {
            setButtonPosition2(event.offsetX)
            setValue({...value, max: event.offsetX / sliderWidth * max})
          }
          // Clicking before the 1st button sets the 1st button position
          else {
            setButtonPosition1(event.offsetX);
            setValue({...value, min: event.offsetX / sliderWidth * max})
          }
        } else if(barRef.current === event.target) {
          if(buttonPosition1 !== buttonPosition2) {
            console.log(buttonPosition1, buttonPosition2, event.offsetX)
            let b1 = Math.abs((event.offsetX + buttonPosition1) - buttonPosition1);
            let b2 = Math.abs((event.offsetX + buttonPosition1) - buttonPosition2);
            console.log(b1, b2)
            if(b1 <= b2 ) {
              setButtonPosition1(state => event.offsetX + state);
              setValue({...value, min: (event.offsetX + buttonPosition1) / sliderWidth * max})
            } else {
              setButtonPosition2(state => state - (barRef.current.clientWidth - event.offsetX));
              setValue({...value, max: (buttonPosition2 - (barRef.current.clientWidth - event.offsetX)) / sliderWidth * max})
            }
          }
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
  }, [buttonClicked1, buttonClicked2, buttonPosition1, buttonPosition2, max, setValue, sliderWidth, value])

  /* Initialize button positions to value prop*/
  useEffect(() => {
    if(typeof value === "number") {
      setButtonPosition1(sliderWidth * (value / max));
    }
    else {
      setButtonPosition1(sliderWidth * (value.min / max));
      setButtonPosition2(sliderWidth * (value.max / max));
    }
  }, [max, sliderWidth, value])

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