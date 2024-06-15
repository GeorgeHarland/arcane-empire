import { WizardEntity } from '../systems/wizards/WizardEntity';
import { WorldEventEntity } from '../systems/world_events/WorldEventEntity';
import {
  StructureData,
  StructureType,
} from '../systems/world_generation/StructureRecords';
import {
  TerrainData,
  TerrainType,
} from '../systems/world_generation/TerrainTileRecords';
import { Tile } from '../systems/world_generation/Tile';
import { WorldModel } from '../systems/world_generation/WorldModel';

export type GameData = null | {
  wizards: WizardCollection;
  empires: EmpireCollection;
  tower: Tower;
  playerGold: number;
  reputation: number;
  upgrades: {
    [key: string]: boolean;
  };
  events: WorldEvent[];
};

export type WizardCollection = {
  [element in ElementType]: Wizard[];
};

export type TileType = {
  parentWorldModel: WorldModel;
  coordinates: Phaser.Math.Vector2;
  terrainData: TerrainData;
  structureData: StructureData | undefined;
  terrainImage: Phaser.GameObjects.Image | undefined;
  wizardSlots: WizardEntity[];
  currentEvent: WorldEventEntity | null;
  getWizardCapacity: () => number;
  setImage: (terrainImage: Phaser.GameObjects.Image) => void;
  makeInteractive: () => void;
};

export type EmpireCollection = Empire[];

export type Empire = {
  empireName: string;
  capitalName: string;
  rulerName: string;
  regionalStrength: number;
  playerReputation: number;
  messageHistory: Message[];
  personality: EmpirePersonality;
  color: number;
};

export type Message = {
  message: string;
  sender: 'user' | 'empire' | 'system';
  timestamp: number;
};

export type Mission = {
  name: string;
  empireName: string;
  description: string;
  reward: number;
  status: 'available' | 'in-progress' | 'completed';
};

export type Tower = {
  baseWizardCost: number;
  perExtraWizardCost: number;
  wizardCapacities: WizardCounts;
};

export type WizardCounts = {
  [element in ElementType]: number;
};

export type WorldEvent = {
  name: string;
  description: string;
  type: WorldEventType;
  difficultyRating: number;
  mission?: Mission;
  elementalEffectiveness: {
    [element in ElementType]: number;
  };
};

export type Wizard = {
  name: string;
  initials: string;
  level: number;
  maxHealth: number;
  status: 'idle' | 'moving' | 'away';
};

export type EmpirePersonality =
  | 'megalomaniacal'
  | 'erratic'
  | 'passive'
  | 'friendly'
  | 'greedy'
  | 'selfish'
  | 'reclusive';

export type ElementType = 'fire' | 'water' | 'earth' | 'air';

export type WorldEventType = 'tornado' | 'fire' | 'earthquake';

export type WorldEventsSettingsCollection = {
  seed: string;
  spawnIntervalSec: number;
  perEventSettings: {
    [element in WorldEventType]: WorldEventSettings;
  };
};

export type WorldEventSettings = {
  type: WorldEventType;
  graphics: {
    path: string;
    scale: number;
    frameWidth: number;
    frameHeight: number;
    frameCount: number;
    originX: number;
    originY: number;
  };
  terrainFilter?: TerrainType[];
  structureFilter?: StructureType[];
  chaosRate: number;
  chaosCapacity: number;
  scoreDeductionPerTick: number;
  banishmentScore: number;
};

export type WizardDispatchData = {
  wizard: Wizard;
  tile: Tile;
};
