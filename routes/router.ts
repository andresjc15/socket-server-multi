
import { Router, Request, Response } from 'express';
import { Socket } from 'socket.io';
import { EncuestaData } from '../classes/encuesta';
import { GraficaData } from '../classes/grafica';
import { Mapa } from '../classes/googlemaps/mapa';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';

const router = Router();

export const mapa = new Mapa();
const lugares = [
    {
        id: '1',
        nombre: 'Udemy',
        lat: 37.784679,
        lng: -122.395936
    },
    {
        id: '2',
        nombre: 'Bahía de San Francisco',
        lat: 37.798933,
        lng: -122.377732
    },
    {
        id: '3',
        nombre: 'The Palace Hotel',
        lat: 37.788578,
        lng: -122.401745
    }
];

mapa.marcadores.push( ...lugares );

router.get('/mapasgoogle', ( req: Request, res: Response ) => {
    res.json( mapa.getMarcadores() );
});

// Sockets mapbox

router.get('/mapa', ( req: Request, res: Response ) => {
    res.json( mapa.getMarcadores() );
});


// Graficas y encuesta

const grafica = new GraficaData();
const encuesta = new EncuestaData();

router.get('/grafica', ( req: Request, res: Response ) => {
    res.json( grafica.getDataGrafica() );
});

router.post('/grafica', ( req: Request, res: Response ) => {
    const mes       = req.body.mes;
    const unidades  = Number( req.body.unidades );

    grafica.incrementarValor( mes, unidades );
    const server = Server.instance;
    server.io.emit( 'cambio-grafica', grafica.getDataGrafica() );

    res.json( grafica.getDataGrafica() );
});

router.get('/encuesta', ( req: Request, res: Response ) => {
    res.json( encuesta.getDataEncuesta() );
});

router.post('/encuesta', ( req: Request, res: Response ) => {
    const alternativa       = req.body.alternativa;
    const unidad  = Number( req.body.unidad );

    encuesta.incrementarValor( alternativa, unidad );
    const server = Server.instance;
    server.io.emit( 'cambio-encuesta', encuesta.getDataEncuesta() );

    res.json( encuesta.getDataEncuesta() );
});

router.post('/mensajes/:id', ( req: Request, res: Response ) => {

    const body = req.body.body;
    const de = req.body.de;
    const id    =req.params.id;

    const payload = {
        de,
        body
    }

    const server = Server.instance;

    server.io.in( id ).emit( 'mensaje-privado', payload )

    res.json({
        ok: true,
        body,
        de
    })
});

router.get('/usuarios', (req: Request, res: Response ) => {

    const server =  Server.instance;

    server.io.clients( (err: any, clientes: string[] ) => {
        if ( err ) {
            res.json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            clientes
        });
    });
});

router.get('/usuarios/detalle', (req: Request, res: Response ) => {

    res.json({
        ok  : true,
        clientes: usuariosConectados.getLista()
    })
});

export default router;