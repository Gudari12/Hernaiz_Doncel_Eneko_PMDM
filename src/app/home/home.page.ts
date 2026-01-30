import { Component, OnInit } from '@angular/core';
import { CuestionarioService } from './../servicios/cuestionario.service';
import { IPregunta } from './../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  preguntas: IPregunta[] = [];
  cargando: boolean = true;

  constructor(private cuestionarioService: CuestionarioService) {}

  ngOnInit() {
    this.cargarPreguntas();
  }

  async cargarPreguntas() {
    try {
      this.cargando = true;
      await this.cuestionarioService.cargarPreguntas();
      this.preguntas = this.cuestionarioService.obtenerPreguntas();
    } catch (error) {
      console.error('Error al cargar las preguntas del cuestionario', error);
    } finally {
      this.cargando = false;
    }
  }

  async responder(pregunta: IPregunta) {
    if (pregunta.intentos > 0 && !pregunta.acierto) {
      await this.cuestionarioService.abrirAlerta(pregunta);
    }
  }
}
