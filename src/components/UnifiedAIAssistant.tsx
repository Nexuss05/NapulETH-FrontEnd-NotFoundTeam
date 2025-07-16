import React, { useState, useRef, useEffect, useCallback } from 'react';
// 1. [修复] 修正了导入路径和类名，并引入了Live API需要的类型
import { GoogleGenerativeAI, LiveServerMessage, Session } from '@google/generative-ai';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Send, Mic, MicOff, Bot, User, X, Camera, Eye } from 'lucide-react';
import { useAccount, useNetwork } from 'wagmi';

// 2. [修复] 将 role 的 'assistant' 改为 'model' 以匹配API
interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  screenshot?: string;
}

// 使用useRef来持有响应队列，避免不必要的UI重渲染
const responseQueueRef: React.MutableRefObject<LiveServerMessage[]> = { current: [] };

export function UnifiedAIAssistant() {
  // --- 你的原始状态和Ref，保持不变 ---
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState<'chat' | 'screen'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  // --- 你的原始useEffect，保持不变 ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // --- 你的原始函数，保持不变 ---
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const captureScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      return new Promise<string>((resolve) => {
        video.onloadedmetadata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(video, 0, 0);
          
          stream.getTracks().forEach(track => track.stop());
          
          const screenshot = canvas.toDataURL('image/png');
          resolve(screenshot);
        };
      });
    } catch (error) {
      console.error('Failed to capture screen:', error);
      return null;
    }
  };

  const getContextualInfo = useCallback(() => {
    return `You are Matteo, a helpful AI assistant for CryptoQuest.
- Current Mode: ${mode}. 
- If in 'screen' mode, you are analyzing a screenshot. Provide step-by-step guidance.
- If in 'chat' mode, you are a general crypto assistant.
- Wallet: ${address || 'N/A'}. Network: ${chain?.name || 'N/A'}.`;
  }, [address, chain, mode]);

  // --- 3. [重构] sendMessage 函数，将Live API逻辑嵌入其中 ---
  const sendMessage = async (isScreenshotRequest: boolean = false) => {
    if ((!input.trim() && !isScreenshotRequest) || isLoading) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBIR44SAG-6RTSI11or5ONEa0Uky7S5Dfk';
    if (!apiKey) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: 'API Key not configured.', timestamp: new Date() }]);
      return;
    }

    setIsLoading(true);
    const ai = new GoogleGenerativeAI({ apiKey });

    // --- A. 如果是屏幕分析模式 ---
    if (isScreenshotRequest) {
      const screenshot = await captureScreen();
      if (!screenshot) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: 'Failed to capture screen.', timestamp: new Date() }]);
        setIsLoading(false);
        return;
      }
      
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `${input || '请分析这个屏幕截图并指导我。'}`,
        timestamp: new Date(),
        screenshot: screenshot,
      };
      setMessages(prev => [...prev, userMessage]);
      const userInputText = input;
      setInput('');

      // 使用 Live API 进行单次分析
      let session: Session | null = null;
      try {
        const handleModelTurn = (message: LiveServerMessage) => {
            const part = message.serverContent?.modelTurn?.parts?.[0];
            if (part?.text) {
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: part.text, timestamp: new Date() }]);
            }
        };

        const waitMessage = async (): Promise<LiveServerMessage> => {
            let message: LiveServerMessage | undefined;
            while (!message) {
                message = responseQueueRef.current.shift();
                if (message) {
                    handleModelTurn(message);
                } else {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            }
            return message;
        };

        const handleTurn = async () => {
            let done = false;
            while (!done) {
                const message = await waitMessage();
                if (message.serverContent?.turnComplete) {
                    done = true;
                }
            }
        };

        session = await ai.live.connect({
          model: 'models/gemini-2.5-flash-preview-native-audio-dialog',
          callbacks: {
            onmessage: (message: LiveServerMessage) => { responseQueueRef.current.push(message); },
            onerror: (e) => { throw e; },
          },
          config: {
            responseModalities: ['TEXT'],
            systemInstruction: getContextualInfo(),
          },
        });

        const base64Data = screenshot.split(',')[1];
        await session.sendRealtimeInput({ mimeType: 'image/png', data: base64Data });
        await session.sendClientContent({
          turns: [{ role: 'user', parts: [{ text: userInputText || '请分析这个屏幕截图并指导我。' }] }]
        });

        await handleTurn();

      } catch (error: any) {
        console.error('Live API Error:', error);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: `Sorry, an error occurred: ${error.message}`, timestamp: new Date() }]);
      } finally {
        session?.close();
        responseQueueRef.current = [];
        setIsLoading(false);
      }
      return; // 结束函数
    }

    // --- B. 如果是普通聊天模式 ---
    const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
        timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    const chatInput = input;
    setInput('');

    try {
        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: getContextualInfo(),
        });
        const result = await model.generateContent(chatInput);
        const responseText = result.response.text();
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', content: responseText, timestamp: new Date() }]);
    } catch (error: any) {
        console.error('Chat Error:', error);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', content: `Sorry, an error occurred: ${error.message}`, timestamp: new Date() }]);
    } finally {
        setIsLoading(false);
    }
  };

  // --- 你的原始UI渲染，保持不变 ---
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => setIsOpen(true)} className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
          <Bot className="h-8 w-8" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px]">
      <Card className="h-full bg-card/95 backdrop-blur-sm border-purple-500/20 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Matteo AI Assistant</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{isConnected ? 'Connected' : 'Disconnected'}</Badge>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant={mode === 'chat' ? 'default' : 'outline'} size="sm" onClick={() => setMode('chat')} className="flex-1">
              <Bot className="h-4 w-4 mr-1" />Chat
            </Button>
            <Button variant={mode === 'screen' ? 'default' : 'outline'} size="sm" onClick={() => setMode('screen')} className="flex-1">
              <Eye className="h-4 w-4 mr-1" />Screen
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col h-[calc(100%-120px)]">
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  {mode === 'chat' ? (
                    <>👋 Hi! I'm Matteo, your crypto assistant.</>
                  ) : (
                    <>📸 Screen Mode: Click the camera button to capture and analyze your screen!</>
                  )}
                </div>
              )}
              
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'model' && <Bot className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />}
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.role === 'user' ? 'bg-purple-500 text-white' : 'bg-muted'}`}>
                    {message.screenshot && (
                      <img src={message.screenshot} alt="Screenshot" className="w-full max-w-[200px] h-auto rounded mb-2 border"/>
                    )}
                    {message.content}
                  </div>
                  {message.role === 'user' && <User className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <Bot className="h-6 w-6 text-purple-500 mt-1" />
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'screen' ? "Ask about the screenshot..." : "Ask Matteo anything..."}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(mode === 'screen')}
              className="flex-1"
            />
            
            {mode === 'screen' && (
              <Button onClick={() => sendMessage(true)} variant="outline" size="sm" className="bg-green-500/20 border-green-500" title="Capture screen">
                <Camera className="h-4 w-4" />
              </Button>
            )}
            
            <Button onClick={toggleListening} variant="outline" size="sm" className={isListening ? 'bg-red-500/20 border-red-500' : ''}>
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button onClick={() => sendMessage(mode === 'screen')} disabled={!input.trim() || isLoading} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
