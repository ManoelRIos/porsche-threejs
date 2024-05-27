import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LearningComponent } from './components/learning/learning.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LearningComponent, LandingPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'threejs';
}
