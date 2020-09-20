import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: SocketIO.Server;
    private httpServer: http.Server;

    constructor() {

        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );
        
        this.listenSockets();
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }

    private  listenSockets() {

        console.log('Escuchando conexiones - Sockets');

        this.io.on('connection', cliente => {

            //Conectar cliente
            socket.conectarCliente( cliente, this.io );

            //Configurar usuario
            socket.configurarUsuario( cliente, this.io );

            //obtener usuarios activos
            socket.obtenerUsuarios( cliente, this.io );

            console.log(cliente.id);

            socket.mensaje( cliente, this.io );

            socket.desconectar( cliente, this.io );

        })
    }

    start( callback: any ) {
        this.httpServer.listen( this.port, callback );
    }

}