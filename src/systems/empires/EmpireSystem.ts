import GameScene from '../../scenes/GameScene';
import { empireColours } from '../../setup/constants';
import { empireNames, castleNames, rulerNames } from '../../setup/empireNames';
import { Empire, EmpirePersonality, GameData } from '../../types';
import { HexagonGrid } from '../hex_grid/HexagonGrid';
import { TerrainType } from '../world_generation/TerrainTileRecords';
import { Tile } from '../world_generation/Tile';
import { WorldModel } from '../world_generation/WorldModel';
import { EmpireEntity } from './EmpireEntity';

export interface EmpireSettings {
  seed: string;
  numberOfEmpires: number;
  minStartSize: number;
  maxStartSize: number;
  minSeparationDistance: number;
}

export class EmpiresSystem {
  scene: GameScene;
  randomGenerator: Phaser.Math.RandomDataGenerator;

  hexGrid: HexagonGrid;
  worldModel: WorldModel;

  empireEntities: EmpireEntity[];

  constructor(
    scene: GameScene,
    hexGrid: HexagonGrid,
    worldModel: WorldModel,
    empireSettings: EmpireSettings
  ) {
    this.scene = scene;
    this.randomGenerator = new Phaser.Math.RandomDataGenerator([
      empireSettings.seed,
    ]);

    this.hexGrid = hexGrid;
    this.worldModel = worldModel;

    this.empireEntities = [];

    let gameState: GameData = {
      ...this.scene.gameState!,
      empires: [],
    };

    for (let i = 0; i < empireSettings.numberOfEmpires; i++) {
      let capitalTile: Tile | undefined = undefined;

      while (
        capitalTile === undefined ||
        this.empireEntities.some(
          (empire) =>
            empire.capitalTile.coordinates.distance(capitalTile!.coordinates) <=
            empireSettings.minSeparationDistance
        )
      ) {
        capitalTile = worldModel.getRandomTile([
          TerrainType.Grass,
          TerrainType.Forest,
          TerrainType.Mountain,
        ]);
      }

      let empire: Empire = {
        empireName:
          empireNames[this.randomGenerator.between(0, empireNames.length)],
        capitalName:
          castleNames[this.randomGenerator.between(0, castleNames.length)],
        rulerName:
          rulerNames[this.randomGenerator.between(0, rulerNames.length)],
        regionalStrength: this.randomGenerator.between(
          empireSettings.minStartSize,
          empireSettings.maxStartSize
        ),
        playerReputation: 5,
        personality: this.getRandomPersonality(),
        color: empireColours[i],
        messageHistory: [],
      };

      gameState.empires.push(empire);

      this.empireEntities[i] = new EmpireEntity(this, empire, capitalTile);
    }

    let territoryGenerationComplete: boolean = true;

    do {
      territoryGenerationComplete = true;

      for (let i = 0; i < gameState.empires.length; i++) {
        if (
          this.empireEntities[i].territoryTiles.length >=
          gameState.empires[i].regionalStrength
        )
          continue;

        let newTerritoryTile: Tile =
          this.empireEntities[i].getExpandableTiles(worldModel)[0];

        this.empireEntities[i].addTileToTerritories(newTerritoryTile);

        territoryGenerationComplete = false;
      }
    } while (territoryGenerationComplete == false);

    scene.handleDataUpdate(gameState);
    scene.sendDataToPreact();
  }

  public create(): void {
    this.empireEntities.forEach((empire: EmpireEntity) => {
      empire.create();
    });
  }

  public update(time: number): void {
    this.empireEntities.forEach((empire: EmpireEntity) => {
      empire.update(
        time,
        new Phaser.Math.Vector2(
          this.hexGrid.getContainer().x,
          this.hexGrid.getContainer().y
        )
      );
    });
  }

  public getOwningEmpire(tileToCheck: Tile): EmpireEntity | undefined {
    for (let i = 0; i < this.empireEntities.length; i++) {
      if (
        this.empireEntities[i].territoryTiles.some(
          (empireTile) => empireTile == tileToCheck
        )
      ) {
        return this.empireEntities[i];
      }
    }

    return undefined;
  }

  public getRandomPersonality(): EmpirePersonality {
    switch (this.randomGenerator.between(0, 3)) {
      case 0:
        return 'passive';
      case 1:
        return 'aggressive';
      case 2:
        return 'friendly';
      case 3:
        return 'selfish';
    }

    return 'passive';
  }
}
