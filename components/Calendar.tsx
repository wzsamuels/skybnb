import {useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";

const Calendar = ({onDateChange}) => {
  const [startDate, setStartDate] = useState(dayjs().add(1, "day"));
  const [endDate, setEndDate] = useState<Dayjs>(null);
  const [selectedDate, setSelectedDate] = useState(startDate)
  const currentDate = dayjs();

  const handleLeftButton = () => {
    setSelectedDate(state => state.subtract(1, "month"));
  }

  const handleRightButton = () => {
    setSelectedDate(state => state.add(1, "month"));
  }

  const handleDateClick = (day) => {
    if(startDate && day.isSame(startDate, 'day')) {
      setStartDate(null)
      setEndDate(null)
    } else if(!startDate && !endDate) {
      setStartDate(day);
    } else if(endDate && day.isSame(endDate, 'day')) {
      setEndDate(null);
    } else {
      setEndDate(day)
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
    console.log(indexDate)

    while(true) {
      console.log(`${indexDate.day()} ${dayOfWeek}`)
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
    if(startDate && day.isSame(startDate, 'day') || endDate && day.isSame(endDate, 'day')) {
      const style = day.isSame(startDate, 'day') ? 'right-0' : 'left-0';
      return (
        <div className={'relative'}>
          <button
            onClick={() => handleDateClick(day)}
            className={'z-20 relative aspect-square shadow-xl max-w-full max-h-full w-full h-full flex p-2 justify-center items-center rounded-full bg-black text-light hover:cursor-pointer'}>{day.date()}
          </button>
          {startDate && endDate && <div className={`z-10 absolute ${style} bg-gray-100 w-1/2 h-full top-0`}/>}
        </div>
      )
    } else if(startDate && endDate && day.isBetween(startDate,endDate, 'day')) {
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
        disabled={day.isBefore(startDate, 'day') || day.isBefore(currentDate, 'day')}
        className={`aspect-square  disabled:text-gray-300 disabled:line-through max-w-full max-h-full w-full h-full hover:cursor-pointer flex p-2  justify-center items-center rounded-full hover:border hover:border-gray-300 hover:cursor-pointer`}>
        {day.date()}
      </button>
    )
  }


  return (
    <section className={'border-t border-gray-300 py-6 md:py-8'}>
      <h2 className={'text-2xl'}>
        {!startDate && !endDate && "Select a Check-In Date"}
        {startDate && !endDate && "Select a Check-Out Date"}
        {startDate && endDate && <span>{endDate.diff(startDate, 'day')} Nights</span>}
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
            onClick={() => {setStartDate(null); setEndDate(null)}}>
            Clear dates
          </button>
        </div>
      </div>
    </section>
  )
}

export default Calendar