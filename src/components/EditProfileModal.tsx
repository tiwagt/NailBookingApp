import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase'; 
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2'; // Import SweetAlert2 for confirmation dialog

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any; // Adjust the type as needed
}



const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userData }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState(userData?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePic, setProfilePic] = useState(userData?.profileUrl || '');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || '');
      setEmail(userData?.email || '');
      setPhoneNumber(userData.phoneNumber || '');
      setProfilePic(userData.profileUrl || '');
    }
  }, [userData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${userData.userId}`);

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload profile picture. Please try again.');
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check if userData and userData.uid are defined
    if (!userData || !userData.userId) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "User data is not available. Please try again.",
      });
      return;
    }
  
    try {
      const photoURL = await handleUpload();
  
      await updateDoc(doc(db, "users", userData.userId), {
        displayName,
        profileUrl: photoURL, // Update profileUrl field in Firestore
        email,
        phoneNumber,
        //...(photoURL && { photoURL }),
      });
  
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
      });
  
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile. Please try again.",
      });
    }
  };
  
  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <div className="mb-4">
          <img
            src={profilePic || " https://via.placeholder.com/100" } 
            alt="Profile"
            className="h-24 w-24 rounded-full mb-2 cursor-pointer"
            onClick={() => document.getElementById('fileInput')?.click()}
          />
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="border rounded w-full px-3 py-2"
            
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded w-full px-3 py-2"
              
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border rounded w-full px-3 py-2"
              
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-[#028a88] text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-[#ec4c9c] text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
