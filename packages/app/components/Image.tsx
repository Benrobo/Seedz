import React from "react";
import { Blurhash } from "react-blurhash";

interface ImageTagProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: React.ComponentProps<"div">["className"];
  style?: React.CSSProperties;
  hash?: string;
}

function ImageTag({
  src,
  width,
  height,
  alt,
  className,
  style,
  ...props
}: ImageTagProps) {
  return (
    <img
      src={src}
      className={className}
      alt={alt}
      width={width}
      height={height}
      style={style}
      crossOrigin={"anonymous"}
      loading="lazy"
      {...props}
    />
  );
}

export default ImageTag;

//! Use this lazyload component later in rendering themes images
export function LazyLoadImg({
  src,
  width,
  height,
  alt,
  className,
  style,
  hash,
}: ImageTagProps) {
  const [imgLoaded, setImgLoaded] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => setImgLoaded(true);
    img.src = src;
  }, [src]);

  return (
    <>
      {!imgLoaded && (
        <Blurhash
          hash={hash as string} // each img hash
          width={"100%"}
          height={"100%"}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}
      {imgLoaded && (
        <img
          src={src}
          className={className}
          alt={alt}
          width={width}
          height={height}
          style={style}
          crossOrigin={"anonymous"}
          loading="lazy"
        />
      )}
    </>
  );
}
