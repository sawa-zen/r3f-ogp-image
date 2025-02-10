import { Color } from "three"

const vertexShader = `
varying vec2 vUv;            // テクスチャ座標
varying vec3 vNormal;        // ワールド空間の法線
varying vec3 vWorldPosition; // ワールド座標

void main() {
  vUv = uv;
  // 法線をワールド空間に変換
  vNormal = normalize(normalMatrix * normal);
  // ワールド座標を計算
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  // 最終的な頂点位置を計算
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
}
`

const fragmentShader = `
uniform vec3 color;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

/**
 * HSVからRGBへの変換
 * @param {vec3} hsv HSV
 */
vec3 hsv2rgb(vec3 hsv) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(hsv.xxx + K.xyz) * 6.0 - K.www);
  return hsv.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), hsv.y);
}

/**
 * カメラとポリゴンの角度を返す
 */
float getViewAngle() {
  vec3 faceNormal = normalize(vNormal); // 法線ベクトル
  vec3 lightDir = normalize(vec3(0.0, -1.0, -1.0)); // ライトの向きベクトル
  float angle = acos(dot(faceNormal, lightDir));
  return angle; // 0.0 ～ π
}

/**
 * 角度に応じたRGBを返す
 * @param {float} strength 角度の強さ
 */
vec4 generateAngleRGBA(float strength) {
  float pi = 3.141592653589793;
  float angle = mod(getViewAngle() * strength, pi) / pi; // 0.0 ～ 1.0
  return vec4(color, angle);
}

/**
 * 反射表現
 */
vec3 reflect2() {
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  return normalize(normalize(vWorldPosition) - 2.0 * dot(normalize(vWorldPosition), vNormal) * vNormal);
}

void main() {
  gl_FragColor = generateAngleRGBA(1.0) + vec4(reflect2(), 1.0);
}
`

interface Props {
  color: string
}

export const MetalMaterial = ({ color }: Props) => {
  return (
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{
        color: { value: new Color(color) },
      }}
    />
  )
}