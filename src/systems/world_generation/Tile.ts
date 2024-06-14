import { eventEmitter } from '../../events/EventEmitter';
import { TileType } from '../../types';
import { WizardEntity } from '../wizards/WizardEntity';
import { WorldEventEntity } from '../world_events/WorldEventEntity';
import { StructureData } from './StructureRecords';
import { TerrainData } from './TerrainTileRecords';
import { WorldModel } from './WorldModel';

export class Tile implements TileType {
  parentWorldModel: WorldModel;

  gameScene: Phaser.Scene;

  coordinates: Phaser.Math.Vector2;
  terrainData: TerrainData;
  structureData: StructureData | undefined;
  currentEvent: WorldEventEntity | null;

  terrainImage: Phaser.GameObjects.Image | undefined;

  wizardSlots: WizardEntity[];

  constructor(
    parentWorldModel: WorldModel,
    gameScene: Phaser.Scene,
    coordinates: Phaser.Math.Vector2,
    terrainType: TerrainData
  ) {
    this.parentWorldModel = parentWorldModel;
    this.gameScene = gameScene;

    this.coordinates = coordinates;
    this.terrainData = terrainType;
    this.currentEvent = null;

    this.wizardSlots = [];
  }

  public getWizardCapacity(): number {
    return 5 - this.wizardSlots.length; // Hard coded 5 slots for now but should probably be in a setting somewhere
  }

  public setImage(terrainImage: Phaser.GameObjects.Image): void {
    this.terrainImage = terrainImage;
    this.makeInteractive();
  }

  public makeInteractive(): void {
    if (this.terrainImage === undefined) return;

    this.terrainImage.setInteractive();

    this.terrainImage.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.parentWorldModel.hexGrid.pointerDown = true;

      pointer.event.preventDefault();
      this.parentWorldModel.hexGrid.dragStartX = pointer.position.x;
      this.parentWorldModel.hexGrid.dragStartY = pointer.position.y;
    });

    this.terrainImage.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.parentWorldModel.hexGrid.pointerDown == false) return;

      if (
        (Math.abs(pointer.position.x - pointer.downX) > 4 ||
          Math.abs(pointer.position.y - pointer.downY) > 4) &&
        this.parentWorldModel.hexGrid.isDragging == false
      ) {
        this.parentWorldModel.hexGrid.isDragging = true;
      }

      if (this.parentWorldModel.hexGrid.isDragging == false) return;

      const dx = pointer.position.x - this.parentWorldModel.hexGrid.dragStartX;
      const dy = pointer.position.y - this.parentWorldModel.hexGrid.dragStartY;

      this.parentWorldModel.hexGrid.dragMap(dx, dy);

      this.parentWorldModel.hexGrid.dragStartX = pointer.position.x;
      this.parentWorldModel.hexGrid.dragStartY = pointer.position.y;
    });

    this.terrainImage.on('pointerup', () => {
      this.parentWorldModel.hexGrid.pointerDown = false;

      if (this.parentWorldModel.hexGrid.isDragging == false) {
        eventEmitter.emit('tile-clicked', this);
      }

      this.parentWorldModel.hexGrid.isDragging = false;
    });
  }
}
