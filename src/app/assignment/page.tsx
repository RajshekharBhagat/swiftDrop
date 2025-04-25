import AssignmentTable from '@/components/AssignmentTable'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MoveLeftIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = () => {

  return (
    <div className='max-w-5xl mx-auto w-full p-3'>
      <div className="flex justify-end py-4">
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex items-center"
          )}
          href={"/"}
        >
          <MoveLeftIcon className="text-violet-500 size-4 mr-2" />
          Home
        </Link>
      </div>
      <AssignmentTable />
    </div>
  )
}

export default Page
