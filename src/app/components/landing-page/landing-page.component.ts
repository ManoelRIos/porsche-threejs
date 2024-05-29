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
    const ambientLight = new THREE.AmbientLight(0xe4e4e7);
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
    directionalLight.position.set(30, 30, 0); // Posição da luz
    directionalLight.scale.set(10, 10, 10); // Posição da luz
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
    // scene
    //   .add
    //   lightHelper,
    //   gridHelper,
    //   axesHelper,
    //   directionalLightHelper,
    //   spotLightHelper,
    //   pointLightHelper
    //   ();

    // Sombras
    const groundGeometry = new THREE.PlaneGeometry(32, 32, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);

    const groundTexture = new THREE.TextureLoader().load(
      '../../../assets/floor/textures/asphalt_02_disp_4k.png'
    );

    const planeGeo = new THREE.PlaneGeometry(100, 100, 100, 100);
    const planeMat = new THREE.MeshPhongMaterial({
      map: groundTexture,
      color: 0x57534e,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    // scene.add(plane);

    const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(helper);

    //Adiciona controles 3D
    const controls = new OrbitControls(camera, document.body);
    /*  controls.enableZoom = false;
    controls.enablePan = false; */

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
      '../../../assets/MRHDRI/MR_INT-001_NaturalStudio_NAD.hdr',
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
      mesh.position.set(0, -1, -3);
      scene.add(mesh);
    });

    const carTexture = new THREE.TextureLoader().load(
      '../../../assets/MRHDRI/kiara_1_dawn_1k.hdr'
    );
    const carMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      reflectivity: 10,
      // normalMap: carTexture
    });

    let objectCar: any;
    loader.load('../../../assets/porsche/scene.gltf', (gltf) => {
      console.log(gltf);
      const mesh = gltf.scene;
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
          // (<THREE.Mesh>child).material = carMat;
        }
      });

      mesh.scale.set(1.5, 2.25, 1.5);
      mesh.position.set(0, 0.6, -3);
      
      const headlightSpot1 = new THREE.SpotLight(0xfde68a, 1, 10, Math.PI / 3); // White color, 1 intensity, 10 range, narrow beam
      headlightSpot1.position.set(mesh.position.x + 1.5, 4.5, mesh.position.z + 10); // Adjust position relative to car model
      headlightSpot1.target.position.set(mesh.position.x + 1.5, 4.5, mesh.position.z + 10); // Aim slightly forward
      // headlightSpot1.castShadow = true; // Enable shadows
      scene.add(headlightSpot1);
      // const spotLightHelper = new THREE.SpotLightHelper(headlightSpot1);
      // scene.add(spotLightHelper)

            const headlightSpot2 = new THREE.SpotLight(0xfde68a, 1, 10, Math.PI / 3); // White color, 1 intensity, 10 range, narrow beam
      headlightSpot2.position.set(mesh.position.x - 5, 4.5, mesh.position.z + 10); // Adjust position relative to car model
      headlightSpot2.target.position.set(mesh.position.x - 5, 4.5, mesh.position.z + 10); // Aim slightly forward      
      headlightSpot2.castShadow = true; // Enable shadows
      scene.add(headlightSpot2);
        const spotLightHelper = new THREE.SpotLightHelper(headlightSpot2);
      // scene.add(spotLightHelper)
      objectCar = mesh;
      scene.add(mesh);
      // scene.add(pointLight);
      // renderer.render(gltf.scenes[0], camera);
    });

    camera.position.set(50, 50, 50);
    camera.lookAt(scene.position);
    // animation

    function animation(time: number) {
      (<THREE.Mesh>objectCar)?.traverse((child) => {
        const leftWheels = ['Object_44', 'Object_50'];
        // 44: Roda TE
        // 50: Roda DE
        const rightWheels = ['Object_56', 'Object_62'];
        // 56: Roda TD
        // 62: Roda DD
        if ((<THREE.Mesh>child).isMesh && leftWheels.includes(child.name)) {
          child.rotation.x += 0.5;
        }
        if ((<THREE.Mesh>child).isMesh && rightWheels.includes(child.name)) {
          child.rotation.x -= 0.5;
        }
      });      

      if (camera.position.z > 20) {
        camera.position.z -= 0.05;
      }

      if (camera.position.y > 20) {
        camera.position.y -= 0.05;
      }

      if (camera.position.x > 20) {
        camera.position.x -= 0.05;
      }

      renderer.render(scene, camera);
    }
  }
}
