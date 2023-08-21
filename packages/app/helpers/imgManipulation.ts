import blurhash, { encode } from "blurhash";
import sharp from "sharp";

export function ImageToBlurHash(url: string) {
  //   return new Promise((resolve, reject) => {
  //     sharp(url)
  //       .raw()
  //       .ensureAlpha()
  //       .resize(32, 32, { fit: "inside" })
  //       .toBuffer((err, buffer, { width, height }) => {
  //         if (err) return reject(err);
  //         resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
  //       });
  //   });
  //   const imageData = getImageData(url);
  //   return encode(imageData.data, imageData.width, imageData.height, 4, 4);
}
