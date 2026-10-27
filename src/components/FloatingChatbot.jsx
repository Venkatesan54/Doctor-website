import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { MessageCircle, X, Send, Trash2, Maximize2, Minimize2 } from "lucide-react";

/**
 * FloatingChatbot Component
 * A responsive, floating AI chatbot that uses OpenAI (or a proxy) to answer questions.
 */
const FloatingChatbot = () => {
  // --- UI State ---
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Controls full-screen mode on mobile
  const chatWindowRef = useRef(null);

  // --- Chat State ---
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Load messages from localStorage or use default welcome message
  const [messages, setMessages] = useState(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("floatingChatMessages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      { 
        role: "assistant", 
        text: "Hi there! 👋 I am your friendly AI health assistant. Ask me anything!", 
        timestamp: new Date().toISOString() 
      }
    ];
  });

  // Predefined quick questions for easy interaction
  const quickQuestions = [
    "Nearest cardiologist?",
    "Symptoms of flu?",
    "Check blood test price",
    "Book home collection"
  ];

  // --- Effects ---

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("floatingChatMessages", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to the bottom when a new message arrives
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  // --- Handlers ---

  // Clear chat history
  const handleClearChat = () => {
    setMessages([
      { 
        role: "assistant", 
        text: "Chat cleared! How can I help you today?", 
        timestamp: new Date().toISOString() 
      }
    ]);
  };

  // Main sending logic
  const handleSend = async (textOverride = null) => {
    const textToSend = textOverride || input;
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    // 1. Add User Message
    const newMessages = [
      ...messages, 
      { role: "user", text: trimmed, timestamp: new Date().toISOString() }
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // 2. Determine API Endpoint
    const customApiUrl = import.meta.env.VITE_AI_CHAT_API_URL || "http://localhost:3001/api/chat";

    try {
      let answer = "";
      try {
        // Attempt 1: Call Backend Proxy Server
        const response = await fetch(customApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmed, conversation: newMessages }),
        });

        if (!response.ok) throw new Error("Backend Proxy Failed.");

        const data = await response.json();
        answer = data.reply || data.answer || "Sorry, I couldn't parse the answer.";
      } catch (proxyError) {
        // Attempt 2: Fallback (Secure proxy is recommended for production)
        const fallbackKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!fallbackKey) throw proxyError; // Stop if no fallback key

        if (fallbackKey.startsWith("AIza")) {
          // GEMINI API FALLBACK
          console.warn("Backend missing: Falling back to Gemini API");
          
          // Gemini requires the conversation to strictly START with a 'user' role.
          // Let's filter out our hardcoded initial 'assistant' welcome message from the payload.
          const cleanHistory = [...newMessages];
          if (cleanHistory.length > 0 && cleanHistory[0].role === 'assistant') {
            cleanHistory.shift(); 
          }

          const geminiMessages = cleanHistory.map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.text }]
          }));

          const fallbackResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${fallbackKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: geminiMessages })
          });

          if (!fallbackResponse.ok) throw new Error("Direct Gemini fallback failed.");
          const fallbackData = await fallbackResponse.json();
          answer = fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No response generated.";
        } else {
          // OPENAI API FALLBACK
          console.warn("Backend missing: Falling back to direct OpenAI API");
          const fallbackResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${fallbackKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini", // Very fast, capable model
              messages: newMessages.map(m => ({ role: m.role, content: m.text })),
              max_tokens: 350
            })
          });

          if (!fallbackResponse.ok) throw new Error("Direct OpenAI fallback failed.");
          const fallbackData = await fallbackResponse.json();
          answer = fallbackData?.choices?.[0]?.message?.content?.trim() || "No response generated.";
        }
      }

      // 3. Add AI Message
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", text: answer, timestamp: new Date().toISOString() }
      ]);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Oops, I'm having trouble connecting right now. Please ensure your API backend or Key is active.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Allow sending with Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Rendering ---

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 p-4 rounded-full shadow-2xl bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-300 animate-fade-up flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Open AI Chat"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 shadow-2xl overflow-hidden
          ${isExpanded 
            ? "inset-0 md:inset-auto md:bottom-24 md:right-10 md:w-[400px] md:h-[600px] md:rounded-[2rem]" 
            : "bottom-0 right-0 w-full h-[600px] rounded-t-3xl md:w-[400px] md:h-[600px] md:bottom-6 md:right-6 md:rounded-[2rem] lg:bottom-10 lg:right-10"}
          `}
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 p-4 text-white shrink-0">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-100"></span>
                </span>
                DocBook AI Assistant
              </h3>
              <p className="text-xs text-blue-100 opacity-80">Online | Ready to help</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-1.5 hover:bg-white/20 rounded-lg transition sm:hidden"
                title="Toggle Fullscreen"
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button 
                onClick={handleClearChat} 
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                title="Clear Chat"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={chatWindowRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50 relative scroll-smooth"
          >
            {messages.map((msg, index) => {
              const isAI = msg.role === "assistant";
              return (
                <div key={index} className={`flex gap-2 items-end ${isAI ? "justify-start" : "justify-end"}`}>
                  
                  {isAI && (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[10px] font-bold shadow-sm">
                      AI
                    </div>
                  )}

                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm ${
                    isAI 
                      ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-bl-none" 
                      : "bg-blue-600 text-white rounded-br-none"
                  }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed break-words">
                      {isAI ? (
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap m-0">{msg.text}</p>
                      )}
                    </div>
                    <small className={`text-[10px] mt-1 block ${isAI ? "text-slate-400 text-left" : "text-blue-200 text-right opacity-90"}`}>
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </small>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
               <div className="flex gap-2 items-end justify-start animate-fade-in">
                 <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 border border-blue-200 flex items-center justify-center text-xs font-bold shadow-sm">AI</div>
                 <div className="px-5 py-3.5 rounded-2xl rounded-bl-none bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                 </div>
               </div>
            )}
          </div>

          {/* Quick Questions & Input Area */}
          <div className="bg-white dark:bg-slate-800 shrink-0 border-t dark:border-slate-700">
            
            {/* Quick Questions (Horizontal scroll) */}
            <div className="p-3 border-b dark:border-slate-700 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="whitespace-nowrap shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-600 transition border border-blue-100 dark:border-slate-600"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 flex items-end gap-2 bg-slate-50 dark:bg-slate-900/40">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your health query..."
                className="flex-1 max-h-32 min-h-[44px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="h-[44px] w-[44px] shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm group"
              >
                <Send size={18} className="translate-x-[-1px] group-active:scale-90 transition-transform" />
              </button>
            </div>
            
            {/* Footer Text */}
            <div className="text-center pb-2 pt-1">
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                AI can make mistakes. Verify important medical info.
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
