import { arrayRemove, deleteDoc, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useChatStore } from '../../lib/chatStore';
import { auth, db } from '../../lib/firebase';
import './detail.css'
import { useUserStore } from '../../lib/userStore.';
import { useState } from 'react';


const Detail = () => {

  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();
  const hideStyle={display:"none"};
  const hideStyle1={display:"block"};
  const [isHide,setHide]=useState(false);
  const[isHide1,setHide1]=useState(false);
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock()
    } catch (err) {
      console.log(err);
    }
  }





  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Age</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Settings</span>
            
            <button className='dropdown' onClick={()=>{setHide1(!isHide1)}}><img src="./arrowUp.png" alt="" /></button>
          </div>
        </div>
        <button className="delete" style={isHide1?hideStyle1:{display:"none"}}>Delete Account</button>
        
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <button className='dropdown' onClick={()=>{setHide(!isHide)}}><img src="./arrowUp.png" alt="" /></button>
          </div>
        </div>
        


        <button onClick={handleBlock} style={isHide?hideStyle:{display:"block"}}>
          {
            isCurrentUserBlocked ? "You are blocked" : 
            isReceiverBlocked ? "User blocked" : "Block User"
          }
        </button>
          
        <button className="logout" style={isHide?hideStyle:{display:"block"}} onClick={() => auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Detail;
