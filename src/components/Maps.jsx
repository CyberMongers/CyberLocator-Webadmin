import React, { useEffect,useState } from 'react'
import { Circle, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer } from 'react-leaflet'
import {w3cwebsocket} from 'websocket'
import L from 'leaflet';
import { officer_db } from '@/utility/officer_db';

export default function Maps() {
 const [socket,setSocket] = useState(null)
 const [personals,setPersonals] =useState([])
 function addUserToUserList(user, userList) {
  const foundUser = userList.find(u => u.userId === user.userId);
  
  if (!foundUser) {
    setPersonals([...personals,user])
  }
  return userList;
}

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

    const position = [22.3577455, 88.4385163]
     const [Lat,setLat] = useState(20.59)
     const [Long,setLong] = useState(78.96)
    const [personalLoc,setPersonalLoc] = useState([Lat,Long])

//     useEffect(()=>{
//         const int = setInterval(()=>{
//              setLat(prev=>prev+.001)
//              setLong(prev=>prev+.01)
//         },[1000])

//         return()=>[
//             clearInterval(int)
//         ]
// },[])






useEffect(()=>{
setPersonalLoc([Lat,Long])
},[Lat,Long])
  
  const fillBlueOptions = { fillColor: 'red' }


  function handleMarkerMove() {
    const distance = L.latLng(position).distanceTo(L.latLng(Lat, Long));
    if (distance > 20000) {
      console.log("officer outof allocated area")
    }
  }

  useEffect(()=>{
  console.log(personals)
  },[personals])

  useEffect(()=>{
  handleMarkerMove();
  },[personalLoc])

  const getUserName=(id)=>{

    const user = officer_db.find(e=>e.id===id)
    if(user)
    return user.first_name + user.last_name
     return 'Unknown'
  }
  return (
    <div className="relative w-screen h-screen">

 <MapContainer maxBounds={[[-10, -20], [60, 120]]} center={position} zoom={5} scrollWheelZoom={true} style={{height: "100%", width: "100%",zIndex:'1'}} >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
     <Circle center={position} pathOptions={fillBlueOptions} radius={20000} />
    {personals?.map((personal)=>{
      return (<Marker key={personal.userId} position={personal.location} icon={pointerIcon} onMove={handleMarkerMove} >
      <Popup>
        <div className="flex">
          <p>{getUserName(personal.userId)}</p>
        </div>
      </Popup>
    </Marker>)
})}
  </MapContainer>
<div className="absolute bottom-0 left-0 h-[10rem] p-5 w-full flex gap-5 bg-white/20 backdrop-blur-sm z-[100]">
<div className="h-[8rem] shadow-2xl w-[10%] bg-blue-700/90 text-white rounded-xl p-5">
 <p className='text-[1.2rem] font-extrabold'>Active Personal</p> 
 <p className='text-[2.5rem] text-center font-extrabold'>{personals.length}</p>
</div>
<div className="h-[8rem] shadow-2xl w-[10%] bg-red-700/90 text-white rounded-xl p-5">
 <p className='text-[1.2rem] font-extrabold'>Active Misson</p> 
 <p className='text-[2.5rem] text-center font-extrabold'>1</p>
</div>
</div>
</div>
  )
}
