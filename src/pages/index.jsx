import Image from 'next/image'
import { Inter } from 'next/font/google'
// import Maps from '@/components/Maps'
import 'leaflet/dist/leaflet.css'
import dynamic from "next/dynamic"
const inter = Inter({ subsets: ['latin'] })
const Maps = dynamic(() => import("../components/Maps"), { ssr:false })
export default function Home() {
    return ( <div className="home w-screen h-screen flex overflow-hidden">
    <div
      className={`map-container w-full bg-slate-200`}
    >
    <Maps/>
    </div>
    </div>
    )
}