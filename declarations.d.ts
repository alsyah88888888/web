import * as THREE from "three";
import { ThreeElements } from "@react-three/fiber";

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.jpg" {
  const content: any;
  export default content;
}
