import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

// Pending to add firstName and lastName editing

const Profile = () => {
 const [userDetails, setUserDetails] = useState({});
 const [updatedDetails, setUpdatedDetails] = useState({});
 const {firstName} = useAppContext();
 const [changed, setChanged] = useState("");
 const [toggleNewPasswordVisibility, setToggleNewPasswordVisibility] = useState(false);
 const [togglePasswordVisibility, setTogglePasswordVisibility] = useState(false);
 const [newPassword, setNewPassword] = useState("");
 const [toConfirm, setToConfirm] = useState("");

 const [editMode, setEditMode] = useState(false);
 const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = sessionStorage.getItem("auth-token");
    if (!authToken) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const authToken = sessionStorage.getItem("auth-token");
      if (!authToken) {
        navigate("/app/login");
        return;
      }
      
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/getUser`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const profileData = await response.json();
        setUserDetails(profileData);
        setUpdatedDetails(profileData);
      } else {
        throw new Error("Failed to fetch profile data");
      }
} catch (error) {
  console.error(error);
  // Handle error case
}
};

const handleChangePassword = async () => {
  debugger;
  console.log("Changing password");
};

const handleEdit = () => {
setEditMode(true);
};

const handleInputChange = (e) => {
setUpdatedDetails({
  ...updatedDetails,
  [e.target.name]: e.target.value,
});
};
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const authToken = sessionStorage.getItem("auth-token");
    const email = sessionStorage.getItem("email");

    if (!authToken || !email) {
      navigate("/app/login");
      return;
    }

    const payload = { ...updatedDetails };

    const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': `Bearer ${authToken}`,
        'email': email,
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      // Update the user details in session storage
      sessionStorage.setItem('name', updatedDetails.name);
      sessionStorage.setItem('email', updatedDetails.email);
      setUserDetails(updatedDetails);
      setEditMode(false);
      // Display success message to the user
      setChanged("Name Changed Successfully!");
      setTimeout(() => {
        setChanged("");
        navigate("/");
      }, 1000);

    } else {
      // Handle error case
      throw new Error("Failed to update profile with response status: " + response.status);
    }
  } catch (error) {
    console.error(error);
    // Handle error case
  }
};

return (
<div className="profile-container">
  {editMode ? (
<form onSubmit={handleSubmit}>
<label>
  Email
  <input
    type="email"
    name="email"
    value={userDetails.email}
    onChange={handleInputChange}
    className={`form-input ${passwordChangeMode ? "grey" : ""}`}
  />
</label>
<label>
   First Name
   <input
     type="text"
     name="name"
     value={updatedDetails.firstName}
     onChange={handleInputChange}
     className={`form-input ${passwordChangeMode ? "grey" : ""}`}
     disabled={passwordChangeMode}
   />
</label>
<label>
    Last Name
    <input
      type="text"
      name="lastName"
      value={updatedDetails.lastName}
      onChange={handleInputChange}
      className={`form-input ${passwordChangeMode ? "grey" : ""}`}
    />
</label>
{passwordChangeMode ? null : (
<label>
    <button onClick={() => setPasswordChangeMode(!passwordChangeMode)}>Change Password</button>
</label>
)}
    {passwordChangeMode ? (
<div className="password-change-section">
<h3>Change Password</h3>
<label>
  Current Password:
  <input type={togglePasswordVisibility ? "text" : "password" } name="currentPassword" className="form-input textInput" onChange={(e) => setToConfirm(e.target.value)}/><br></br>
</label>
  <input type="checkbox" onClick={() =>setTogglePasswordVisibility(!togglePasswordVisibility)}/> Show Password

<label>
  New Password:
  <input type={toggleNewPasswordVisibility ? "text" : "password" } name="newPassword" className="form-input textInput" onChange={(e) => setNewPassword(e.target.value)}/><br></br>
</label>
  <input type="checkbox" onClick={() => setToggleNewPasswordVisibility(!toggleNewPasswordVisibility)}/> Show Password
<br></br>
<button onClick={handleChangePassword}>Change Password</button><br></br>
<button onClick={() => setPasswordChangeMode(false)}>Cancel</button>
</div>
) : null}
{passwordChangeMode ? null : (
<button type="submit">Save</button>
  )}
</form>
) : (
<div className="profile-details">
<h1>Hi, {updatedDetails.firstName || ''}</h1>
<p> <b>Email:</b> {updatedDetails.email || ''}</p>
<button onClick={handleEdit}>Edit</button>
<span style={{color:'green',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{changed}</span>
</div>
)}
</div>
);
};

export default Profile;
