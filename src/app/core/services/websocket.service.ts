import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment'; // Import your environment

@Injectable({ providedIn: 'root' })
export class WebsocketService implements OnDestroy {

  private client: Client | null = null;
  private connected = false;
  private connectionPromise: Promise<void> | null = null;

  constructor(private authService: AuthService) {}

  get isConnected(): boolean {
    return this.connected;
  }

  connect(): Promise<void> {
    if (this.connected) return Promise.resolve();
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = new Promise((resolve, reject) => {
      const token = this.authService.getToken();

      // Use the API URL from your environment file to build the WS URL
      // This switches automatically between http (local) and https (production)
      const wsUrl = environment.apiUrl.replace('/api/v1', '/ws');

      this.client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        connectHeaders: token
          ? { Authorization: `Bearer ${token}` }
          : {},
        reconnectDelay: 5000,
        debug: () => {},

        onConnect: () => {
          this.connected = true;
          resolve();
        },

        onStompError: frame => {
          console.warn('STOMP error', frame);
          this.connected = false;
          this.connectionPromise = null;
          reject(frame);
        },

        onDisconnect: () => {
          this.connected = false;
          this.connectionPromise = null;
        }
      });

      this.client.activate();
    });

    return this.connectionPromise;
  }

  subscribeToLocation(ownerId: number): Observable<any> {
    return this.createSubscription(`/topic/location/${ownerId}`);
  }

  subscribeToAlerts(ownerId: number): Observable<any> {
    return this.createSubscription(`/topic/alerts/${ownerId}`);
  }

  private createSubscription<T>(topic: string): Observable<T> {
    return new Observable(observer => {
      this.connect()
        .then(() => {
          if (!this.client) return;
          const sub = this.client.subscribe(
            topic,
            (msg: IMessage) => {
              try {
                observer.next(JSON.parse(msg.body) as T);
              } catch (e) {
                console.error('Error parsing WebSocket message', e);
              }
            }
          );
          observer.add(() => sub.unsubscribe());
        })
        .catch(err => observer.error(err));
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.connected = false;
    this.connectionPromise = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}