import {Dialog, Transition} from "@headlessui/react";
import {ComponentPropsWithoutRef, Fragment} from "react";

interface Props extends ComponentPropsWithoutRef<any> {
  show: boolean
  onClose: () => void
  title: string
}

const Modal = ({show, onClose, children, title} : Props) => {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog
        onClose={onClose}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition-all duration-500"
          enterFrom="top-[1000px]"
          enterTo="top-0"
          leave="transition-all duration-500"
          leaveFrom="bottom-0"
          leaveTo="top-[1000px]"
        >
          <div className="fixed inset-0 flex min-h-full items-center justify-center p-4" style={{overflow: "initial"}}>
            {/* The actual dialog panel  */}
            <Dialog.Panel className="mx-auto w-full max-w-[1080px] max-h-[99%] p-4 rounded bg-white overflow-y-scroll" >
              <Dialog.Title className={'flex justify-between'}>{title}<button onClick={onClose}>X</button></Dialog.Title>
              {children}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default Modal