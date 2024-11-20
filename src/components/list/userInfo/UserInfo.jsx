import { doc, deleteDoc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useUserStore } from '../../../lib/userStore.'; // Ensure this path is correct
import { auth, db } from '../../../lib/firebase';
import './userInfo.css';
import { toast } from 'react-toastify';


const UserInfo = () => {
    const { currentUser } = useUserStore();

    return (
        <div className="userInfo">
            <div className="user">
                <img src={currentUser.avatar || "./avatar.png"} alt="" />
                <h3>{currentUser.username}</h3>
            </div>
            <div className="icons">
                <button className="logout" onClick={() => auth.signOut()} >
                    Logout
                </button>
                
            </div>
        </div>
    );
};

export default UserInfo;
