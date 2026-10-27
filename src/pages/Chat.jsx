import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Send, Paperclip, MoreVertical, Phone, Video, 
  ChevronLeft, MessageSquare, CheckCheck, Smile
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getOrCreateChat, sendMessage, getDoctorById } from "../lib/firebase/firestore";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { toast } from "react-toastify";

const Chat = () => {
  const { doctorId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef();

  useEffect(() => {
    const initChat = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        // Find doctor details
        const docInfo = await getDoctorById(doctorId);
        setDoctor(docInfo);

        // Get or create chat session
        const chatData = await getOrCreateChat(currentUser.uid, doctorId);
        setChat(chatData);

        // Listen for real-time messages
        const msgsQuery = query(
          collection(db, "chats", chatData.id, "messages"),
          orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(msgsQuery, (snapshot) => {
          const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMessages(msgs);
          setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to connect to chat server");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [doctorId, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    try {
      const text = newMessage;
      setNewMessage("");
      await sendMessage(chat.id, currentUser.uid, text);
    } catch (error) {
      toast.error("Message failed to send");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
        <p className="text-slate-500 font-bold">Connecting to Secure Server...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 h-screen flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col bg-white dark:bg-slate-800 shadow-2xl overflow-hidden border-x border-slate-200 dark:border-slate-700">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full md:hidden">
              <ChevronLeft size={20} />
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                {doctor?.name?.charAt(0) || "D"}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white leading-none">Dr. {doctor?.name || "Doctor"}</h3>
              <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Online</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Phone size={20} />
            </button>
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Video size={20} />
            </button>
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/30">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <MessageSquare size={32} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Start a Conversation</h4>
              <p className="text-sm text-slate-500 max-w-xs mt-2">Consult with Dr. {doctor?.name} privately. Your data is encrypted and secure.</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderId === currentUser.uid;
              return (
                <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[75%] sm:max-w-[60%] rounded-2xl p-3 shadow-md ${
                    isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-600'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                      <p className="text-[10px] font-medium">
                        {msg.timestamp?.toDate ? new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit'}).format(msg.timestamp.toDate()) : 'Now'}
                      </p>
                      {isMe && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button type="button" className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              <Paperclip size={20} />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full pl-4 pr-10 py-3 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <Smile size={18} />
              </button>
            </div>
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
            >
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Chat;
