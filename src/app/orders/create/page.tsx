import OrderForm from '@/components/OrderForm'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { HomeIcon, MoveLeftIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div>
      <div className='flex justify-end'>
      <Link className={cn(buttonVariants({variant:'outline'}),'flex items-center')} href={'/orders'}><MoveLeftIcon className='text-violet-500 size-4 mr-2' />Orders</Link>
      </div>
      <OrderForm />
    </div>
  )
}

export default Page
