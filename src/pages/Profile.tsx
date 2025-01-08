import { useEffect, useState } from 'react';
import { FaEnvelope, FaPhone, FaComments, FaEdit, FaBell, FaChevronLeft, FaChevronRight, FaSignOutAlt, FaWhatsapp } from 'react-icons/fa'; // Import icons from react-icons
import { useNavigate } from 'react-router-dom'; 
import 'react-calendar/dist/Calendar.css'; 
import { useAuth} from '../contexts/AuthContext';
import { db } from '../lib/firebase'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import EditProfileModal from '../components/EditProfileModal'; 
import { getUpcomingAppointments, getServices } from '../services/bookings'; 
import { BookingDetails } from '../types/index'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Swal from 'sweetalert2'; 
import { listenToAppointments } from '../utils/firebaseUtils';
import { getPastAppointments } from '../services/bookings'; 
import { getSpecialOffers, SpecialOffer } from '../services/offers'; 


export function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); 
  const loyaltyPoints = 3; 
  const maxPoints = 30; 
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]); 
  const [services, setServices] = useState<any[]>([]); 
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [enrichedPastAppointments, setEnrichedPastAppointments] = useState<BookingDetails[]>([]);
  const [sorteCriteria, setSorteCriteria] = useState<string>('date'); 

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
   
    const fetchServices = async () => {
      const servicesData = await getServices(); // Fetch services from the database
      setServices(servicesData);
    };

    //fetchUpcomingAppointments();
    fetchServices();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = listenToAppointments((updatedAppointments: BookingDetails[]) => {
        const userAppointments = updatedAppointments.filter(
          (appointment) => appointment.status === 'pending' || appointment.status === 'confirmed'
        );
        setUpcomingAppointments(userAppointments);
      });
  
      // Cleanup listener on unmount
      return () => unsubscribe();
    }
  }, [currentUser]);

  
  useEffect(() => {
    const fetchAndEnrichAppointments = async () => {
      if (currentUser) {
        const appointments = await getPastAppointments(currentUser.uid); // Fetch past appointments for the current user
    
        // Enrich appointments with service names
        const enriched = await enrichAppointmentsWithServiceNames(appointments);
        setEnrichedPastAppointments(enriched); // Update state with enriched appointments
      }
    };

    fetchAndEnrichAppointments();
  }, [currentUser]);

  const enrichAppointmentsWithServiceNames = async (appointments: BookingDetails[]) => {
    return Promise.all(
      appointments.map(async (appointment) => {
        if (appointment.service) {
          try {
            const serviceDoc = await getDoc(doc(db, "Services", appointment.service));
            const serviceName = serviceDoc.exists() ? serviceDoc.data().name : "Unknown Service";
            return { ...appointment, serviceName };
          } catch (error) {
            console.error(`Error fetching service for ID ${appointment.service}:`, error);
            return { ...appointment, serviceName: "Unknown Service" };
          }
        }
        return { ...appointment, serviceName: "Unknown Service" };
      })
    );
  };

  // Sort the enriched appointments by createdAt
  const sortedPastAppointments = [...enrichedPastAppointments].sort((a, b) => {
    if (sorteCriteria === 'date') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0; // Default to 0 if undefined
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0; 
      return dateB - dateA; // Sort in descending order
    } else if (sorteCriteria === 'serviceType') {
      return a.serviceName.localeCompare(b.serviceName);
    }
    return 0;
  });

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      const offers = await getSpecialOffers(); // Fetch special offers from the database
      setSpecialOffers(offers); // Update state with fetched offers
    };

    fetchSpecialOffers();
  }, []);

  
  const [value, setValue] = useState<Date | null>(new Date()); // State to manage selected date
  const [selectedAppointments, setSelectedAppointments] = useState<any[]>([]); // Change to BookingDetails[]


  const handleRedeemPoints = () => {
    // Logic to redeem points for discounts
    alert('Points redeemed for discounts!');
  };


  const handleCancel = async (id: string) => {
    // Display a confirmation dialog using SweetAlert2
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to cancel this appointment`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
      customClass: {
        confirmButton: "custom-confirm-button", // Class for the confirm button
        cancelButton: "custom-cancel-button", // Class for the cancel button
      },
      buttonsStyling: true, 
    });

    if (!isConfirmed) return; 

    try {
      // Reference the document in Firestore
      const appointmentRef = doc(db, "bookings", id);

      // Update the status field to "canceled"
      await updateDoc(appointmentRef, {
        status: "canceled",
      });

      // Display success message using toast
      toast.success(`Appointment with ID ${id} canceled successfully.`);

      // Update the UI by removing the canceled appointment
      setUpcomingAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      // Handle errors gracefully
      console.error("Error canceling appointment:", error);
      toast.error("There was an error canceling the appointment. Please try again.");
    }
  }

  const handleReschedule = async (appointment: BookingDetails) => {
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const currentTime = today.toTimeString().slice(0, 5); // Format as HH:mm
  
    // Show SweetAlert2 popup with fields for date and time
    const { value: formValues } = await Swal.fire({
      title: "Reschedule Appointment",
      html: `
        <div style="display: grid; gap: 10px; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <label for="newDate" style="width: 100px;">New Date:</label>
            <input 
              type="date" 
              id="newDate" 
              class="swal2-input" 
              value="${appointment.date}" 
              min="${currentDate}" 
              required 
            />
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <label for="newTime" style="width: 100px;">New Time:</label>
            <input 
              type="time" 
              id="newTime" 
              class="swal2-input" 
              value="${appointment.time}" 
              min="${appointment.date === currentDate ? currentTime : ""}" 
              required 
            />
          </div>
        </div>
      `,
      showCancelButton: true, 
      confirmButtonText: "Reschedule",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "custom-confirm-button", 
        cancelButton: "custom-cancel-button",
      },
      buttonsStyling: true, // Enables custom button styling
      focusConfirm: false,
      preConfirm: () => {
        const newDate = (document.getElementById("newDate") as HTMLInputElement)?.value;
        const newTime = (document.getElementById("newTime") as HTMLInputElement)?.value;
  
        if (!newDate || !newTime) {
          Swal.showValidationMessage("Both date and time are required!");
          return null;
        }
  
        if (newDate === currentDate && newTime < currentTime) {
          Swal.showValidationMessage("Selected time has already passed!");
          return null;
        }
  
        return { newDate, newTime };
      },
    });
  
    if (!formValues) {
      // User canceled or closed the modal
      return;
    }
  
    const { newDate, newTime } = formValues;
  
    try {
      // Firestore document reference
      const appointmentRef = doc(db, "bookings", appointment.id ?? "");
  
      // Update Firestore document
      await updateDoc(appointmentRef, {
        date: newDate,
        time: newTime,
      });
  
      Swal.fire("Success", "Appointment rescheduled successfully!", "success");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      Swal.fire("Error", "Failed to reschedule appointment. Please try again.", "error");
    }
  };
  
  

  const { logout } = useAuth(); // Destructure logout and currentUser from the context
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from the AuthContext
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed:', error); 
      alert('Logout failed. Please try again.'); 
    }
  };

  
  // Notification counts
  const upcomingCount = upcomingAppointments.length; // Count of upcoming appointments
  

   // Open the Edit profile modal
  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  //handle whatsapp messages
  const whatsappNumber = '698400352';
  const waMessage = () => {
    const message = "Hello! How can we help..."; // pre-filled message
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank'); // Open in a new tab
  };

  // Create a mapping of serviceId to service details
  const serviceMap = services.reduce((acc: { [key: string]: any }, service: any) => {
    acc[service.serviceId] = service; 
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f5fef9]">
      {/* ToastContainer to  component */}
      <ToastContainer />
      {/* Sidebar with Glass Effect */}
      <div
        className={`bg-[#ffffff] bg-opacity-10 backdrop-blur-lg shadow-lg rounded-lg p-4 transition-transform duration-300 ${
          isSidebarOpen ? 'w-full lg:w-1/4' : 'w-16'
        } h-auto lg:h-full`}
      >
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mb-4">
          {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
        {isSidebarOpen &&  (
          <>
            <h2 className="text-xl font-bold mb-4 text-[#ec4c9c]">Profile</h2>
            <div className="flex items-center mb-4">
              <img
                src= { "https://via.placeholder.com/100"}
                alt="Profile"
                className="h-24 w-24 rounded-full mr-4 border-2 border-[#ec4c9c]"
              />
              <div>
                <h3 className="text-lg font-semibold text-[#ec4c9c]">{userData?.displayName}</h3>
                <p className="text-gray-600">{userData?.email}</p>
                <p className="text-gray-600">{userData?.phoneNumber}</p>
              </div>
            </div>

            {/* Loyalty Points Progress Bar */}
            <h3 className="text-lg font-bold mb-2 text-[#ec4c9c]">Loyalty Points</h3>
            <div className="relative mb-4">
              <p className="text-xs text-center mb-1">
                {loyaltyPoints} / {maxPoints} Points
              </p>
              <div className="h-2 bg-[#028a88] rounded-full">
                <div
                  className="h-full bg-[#ec4c9c] rounded-full"
                  style={{ width: `${(loyaltyPoints / maxPoints) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-gray-700">
              Earn points with every service! Redeem them for discounts on future visits.
            </p>

            {/* Total Loyalty Points and Redeem Button */}
            <div className="mt-4">
              <h3 className="text-lg font-bold text-[#ec4c9c]">Total Loyalty Points</h3>
              <p className="text-xl font-semibold text-gray-800">{loyaltyPoints} Points</p>
              <button
                onClick={handleRedeemPoints}
                className="mt-2 w-full p-2 bg-[#028a88] text-white rounded-lg hover:bg-[#e591c5]"
              >
                Redeem Points for Discounts
              </button>
            </div>

            {/* Quick Action Buttons */}
            <h3 className="text-lg font-bold mb-2 text-[#ec4c9c] mt-4">Quick Actions</h3>
            <div className="flex space-x-4">
              <button title="Edit Profile" onClick={handleEditProfile} className="p-2 rounded-full bg-[#028a88] text-white hover:bg-[#e591c5]">
                <FaEdit />
              </button>
              <button title="Send Message" onClick={waMessage} className="p-2 rounded-full bg-[#028a88] text-white hover:bg-[#e591c5]">
                <FaWhatsapp />
              </button>
             {/* <button title="Call" className="p-2 rounded-full bg-[#028a88] text-white hover:bg-[#e591c5]">
                <FaPhone />
              </button>
              <button title="Comments" className="p-2 rounded-full bg-[#028a88] text-white hover:bg-[#e591c5]">
                <FaComments />
              </button>*/}
            </div>

            {/* Logout Button */}
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded-full bg-[#ec4c9c] text-white hover:bg-red-600 w-full"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>

            {/* Notification Icon and Count */}
            <div className="flex items-center mt-4">
              <FaBell className="text-[#ec4c9c]" />
              <span className="ml-2 text-gray-600">
                {upcomingCount} Upcoming Appointments
              </span>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-6 ${
          isSidebarOpen ? 'ml-0' : 'ml-16'
        } transition-all duration-300`}
      >
        {/* Center Column: Appointments */}
        <h2 className="text-xl font-bold mb-4 text-[#ec4c9c]">Upcoming Appointments</h2>
        <div className="space-y-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        
         {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment, index) => {
            
              const serviceId = appointment.service;

              // Retrieve the service details from the serviceMap
              const service = serviceMap[serviceId];

              // Generate a fallback ID
              const appointmentKey = appointment.id || `${appointment.date}-${appointment.time}-${index}`;
            return (
              <div key={`${appointment.id}-${appointment.date}-${appointment.time}`} className="bg-[#ffffff] shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#ec4c9c]">Date: {appointment.date}</h3>
                <p className="text-gray-600">Time: {appointment.time}</p>
                
                    Services:
                      {service ? (
                        <div className="mt-2">
                          <img
                            src={service.imageUrl}
                            alt={service.name}
                            className="w-16 h-16 rounded"
                          />
                          <p>{service.name} - ${service.price}</p>
                          <p>{service.description}</p>
                          <p>Duration: {service.duration} minutes</p>
                          <p>Status: {appointment.status}</p>
                        </div>
                      ) : (
                        "Unknown Service"
                      )}
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleReschedule(appointment)} // Pass the entire appointment object
                    className="flex-1 p-2 bg-[#028a88] text-white rounded-lg hover:bg-[#e591c5]"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(appointment.bookingId || appointmentKey)} // Use non-null assertion since id is optional
                    className="flex-1 p-2 bg-[#ec4c9c] text-white rounded-lg hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </div>

        
        <div className="mt-4">
          
          {selectedAppointments.length > 0 ? (
            <ul className="list-disc pl-5">
              {selectedAppointments.map((appointment, index) => (
                <li key={index} className="text-gray-600">
                {appointment.name} - ${appointment.price} - Status: {appointment.status} - Completed on {appointment.completionDate}
              </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600"></p>
          )}
        </div>
      </div>

      {/* Right Column: Booking History */}
      <div className="w-full lg:w-1/4 p-6 bg-[#ffffff] bg-opacity-10 backdrop-blur-lg shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-[#ec4c9c]">Booking History</h2>
        
        {/* Sort Options */}
        <div className="mb-4">
          <label htmlFor="sorteCriteria" className="text-gray-700">Sort by:</label>
          <select
            id="sorteCriteria"
            value={sorteCriteria}
            onChange={(e) => setSorteCriteria(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            <option value="date">Date</option>
            <option value="serviceType">Service Name</option>
          </select>
        </div>

        <div className="h-64 bg-[#e2e7eb] rounded-lg p-4 overflow-y-auto">
          <ul className="list-disc pl-5">
            {sortedPastAppointments.map((appointment, index) => (
              <li key={index} className="text-gray-600">
                {appointment.serviceName} - booked on {appointment.date} was {appointment.status}
              </li>
            ))}
          </ul>
        </div>

        {/* Special Offers Section */}
        <h2 className="text-xl font-bold mb-4 text-[#ec4c9c] mt-6">Special Offers</h2>
        <ul className="list-disc pl-5">
          {specialOffers.map((offer) => (
            <li key={offer.id} className="text-gray-600">
              {offer.description} - Requires {offer.pointsRequired} Points
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={userData}
      />
    </div>
  );
} 