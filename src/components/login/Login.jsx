import { useState } from 'react';
import './login.css';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'; 
import upload from '../../lib/upload';

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading0, setLoading0] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const handlAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
    else{
      setAvatar({
        file:"/avatar.png",
        url: URL.createObjectURL("/avatar.png")
      })
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading0(true);
  
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
  
    try {
      // Check if the email exists in the Firestore database
      const userRef = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(userRef);
  
      if (querySnapshot.empty) {
        // If email is not found, show a warning
        alert('Incorrect email or password');
        setLoading0(false); // Stop the loading spinner
        return; // Exit the function early
      }
      
      // Proceed with signing in if email is found in Firestore
      console.log("Attempting to log in with email:", email);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      window.location.reload();
    } catch (err) {
      console.log("Login error:", err);
      alert('Email is not registered');
    } finally {
      setLoading0(false); // Stop the loading spinner after the process
    }
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading1(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    console.log(username, email, password);
    
    try {
      // Check if username already exists in Firestore
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If the username exists, show a toast and return early
        console.log("Username already exists");
        alert('Username already exists');
        return; // Prevent account creation
      }

      // Proceed with creating the user account
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      let imgUrl = "./avatar.png";
      // If avatar is provided, upload it
      if (avatar.file) {
        imgUrl = await upload(avatar.file);
      } 
      // Create user document in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      // Create user chat document in Firestore
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      alert("Account created! You can login now!");
    } catch (err) {
      console.log("Registration error:", err);
      toast.error(err.message);
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="login section">
      <div className="item">
        <h2>Welcome back</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading0}>{loading0 ? "Loading" : "Log In"}</button>
        </form>
      </div>

      <div className="separator"></div>

      <div className="item">
        <h2>Create an account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={avatar.url || "./avatar.png"}  // Default image if no avatar is uploaded
              alt="avatar"
              style={{
                height: '80px',
                width: '80px',
                borderRadius: '50%',
                marginBottom: '10px',
              }}
            />
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#ccc', marginTop: 0, marginBottom: '10px' }}>
              Upload an image (Required)
            </p>
            <input
              type="file"
              id="file"
              style={{ display: 'none' }}
              onChange={handlAvatar}
            />
          </label>
          <input type="text" placeholder="Username" name="username" required />
          <input type="email" placeholder="Email" name="email" required />
          <input type="password" placeholder="Password" name="password" required />
          <button disabled={loading1}>{loading1 ? "Loading..." : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
