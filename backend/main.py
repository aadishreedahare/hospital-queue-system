from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy.orm import sessionmaker

from database import engine
from models import Patient as PatientModel, Doctor as DoctorModel, Appointment as AppointmentModel

app = FastAPI()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SessionLocal = sessionmaker(bind=engine)

SessionLocal = sessionmaker(bind=engine)


class PatientCreate(BaseModel):
    name: str
    age: int
    problem: str

class DoctorCreate(BaseModel):
    name: str
    specialization: str
    available_time: str
class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: str
    status: str

@app.get("/")
def home():
    return {
        "message": "Hospital Queue & Appointment Management System API is running!"
    }


@app.get("/patients")
def get_patients():
    db = SessionLocal()
    patients = db.query(PatientModel).all()
    db.close()
    return patients


@app.post("/patients")
def add_patient(patient: PatientCreate):
    db = SessionLocal()

    new_patient = PatientModel(
        name=patient.name,
        age=patient.age,
        problem=patient.problem
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    db.close()

    return {
        "message": "Patient added successfully",
        "data": new_patient
    }
@app.get("/doctors")
def get_doctors():
    db = SessionLocal()
    doctors = db.query(DoctorModel).all()
    db.close()
    return doctors


@app.post("/doctors")
def add_doctor(doctor: DoctorCreate):
    db = SessionLocal()

    new_doctor = DoctorModel(
        name=doctor.name,
        specialization=doctor.specialization,
        available_time=doctor.available_time
    )

    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    db.close()

    return {
        "message": "Doctor added successfully",
        "data": new_doctor
    }
@app.get("/appointments")
def get_appointments():
    db = SessionLocal()
    appointments = db.query(AppointmentModel).all()
    db.close()
    return appointments


@app.post("/appointments")
def add_appointment(appointment: AppointmentCreate):
    db = SessionLocal()

    new_appointment = AppointmentModel(
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        appointment_date=appointment.appointment_date,
        status=appointment.status
    )

    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    db.close()

    return {
        "message": "Appointment booked successfully",
        "data": new_appointment
    }
@app.put("/appointments/{appointment_id}")
def update_appointment_status(appointment_id: int, status: str):
    db = SessionLocal()

    appointment = db.query(AppointmentModel).filter(
        AppointmentModel.id == appointment_id
    ).first()

    if appointment is None:
        db.close()
        return {
            "message": "Appointment not found"
        }

    appointment.status = status
    db.commit()
    db.refresh(appointment)
    db.close()

    return {
        "message": "Appointment status updated successfully",
        "data": appointment
    }
@app.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: int):
    db = SessionLocal()

    appointment = db.query(AppointmentModel).filter(
        AppointmentModel.id == appointment_id
    ).first()

    if appointment is None:
        db.close()
        return {
            "message": "Appointment not found"
        }

    db.delete(appointment)
    db.commit()
    db.close()

    return {
        "message": "Appointment deleted successfully"
    }
@app.get("/doctors/{doctor_id}/appointments")
def get_doctor_appointments(doctor_id: int):
    db = SessionLocal()

    appointments = db.query(AppointmentModel).filter(
        AppointmentModel.doctor_id == doctor_id
    ).all()

    db.close()

    return appointments
@app.get("/patients/{patient_id}/appointments")
def get_patient_appointments(patient_id: int):
    db = SessionLocal()

    appointments = db.query(AppointmentModel).filter(
        AppointmentModel.patient_id == patient_id
    ).all()

    db.close()

    return appointments
@app.get("/dashboard/stats")
def get_dashboard_stats():
    db = SessionLocal()

    total_patients = db.query(PatientModel).count()
    total_doctors = db.query(DoctorModel).count()
    total_appointments = db.query(AppointmentModel).count()
    completed_appointments = db.query(AppointmentModel).filter(
        AppointmentModel.status == "completed"
    ).count()

    db.close()

    return {
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "completed_appointments": completed_appointments
    }