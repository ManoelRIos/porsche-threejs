import { Component, Input } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  @Input() progress: string = '0';
  width = window.innerWidth;
  height = window.innerHeight;
  ngOnInit(): void {
    const camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      1000
    );

    const scene = new THREE.Scene();
    
    const gridHelper = new THREE.GridHelper(200, 50);
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(gridHelper, axesHelper);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setAnimationLoop(animation);
    const canvas = document.getElementById('threejs-loading');    
    const widthCanva = canvas!.offsetWidth;
    const heightCanva = canvas!.offsetHeight;
    renderer.setSize(widthCanva, heightCanva);
    canvas?.appendChild(renderer.domElement);

    camera.position.set(15, 0, 15);
    camera.lookAt(scene.position);

    function animation(thime: number) {
      renderer.render(scene, camera);
    }
  }
}
