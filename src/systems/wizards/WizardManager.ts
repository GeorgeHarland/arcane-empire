import { eventEmitter } from '../../events/EventEmitter';
import GameScene from '../../scenes/GameScene';
import {
  airWizardNames,
  earthWizardNames,
  fireWizardNames,
  guildNames,
  waterWizardNames,
} from '../../setup/wizardNames';
import { ElementType, GameData, Wizard, WizardDispatchData } from '../../types';
import { HexagonGrid } from '../hex_grid/HexagonGrid';
import { StructureType } from '../world_generation/StructureRecords';
import { Tile } from '../world_generation/Tile';
import { WorldModel } from '../world_generation/WorldModel';
import { MovementAction } from './MovementAction';
import { WizardEntity } from './WizardEntity';
import { WizardType, WizardCounts, WizardGraphicDatas } from './WizardRecords';

export interface WizardSettings {
  seed: string;
  numberOfWizards: WizardCounts;
}

export class WizardManager {
  scene: GameScene;
  randomGenerator: Phaser.Math.RandomDataGenerator;

  hexGrid: HexagonGrid;
  worldModel: WorldModel;

  guildName: string;
  guildTowerTile: Tile;

  wizardsEntities: WizardEntity[];

  staticWizards: Map<WizardEntity, Tile>;
  movingWizards: Map<WizardEntity, MovementAction>;

  buyWizardListener: () => void;

  dispatchWizard: (wizard: Wizard, tile: Tile) => void;

  constructor(
    scene: GameScene,
    hexGrid: HexagonGrid,
    worldModel: WorldModel,
    wizardSettings: WizardSettings
  ) {
    this.scene = scene;
    this.randomGenerator = new Phaser.Math.RandomDataGenerator([
      wizardSettings.seed,
    ]);

    this.hexGrid = hexGrid;
    this.worldModel = worldModel;

    this.guildName = this.randomGenerator.pick(guildNames);
    this.guildTowerTile = this.worldModel.getRandomTile(undefined, [
      StructureType.Wizard_Tower,
    ]);

    this.wizardsEntities = [];

    this.staticWizards = new Map<WizardEntity, Tile>();
    this.movingWizards = new Map<WizardEntity, MovementAction>();

    let gameState: GameData = {
      ...this.scene.gameState!,
      wizards: {
        fire: [],
        water: [],
        earth: [],
        air: [],
      },
    };

    for (let i = 0; i < wizardSettings.numberOfWizards.fire; i++) {
      let [name, initials] = this.getRandomWizardNameAndInitials(
        WizardType.Fire
      );

      let wizard: Wizard = {
        name,
        initials,
        level: 1,
        status: 'idle',
        maxHealth: 100,
      };

      gameState.wizards.fire.push(wizard);

      this.wizardsEntities.push(
        new WizardEntity(this, wizard, WizardGraphicDatas.fire)
      );
    }

    for (let i = 0; i < wizardSettings.numberOfWizards.water; i++) {
      let [name, initials] = this.getRandomWizardNameAndInitials(
        WizardType.Water
      );

      let wizard: Wizard = {
        name,
        initials,
        level: 1,
        status: 'idle',
        maxHealth: 100,
      };

      gameState.wizards.water.push(wizard);

      this.wizardsEntities.push(
        new WizardEntity(this, wizard, WizardGraphicDatas.water)
      );
    }

    for (let i = 0; i < wizardSettings.numberOfWizards.earth; i++) {
      let [name, initials] = this.getRandomWizardNameAndInitials(
        WizardType.Earth
      );

      let wizard: Wizard = {
        name,
        initials,
        level: 1,
        status: 'idle',
        maxHealth: 100,
      };

      gameState.wizards.earth.push(wizard);

      this.wizardsEntities.push(
        new WizardEntity(this, wizard, WizardGraphicDatas.earth)
      );
    }

    for (let i = 0; i < wizardSettings.numberOfWizards.air; i++) {
      let [name, initials] = this.getRandomWizardNameAndInitials(
        WizardType.Air
      );

      let wizard: Wizard = {
        name,
        initials,
        level: 1,
        status: 'idle',
        maxHealth: 100,
      };

      gameState.wizards.air.push(wizard);

      this.wizardsEntities.push(
        new WizardEntity(this, wizard, WizardGraphicDatas.air)
      );
    }

    this.wizardsEntities = this.randomGenerator.shuffle(this.wizardsEntities);

    scene.handleDataUpdate(gameState);
    scene.sendDataToPreact();

    this.buyWizardListener = eventEmitter.subscribe(
      'buy-wizard',
      this.buyWizard.bind(this)
    );

    this.dispatchWizard = eventEmitter.subscribe(
      'dispatch-wizard',
      (wizardDispatchData: WizardDispatchData) => {
        let wizardEntity: WizardEntity | undefined = this.getWizardEntityByName(
          wizardDispatchData.wizard.name
        );

        if (wizardEntity === undefined) return;

        this.sendWizardToTile(wizardEntity, wizardDispatchData.tile);
      }
    );
  }

  public preload(): void {
    Object.entries(WizardGraphicDatas).forEach(
      ([elementalPower, wizardData]) => {
        this.scene.load.image(elementalPower + '_wizard', wizardData.path);
      }
    );
  }

  public create(): void {
    for (const wizardEntity of this.wizardsEntities) {
      wizardEntity.spawnWizard();

      this.staticWizards.set(wizardEntity, this.guildTowerTile);

      wizardEntity.setIdle();
    }
  }

  public update(deltaTimeMs: number): void {
    // Lock the idle wizards to their respective slot on their tile

    this.getOccupiedTiles().forEach((tile) => {
      this.getWizardsOnTile(tile).forEach((wizard, index) => {
        let slotPosition = this.hexGrid.getUnitSlotPixelPosition(
          tile.coordinates,
          index
        );

        const wizardContainer = wizard.getContainer();

        wizardContainer.x = slotPosition.x + this.hexGrid.getContainer().x;
        wizardContainer.y = slotPosition.y + this.hexGrid.getContainer().y;

        wizardContainer.depth = wizardContainer.y;
      });
    });

    // Update the motions of any wizards moving between tiles

    for (const [_, movementAction] of this.movingWizards.entries()) {
      movementAction.update(deltaTimeMs);
    }
  }

  public getRandomWizardNameAndInitials(
    powerType: WizardType
  ): [string, string] {
    let name: string = 'Master Nonameus';

    switch (powerType) {
      case WizardType.Fire:
        name = this.randomGenerator.pick(fireWizardNames);
        break;
      case WizardType.Water:
        name = this.randomGenerator.pick(waterWizardNames);
        break;
      case WizardType.Earth:
        name = this.randomGenerator.pick(earthWizardNames);
        break;
      case WizardType.Air:
        name = this.randomGenerator.pick(airWizardNames);
        break;
    }

    let nameParts = name.split(' ');
    let initials =
      nameParts.map((word) => word[0].toUpperCase()).join('.') + '.';

    return [name, initials];
  }

  public getOccupiedTiles(): Tile[] {
    return Array.from(this.staticWizards.values());
  }

  public getWizardsOnTile(tileToCheck: Tile): WizardEntity[] {
    let wizards: WizardEntity[] = [];

    for (const [wizard, tile] of this.staticWizards.entries()) {
      if (tile === tileToCheck) {
        wizards.push(wizard);
      }
    }

    return wizards;
  }

  private getWizardEntityByName(name: string): WizardEntity | undefined {
    return this.wizardsEntities.find(
      (entity) => entity.wizardData.name == name
    );
  }

  public sendWizardToTile(targetWizard: WizardEntity, targetTile: Tile): void {
    if (
      this.staticWizards.has(targetWizard) == false &&
      this.movingWizards.has(targetWizard) == false
    )
      return;

    let currentTile =
      this.staticWizards.get(targetWizard) ||
      this.movingWizards.get(targetWizard);

    if (currentTile === undefined) return;

    if (this.movingWizards.has(targetWizard)) {
      this.staticWizards.set(
        targetWizard,
        this.worldModel.getTile(
          this.movingWizards.get(targetWizard)!.wizardPosition()
        )
      );
      const wiz = this.movingWizards.get(targetWizard);
      wiz ? this.movingWizards.get(targetWizard)?.complete : null;
      this.movingWizards.get(targetWizard)?.completeCallback();
    }

    this.movingWizards.set(
      targetWizard,
      new MovementAction(
        this.worldModel,
        this.hexGrid,
        targetWizard,
        this.staticWizards.has(targetWizard)
          ? (currentTile as Tile)
          : 'fetchTile',
        targetTile,
        20 * this.hexGrid.hexScale,
        () => {
          this.setWizardToStatic(targetWizard, targetTile);
        }
      )
    );

    this.staticWizards.delete(targetWizard);
  }

  private setWizardToStatic(
    targetWizard: WizardEntity,
    targetTile: Tile
  ): void {
    this.movingWizards.delete(targetWizard);
    this.staticWizards.set(targetWizard, targetTile);
  }

  private buyWizard = (elementType: ElementType) => {
    let [name, initials] = this.getRandomWizardNameAndInitials(
      elementType as WizardType
    );

    let newWizard: Wizard = {
      name,
      initials,
      level: 1,
      status: 'idle',
      maxHealth: 100,
    };

    let newWizardEntity = new WizardEntity(
      this,
      newWizard,
      WizardGraphicDatas[elementType as WizardType]
    );

    newWizardEntity.spawnWizard();

    newWizardEntity.setIdle();

    let modifiedGameState: GameData = { ...this.scene.gameState! };

    modifiedGameState.playerGold -=
      modifiedGameState.tower.baseWizardCost +
      modifiedGameState.tower.perExtraWizardCost *
        (modifiedGameState.wizards[elementType].length - 1);

    modifiedGameState.wizards[elementType].push(newWizard);

    this.wizardsEntities.push(newWizardEntity);

    this.staticWizards.set(newWizardEntity, this.guildTowerTile);

    this.scene.handleDataUpdate(modifiedGameState);
    this.scene.sendDataToPreact();
  };
}
