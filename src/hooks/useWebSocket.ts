import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  sender?: string;
}

export interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const {
    url,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 5
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const attemptRef = useRef(0);
  const shouldReconnect = useRef(reconnect);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('✅ WebSocket Connected:', url);
        setIsConnected(true);
        attemptRef.current = 0;
        onOpen?.();
      };
      
      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket Error:', error);
        onError?.(error);
      };
      
      ws.onclose = () => {
        console.log('🔌 WebSocket Disconnected');
        setIsConnected(false);
        onClose?.();
        
        // Auto-reconnect logic
        if (shouldReconnect.current && attemptRef.current < reconnectAttempts) {
          attemptRef.current++;
          console.log(`🔄 Reconnecting... Attempt ${attemptRef.current}/${reconnectAttempts}`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectInterval, reconnectAttempts]);

  const disconnect = useCallback(() => {
    shouldReconnect.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: Date.now()
      };
      wsRef.current.send(JSON.stringify(fullMessage));
      return true;
    } else {
      console.warn('⚠️ WebSocket not connected. Message not sent.');
      return false;
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      shouldReconnect.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: connect
  };
};
