export class StompClient {
  private ws: WebSocket | null = null;
  private connected = false;
  private subscriptions: Map<string, (message: any) => void> = new Map();
  
  onConnect: (() => void) | null = null;
  onDisconnect: (() => void) | null = null;

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const port = window.location.port || (protocol === 'wss:' ? '443' : '80');
    this.ws = new WebSocket(`${protocol}//${window.location.hostname}:${port}/ws`);

    this.ws.onopen = () => {
      this.connected = true;
      this.onConnect?.();
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.onDisconnect?.();
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const subscription = this.subscriptions.get(message.destination);
      if (subscription) {
        subscription(message);
      }
    };
  }

  subscribe(destination: string, callback: (message: any) => void) {
    this.subscriptions.set(destination, callback);
    if (this.connected && this.ws) {
      this.ws.send(JSON.stringify({
        command: 'SUBSCRIBE',
        destination
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
  }
}
