import Image from 'next/image'
import {useState} from 'react'
import { Inter } from 'next/font/google'
// import Maps from '@/components/Maps'
import 'leaflet/dist/leaflet.css'
import dynamic from "next/dynamic"
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,useDisclosure } from '@chakra-ui/react'
const inter = Inter({ subsets: ['latin'] })
const Maps = dynamic(() => import("../components/Maps"), { ssr:false })
export default function Home() {
  const [ShowModal,setShowModal] = useState(false)
  const [ModalData,setModalData] = useState({
    "name": "",
    "image": "",
    "location": "",
    "lat": 0,
    "long": 0,
    "duration": "",
    "city": "",
    "address": "",
    "country": "",
    "personal": [
    ],
    "deployed": true,
    "description": ""
})
  const handleShowModal =()=>{
    setShowModal(prev=>!prev)
  }
    return (
       <div className="home w-screen h-screen flex overflow-hidden">
    <div
      className={`map-container w-full bg-slate-200`}
    >
      <Modal isOpen={ShowModal} onClose={handleShowModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{ModalData.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="my-2">
              <p className='font-semibold text-[.9rem] text-slate-700'>Description</p>
              <p className='text-[.7rem] text-gray-500'>{ModalData.description}</p>
            </div>
            <div className="my-2">
              <p className='font-semibold text-[.9rem] text-slate-700'>Address</p>
              <p className='text-[.7rem] text-gray-500'>{ModalData.location},{ModalData.address}</p>
              <p className='font-semibold text-[.9rem] text-slate-700'>Latitude : <span className='text-gray-500'> {ModalData.lat}</span></p>
              <p className='font-semibold text-[.9rem] text-slate-700'>Longitude : <span className='text-gray-500'> {ModalData.long} </span></p>
              <p className='font-semibold text-[.9rem] text-slate-700'>City : <span className='text-gray-500'> {ModalData.city} </span></p>
              <p className='font-semibold text-[.9rem] text-slate-700'>Country : <span className='text-gray-500'> {ModalData.country} </span></p>
            </div>
            <div className="my-2">
              <p className='font-semibold text-[.9rem] text-slate-700'>Personal Deployed : <span className='text-gray-500'> {ModalData.personal.length}</span></p>
              <p className='font-semibold text-[.9rem] text-slate-700'>Duration : <span className='text-gray-500'> {ModalData.duration}</span></p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleShowModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    <Maps setModal={setShowModal} setModalData={setModalData}/>
    </div>
    </div>
    )
}