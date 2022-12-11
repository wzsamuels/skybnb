const ProgressBar = ({percent}: {percent: number}) => {
  return (
    <div className="basis-[50%] shrink-0 bg-gray-200 h-1 rounded ">
      <div className="bg-black h-1 rounded" style={{width: `${percent}%`}}/>
    </div>
  )
}

export default ProgressBar