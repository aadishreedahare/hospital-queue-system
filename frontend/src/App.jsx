import { useEffect, useState } from "react";

function App() {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [problem, setProblem] = useState("");

  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [availableTime, setAvailableTime] = useState("");

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  const fetchDashboardData = () => {
    fetch("http://127.0.0.1:8000/dashboard/stats")
      .then((response) => response.json())
      .then((data) => setStats(data));

    fetch("http://127.0.0.1:8000/patients")
      .then((response) => response.json())
      .then((data) => setPatients(data));

    fetch("http://127.0.0.1:8000/doctors")
      .then((response) => response.json())
      .then((data) => setDoctors(data));

    fetch("http://127.0.0.1:8000/appointments")
      .then((response) => response.json())
      .then((data) => setAppointments(data));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const addPatient = (event) => {
    event.preventDefault();

    fetch("http://127.0.0.1:8000/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age: Number(age), problem }),
    })
      .then((response) => response.json())
      .then(() => {
        setName("");
        setAge("");
        setProblem("");
        fetchDashboardData();
      });
  };

  const addDoctor = (event) => {
    event.preventDefault();

    fetch("http://127.0.0.1:8000/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: doctorName,
        specialization,
        available_time: availableTime,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setDoctorName("");
        setSpecialization("");
        setAvailableTime("");
        fetchDashboardData();
      });
  };

  const bookAppointment = (event) => {
    event.preventDefault();

    fetch("http://127.0.0.1:8000/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: Number(selectedPatientId),
        doctor_id: Number(selectedDoctorId),
        appointment_date: appointmentDate,
        status: "Booked",
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setSelectedPatientId("");
        setSelectedDoctorId("");
        setAppointmentDate("");
        fetchDashboardData();
      });
  };

  const completeAppointment = (appointmentId) => {
    fetch(
      `http://127.0.0.1:8000/appointments/${appointmentId}?status=completed`,
      {
        method: "PUT",
      }
    )
      .then((response) => response.json())
      .then(() => fetchDashboardData());
  };

  const deleteAppointment = (appointmentId) => {
    fetch(`http://127.0.0.1:8000/appointments/${appointmentId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => fetchDashboardData());
  };
  const getPatientName = (patientId) => {
  const patient = patients.find((patient) => patient.id === patientId);
  return patient ? patient.name : "Unknown";
};

const getDoctorName = (doctorId) => {
  const doctor = doctors.find((doctor) => doctor.id === doctorId);
  return doctor ? doctor.name : "Unknown";
};
const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  width: "220px",
  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  textAlign: "center",
};
const buttonStyle = {
  padding: "10px 18px",
  fontSize: "14px",
  cursor: "pointer",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
};
const smallButtonStyle = {
  padding: "6px 10px",
  marginRight: "8px",
  cursor: "pointer",
  backgroundColor: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px",
};
const deleteButtonStyle = {
  padding: "6px 10px",
  cursor: "pointer",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
};
const inputStyle = {
  padding: "10px",
  fontSize: "14px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center",
  backgroundColor: "white",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
};

  return (
    <div
   style={{
    padding: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f4f7fc",
  }}
   >
      <h1 style={{ fontSize: "36px", lineHeight: "1.2", textAlign: "center", margin: "20px 0 10px" }}>
        Hospital Queue & Appointment
        <br />
        Management System
      </h1>

      <h2>Dashboard</h2>

      {stats ? (
        <>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
            <div style={cardStyle}><h3>Total Patients</h3><p>{stats.total_patients}</p></div>
            <div style={cardStyle}><h3>Total Doctors</h3><p>{stats.total_doctors}</p></div>
            <div style={cardStyle}><h3>Total Appointments</h3><p>{stats.total_appointments}</p></div>
            <div style={cardStyle}><h3>Completed Appointments</h3><p>{stats.completed_appointments}</p></div>
          </div>

          <h2>Add Patient</h2>
          <form onSubmit={addPatient} style={formStyle}>
            <input type="text" placeholder="Patient Name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="Problem" value={problem} onChange={(e) => setProblem(e.target.value)} required style={inputStyle} />
            <button type="submit" style={buttonStyle}>Add Patient</button>
          </form>

          <h2>Patients List</h2>
          <table border="1" cellPadding="10" style={tableStyle}>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Age</th><th>Problem</th></tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td><td>{patient.name}</td><td>{patient.age}</td><td>{patient.problem}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: "40px" }}>Add Doctor</h2>
          <form onSubmit={addDoctor} style={formStyle}>
            <input type="text" placeholder="Doctor Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="Available Time" value={availableTime} onChange={(e) => setAvailableTime(e.target.value)} required style={inputStyle} />
            <button type="submit" style={buttonStyle}>Add Doctor</button>
          </form>

          <h2>Doctors List</h2>
          <table border="1" cellPadding="10" style={tableStyle}>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Specialization</th><th>Available Time</th></tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td><td>{doctor.name}</td><td>{doctor.specialization}</td><td>{doctor.available_time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: "40px" }}>Book Appointment</h2>
          <form onSubmit={bookAppointment} style={formStyle}>
            <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} required style={inputStyle}>
              <option value="">Select Patient</option>
              {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
            </select>

            <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} required style={inputStyle}>
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialization}</option>)}
            </select>

            <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required style={inputStyle} />
            <button type="submit" style={buttonStyle}>Book Appointment</button>
          </form>

          <h2>Appointments List</h2>
          <table border="1" cellPadding="10" style={tableStyle}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{getPatientName(appointment.patient_id)}</td>
                  <td>{getDoctorName(appointment.doctor_id)}</td>
                  <td>{appointment.appointment_date}</td>
                  <td>{appointment.status}</td>
                  <td>
                    {appointment.status !== "completed" && (
                      <button onClick={() => completeAppointment(appointment.id)} style={smallButtonStyle}>
                        Complete
                      </button>
                    )}

                    <button onClick={() => deleteAppointment(appointment.id)} style={deleteButtonStyle}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  width: "220px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const formStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "30px",
  flexWrap: "wrap",
};

const inputStyle = {
  padding: "10px",
  fontSize: "14px",
};

const buttonStyle = {
  padding: "10px 18px",
  fontSize: "14px",
  cursor: "pointer",
};

const smallButtonStyle = {
  padding: "6px 10px",
  marginRight: "8px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  padding: "6px 10px",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center",
};

export default App;