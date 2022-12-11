import {ComponentPropsWithoutRef} from "react";

const VisuallyHidden = ({children} : ComponentPropsWithoutRef<"div">) => {
  return (
    <div className={'border-none border-[0px] h-[1px] m-[-1px] overflow-hidden p-0 absolute w-[1px]'}>
      {children}
    </div>
  )
}

export default VisuallyHidden