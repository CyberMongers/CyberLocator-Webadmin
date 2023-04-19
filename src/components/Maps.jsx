import React, { useEffect,useState } from 'react'
import { Circle, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer } from 'react-leaflet'
import {w3cwebsocket} from 'websocket'
import L from 'leaflet';
import { officer_db } from '@/utility/officer_db';
import { missions } from '@/utility/mission_db';
import { useToast } from '@chakra-ui/react';
export default function Maps({setModal,setModalData}) {
 const [socket,setSocket] = useState(null)
 const [personals,setPersonals] =useState([])
 function addUserToUserList(user, userList) {
  const foundUser = userList.find(u => u.userId === user.userId);
  
  if (!foundUser) {
    setPersonals([...personals,user])
  }
  return userList;
}
 const toast = useToast()
 useEffect(() => {
  const newSocket = new w3cwebsocket('wss://api-snappio.onrender.com/ws/rooms/123456/')

  newSocket.onopen = () => {
    console.log('WebSocket connected');
  };

  newSocket.onmessage = (event) => {
    let user = JSON.parse(event.data).message
    addUserToUserList(user, personals)
  };

  
  newSocket.onclose = () => {
    console.log('WebSocket disconnected');
    setSocket(null);
  };

  setSocket(newSocket);
  
  return () => {
    newSocket.close();
  };
}, [personals]);
const pointerIcon = new L.Icon({
        iconUrl: 'https://static.vecteezy.com/system/resources/previews/009/589/758/original/location-location-pin-location-icon-transparent-free-png.png',
        iconSize: [40, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
      });

    const position = [22.5310, 88.3260]
    //  const [Lat,setLat] = useState(20.59)
    //  const [Long,setLong] = useState(78.96)
    // const [personalLoc,setPersonalLoc] = useState([Lat,Long])

//     useEffect(()=>{
//         const int = setInterval(()=>{
//              setLat(prev=>prev+.001)
//              setLong(prev=>prev+.01)
//         },[1000])

//         return()=>[
//             clearInterval(int)
//         ]
// },[])






// useEffect(()=>{
// setPersonalLoc([Lat,Long])
// },[Lat,Long])
  
  const fillBlueOptions = { fillColor: 'red' }


  function handleMarkerMove(Lat,Long,id) {
    const distance = L.latLng(position).distanceTo(L.latLng(Lat, Long));
    console.log(distance)
    if (distance > 8000) {
      console.log("officer outof allocated area")
      toast({
        title: 'Personal Out Of Mission Area',
        description: id,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    }
    return 1;
  }

  useEffect(()=>{
  console.log(personals)
  personals.map((personal)=>{

    if(personal.length!==0)
    handleMarkerMove(personal?.latitude,personal?.longitude,personal?.userId)
  }
  )
  },[personals])



  // useEffect(()=>{
  // handleMarkerMove();
  // },[personalLoc])

  const getUserName=(id)=>{

    const user = officer_db.find(e=>e.id===id)
    if(user)
    return user.first_name + user.last_name
     return 'Unknown'
  }

  const func =(data)=>{
    setModal(true)
    setModalData(data)
  }
  return (
    <div className="relative w-screen h-screen">

 <MapContainer maxBounds={[[-10, -20], [60, 120]]} center={position} zoom={5} scrollWheelZoom={true} style={{height: "100%", width: "100%",zIndex:'1'}} >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {missions?.map((mission)=>{
    return (<Circle key={mission.name} center={[mission.lat,mission.long]} pathOptions={fillBlueOptions} radius={8000}  eventHandlers={{click:()=> func(mission)}}/>)
    })}
    {personals?.map((personal)=>{
      return ( <Marker  key={personal.userId} position={personal.location} icon={pointerIcon} >
      <Popup>
        <div className="flex">
          <img src={personal.avatar} alt="" />
          <p>{getUserName(personal.userId)}</p>
        </div>
      </Popup>
    </Marker>)
})}
  </MapContainer>
<div className="absolute bottom-0 left-0 h-[10rem] p-5 w-full flex gap-5 bg-white/20 backdrop-blur-sm z-[100]">
<div className="h-[8rem] shadow-2xl w-[10%] bg-blue-700/90 text-white rounded-xl py-5">
 <p className='text-[1rem] text-center font-extrabold'>Active Personal</p> 
 <p className='text-[2.5rem] text-center font-extrabold'>{personals.length}</p>
</div>
<div className="h-[8rem] shadow-2xl w-[10%] bg-red-700/90 text-white rounded-xl py-5">
 <p className='text-[1rem] text-center font-extrabold'>Active Misson</p> 
 <p className='text-[2.5rem] text-center font-extrabold'>{missions.length}</p>
</div>
</div>
</div>
  )
}
