import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen h-full w-full">
      <div className="max-w-5xl w-full mx-auto mt-10">
        <span className="flex items-center justify-center text-violet-900 font-bold tracking-tighter text-2xl sm:text-3xl md:text-6xl">
          <span className="font-extrabold text-violet-500">S</span>wift
          <span className="font-extrabold text-violet-500">D</span>rop
        </span>
        <div className="max-w-7xl mt-10 w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2">
            <div className="p-2">
              <Link href={'/dashboard'} className="md:h-40 h-20 bg-violet-300 rounded-lg shadow-md hover:translate-y-0.5 transition-all flex flex-col items-center justify-center">
                <span className="text-2xl md:text-4xl  font-extrabold">Dashboard</span>
              </Link>
            </div>
            <div className="p-2">
              <Link href={'/partner'} className="md:h-40 h-20 bg-violet-300 rounded-lg shadow-md hover:translate-y-0.5 transition-all flex flex-col items-center justify-center">
                <span className="text-2xl md:text-4xl  font-extrabold">Partners</span>
              </Link>
            </div>
            <div className="p-2">
              <Link href={'/orders'} className="md:h-40 h-20 bg-violet-300 rounded-lg shadow-md hover:translate-y-0.5 transition-all flex flex-col items-center justify-center">
                <span className="text-2xl md:text-4xl font-extrabold">Orders</span>
              </Link>
            </div>
            <div className="p-2">
              <Link href={'/assignment'} className="md:h-40 h-20 bg-violet-300 rounded-lg shadow-md hover:translate-y-0.5 transition-all flex flex-col items-center justify-center">
                <span className="text-2xl md:text-4xl  font-extrabold">Assignment</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
