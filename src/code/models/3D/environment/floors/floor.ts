import * as THREE from 'three';
import { Item } from '../items/item';
import { Model } from '../model';

export class Floor /*extends Model*/ {
  declare _asset: THREE.Mesh;
  declare _normal: THREE.Vector3;

  // geometry!: THREE.PlaneGeometry;
  // textures: IDictionary<THREE.Texture> = {};
  // material!: THREE.MeshStandardMaterial;
  // mesh!: THREE.Mesh;

  // /**
  //  *
  //  */
  // constructor() {
  //   this.setGeometry();
  //   this.setTextures();
  //   this.setMaterial();
  //   this.setMesh();
  // }

  // setGeometry() {
  //   this.geometry = new THREE.PlaneGeometry(200, 200);
  // }

  // setTextures() {
  //   const repeatValue: number = 150;
  //   this.textures.color = this.resources.items
  //     .grassColorTexture as THREE.Texture;
  //   this.textures.color.encoding = THREE.sRGBEncoding;
  //   this.textures.color.repeat.set(repeatValue, repeatValue);
  //   this.textures.color.wrapS = THREE.RepeatWrapping;
  //   this.textures.color.wrapT = THREE.RepeatWrapping;

  //   this.textures.normal = this.resources.items
  //     .grassNormalTexture as THREE.Texture;
  //   this.textures.normal.repeat.set(repeatValue, repeatValue);
  //   this.textures.normal.wrapS = THREE.RepeatWrapping;
  //   this.textures.normal.wrapT = THREE.RepeatWrapping;
  // }

  // setMaterial() {
  //   this.material = new THREE.MeshStandardMaterial({
  //     map: this.textures.color,
  //     normalMap: this.textures.normal,
  //   });
  // }

  // setMesh() {
  //   this.mesh = new THREE.Mesh(this.geometry, this.material);
  //   this.mesh.rotation.x = -Math.PI * 0.5;
  //   //this.mesh.receiveShadow = true;
  // }

  /**
   * Constructor
   */
  constructor() // initialPosition: THREE.Vector3 = new THREE.Vector3(), // goToHTML: number | null, // goToEnvironment: number | null, // checkpoint: Item | null, // isInteractable: boolean, // assetId: number, // height: number, // description: string, // name: string, // id: number,
  // initialYAngleRotation: number = 0
  {
    // super(
    //   id,
    //   name,
    //   description,
    //   height,
    //   assetId,
    //   isInteractable,
    //   checkpoint,
    //   goToEnvironment,
    //   goToHTML,
    //   initialPosition,
    //   initialYAngleRotation
    // );

    //this._logger.log(`${this.constructor.name} class instantiated:`, this);

    this._normal = new THREE.Vector3(0, 1, 0);
    this.setMesh();
  }

  private setMesh() {
    this._asset = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial({ color: new THREE.Color('white') })
    );
    this._asset.rotateX(-Math.PI / 2);
  }
}
