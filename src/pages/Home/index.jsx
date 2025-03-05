import React from 'react'
import './index.css'
import { Slider, TextField } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers'
import useApi from '../hooks/useApi'

function Home() {

  const [duration, setDuration] = React.useState(30)
  const [value, setValue] = React.useState()
  const [rooms, setRooms] = React.useState([])
  const [hasSearch, setHasSearch] = React.useState(false)
  const [selectedRoom, setSelectedRoom] = React.useState({room_id: '', room_name: ''})
  const [persons, setPersons] = React.useState(2)
  const [students, setStudents] = React.useState("")

  function generateTimeSlots() {
    const now = new Date();
    let hours = Math.max(now.getHours(), 7);
    let minutes = Math.ceil(now.getMinutes() / 15) * 15;
    const endHour = 17; // 5 PM
    const timeSlots = [];
    
    while (hours < endHour || (hours === endHour && minutes === 0)) {
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
        if (hours >= endHour && minutes > 0) break;
        
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        timeSlots.push(formattedTime);
        minutes += 15;
    }
    
    return timeSlots;
  }

  const handleGetAvailableRooms = async () => {
    if (!value) {
      alert('Selecciona una hora de inicio')
      return
    }
    const [hours, minutes] = value.split(':')
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes)
    const bodyData = {
      start_time: totalMinutes,
      duration: duration,
      cookies: JSON.parse(sessionStorage.getItem('data')).cookie
    }
    const {status, data} = await useApi({url: '/find_rooms', method: 'POST', body: bodyData})
    if (status === 200) {
      setHasSearch(true)
      setRooms(data)
    } else {
      alert('Hubo un error al buscar los cubículos')
    }
  }

  const handleReserveRoom = async () => {

    const [hours, minutes] = value.split(':')
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes)

    if (students === "") {
      alert('Ingresa los nombres y códigos de los estudiantes')
      return
    }

    let bodyData = {
      cookies: JSON.parse(sessionStorage.getItem('data')).cookie,
      data_book: {
        room_id: selectedRoom.room_id,
        start_time: totalMinutes,
        duration: duration,
        internal_id: selectedRoom.internal_id,
        secondary_internal_id: selectedRoom.secondary_internal_id,
      }
    }

    let {status, data} = await useApi({url: '/select_room', method: 'POST', body: bodyData})

    if (status === 200) {
      bodyData = {
        cookies: JSON.parse(sessionStorage.getItem('data')).cookie,
        data_book: {
          room_id: selectedRoom.room_id,
          start_time: totalMinutes,
          duration: duration,
          internal_id: selectedRoom.internal_id,
          secondary_internal_id: selectedRoom.secondary_internal_id,
          information: students,
          students_number: persons
        }
      }
      let {status, data} = await useApi({url: '/reserve_room', method: 'POST', body: bodyData})
      if ((status === 200) && (data.status === true)) {
        setRooms([])
        setHasSearch(false)
        setSelectedRoom({room_id: '', room_name: ''})
        setPersons(2)
        setStudents("")
        alert('Reserva realizada con éxito')
      } else {
        alert('Hubo un error al realizar la reserva')
      }
    }

  }

  const marks = [
    {
      value: 30,
      label: '30 min',
    },
    {
      value: 60,
      label: '1 hr',
    },
    {
      value: 90,
      label: '1 hr 30 min',
    },
    {
      value: 120,
      label: '2 hrs',
    }
  ]

  return (
    <div className='container-reserva'>
      <header>
        <h2>Realizar Reserva</h2>
        <span>Llena los datos para continuar con la reserva</span>
      </header>
      <div className='body-reserva'>
        <section>
          <h3>Hora de inicio</h3>
          <select className='select' value={value} onChange={(e) => setValue(e.target.value)}>
            {generateTimeSlots().map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </section>
        <section>
          <h3>Duración: {duration} minutos</h3>
          <Slider
            aria-label="Duración de la reserva"
            defaultValue={30}
            valueLabelDisplay="auto"
            shiftStep={30}
            step={30}
            value={duration}
            onChange={(e, value) => setDuration(value)}
            min={30}
            max={120}
            marks={marks}
            sx={{ width: '95%', marginInline: 'auto', display: 'block' }}
          />
        </section>
        <button className='search-btn' onClick={handleGetAvailableRooms}>Buscar cubículos</button>
        {hasSearch && (<section>
          <h4>Cubículos disponibles</h4>
          {rooms.length === 0 ? <span className='information-message'>No hay cubículos disponibles</span> : rooms.map(room => (<article key={room.id} className={`room-card ${room.room_id === selectedRoom.room_id ? 'selected_room': ''}`} onClick={() => setSelectedRoom(room)}>{room.room_name}</article>))}
        </section>)}
        {
          (selectedRoom.room_id !== "" && rooms.length !== 0) && (
            <section>
              <h4>Detalles de la reserva</h4>
              <div>
                <span className='label-dec'>Número de personas ({persons})</span>
                <div className='container-persons'>
                  <button disabled={persons === 2} onClick={() => setPersons(persons - 1)} className='increment-button'>-</button>
                  <span>{persons}</span>
                  <button disabled={persons === 4} onClick={() => setPersons(persons + 1)} className='increment-button'>+</button>
                </div>
              </div>
              <div>
                <span className='label-dec'>Estudiantes y códigos</span>
                <input placeholder='Juan... 2020020202' className='multi-input' maxLength={100} value={students} onChange={(e) => setStudents(e.target.value)}/>
              </div>
              <button className='reserva-btn' onClick={handleReserveRoom}>Reservar</button>
            </section>
          )
        }
      </div>
    </div>
  )
}

export default Home
