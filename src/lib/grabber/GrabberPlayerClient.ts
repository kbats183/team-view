import { GrabberSocket } from '$lib/grabber/GrabberSocket';

type EventHandler = (...args: any[]) => void;

interface GrabberSocketLike {
	on(event: string, handler: EventHandler): void;
	emit(event: string, data: any): void;
	close(): void;
}

interface PeerInfo {
	peerName: string;
	peerId?: string;
}

interface PeerConnectionConfig {
	iceServers?: RTCIceServer[];
}

interface OfferAnswer {
	peerId: string;
	answer: RTCSessionDescriptionInit;
}

interface IceCandidate {
	peerId: string;
	candidate: RTCIceCandidateInit;
}

export class GrabberPlayerClient {
	private pc: RTCPeerConnection | null = null;
	private peerConnectionConfig: PeerConnectionConfig | null = null;
	private ws: GrabberSocketLike;
	private target: EventTarget = new EventTarget();

	constructor(mode: "play" | "admin", baseUrl: string) {
		// Можно адаптировать — зависит от сервера
		const wsUrl = baseUrl.replace(/^http/, "ws") + "/ws/player/" + (mode === "play" ? "play" : "admin");
		this.ws = new GrabberSocket(wsUrl);
		this._setupWS();
	}

	private _setupWS() {
		const _client = this;

		this.ws.on("auth:request", () => {
			_client.target.dispatchEvent(new CustomEvent("auth:request"));
		});

		this.ws.on("auth:failed", ({ accessMessage }) => {
			console.warn("WebRTCGrabber: auth failed", accessMessage);
			_client.ws.close();
			_client.target.dispatchEvent(new CustomEvent("auth:failed", { detail: [accessMessage] }));
		});

		this.ws.on("init_peer", ({ initPeer: { pcConfig } }) => {
			_client.peerConnectionConfig = pcConfig;
			console.debug("WebRTCGrabber: connection initialized");
			_client.target.dispatchEvent(new CustomEvent("initialized"));
		});

		this.ws.on("offer_answer", async ({ offerAnswer }: { offerAnswer: OfferAnswer }) => {
			console.debug(`WebRTCGrabber: got offer_answer from ${offerAnswer.peerId}`);
			if (_client.pc) {
				await _client.pc.setRemoteDescription(offerAnswer.answer);
			}
		});

		this.ws.on("grabber_ice", async ({ ice }: { ice: IceCandidate }) => {
			console.debug(`WebRTCGrabber: got ICE from ${ice.peerId}`);
			if (_client.pc && ice.candidate) {
				await _client.pc.addIceCandidate(ice.candidate);
			}
		});
	}

	authorize(credential: string) {
		this.ws.emit("auth", { playerAuth: { credential } });
	}

	connect(peerInfo: PeerInfo, streamType: string, onVideoStream: (stream: MediaStream) => void) {
		if (!this.peerConnectionConfig) {
			console.error("WebRTCGrabber: peerConnectionConfig is missing!");
			return;
		}

		const pc = new RTCPeerConnection(this.peerConnectionConfig);
		this.pc = pc;

		pc.addTransceiver("video");
		pc.addTransceiver("audio");

		pc.ontrack = (event) => {
			console.debug("WebRTCGrabber: received remote track");
			if (event.streams && event.streams[0]) {
				onVideoStream(event.streams[0]);
			}
		};

		pc.onicecandidate = (event) => {
			if (event.candidate) {
				this.ws.emit("player_ice", {
					ice: { ...peerInfo, candidate: event.candidate }
				});
			}
		};

		pc.createOffer()
			.then((offer) => {
				pc.setLocalDescription(offer);
				this.ws.emit("offer", { offer: { ...peerInfo, offer, streamType } });
				console.debug("WebRTCGrabber: sent offer to", peerInfo.peerName);
			})
			.catch((err) => console.error("WebRTCGrabber: failed to create offer", err));
	}

	on(eventName: string, callback: EventHandler) {
		this.target.addEventListener(eventName, (e: Event) => {
			const detail = (e as CustomEvent).detail;
			callback(detail);
		});
	}

	close() {
		this.pc?.close();
		this.pc = null;
		this.ws.close();
	}
}