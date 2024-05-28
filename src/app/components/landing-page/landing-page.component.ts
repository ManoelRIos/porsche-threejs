import { Component } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  width = window.innerWidth;
  height = window.innerHeight;

  color: string = '#e11d48';
  colorTailwind: string = 'rose';

  isLoading: boolean = true;
  progress: string = '0';
  async ngOnInit(): Promise<void> {
    const camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      1000
    );

    const scene = new THREE.Scene();
    // Adiciona iluminação
    const pointLight = new THREE.PointLight(0x99f6e4, 10);
    const ambientLight = new THREE.AmbientLight(0xccfbf1);
    scene.add(pointLight, ambientLight);
    // scene.fog = new THREE.Fog( 0xfefefe, 20, 2);
    const spotLight = new THREE.SpotLight(0x2dd4bf);
    spotLight.position.set(0, 60, -3);
    spotLight.intensity = 1.2;
    spotLight.angle = 0.45;
    spotLight.penumbra = 0.3;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 10;
    spotLight.shadow.mapSize.height = 10;
    spotLight.shadow.camera.near = 5;
    spotLight.shadow.camera.far = 15;
    spotLight.shadow.focus = 1;
    scene.add(spotLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luz branca com intensidade 1
    directionalLight.position.set(10, 30, 0); // Posição da luz
    directionalLight.castShadow = true; // default false
    scene.add(directionalLight);

    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      10
    );
    const lightHelper = new THREE.PointLightHelper(pointLight);
    const gridHelper = new THREE.GridHelper(200, 50);
    const axesHelper = new THREE.AxesHelper(100);
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(
      // lightHelper,
      // gridHelper,
      // axesHelper,
      directionalLightHelper,
      // spotLightHelper,
      pointLightHelper
    );

    // Sombras
    const groundGeometry = new THREE.PlaneGeometry(32, 32, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);

    const groundTexture = new THREE.TextureLoader().load(
      '../../../assets/floor/textures/asphalt_02_disp_4k.png'
    );
    const groundTexture3d = new THREE.TextureLoader().load(
      '../../../assets/floor/textures/asphalt_02_diff_4k.jpg'
    );

    const planeGeo = new THREE.PlaneGeometry(100, 100, 100, 100);
    const planeMat = new THREE.MeshPhongMaterial({
      map: groundTexture,
      color: 0x57534e,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(helper);

    //Adiciona controles 3D
    // const controls = new OrbitControls(camera, document.body);
    /*     controls.enableZoom = false;
    controls.enablePan = false;     */

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x18181b);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setAnimationLoop(animation);
    const canvas = document.getElementById('threejs-canvas');
    const widthCanva = canvas!.offsetWidth;
    const heightCanva = canvas!.offsetHeight;
    renderer.setSize(widthCanva, heightCanva);
    canvas?.appendChild(renderer.domElement);

    // Loading
    const loaddingManager = new THREE.LoadingManager();
    loaddingManager.onProgress = (url, loaded, total) => {
      this.progress = ((loaded / total) * 100).toFixed(0);
    };
    loaddingManager.onLoad = () => {
      this.isLoading = false;
    };

    const loader = new GLTFLoader(loaddingManager);
    const rgbeLoader = new RGBELoader(loaddingManager);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1; // Adjust exposure as needed
    // https://market.pmnd.rs/hdri/kiara
    rgbeLoader.load(
      '../../../assets/MRHDRI/MR_INT-006_LoftIndustrialWindow_Griffintown.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
      }
    );

    loader.load('../../../assets/floor/cracked_concret/scene.gltf', (gltf) => {
      const mesh = gltf.scene;

      mesh.traverse((child) => {
        child.receiveShadow = true;
        child.castShadow = true;
      });

      mesh.scale.set(9, 9, 9);
      mesh.position.set(0, 0, -3);
      scene.add(mesh);
    });

    const carTexture = new THREE.TextureLoader().load(
      '../../../assets/MRHDRI/kiara_1_dawn_1k.hdr'
    );
    const carMat = new THREE.MeshPhongMaterial({
      color: Number('0x' + this.color.replace('#', '')),
      reflectivity: 10,
      // normalMap: carTexture
    });

    let objectCar: any;
    loader.load('../../../assets/porsche/scene.gltf', (gltf) => {
      console.log(gltf);
      const mesh = gltf.scene;
      objectCar = mesh;

      mesh.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
        console.log(child.name);
        console.log(child);
        const objToPaint = ['Object_12', 'Object_14', 'Object_26', 'Object_28'];
        // 12: Aerofolio
        // 14: Lataria
        // 26: Farol
        if ((<THREE.Mesh>child).isMesh && objToPaint.includes(child.name)) {
          (<THREE.Mesh>child).material = carMat;
        }
      });

      mesh.scale.set(1.5, 2.25, 1.5);
      mesh.position.set(0, 1.6, -3);
      pointLight.position.set(mesh.position.x + 1, 7, mesh.position.z + 10);

      scene.add(mesh);
      // scene.add(pointLight);
      // renderer.render(gltf.scenes[0], camera);
    });

    camera.position.set(15, 10, 15);
    camera.lookAt(scene.position);
    // animation
    function animation(time: number) {
      /*       if (camera.position.z > 15) {
        camera.position.z -= 0.1;
      }

      if (camera.position.y > 15) {
        camera.position.y -= 0.1;
      }

      if (camera.position.x > 15) {
        camera.position.x -= 0.1;
      } */

      renderer.render(scene, camera);
    }
  }
}
