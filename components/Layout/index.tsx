import {ReactNode} from "react";

const Layout = ({children} : {children: ReactNode}) => {
  return (
    <div>
      <nav className={'h-[50px] border-b-2 border-gray-400'}>
        SkyBnB
      </nav>
      <main>
        {children}
      </main>
      <footer className={'border-gray-400 border-t-2'}>
        SkyBnB
      </footer>
    </div>
  )
}

export default Layout