import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Send, Mic, MicOff, Bot, User, X, Camera, Eye } from 'lucide-react';
import { useAccount, useNetwork } from 'wagmi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  screenshot?: string;
}

export function UnifiedAIAssistant() {
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化语音识别
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

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // 截取屏幕截图
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
          
          // 停止录制
          stream.getTracks().forEach(track => track.stop());
          
          // 转换为base64
          const screenshot = canvas.toDataURL('image/png');
          resolve(screenshot);
        };
      });
    } catch (error) {
      console.error('Failed to capture screen:', error);
      return null;
    }
  };

  const getContextualInfo = () => {
    return `Current context:
- Wallet Address: ${address || 'Not connected'}
- Network: ${chain?.name || 'Unknown'} (Chain ID: ${chain?.id || 'Unknown'})
- Connected: ${isConnected ? 'Yes' : 'No'}
- App: CryptoQuest - A crypto learning and gaming platform
- Smart Contract: 0x524a94d6904fd3801e790442ff9f1Fe4c0b931a8 on Avalanche Fuji
- You are Matteo, a helpful AI assistant that can chat and analyze screenshots.`;
  };

  const sendMessage = async (includeScreenshot = false) => {
    if ((!input.trim() && !includeScreenshot) || isLoading) return;

    // 使用正确的 API Key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBIR44SAG-6RTSI11or5ONEa0Uky7S5Dfk';
    
    console.log('API Key status:', apiKey ? 'Found' : 'Missing');

    if (!apiKey) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'API Key not configured. Please check your environment variables.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    let screenshot = null;
    if (includeScreenshot) {
      screenshot = await captureScreen();
      if (!screenshot) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Failed to capture screen. Please try again.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: includeScreenshot ? 
        `${input || 'Please analyze this screenshot'} [Screenshot attached]` : 
        input,
      timestamp: new Date(),
      screenshot: screenshot || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 使用正确的 GoogleGenAI 初始化方式
      const ai = new GoogleGenAI({ apiKey });
      
      if (mode === 'chat' && !includeScreenshot) {
        // 对于普通聊天，使用标准的 generateContent API
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [{
            role: 'user',
            parts: [{ text: input }]
          }],
          config: {
            systemInstruction: `You are Matteo, a friendly AI assistant for CryptoQuest. ${getContextualInfo()}`
          }
        });
        
        const text = response.text || 'I received your message but had trouble responding.';
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: text,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        
      } else if (includeScreenshot && screenshot) {
        // 对于截图分析，使用 Live API
        console.log('Using Live API for screenshot analysis...');
        
        const responseQueue: any[] = [];
        let responseReceived = false;

        const session = await ai.live.connect({
          model: 'gemini-2.0-flash-live-001', // 使用正确的 Live API 模型
          callbacks: {
            onopen: function () {
              console.log('Live API connected for screenshot analysis');
            },
            onmessage: function (message) {
              console.log('Received message:', message);
              responseQueue.push(message);
              if (message.text) {
                const assistantMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  role: 'assistant',
                  content: message.text,
                  timestamp: new Date(),
                };
                setMessages(prev => [...prev, assistantMessage]);
                responseReceived = true;
                session.close();
              }
            },
            onerror: function (e) {
              console.error('Live API error:', e);
              throw new Error('Live API connection failed');
            },
            onclose: function (e) {
              console.log('Live API disconnected');
            },
          },
          config: {
            responseModalities: ['TEXT'],
            systemInstruction: `You are Matteo, a helpful AI assistant that can analyze screenshots. ${getContextualInfo()}`
          },
        });






        // 发送截图数据
        const base64Data = screenshot.split(',')[1];
        await session.sendRealtimeInput({
          mimeType: 'image/png',
          data: base64Data
        });

        // 发送文本问题
        if (input.trim()) {
          await session.sendClientContent({
            turns: [{
              role: 'user',
              parts: [{ text: input }]
            }]
          });
        } else {
          await session.sendClientContent({
            turns: [{
              role: 'user',
              parts: [{ text: 'Please analyze this screenshot and tell me what you see.' }]
            }]
          });
        }

        // 等待响应（最多10秒）
        let waitTime = 0;
        while (!responseReceived && waitTime < 10000) {
          await new Promise(resolve => setTimeout(resolve, 100));
          waitTime += 100;
        }

        if (!responseReceived) {
          session.close();
          throw new Error('No response received from Live API');
        }

      } else {
        // 普通文本聊天的备选方案
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [{
            role: 'user',
            parts: [{ text: input }]
          }]
        });
        
        const text = response.text || 'I received your message but had trouble responding.';
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: text,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
      
    } catch (error) {
      console.error('Detailed error:', error);
      
      let errorMsg = 'Sorry, I encountered an error. ';
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
          errorMsg += 'The API key is invalid.';
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
          errorMsg += 'API quota exceeded.';
        } else {
          errorMsg += `Error: ${error.message}`;
        }
      } else {
        errorMsg += 'Please try again.';
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
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
              <Badge variant="outline" className="text-xs">
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* 模式切换 */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'chat' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('chat')}
              className="flex-1"
            >
              <Bot className="h-4 w-4 mr-1" />
              Chat
            </Button>
            <Button
              variant={mode === 'screen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('screen')}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              Screen
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col h-[calc(100%-120px)]">
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  {mode === 'chat' ? (
                    <>
                      👋 Hi! I'm Matteo, your crypto assistant. Ask me anything about blockchain, DeFi, or your CryptoQuest journey!
                    </>
                  ) : (
                    <>
                      📸 Screen Mode: Click the camera button to capture and analyze your screen using Gemini Live API!
                    </>
                  )}
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Bot className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-muted'
                    }`}
                  >
                    {message.screenshot && (
                      <img 
                        src={message.screenshot} 
                        alt="Screenshot" 
                        className="w-full max-w-[200px] h-auto rounded mb-2 border"
                      />
                    )}
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <User className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />
                  )}
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
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(false)}
              className="flex-1"
            />
            
            {mode === 'screen' && (
              <Button
                onClick={() => sendMessage(true)}
                variant="outline"
                size="sm"
                className="bg-green-500/20 border-green-500"
                title="Capture screen"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              onClick={toggleListening}
              variant="outline"
              size="sm"
              className={isListening ? 'bg-red-500/20 border-red-500' : ''}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button 
              onClick={() => sendMessage(false)}
              disabled={!input.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
