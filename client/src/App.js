import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room, Star} from "@material-ui/icons";
import "./app.css"
import axios from "axios";
import {format} from "timeago.js"


function App() {
  const currentUser = "Jane"
  const [pins, setPins] = useState([]);
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating,setRating] = useState(0);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 3
  });

  useEffect(()=>{
    const getPins = async()=>{
      try{
        const res = await axios.get("/pins");
        setPins(res.data);
      }catch(err){
        console.log(err)

      }
    };
    getPins()
  },[])

  const handleMarkerClick = (id,lat,long)=>{
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude:lat, longitude:long });
  };

  const handleAddClick = (e) =>{
    const [long,lat] = e.lngLat;
    setNewPlace({
      lat:lat,
      long:long,
    })
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    /*created Pin object*/
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,

    }

    try{

      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);

    }catch(err){
      console.log(err);
    }
  };



  return (
    <div className="App">
     <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/fatropolis/cksm6riwc49pd18nxnhmfark0"
      onDblClick = {handleAddClick}
      transitionDuration="400"
    
    >
      {pins.map(p=>(
<>
     
      <Marker latitude={p.lat} longitude={p.long} offsetLeft={-20} offsetTop={-10}>
        <Room style={{fontsize:viewport.zoom * 6, color: p.username === currentUser ?"tomato":"slateblue",}}
              onClick={()=>handleMarkerClick(p._id, p.lat,p.long)}
        />

      </Marker>
      {p._id === currentPlaceId && (
       <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={()=>setCurrentPlaceId(null)}
          >
          <div className="card">
            <label>Place</label>
            <h4 className="place">{p.title}</h4>
            <label>Review</label>
            <p className="desc">{p.desc}</p>
            <label>Rating</label>
            <div className="stars">
             {Array(p.rating).fill(<Star className="star" />)}

            </div>
            <label>Description</label>
            <span className="username">Created by<b>{p.user}</b> </span>
            <span className="date">{format(p.createdAt)}</span>
          </div>  
      </Popup> 
      )}
      </>
     ))}

        {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={()=> setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input 
                placeholder = "Enter a Title" 
                onChange={(e)=>setTitle(e.target.value)}
              /> 
              <label>Review</label>
                <textarea 
                placeholder = "Tell us something about this place"
                onChange={(e)=>setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e)=>setRating(e.target.value)}>
                <option value = "1">1</option>
                <option value = "2">2</option>
                <option value = "3">3</option>
                <option value = "4">4</option>
                <option value = "5">5</option>
              </select>
              <button className="submitButton" type = "submit">Add Pin</button>
            </form>
          </div>

        </Popup>
        )}
       {/* <button className="button logout">Log out</button>
        <button>Log in</button>
        <button>Register</button>*/}

    </ReactMapGL>
    </div>
  );
}

export default App;
