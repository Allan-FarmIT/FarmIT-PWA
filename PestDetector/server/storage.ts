import { pests, agrovets, farms, crops, type Pest, type Agrovet, type Farm, type Crop } from "@shared/schema";

export interface IStorage {
  getPests(): Promise<Pest[]>;
  getAgrovets(): Promise<Agrovet[]>;
  getFarms(): Promise<Farm[]>;
  createFarm(farm: Omit<Farm, 'id' | 'createdAt'>): Promise<Farm>;
  getCropsByFarmId(farmId: number): Promise<Crop[]>;
  createCrop(crop: Omit<Crop, 'id'>): Promise<Crop>;
}

export class MemStorage implements IStorage {
  private pests: Pest[];
  private agrovets: Agrovet[];
  private farms: Farm[];
  private crops: Crop[];

  constructor() {
    this.pests = [
      {
        id: 1,
        name: "Fall Armyworm",
        description: "Common pest affecting maize crops",
        treatments: {
          low: {
            organic: "Use natural predators like birds and beneficial insects. Apply neem oil or garlic spray. Practice crop monitoring.",
            chemical: "Spot treatment with low-toxicity insecticides like Spinosad. Use pheromone traps for monitoring."
          },
          medium: {
            organic: "Intensive use of biological controls (Bacillus thuringiensis). Introduce parasitic wasps. Apply botanical pesticides.",
            chemical: "Targeted application of pyrethroid insecticides. Use systemic insecticides for better control."
          },
          high: {
            organic: "Mass trapping using pheromone traps. Apply microbial pesticides at maximum rate. Consider crop rotation.",
            chemical: "Immediate application of broad-spectrum insecticides. Use combination of contact and systemic pesticides."
          }
        },
        confidence: 90
      },
      {
        id: 2,
        name: "Leaf Blight",
        description: "Fungal disease affecting crop leaves",
        treatments: {
          low: {
            organic: "Improve air circulation. Remove affected leaves. Apply compost tea or neem oil.",
            chemical: "Apply preventive copper-based fungicides at minimum rate."
          },
          medium: {
            organic: "Use potassium bicarbonate sprays. Apply biological fungicides. Adjust plant spacing.",
            chemical: "Apply systemic fungicides. Use strobilurin fungicides for control."
          },
          high: {
            organic: "Intensive application of biological fungicides. Complete removal of affected plants. Soil solarization.",
            chemical: "Emergency treatment with strong systemic fungicides. Combine protectant and systemic fungicides."
          }
        },
        confidence: 85
      }
    ];

    this.agrovets = [
      {
        id: 1,
        name: "FarmCare Agrovet",
        location: "123 Main Street, Town",
        contact: "+254700000000",
        latitude: "-1.2921",
        longitude: "36.8219"
      },
      {
        id: 2,
        name: "Green Solutions",
        location: "456 Market Road, City",
        contact: "+254711111111",
        latitude: "-1.2980",
        longitude: "36.8148"
      },
      {
        id: 3,
        name: "AgriCare Plus",
        location: "789 Farm Avenue",
        contact: "+254722222222",
        latitude: "-1.2864",
        longitude: "36.8172"
      }
    ];

    this.farms = [];
    this.crops = [];
  }

  async getPests(): Promise<Pest[]> {
    return this.pests;
  }

  async getAgrovets(): Promise<Agrovet[]> {
    return this.agrovets;
  }

  async getFarms(): Promise<Farm[]> {
    return this.farms;
  }

  async createFarm(farm: Omit<Farm, 'id' | 'createdAt'>): Promise<Farm> {
    const newFarm: Farm = {
      id: this.farms.length + 1,
      ...farm,
      createdAt: new Date(),
    };
    this.farms.push(newFarm);
    return newFarm;
  }

  async getCropsByFarmId(farmId: number): Promise<Crop[]> {
    return this.crops.filter(crop => crop.farmId === farmId);
  }

  async createCrop(crop: Omit<Crop, 'id'>): Promise<Crop> {
    const newCrop: Crop = {
      id: this.crops.length + 1,
      ...crop,
    };
    this.crops.push(newCrop);
    return newCrop;
  }
}

export const storage = new MemStorage();