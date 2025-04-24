'use client';
import OrderList from '@/components/OrderList';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MoveLeftIcon, PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  
  return (
    <div className='flex flex-col min-h-screen h-full w-full p-3'>
      <div className='flex justify-between gap-3'>
      <span className="flex items-center justify-center text-violet-900 font-bold tracking-tighter text-2xl md:text-3xl xl:text-6xl">
          <span className="font-extrabold text-violet-500">S</span>wift
          <span className="font-extrabold text-violet-500">D</span>rop
        </span>
        <div className='flex items-center gap-4'>
      <Link className={cn(buttonVariants({variant:'outline'}),'flex items-center')} href={'/'}><MoveLeftIcon className='text-violet-500 size-4 mr-2' />
        <span className='hidden md:inline'>Home</span>
      </Link>
        <Link className={cn(buttonVariants({variant:'outline'}),'flex items-center')} href={'/orders/create'}><PlusCircleIcon className='text-violet-500 size-4 mr-2' />
          <span className='hidden md:inline'>Create Order</span>
        </Link>
        </div>
      </div>
      <div>
        <OrderList />
      </div>
    </div>
  )
}

export default Page
