import { arrayRemove, arrayUnion, doc, updateDoc,deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore.';
import { useState } from 'react';
import './detail.css';

const Detail = () => {
  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();

  // States to toggle the visibility of elements
  const hideStyle = { display: "none" };
  const hideStyle1 = { display: "block" };
  const [isHide, setHide] = useState(false);
  const [isHide1, setHide1] = useState(false);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);

  // Handle the Block/Unblock User action
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  // Handle deleting the user
  const handleDeleteAccount = async () => {
    try {
      // Delete the user data from Firestore (if stored)
      const userDocRef = doc(db, "users", currentUser.id);
      await deleteDoc(userDocRef); // Assuming user data is stored under 'users'

      // Delete the user from Firebase Authentication
      await auth.currentUser.delete();

      alert("Your account has been deleted successfully.");
      // Optionally, redirect to home or log the user out
      // Redirect example: navigate('/');
      auth.signOut(); // Sign out the user after deletion
    } catch (err) {
      console.log("Error deleting account:", err);
      alert("Error deleting your account: " + err.message);
    }
  };

  // Render confirmation modal
  const renderDeleteConfirmation = () => (
    <div className="confirmation-modal">
      <p>Are you sure you want to delete your account? This action is irreversible.</p>
      <button onClick={handleDeleteAccount}>Yes, delete my account</button>
      <button onClick={() => setDeleteConfirmationVisible(false)}>Cancel</button>
    </div>
  );

  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="User Avatar" />
        <h2>{user?.username}</h2>
        <p>Age</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Settings</span>
            <button className='dropdown' onClick={() => { setHide1(!isHide1) }}>
              <img src="./arrowUp.png" alt="Toggle" />
            </button>
          </div>
        </div>
        {/* Delete Account Button */}
        <button
          className="delete"
          style={isHide1 ? hideStyle1 : hideStyle}
          onClick={() => setDeleteConfirmationVisible(true)}
        >
          Delete Account
        </button>

        {/* Render the delete confirmation modal */}
        {isDeleteConfirmationVisible && renderDeleteConfirmation()}

        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <button className='dropdown' onClick={() => { setHide(!isHide) }}>
              <img src="./arrowUp.png" alt="Toggle" />
            </button>
          </div>
        </div>

        <button
          onClick={handleBlock}
          style={isHide ? hideStyle : { display: "block" }}
        >
          {isCurrentUserBlocked ? "You are blocked" :
            isReceiverBlocked ? "User blocked" : "Block User"
          }
        </button>

      </div>
    </div>
  );
};

export default Detail;
