import {useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";

const Calendar = ({dates, setDates}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const currentDate = dayjs();

  const handleLeftButton = () => {
    setSelectedDate(state => state.subtract(1, "month"));
  }

  const handleRightButton = () => {
    setSelectedDate(state => state.add(1, "month"));
  }

  useEffect(() => {
    console.log(dates)
  }, [dates])

  const handleDateClick = (day) => {
    if(dates.startDate && day.isSame(dates.startDate, 'day')) {
      setDates({startDate: null, endDate: null})
    } else if(!dates.startDate && !dates.endDate) {
      setDates({...dates, startDate: day})
    } else if(dates.endDate && day.isSame(dates.endDate, 'day')) {
      setDates({...dates, endDate: null})
    } else {
      setDates({...dates, endDate: day})
    }
  }

  const renderCalendar = (date) => {
    return (
      <>
        <div className={'flex justify-center my-4 w-full'}>
          <h3 className={'font-bold'}>{date.format('MMMM YYYY')}</h3>
        </div>
        <div className={'grid grid-cols-7 grid-rows-auto  items-center justify-center content-center'}>
          <div className={'flex justify-center items-center'}>Su</div>
          <div className={'flex justify-center items-center'}>Mo</div>
          <div className={'flex justify-center items-center'}>Tu</div>
          <div className={'flex justify-center items-center'}>We</div>
          <div className={'flex justify-center items-center'}>Th</div>
          <div className={'flex justify-center items-center'}>Fr</div>
          <div className={'flex justify-center items-center'}>Sa</div>
          {renderCalendarDates(date)}
        </div>
      </>
    )
  }

  const renderCalendarDates = (date) => {
    let state = "preBlank";
    let divs = [];
    let indexDate = dayjs(date.date(1))
    let dayOfWeek = 0;

    while(true) {
      if(state === "preBlank") {
        if(dayOfWeek === indexDate.day()) {
          state = "date";
        }
        else {
          dayOfWeek += 1;
          divs.push(<div className={'aspect-square  max-w-full max-h-full w-full h-full'}></div>)
        }
      }
      else if(state === "date") {
        divs.push(renderCalendarDay(indexDate))
        indexDate = indexDate.add(1, "day");
        dayOfWeek = indexDate.day();
        if(indexDate.date() === indexDate.daysInMonth()) {
          divs.push(renderCalendarDay(indexDate))
          state = "postBlank";
          break;
        }
      }
    }
    return divs;
  }

  const renderCalendarDay = (day) => {
    if(dates.startDate && day.isSame(dates.startDate, 'day') || dates.endDate && day.isSame(dates.endDate, 'day')) {
      const style = day.isSame(dates.startDate, 'day') ? 'right-0' : 'left-0';
      return (
        <div className={'relative'}>
          <button
            onClick={() => handleDateClick(day)}
            className={'z-20 relative aspect-square shadow-xl max-w-full max-h-full w-full h-full flex p-2 justify-center items-center rounded-full bg-black text-light hover:cursor-pointer'}>{day.date()}
          </button>
          {dates.startDate && dates.endDate && <div className={`z-10 absolute ${style} bg-gray-100 w-1/2 h-full top-0`}/>}
        </div>
      )
    } else if(dates.startDate && dates.endDate && day.isBetween(dates.startDate,dates.endDate, 'day')) {
      return (
        <div className={'bg-gray-100'}>
          <button
            onClick={() => handleDateClick(day)}
            className={` aspect-square rounded-full max-w-full max-h-full w-full h-full  flex p-2  justify-center items-center border border-gray-100 hover:border-gray-300 hover:cursor-pointer`}>
            {day.date()}
          </button>
        </div>
      )
    }
    return (
      <button
        onClick={() => handleDateClick(day)}
        disabled={day.isBefore(dates.startDate, 'day') || day.isBefore(currentDate, 'day')}
        className={`aspect-square  disabled:text-gray-300 disabled:line-through max-w-full max-h-full w-full h-full hover:cursor-pointer flex p-2  justify-center items-center rounded-full hover:border hover:border-gray-300 hover:cursor-pointer`}>
        {day.date()}
      </button>
    )
  }


  return (
    <>
      <h2 className={'text-2xl'}>
        {!dates.startDate && !dates.endDate && "Select a Check-In Date"}
        {dates.startDate && !dates.endDate && "Select a Check-Out Date"}
        {dates.startDate && dates.endDate && <span>{dates.endDate.diff(dates.startDate, 'day')} Nights</span>}
      </h2>
      <div className={'relative'}>
        <div className={'flex justify-between my-4 absolute top-0 w-full px-2'}>
          <button className={'disabled:opacity-20'} onClick={handleLeftButton} disabled={selectedDate.month() === currentDate.month() && selectedDate.year() === currentDate.year()}><FiChevronLeft className={'w-6 h-6'}/></button>
          <button onClick={handleRightButton}><FiChevronRight className={'w-6 h-6'} /></button>
        </div>
        <div className={'flex justify-center lg:justify-between top-0'}>
          <div className={'w-full lg:mr-4'}>
            {renderCalendar(selectedDate)}
          </div>
          <div className={'hidden xl:block w-full'}>
            {renderCalendar(selectedDate.add(1, "month"))}
          </div>
        </div>
        <div>
          <button
            className={'underline w-full flex justify-end'}
            onClick={() => {setDates({endDate: null, startDate: null})}}>
            Clear dates
          </button>
        </div>
      </div>
    </>
  )
}

export default Calendar