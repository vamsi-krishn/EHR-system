// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Medical Records System
 * @dev Smart contract for managing electronic health records with patient consent
 */
contract MedicalRecords {
    // Appointment status enum
    enum AppointmentStatus { Pending, Confirmed, Completed, Cancelled }
    
    // Medical Record struct
    struct MedicalRecord {
        uint256 id;
        address patient;
        address doctor;
        string title;
        string description;
        string fileHash;
        string fileType;
        uint256 timestamp;
    }
    
    // Patient struct
    struct Patient {
        string name;
        uint256 dateOfBirth;
        string gender;
        string contactInfo;
        bool isRegistered;
        uint256[] recordIds;
        uint256[] appointmentIds;
    }
    
    // Doctor struct
    struct Doctor {
        string name;
        string specialization;
        string licenseNumber;
        bool isRegistered;
        uint256[] appointmentIds;
    }
    
    // Appointment struct
    struct Appointment {
        uint256 id;
        address patient;
        address doctor;
        uint256 timestamp;
        string reason;
        AppointmentStatus status;
    }
    
    // Contract state variables
    mapping(address => Patient) private patients;
    mapping(address => Doctor) private doctors;
    mapping(uint256 => MedicalRecord) private medicalRecords;
    mapping(uint256 => Appointment) private appointments;
    mapping(address => mapping(address => bool)) private permissions; // patient => doctor => permission
    
    uint256 private recordCount;
    uint256 private appointmentCount;
    
    // Events
    event PatientRegistered(address indexed patient, string name);
    event DoctorRegistered(address indexed doctor, string name, string specialization);
    event MedicalRecordAdded(uint256 indexed recordId, address indexed patient, address indexed doctor);
    event MedicalRecordUpdated(uint256 indexed recordId, address indexed patient, address indexed doctor);
    event AppointmentBooked(uint256 indexed appointmentId, address indexed patient, address indexed doctor, uint256 timestamp);
    event AppointmentStatusChanged(uint256 indexed appointmentId, AppointmentStatus status);
    event PermissionChanged(address indexed patient, address indexed doctor, bool granted);
    
    // Modifiers
    modifier onlyRegisteredPatient() {
        require(patients[msg.sender].isRegistered, "Only registered patients can call this function");
        _;
    }
    
    modifier onlyRegisteredDoctor() {
        require(doctors[msg.sender].isRegistered, "Only registered doctors can call this function");
        _;
    }
    
    modifier onlyPatientOrAuthorizedDoctor(address patientAddress) {
        require(
            msg.sender == patientAddress || 
            (doctors[msg.sender].isRegistered && permissions[patientAddress][msg.sender]),
            "Not authorized to access this patient's data"
        );
        _;
    }
    
    // Constructor
    constructor() {
        recordCount = 0;
        appointmentCount = 0;
    }
    
    /**
     * @dev Register a new patient
     * @param _name Name of the patient
     * @param _dateOfBirth Date of birth as a timestamp
     * @param _gender Gender of the patient
     * @param _contactInfo Contact information
     */
    function registerPatient(
        string memory _name,
        uint256 _dateOfBirth,
        string memory _gender,
        string memory _contactInfo
    ) public {
        require(!patients[msg.sender].isRegistered, "Patient already registered");
        
        patients[msg.sender] = Patient({
            name: _name,
            dateOfBirth: _dateOfBirth,
            gender: _gender,
            contactInfo: _contactInfo,
            isRegistered: true,
            recordIds: new uint256[](0),
            appointmentIds: new uint256[](0)
        });
        
        emit PatientRegistered(msg.sender, _name);
    }
    
    /**
     * @dev Register a new doctor
     * @param _name Name of the doctor
     * @param _specialization Medical specialization
     * @param _licenseNumber Medical license number
     */
    function registerDoctor(
        string memory _name,
        string memory _specialization,
        string memory _licenseNumber
    ) public {
        require(!doctors[msg.sender].isRegistered, "Doctor already registered");
        
        doctors[msg.sender] = Doctor({
            name: _name,
            specialization: _specialization,
            licenseNumber: _licenseNumber,
            isRegistered: true,
            appointmentIds: new uint256[](0)
        });
        
        emit DoctorRegistered(msg.sender, _name, _specialization);
    }
    
    /**
     * @dev Create a new medical record
     * @param _title Title of the record
     * @param _description Description of the record
     * @param _fileHash IPFS hash of the file
     * @param _fileType Type of the file
     * @param _patientAddress Address of the patient
     * @return ID of the created record
     */
    function createMedicalRecord(
        string memory _title,
        string memory _description,
        string memory _fileHash,
        string memory _fileType,
        address _patientAddress
    ) public onlyRegisteredDoctor onlyPatientOrAuthorizedDoctor(_patientAddress) returns (uint256) {
        recordCount++;
        
        medicalRecords[recordCount] = MedicalRecord({
            id: recordCount,
            patient: _patientAddress,
            doctor: msg.sender,
            title: _title,
            description: _description,
            fileHash: _fileHash,
            fileType: _fileType,
            timestamp: block.timestamp
        });
        
        patients[_patientAddress].recordIds.push(recordCount);
        
        emit MedicalRecordAdded(recordCount, _patientAddress, msg.sender);
        
        return recordCount;
    }
    
    /**
     * @dev Update an existing medical record
     * @param _recordId ID of the record to update
     * @param _title New title
     * @param _description New description
     * @param _fileHash New file hash
     * @param _fileType New file type
     */
    function updateMedicalRecord(
        uint256 _recordId,
        string memory _title,
        string memory _description,
        string memory _fileHash,
        string memory _fileType
    ) public onlyRegisteredDoctor {
        require(_recordId > 0 && _recordId <= recordCount, "Invalid record ID");
        
        MedicalRecord storage record = medicalRecords[_recordId];
        
        require(
            record.doctor == msg.sender || permissions[record.patient][msg.sender],
            "Not authorized to update this record"
        );
        
        record.title = _title;
        record.description = _description;
        record.fileHash = _fileHash;
        record.fileType = _fileType;
        record.timestamp = block.timestamp;
        
        emit MedicalRecordUpdated(_recordId, record.patient, msg.sender);
    }
    
    /**
     * @dev Book an appointment with a doctor
     * @param _doctor Address of the doctor
     * @param _timestamp Timestamp for the appointment
     * @param _reason Reason for the appointment
     * @return ID of the created appointment
     */
    function bookAppointment(
        address _doctor,
        uint256 _timestamp,
        string memory _reason
    ) public onlyRegisteredPatient returns (uint256) {
        require(doctors[_doctor].isRegistered, "Doctor not registered");
        require(_timestamp > block.timestamp, "Appointment time must be in the future");
        
        appointmentCount++;
        
        appointments[appointmentCount] = Appointment({
            id: appointmentCount,
            patient: msg.sender,
            doctor: _doctor,
            timestamp: _timestamp,
            reason: _reason,
            status: AppointmentStatus.Pending
        });
        
        patients[msg.sender].appointmentIds.push(appointmentCount);
        doctors[_doctor].appointmentIds.push(appointmentCount);
        
        emit AppointmentBooked(appointmentCount, msg.sender, _doctor, _timestamp);
        
        return appointmentCount;
    }
    
    /**
     * @dev Change the status of an appointment
     * @param _appointmentId ID of the appointment
     * @param _status New status
     */
    function changeAppointmentStatus(
        uint256 _appointmentId,
        AppointmentStatus _status
    ) public {
        require(_appointmentId > 0 && _appointmentId <= appointmentCount, "Invalid appointment ID");
        
        Appointment storage appointment = appointments[_appointmentId];
        
        require(
            msg.sender == appointment.doctor || msg.sender == appointment.patient,
            "Not authorized to change this appointment"
        );
        
        appointment.status = _status;
        
        emit AppointmentStatusChanged(_appointmentId, _status);
    }
    
    /**
     * @dev Grant or revoke permission for a doctor to access patient records
     * @param _doctor Address of the doctor
     * @param _granted True to grant permission, false to revoke
     */
    function changePermission(address _doctor, bool _granted) public onlyRegisteredPatient {
        require(doctors[_doctor].isRegistered, "Doctor not registered");
        
        permissions[msg.sender][_doctor] = _granted;
        
        emit PermissionChanged(msg.sender, _doctor, _granted);
    }
    
    /**
     * @dev Check if a doctor has permission to access a patient's records
     * @param _patient Address of the patient
     * @param _doctor Address of the doctor
     * @return True if the doctor has permission
     */
    function hasPermission(address _patient, address _doctor) public view returns (bool) {
        return permissions[_patient][_doctor];
    }
    
    /**
     * @dev Get patient details
     * @param _patient Address of the patient
     * @return Patient details
     */
    function getPatientDetails(address _patient) public view onlyPatientOrAuthorizedDoctor(_patient) returns (Patient memory) {
        return patients[_patient];
    }
    
    /**
     * @dev Get doctor details
     * @param _doctor Address of the doctor
     * @return Doctor details
     */
    function getDoctorDetails(address _doctor) public view returns (Doctor memory) {
        require(doctors[_doctor].isRegistered, "Doctor not registered");
        return doctors[_doctor];
    }
    
    /**
     * @dev Get medical record details
     * @param _recordId ID of the record
     * @return Medical record details
     */
    function getMedicalRecord(uint256 _recordId) public view returns (MedicalRecord memory) {
        require(_recordId > 0 && _recordId <= recordCount, "Invalid record ID");
        
        MedicalRecord memory record = medicalRecords[_recordId];
        
        require(
            msg.sender == record.patient || 
            msg.sender == record.doctor || 
            permissions[record.patient][msg.sender],
            "Not authorized to view this record"
        );
        
        return record;
    }
    
    /**
     * @dev Get appointment details
     * @param _appointmentId ID of the appointment
     * @return Appointment details
     */
    function getAppointment(uint256 _appointmentId) public view returns (Appointment memory) {
        require(_appointmentId > 0 && _appointmentId <= appointmentCount, "Invalid appointment ID");
        
        Appointment memory appointment = appointments[_appointmentId];
        
        require(
            msg.sender == appointment.patient || msg.sender == appointment.doctor,
            "Not authorized to view this appointment"
        );
        
        return appointment;
    }
    
    /**
     * @dev Get all records for a patient
     * @param _patient Address of the patient
     * @return Array of record IDs
     */
    function getPatientRecords(address _patient) public view onlyPatientOrAuthorizedDoctor(_patient) returns (uint256[] memory) {
        return patients[_patient].recordIds;
    }
    
    /**
     * @dev Get all appointments for a patient
     * @param _patient Address of the patient
     * @return Array of appointment IDs
     */
    function getPatientAppointments(address _patient) public view returns (uint256[] memory) {
        require(
            msg.sender == _patient || permissions[_patient][msg.sender],
            "Not authorized to view this patient's appointments"
        );
        
        return patients[_patient].appointmentIds;
    }
    
    /**
     * @dev Get all appointments for a doctor
     * @param _doctor Address of the doctor
     * @return Array of appointment IDs
     */
    function getDoctorAppointments(address _doctor) public view returns (uint256[] memory) {
        require(
            msg.sender == _doctor,
            "Not authorized to view this doctor's appointments"
        );
        
        return doctors[_doctor].appointmentIds;
    }
    
    /**
     * @dev Get the total number of medical records
     * @return Total number of records
     */
    function getMedicalRecordCount() public view returns (uint256) {
        return recordCount;
    }
    
    /**
     * @dev Get the total number of appointments
     * @return Total number of appointments
     */
    function getAppointmentCount() public view returns (uint256) {
        return appointmentCount;
    }
}
