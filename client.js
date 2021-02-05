import { Socket } from 'net';

const socket = new Socket();
socket.connect(6700, '127.0.0.1')