import './chat.css'
import { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { getDatabase, ref, onDisconnect, onValue, set } from 'firebase/database';
import { db } from '../../lib/firebase';
import upload from '../../lib/upload'
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore.';

const Chat = () => {
  const [chat, setChat] = useState();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "chats", chatId),
      (res) => {
        setChat(res.data());
      }
    );

    return () => {
      unSub();
    };
  }, [chatId]);

  useEffect(() => {
    if (!currentUser?.id) return; // Ensure the current user exists
  
    const db = getDatabase();
    const userStatusDatabaseRef = ref(db, `/status/${currentUser.id}`);
  
    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: new Date().toISOString(),
    };
  
    const isOnlineForDatabase = {
      state: 'online',
      last_changed: new Date().toISOString(),
    };
  
    const connectedRef = ref(db, '.info/connected');
  
    // Listener to track if the device is connected
    const handleConnected = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) {
        // Device is offline
        return;
      }
  
      // Set online status and configure disconnection fallback
      onDisconnect(userStatusDatabaseRef)
        .set(isOfflineForDatabase)
        .then(() => {
          // Set online status when the device is connected
          set(userStatusDatabaseRef, isOnlineForDatabase);
        })
        .catch((err) => console.error('Error setting onDisconnect:', err));
    });
  
    return () => {
      handleConnected(); // Unsubscribe from `.info/connected`
      set(userStatusDatabaseRef, isOfflineForDatabase); // Cleanup to ensure proper offline status
    };
  }, [currentUser?.id]);
  
  
  

  useEffect(() => {
    const dbRealtime = getDatabase();
    const userStatusDatabaseRef = ref(dbRealtime, `/status/${user.id}`);

    onValue(userStatusDatabaseRef, async (snapshot) => {
      const status = snapshot.val();
      if (status) {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          isOnline: status.state === 'online',
        });
        setlastseen(status.state === 'online' ? 'online🟢' : 'offline🔴');
      }
    });
  }, [user.id]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };

  const handleImg = e => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        })
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapShot = await getDoc(userChatRef);

        if (userChatsSnapShot.exists()) {
          const userChatsData = userChatsSnapShot.data();

          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }

    setImg({
      file: null,
      url: "",
    });
    setText("");
  };

  const [lastseen, setlastseen] = useState('connecting...');

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>{lastseen}</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message.createAt}>
            <img src={user?.avatar || "./avatar.png"} className='avatar' alt="" />
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {img?.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input type="file" id='file' style={{ display: 'none' }} onChange={handleImg} />
          
          <img src="./mic.png" alt="" />
        </div>
        <input type="text"
          placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : "Type a message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpenEmoji((prev) => !prev)} />
          <div className="picker">
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} width={"300px"} height={"400px"} />
          </div>
        </div>
        <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked} >Send</button>
      </div>
    </div>
  );
}

export default Chat;
