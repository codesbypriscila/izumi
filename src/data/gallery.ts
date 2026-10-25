import type { GalleryImage } from "@/types/site";
import { images } from "./images";

/** Order and photos of the gallery grid. Captions: src/i18n/dictionaries. */
export const gallery: GalleryImage[] = [
  { id: "room", src: images.interiorBooths },
  { id: "platter", src: images.sushiPlatter },
  { id: "wagyu", src: images.wagyu },
  { id: "plating", src: images.sashimiPlating },
  { id: "kaiseki", src: images.kaisekiSpread },
  { id: "sashimi", src: images.sashimiBoat },
];
