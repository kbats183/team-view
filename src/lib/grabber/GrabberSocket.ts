export interface GrabberSocketEventPayload {
	event: string;
	[key: string]: any;
}
export type GrabberSocketHandler = (payload: GrabberSocketEventPayload) => void;

export class GrabberSocket {
    private url: string;
	private ws!: WebSocket;
	private target: EventTarget;
	private messageQueue: GrabberSocketEventPayload[];
	private isClosed: boolean;

    constructor(url: string) {
        if (!url.startsWith("ws")) {
            url = (window.location.protocol === "http:" ? "ws:" : "wss:") + window.location.host + url;
        }
        this.url = url;
        this.target = new EventTarget();
        this.messageQueue = [];
        this.isClosed = false;
        this.connect();
    }

    connect() {
        if (this.isClosed) {
            return;
        }
        const ws = new WebSocket(this.url);
        const _this = this;
        ws.onopen = function () {
            while (_this.messageQueue.length > 0) {
                ws.send(JSON.stringify(_this.messageQueue[0]));
                _this.messageQueue.splice(0, 1);
            }
        }
        ws.onmessage = function ({data}) {
            const payload = JSON.parse(data);
            _this.target.dispatchEvent(new CustomEvent(payload.event, {detail: payload}));
        }
        ws.onclose = function () {
            if (_this.isClosed) {
                return;
            }
            setTimeout(() => _this.connect(), 1000);
        }
        this.ws = ws;
    }

    emit(event: string, payload: Record<string, any> = {}) {
        const data = {...payload, "event": event};
        if (this.ws.readyState === this.ws.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            this.messageQueue.push(data);
        }
    }

    on(event: string, callback: GrabberSocketHandler) {
		this.target.addEventListener(event, (e: Event) => {
			const detail = (e as CustomEvent<GrabberSocketEventPayload>).detail;
			callback(detail);
		});
	}

    close() {
        this.isClosed = true;
        this.ws?.close();
    }
}