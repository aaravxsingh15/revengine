import { batch1 } from "./batch1";
import { batch2 } from "./batch2";
import { batch3 } from "./batch3";
import { batch4 } from "./batch4";
import { batch5 } from "./batch5";
import type { Car } from "@/types/car";

export const allCars: Car[] = [...batch1, ...batch2, ...batch3, ...batch4, ...batch5];
