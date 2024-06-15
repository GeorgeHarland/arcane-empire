import { lerp } from '../../helpers';
import { HexagonGrid } from '../hex_grid/HexagonGrid';
import { Tile } from '../world_generation/Tile';
import { WorldModel } from '../world_generation/WorldModel';
import { WizardEntity } from './WizardEntity';

export class MovementAction {
  worldModel: WorldModel;
  hexGrid: HexagonGrid;

  wizard: WizardEntity;

  startTile: Tile;
  endTile: Tile;
  path: Phaser.Math.Vector2[];

  startPixelPosition: Phaser.Math.Vector2;
  endPixelPosition: Phaser.Math.Vector2;

  speed: number;

  distance: number;
  time: number;

  progress: number;

  complete: boolean;
  completeCallback: () => void;

  constructor(
    worldModel: WorldModel,
    hexGrid: HexagonGrid,
    wizard: WizardEntity,
    startTile: Tile,
    endTile: Tile,
    speed: number,
    completeCallback: () => void
  ) {
    this.worldModel = worldModel;
    this.hexGrid = hexGrid;

    this.wizard = wizard;

    this.startTile = startTile;
    this.endTile = endTile;

    this.startPixelPosition = this.hexGrid.convertGridHexToPixelHex(
      startTile.coordinates
    );
    this.endPixelPosition = this.hexGrid.convertGridHexToPixelHex(
      endTile.coordinates
    );

    this.speed = speed;

    this.path = this.pathfind(startTile, endTile);
    this.distance = this.startPixelPosition.distance(this.endPixelPosition);
    this.time = this.distance / this.speed;

    this.progress = 0;

    this.complete = false;
    this.completeCallback = completeCallback;
  }

  private pathfind(startPoint: Tile, endPoint: Tile) {
    const start = startPoint.coordinates;
    const end = endPoint.coordinates;

    /* list of hexes leading to hashed hex, hashed by Vec2 hex position */
    const paths: { [key: string]: any } = {};
    // define paths before isNew

    const neighbours = (hex: Phaser.Math.Vector2) =>
      this.hexGrid.getNeighbouringHexes(hex);
    const hash = (hex: Phaser.Math.Vector2) => '<' + hex.x + ',' + hex.y + '>';
    const isNew = (hex: any) => paths[hash(hex)] === undefined;
    const isWalkable = (hex: Phaser.Math.Vector2) =>
      this.worldModel.getTile(hex).terrainData.is_walkable;

    paths[hash(start)] = [start];
    let curPass = [start];
    let nextPass: any[] = [];
    while (curPass.length !== 0) {
      curPass.forEach((curHex) => {
        const newHexes = neighbours(curHex).filter(isNew).filter(isWalkable);
        newHexes.forEach((newHex) => {
          const pathHere = paths[hash(curHex)].concat([newHex]);
          paths[hash(newHex)] = pathHere;
          nextPass.push(newHex);
        });
      });
      curPass = nextPass;
      nextPass = [];
    }

    return paths[hash(end)].map((hex: Phaser.Math.Vector2) =>
      this.hexGrid.convertGridHexToPixelHex(hex)
    );
  }

  public update(deltaTimeMs: number) {
    if (this.complete) return;

    this.progress += deltaTimeMs / 1000;

    if (this.progress >= this.time) {
      this.complete = true;
      this.completeCallback();
      return;
    }

    const wizardContainer = this.wizard.getContainer();

    wizardContainer.x = this.wizardPosition().x + this.hexGrid.getContainer().x;
    wizardContainer.y = this.wizardPosition().y + this.hexGrid.getContainer().y;

    wizardContainer.depth = wizardContainer.y;
  }

  private wizardPosition(): Phaser.Math.Vector2 {
    const journeyProgress = (this.progress / this.time) * this.path.length;
    const legStartIndex = Math.floor(journeyProgress);
    const legStart = this.path[legStartIndex];
    const legEnd = this.path[legStartIndex + 1];
    const legProgress = journeyProgress - legStartIndex;
    if (legStartIndex + 1 >= this.path.length) {
      return legStart; // end doesn't exist after arrival, start is final position
    } else {
      return lerp(legStart, legEnd, legProgress);
    }
  }
}
