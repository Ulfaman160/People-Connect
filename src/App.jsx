import List from './components/list/List'
import React, { Profiler } from 'react'; 
import Chat from './components/chat/Chat'
import Detail from './components/detail/Detail'
import Login from './components/login/Login';
import Notification from './components/notification/Notification';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useUserStore } from './lib/userStore.';
import { useChatStore } from './lib/chatStore';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };

  }, [fetchUserInfo]);

  if (isLoading) return (
    <div className="loading-container">
      <div className='loading'></div>
      <div className="loading-text"></div>
    </div>
  );

  return (
    <Router>
      <div className='container'>
        {
          currentUser ? (
            <>
              <List />
              {chatId && <Chat />}
              {chatId && <Detail />}
            </>
          ) : (
            
            <>
            {/* User Already Exists */}
            <Home />
            </>
          )
        }
      </div>
    </Router>
  );
}

export default App;
