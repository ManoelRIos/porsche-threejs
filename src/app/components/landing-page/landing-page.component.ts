import { Component } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  width = window.innerWidth;
  height = window.innerHeight;
  ngOnInit(): void {
    const camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      1000
    );
    camera.position.set(4, 5, 11);
    camera.lookAt(0, 0, 0);
    const scene = new THREE.Scene();

    // Adiciona iluminação
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);
    const lightHelper = new THREE.PointLightHelper(pointLight);
    const gridHelper = new THREE.GridHelper(200, 50);
    // const axesHelper = new THREE.AxesHelper(100);
    scene.add(lightHelper, gridHelper /* axesHelper */);

    //Adiciona controles 3D
    const controls = new OrbitControls(camera, document.body);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const canvas = document.getElementById('threejs-canvas');
    canvas?.appendChild(renderer.domElement);
    renderer.setClearColor(0x111827);
    renderer.setSize(this.width, this.height);
    renderer.setAnimationLoop(animation);

    renderer.setSize(this.width / 2, this.height / 2);

    const loader = new GLTFLoader();
    const rgbeLoader = new RGBELoader();

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1; // Adjust exposure as needed

    rgbeLoader.load(
      '../../../assets/MRHDRI/MR_INT-005_WhiteNeons_NAD.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
      }
    );

    let objectCar: any;
    loader.load('../../../assets/porscheTurbo/scene.gltf', (gltf) => {
      console.log(gltf);
      const mesh = gltf.scene;
      objectCar = mesh;
      mesh.position.set(0, 0, 0);
      // const carTexture = new THREE.TextureLoader().load(
      //   '../../../assets/porsche/textures/coat_baseColor.png'
      // );

      scene.add(mesh);
      renderer.render(gltf.scenes[0], camera);
    });

    // animation
    function animation(time: number) {
      /*     objectCar.rotation.x += 0.0001;
      objectCar.rotation.y += 0.0005;
      objectCar.rotation.z += 0.001; */

      renderer.render(scene, camera);
    }
  }
}
