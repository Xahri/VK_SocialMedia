'use client'
export const revalidate = 0
import NavCard from './NavCard'

export default function Layout({ children }: any) {
  return (
    <div className="md:flex mt-4 max-w-4xl mx-auto gap-6 mb-24 md:mb-0">
      <div className='flex-col w-full md:w-3/12'>
        <div className="fixed md:static w-full bottom-0 -mb-5" >
          <NavCard />
        </div>
      </div>
      <div className='mx-4 md:mx-0 md:w-9/12'>
        {children}
      </div>
    </div>
  )
}
