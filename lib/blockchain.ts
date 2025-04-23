"use client"

import { ethers } from "ethers"
import MedicalRecordsABI from "./MedicalRecordsABI"

// Contract address would be set after deployment
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

// Create a global state to persist data between page refreshes
// This simulates a database in our demo application
const globalState = {
  patients: [
    {
      id: "1",
      name: "John Smith",
      dateOfBirth: "1985-05-15",
      gender: "Male",
      contactInfo: "john.smith@email.com",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      dateOfBirth: "1990-08-22",
      gender: "Female",
      contactInfo: "sarah.j@email.com",
      walletAddress: "0x2345678901abcdef2345678901abcdef23456789",
    },
  ],
  doctors: [
    {
      id: "1",
      name: "Dr. Michael Chen",
      specialization: "Cardiology",
      licenseNumber: "MED12345",
      walletAddress: "0x3456789012abcdef3456789012abcdef34567890",
    },
    {
      id: "2",
      name: "Dr. Emily Williams",
      specialization: "Neurology",
      licenseNumber: "MED67890",
      walletAddress: "0x4567890123abcdef4567890123abcdef45678901",
    },
    {
      id: "3",
      name: "Dr. Robert Garcia",
      specialization: "Pediatrics",
      licenseNumber: "MED54321",
      walletAddress: "0x5678901234abcdef5678901234abcdef56789012",
    },
  ],
  medicalRecords: [
    {
      id: "1",
      patientId: "1",
      doctorId: "1",
      title: "Annual Checkup",
      description: "Regular annual physical examination. Blood pressure normal, heart rate 72 bpm.",
      fileHash: "QmT7fzZ6zS9YZxMFSYfhES5xKCE2oSJwLuEJgAG9mPXdK",
      fileType: "pdf",
      timestamp: "2023-04-15T10:30:00Z",
    },
    {
      id: "2",
      patientId: "1",
      doctorId: "2",
      title: "MRI Results",
      description: "Brain MRI scan results. No abnormalities detected.",
      fileHash: "QmUyF8jGZxMKdEJqHkx5NvwTYP8MQQcXkgN6hTuZnzKmtP",
      fileType: "dicom",
      timestamp: "2023-05-22T14:15:00Z",
    },
    {
      id: "3",
      patientId: "2",
      doctorId: "3",
      title: "Vaccination Record",
      description: "COVID-19 vaccination. Second dose of Pfizer-BioNTech.",
      fileHash: "QmR7YzxMFSYfhES5xKCE2oSJwLuEJgAG9mPXdKT7fzZ6z",
      fileType: "pdf",
      timestamp: "2023-03-10T09:45:00Z",
    },
  ],
  appointments: [
    {
      id: "1",
      patientId: "1",
      doctorId: "1",
      timestamp: "2023-06-15T10:00:00Z",
      reason: "Follow-up on medication",
      status: "Confirmed",
    },
    {
      id: "2",
      patientId: "2",
      doctorId: "3",
      timestamp: "2023-06-16T14:30:00Z",
      reason: "Annual checkup",
      status: "Confirmed",
    },
    {
      id: "3",
      patientId: "1",
      doctorId: "2",
      timestamp: "2023-06-20T11:15:00Z",
      reason: "Headache consultation",
      status: "Pending",
    },
  ],
  permissions: {
    "1": {
      "1": true, // Patient 1 has given permission to Doctor 1
      "2": true, // Patient 1 has given permission to Doctor 2
    },
    "2": {
      "3": true, // Patient 2 has given permission to Doctor 3
    },
  },
  permissionLogs: [
    {
      patientId: "1",
      doctorId: "1",
      doctorName: "Dr. Michael Chen",
      granted: true,
      timestamp: new Date().toISOString(),
    },
    {
      patientId: "1",
      doctorId: "2",
      doctorName: "Dr. Emily Williams",
      granted: false,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  registeredUsers: {
    // This will store newly registered users
  },
  nextId: {
    patient: 3,
    doctor: 4,
    record: 4,
    appointment: 4,
  },
}

// Connect to wallet
export const connectWallet = async () => {
  try {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed. Please install MetaMask to use this application.")
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    return accounts[0]
  } catch (error) {
    console.error("Error connecting to wallet:", error)
    throw error
  }
}

// Get contract instance
const getContract = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    return new ethers.Contract(CONTRACT_ADDRESS, MedicalRecordsABI, signer)
  } catch (error) {
    console.error("Error getting contract:", error)
    throw error
  }
}

// Helper function to find patient by wallet address
const findPatientByAddress = (address) => {
  return globalState.patients.find((p) => p.walletAddress.toLowerCase() === address.toLowerCase())
}

// Helper function to find doctor by wallet address
const findDoctorByAddress = (address) => {
  return globalState.doctors.find((d) => d.walletAddress.toLowerCase() === address.toLowerCase())
}

// Register patient
export const registerPatient = async (patientData) => {
  try {
    console.log("Registering patient:", patientData)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add patient to our global state
    const newPatientId = globalState.nextId.patient.toString()
    globalState.nextId.patient++

    const newPatient = {
      id: newPatientId,
      name: patientData.name,
      dateOfBirth: patientData.dateOfBirth,
      gender: patientData.gender,
      contactInfo: patientData.contactInfo,
      walletAddress: patientData.walletAddress,
    }

    globalState.patients.push(newPatient)

    // Store in registered users for login
    globalState.registeredUsers[patientData.walletAddress.toLowerCase()] = {
      role: "patient",
      name: patientData.name,
      id: newPatientId,
    }

    return { success: true, patientId: newPatientId }
  } catch (error) {
    console.error("Error registering patient:", error)
    throw error
  }
}

// Register doctor
export const registerDoctor = async (doctorData) => {
  try {
    console.log("Registering doctor:", doctorData)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Add doctor to our global state
    const newDoctorId = globalState.nextId.doctor.toString()
    globalState.nextId.doctor++

    const newDoctor = {
      id: newDoctorId,
      name: doctorData.name,
      specialization: doctorData.specialization,
      licenseNumber: doctorData.licenseNumber,
      contactInfo: doctorData.contactInfo,
      walletAddress: doctorData.walletAddress,
    }

    globalState.doctors.push(newDoctor)

    // Store in registered users for login
    globalState.registeredUsers[doctorData.walletAddress.toLowerCase()] = {
      role: "doctor",
      name: doctorData.name,
      id: newDoctorId,
    }

    return { success: true, doctorId: newDoctorId }
  } catch (error) {
    console.error("Error registering doctor:", error)
    throw error
  }
}

// Get patient data
export const getPatientData = async (address) => {
  try {
    console.log("Getting patient data for:", address)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find patient by address
    const patient = findPatientByAddress(address)

    if (!patient) {
      return null
    }

    // Get patient records and appointments
    const patientRecords = globalState.medicalRecords.filter((record) => record.patientId === patient.id)
    const patientAppointments = globalState.appointments.filter((appointment) => appointment.patientId === patient.id)

    return {
      patient,
      records: patientRecords,
      appointments: patientAppointments,
    }
  } catch (error) {
    console.error("Error getting patient data:", error)
    throw error
  }
}

// Get doctor data
export const getDoctorData = async (address) => {
  try {
    console.log("Getting doctor data for:", address)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find doctor by address
    const doctor = findDoctorByAddress(address)

    if (!doctor) {
      return null
    }

    // Get doctor appointments
    const doctorAppointments = globalState.appointments.filter((appointment) => appointment.doctorId === doctor.id)

    return {
      doctor,
      appointments: doctorAppointments,
    }
  } catch (error) {
    console.error("Error getting doctor data:", error)
    throw error
  }
}

// Book appointment
export const bookAppointment = async (appointmentData) => {
  try {
    console.log("Booking appointment:", appointmentData)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Get patient and doctor
    const patientAddress = localStorage.getItem("userAddress")
    const patient = findPatientByAddress(patientAddress)

    // Find doctor by wallet address
    const doctor = globalState.doctors.find(
      (d) => d.walletAddress.toLowerCase() === appointmentData.doctor.toLowerCase(),
    )

    if (!patient || !doctor) {
      throw new Error("Patient or doctor not found")
    }

    // Create new appointment
    const newAppointmentId = globalState.nextId.appointment.toString()
    globalState.nextId.appointment++

    const newAppointment = {
      id: newAppointmentId,
      patientId: patient.id,
      doctorId: doctor.id,
      timestamp: appointmentData.timestamp,
      reason: appointmentData.reason,
      status: "Pending",
    }

    // Add to global state
    globalState.appointments.push(newAppointment)

    return {
      success: true,
      appointmentId: newAppointmentId,
    }
  } catch (error) {
    console.error("Error booking appointment:", error)
    throw error
  }
}

// Update appointment status
export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    console.log("Updating appointment status:", appointmentId, status)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find and update appointment
    const appointmentIndex = globalState.appointments.findIndex((a) => a.id === appointmentId)

    if (appointmentIndex !== -1) {
      globalState.appointments[appointmentIndex].status = status
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating appointment status:", error)
    throw error
  }
}

// Add medical record
export const addMedicalRecord = async (recordData) => {
  try {
    console.log("Adding medical record:", recordData)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Get patient and current user (doctor or patient)
    const userAddress = localStorage.getItem("userAddress")
    const userRole = localStorage.getItem("userRole")

    let patient, doctor

    if (userRole === "patient") {
      patient = findPatientByAddress(userAddress)
      doctor = { id: "0" } // Self-uploaded
    } else if (userRole === "doctor") {
      doctor = findDoctorByAddress(userAddress)
      patient = findPatientByAddress(recordData.patientAddress)
    }

    if (!patient) {
      throw new Error("Patient not found")
    }

    // Create new record
    const newRecordId = globalState.nextId.record.toString()
    globalState.nextId.record++

    const newRecord = {
      id: newRecordId,
      patientId: patient.id,
      doctorId: doctor.id,
      title: recordData.title,
      description: recordData.description,
      fileHash: recordData.fileHash,
      fileType: recordData.fileType,
      timestamp: new Date().toISOString(),
    }

    // Add to global state
    globalState.medicalRecords.push(newRecord)

    return {
      success: true,
      recordId: newRecordId,
    }
  } catch (error) {
    console.error("Error adding medical record:", error)
    throw error
  }
}

// Update medical record
export const updateMedicalRecord = async (recordId, recordData) => {
  try {
    console.log("Updating medical record:", recordId, recordData)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Find and update record
    const recordIndex = globalState.medicalRecords.findIndex((r) => r.id === recordId)

    if (recordIndex !== -1) {
      const record = globalState.medicalRecords[recordIndex]

      globalState.medicalRecords[recordIndex] = {
        ...record,
        title: recordData.title,
        description: recordData.description,
        fileHash: recordData.fileHash,
        fileType: recordData.fileType,
        timestamp: new Date().toISOString(),
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating medical record:", error)
    throw error
  }
}

// Get medical record
export const getMedicalRecord = async (recordId) => {
  try {
    console.log("Getting medical record:", recordId)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Find record
    const record = globalState.medicalRecords.find((r) => r.id === recordId)

    if (!record) {
      throw new Error("Record not found")
    }

    return record
  } catch (error) {
    console.error("Error getting medical record:", error)
    throw error
  }
}

// Grant permission to doctor
export const grantPermission = async (patientAddress, doctorAddress) => {
  try {
    console.log("Granting permission:", patientAddress, doctorAddress)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find patient and doctor
    const patient = findPatientByAddress(patientAddress)
    const doctor = findDoctorByAddress(doctorAddress)

    if (!patient || !doctor) {
      throw new Error("Patient or doctor not found")
    }

    // Update permissions
    if (!globalState.permissions[patient.id]) {
      globalState.permissions[patient.id] = {}
    }

    globalState.permissions[patient.id][doctor.id] = true

    // Add to permission logs
    globalState.permissionLogs.unshift({
      patientId: patient.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      granted: true,
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error granting permission:", error)
    throw error
  }
}

// Revoke permission from doctor
export const revokePermission = async (patientAddress, doctorAddress) => {
  try {
    console.log("Revoking permission:", patientAddress, doctorAddress)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find patient and doctor
    const patient = findPatientByAddress(patientAddress)
    const doctor = findDoctorByAddress(doctorAddress)

    if (!patient || !doctor) {
      throw new Error("Patient or doctor not found")
    }

    // Update permissions
    if (globalState.permissions[patient.id] && globalState.permissions[patient.id][doctor.id]) {
      globalState.permissions[patient.id][doctor.id] = false
    }

    // Add to permission logs
    globalState.permissionLogs.unshift({
      patientId: patient.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      granted: false,
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error revoking permission:", error)
    throw error
  }
}

// Check if doctor has permission
export const checkPermission = async (patientAddress, doctorAddress) => {
  try {
    console.log("Checking permission:", patientAddress, doctorAddress)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find patient and doctor
    const patient = findPatientByAddress(patientAddress)
    const doctor = findDoctorByAddress(doctorAddress)

    if (!patient || !doctor) {
      return false
    }

    // Check permissions
    return globalState.permissions[patient.id]?.[doctor.id] || false
  } catch (error) {
    console.error("Error checking permission:", error)
    throw error
  }
}

// Get all doctors
export const getAllDoctors = async () => {
  try {
    console.log("Getting all doctors")

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return globalState.doctors
  } catch (error) {
    console.error("Error getting all doctors:", error)
    throw error
  }
}

// Get all patient records
export const getPatientRecords = async (patientAddress) => {
  try {
    console.log("Getting patient records for:", patientAddress)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    // Find patient
    const patient = findPatientByAddress(patientAddress)

    if (!patient) {
      return []
    }

    // Get patient records
    return globalState.medicalRecords.filter((record) => record.patientId === patient.id)
  } catch (error) {
    console.error("Error getting patient records:", error)
    throw error
  }
}

// Get permission logs for a patient
export const getPermissionLogs = async (patientAddress) => {
  try {
    console.log("Getting permission logs for:", patientAddress)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Find patient
    const patient = findPatientByAddress(patientAddress)

    if (!patient) {
      return []
    }

    // Get permission logs for this patient
    return globalState.permissionLogs.filter((log) => log.patientId === patient.id)
  } catch (error) {
    console.error("Error getting permission logs:", error)
    throw error
  }
}

// Check if a wallet address is registered
export const checkRegistration = async (address) => {
  try {
    console.log("Checking registration for:", address)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if address is in our mock database
    const patient = findPatientByAddress(address)
    const doctor = findDoctorByAddress(address)
    const registeredUser = globalState.registeredUsers[address.toLowerCase()]

    if (patient) {
      return { isRegistered: true, role: "patient", name: patient.name, id: patient.id }
    } else if (doctor) {
      return { isRegistered: true, role: "doctor", name: doctor.name, id: doctor.id }
    } else if (registeredUser) {
      return { isRegistered: true, ...registeredUser }
    }

    return { isRegistered: false }
  } catch (error) {
    console.error("Error checking registration:", error)
    throw error
  }
}

// The following functions are kept for compatibility but are not used in the EHR system
export const registerVoter = async () => ({ success: true })
export const checkVoterStatus = async () => ({ hasVoted: false })
export const getElectionData = async () => ({ positions: [] })
export const castVote = async () => ({ success: true })
export const getElectionResults = async () => ({ positions: [] })
export const getAdminData = async () => ({ totalVoters: 0, registeredVoters: 0, votesCount: 0 })
export const createElection = async () => ({ success: true })
export const addCandidate = async () => ({ success: true })
export const removeCandidate = async () => ({ success: true })
export const startElection = async () => ({ success: true })
export const endElection = async () => ({ success: true })
export const verifyStudentEligibility = async () => ({ eligible: true })
export const getVotingCategories = async () => []
export const addVotingCategory = async () => ({ success: true })
export const removeVotingCategory = async () => ({ success: true })
