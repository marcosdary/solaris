import type { WSRequest, WSResponse } from "../types/websocket-cv";

type MessageCallback = (message: WSResponse) => void;
type EventCallback = () => void;

export class CVWebSocket {
  private socket: WebSocket | null = null;

  private readonly url: string;

  private messageListeners = new Set<MessageCallback>();
  private openListeners = new Set<EventCallback>();
  private closeListeners = new Set<EventCallback>();
  private errorListeners = new Set<(event: Event) => void>();

  constructor(baseURL: string, cvId: string) {
    this.url = `${baseURL}/${cvId}`;
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.openListeners.forEach((cb) => cb());
    };

    this.socket.onclose = () => {
      this.closeListeners.forEach((cb) => cb());
    };

    this.socket.onerror = (event) => {
      this.errorListeners.forEach((cb) => cb(event));
    };

    this.socket.onmessage = (event) => {
      const response: WSResponse = JSON.parse(event.data);

      this.messageListeners.forEach((cb) => cb(response));
    };
  }

  disconnect() {
    this.socket?.close();
  }

  send<T>(request: WSRequest<T>) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket não conectado.");
    }

    this.socket.send(JSON.stringify(request));
  }

  onMessage(callback: MessageCallback) {
    this.messageListeners.add(callback);

    return () => this.messageListeners.delete(callback);
  }

  onOpen(callback: EventCallback) {
    this.openListeners.add(callback);

    return () => this.openListeners.delete(callback);
  }

  onClose(callback: EventCallback) {
    this.closeListeners.add(callback);

    return () => this.closeListeners.delete(callback);
  }

  onError(callback: (event: Event) => void) {
    this.errorListeners.add(callback);

    return () => this.errorListeners.delete(callback);
  }
}