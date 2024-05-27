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
  async ngOnInit(): Promise<void> {
    const camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      1000
    );    

    
    const scene = new THREE.Scene();
    // Adiciona iluminação
    const pointLight = new THREE.PointLight(0x404040);
    pointLight.position.set(5, 10, 5);
    const ambientLight = new THREE.AmbientLight(0x404040);
    // scene.add(pointLight, ambientLight);
    // scene.fog = new THREE.Fog( 0xffffff, 2, 1.1);      
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 30, -3);
    spotLight.intensity = 1.2
    spotLight.angle = 0.45
    spotLight.penumbra = 0.3
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.near = 5
    spotLight.shadow.camera.far = 15
    spotLight.shadow.focus = 1
    scene.add(spotLight);

    var light = new THREE.DirectionalLight(0xffffff, 1); // Luz branca com intensidade 1
    light.position.set(0, 10, 10); // Posição da luz
    // scene.add(light);

    const directionalLightHelper = new THREE.DirectionalLightHelper(light, 10);
    const lightHelper = new THREE.PointLightHelper(pointLight);
    const gridHelper = new THREE.GridHelper(200, 50);
    const axesHelper = new THREE.AxesHelper(100);    
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(lightHelper, gridHelper, axesHelper, directionalLightHelper,spotLightHelper);



    // Sombras
    const groundGeometry = new THREE.PlaneGeometry(32, 32, 32, 32);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundTexture = new THREE.TextureLoader().load(
      '../../../assets/floor/textures/asphalt_02_diff_4k.jpg'
    );
    const groundTexture3d = new THREE.TextureLoader().load(
      '../../../assets/floor/textures/asphalt_02_disp_4k.png'
    );    
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;    
    groundTexture.anisotropy = 16;
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: groundTexture,
      normalMap: groundTexture3d,
    });

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.position.set(0, 0.01, -2.5);
    // scene.add(groundMesh);

    const planeGeo = new THREE.PlaneGeometry(100,100)
    const planeMat = new THREE.MeshPhongMaterial({color: 0xffffff, dithering: true})    
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.rotation.x = -0.5 * Math.PI
    scene.add(plane)
    plane.receiveShadow = true


    //Adiciona controles 3D
    const controls = new OrbitControls(camera, document.body);
    // controls.enableZoom = false
    // controls.enablePan = false

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;    
    renderer.setClearColor(0x18181b);    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;    

    const canvas = document.getElementById('threejs-canvas');
    const widthCanva = canvas!.offsetWidth;
    const heightCanva = canvas!.offsetHeight;
    renderer.setSize(widthCanva, heightCanva);
    canvas?.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    const rgbeLoader = new RGBELoader();

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1; // Adjust exposure as needed

    rgbeLoader.load(
      '../../../assets/MRHDRI/MR_INT-006_LoftIndustrialWindow_Griffintown.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
      }
    );

    let objectCar: any;
    loader.load('../../../assets/porsche/scene.gltf', (gltf) => {
      console.log(gltf);
      const mesh = gltf.scene;
      objectCar = mesh;

      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.scale.set(1.5, 2.25, 1.5);
      mesh.position.set(0, 0, -3);
      renderer.setAnimationLoop(animation);

      scene.add(mesh);
      renderer.render(gltf.scenes[0], camera);
    });

    camera.position.set(15, 10, 15);
    camera.lookAt(scene.position);

    // animation
    function animation(time: number) {
      // objectCar.rotation.x += 0.0001;
      objectCar.rotation.y -= 0.0005;
      // objectCar.rotation.z += 0.001;
      renderer.render(scene, camera);
    }
  }
}
