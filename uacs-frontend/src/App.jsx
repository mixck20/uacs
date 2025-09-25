import React, { useEffect, useState } from "react";
import { PatientsAPI, InventoryAPI, AppointmentsAPI } from "./api";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ClinicDashboard from "./components/ClinicDashboard";
import Patients from "./components/Patients";
import Inventory from "./components/Inventory";
import Appointment from "./components/Appointment";
import Email from "./components/Email";
import EHR from "./components/EHR";

function App() {
  const [authPage, setAuthPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [patients, setPatients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => {
    // Clear stored tokens and user data
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setIsLoggedIn(false);
    setAuthPage("login");
    setActivePage("dashboard");
    setPatients([]);
    setInventory([]);
    setAppointments([]);
  };

  // Persist auth across refresh by checking stored token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      }
    } catch {}
  }, []);

  // Preload data for dashboard counts when logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    (async () => {
      try {
        const [p, i, a] = await Promise.allSettled([
          PatientsAPI.list().catch(() => []),
          InventoryAPI.list().catch(() => []),
          AppointmentsAPI.list().catch(() => []),
        ]);
        if (cancelled) return;
        if (p.status === 'fulfilled') setPatients(p.value);
        if (i.status === 'fulfilled') setInventory(i.value.map(it => ({
          id: it._id,
          name: it.name,
          quantity: it.quantity,
          expiry: it.expiryDate ? it.expiryDate.substring(0,10) : "",
          category: it.category || 'Medicine',
        })));
        if (a.status === 'fulfilled') setAppointments(a.value.map(d => ({
          id: d._id,
          patientName: d.requester?.name || 'N/A',
          appointmentType: 'Consultation',
          date: d.preferredDate ? new Date(d.preferredDate).toISOString().slice(0,10) : new Date().toISOString().slice(0,10),
          time: '09:00',
          reason: d.concern,
          status: (d.status || 'pending').charAt(0).toUpperCase() + (d.status || 'pending').slice(1),
        })));
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return authPage === "login" ? (
      <Login onSwitch={() => setAuthPage("signup")} onLogin={handleLoginSuccess} />
    ) : (
      <Signup onSwitch={() => setAuthPage("login")} onLogin={handleLoginSuccess} />
    );
  }

  const commonProps = {
    setActivePage,
    activePage,
    sidebarOpen,
    setSidebarOpen,
    onLogout: handleLogout
  };

  if (activePage === "dashboard") {
    return (
      <ClinicDashboard
        {...commonProps}
        patients={patients}
        inventory={inventory}
        appointments={appointments}
      />
    );
  } else if (activePage === "patients") {
    return (
      <Patients
        {...commonProps}
        patients={patients}
        setPatients={setPatients}
      />
    );
  } else if (activePage === "ehr") {
    return (
      <EHR
        {...commonProps}
        patients={patients}
        setPatients={setPatients}
      />
    );
  } else if (activePage === "inventory") {
    return (
      <Inventory
        {...commonProps}
        inventory={inventory}
        setInventory={setInventory}
      />
    );
  } else if (activePage === "appointment") {
    return (
      <Appointment
        {...commonProps}
        patients={patients}
        appointments={appointments}
        setAppointments={setAppointments}
      />
    );
  } else if (activePage === "email") {
    return (
      <Email
        {...commonProps}
        patients={patients}
        appointments={appointments}
        inventory={inventory}
      />
    );
  }

  return <ClinicDashboard {...commonProps} />;
}

export default App;
