import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { IPregunta } from './../interfaces/interfaces';
import { GestionStorageService } from './gestion-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {
  private preguntas: IPregunta[] = [];
  private readonly STORAGE_KEY = 'preguntas_cuestionario';
  private readonly INTENTOS_DEFECTO = 3;

  constructor(
    private httpClient: HttpClient,
    private alertController: AlertController,
    private gestionStorageService: GestionStorageService
  ) {}

  obtenerPreguntas(): IPregunta[] {
    return this.preguntas;
  }

  async cargarPreguntas(): Promise<IPregunta[]> {
    await this.leerJSON();
    return this.preguntas;
  }

  private leerJSON(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.get<any[]>('assets/datos/datos.json').subscribe({
        next: (datos) => {
          this.preguntas = datos.map(pregunta => ({
            ...pregunta,
            respuestasIncorrectas: [],
            intentos: this.INTENTOS_DEFECTO,
            acierto: false
          }));
          resolve();
        },
        error: (error) => {
          console.error('Error al leer el archivo JSON de preguntas', error);
          reject(error);
        }
      });
    });
  }

  async abrirAlerta(pregunta: IPregunta): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Zer markaren logotipoa da?',
      inputs: [
        {
          name: 'respuesta',
          type: 'text',
          placeholder: 'Idatzi erantzuna',
          id: 'input-respuesta'
        }
      ],
      buttons: [
        {
          text: 'Utzi',
          role: 'cancel'
        },
        {
          text: 'Bidali',
          handler: (data) => {
            this.validarRespuesta(pregunta, data.respuesta);
          }
        }
      ]
    });

    await alert.present();
  }

  private validarRespuesta(pregunta: IPregunta, respuestaIngresada: string): void {
    const respuestaLimpia = respuestaIngresada.trim().toLowerCase();
    const respuestaCorrecta = pregunta.respuesta.trim().toLowerCase();

    if (respuestaLimpia === respuestaCorrecta) {
      pregunta.acierto = true;
    } else {
      pregunta.respuestasIncorrectas.push(respuestaIngresada);
      pregunta.intentos--;
    }
  }

  guardarEnStorage(): Promise<void> {
    return this.gestionStorageService.setObject(this.STORAGE_KEY, this.preguntas);
  }
}
