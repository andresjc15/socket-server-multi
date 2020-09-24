import { Socket } from 'socket.io';
import { Mapa } from '../classes/mapa';
import { Marcador } from '../classes/marcador';
import { Usuario } from '../classes/usuario';
import { UsuariosLista } from '../classes/usuarios-lista';
import { mapa } from '../routes/router';

// googlemaps sockets
export const marcadorNuevo = ( cliente: Socket, io: SocketIO.Server ) => {
    cliente.on('marcador-nuevo', (marcador) => {
        mapa.agregarMarcador(marcador);
        cliente.broadcast.emit('marcador-nuevo', marcador);
    });
}

export const marcadorBorrar = ( cliente: Socket, io: SocketIO.Server ) => {
    cliente.on('marcador-nuevo', (id: string) => {
        mapa.borrarMarcador(id);
        cliente.broadcast.emit('marcador-borrar', id);
    });
}

export const marcadorMover = ( cliente: Socket, io: SocketIO.Server ) => {
    cliente.on('marcador-nuevo', (marcador) => {
        mapa.moverMarcador(marcador);   
        cliente.broadcast.emit('marcador-mover', marcador   );
    });
}

export const usuariosConectados = new UsuariosLista();
export const mapaMB = new Mapa();

// eventos de mapbox
export const mapaSockets = ( cliente: Socket, io: SocketIO.Server ) => {
    cliente.on( 'marcador-nuevo', (marcador: Marcador) => {
        mapaMB.agregarMarcador( marcador );
        cliente.broadcast.emit( 'marcador-nuevo', marcador );
    });

    cliente.on( 'marcador-mover', ( marcador: Marcador ) => {
        mapaMB.moverMarcador( marcador );
        cliente.broadcast.emit( 'marcador-mover', marcador );
    });

    cliente.on( 'marcador-borrar', ( id: string ) => {
        mapaMB.borrarMarcador( id );
        cliente.broadcast.emit( 'marcador-borrar', id );
    });
}

export const conectarCliente = ( cliente: Socket, io: SocketIO.Server ) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );

}

export const desconectar = ( cliente: Socket, io: SocketIO.Server ) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');

        usuariosConectados.borrarUsuario( cliente.id );

        io.emit('usuarios-activos', usuariosConectados.getLista() );
    });
}

export const mensaje = ( cliente: Socket, io: SocketIO.Server ) => {
    cliente.on('mensaje', ( payload: { de: string, body: string }) => {
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);
    });
}

//configurar usuario
export const configurarUsuario = ( cliente: Socket, io: SocketIO.Server ) => {
    cliente.on('configurar-usuario', ( payload: { nombre: string }, callback: Function ) => {
        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        io.emit('usuarios-activos', usuariosConectados.getLista() );

        callback({
            ok      : true,
            mensaje : `Usuario ${ payload.nombre }, configurado`
        }); 
    });
}

export const obtenerUsuarios = ( cliente: Socket, io: SocketIO.Server ) => {
    cliente.on('obtener-usuarios', () => {

        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista() );

    });
}