import { airWizardNames, earthWizardNames, fireWizardNames, guildNames, waterWizardNames } from "../../setup/wizardNames";
import { HexagonGrid } from "../hex_grid/HexagonGrid";
import { StructureType } from "../world_generation/StructureRecords";
import { Tile, WorldModel } from "../world_generation/WorldModel";
import { MovementAction } from "./MovementAction";
import { Wizard } from "./Wizard";
import { ElementalPower, WizardCounts, WizardDatas } from "./WizardRecords";



export interface WizardSetings {
    seed: string;
    numberOfWizaards: WizardCounts;
}

export class WizardManager {

    scene: Phaser.Scene;
    randomGenerator: Phaser.Math.RandomDataGenerator;

    hexGrid: HexagonGrid;
    worldModel: WorldModel;

    guildName: string;
    guildTowerTile: Tile;

    wizards: Wizard[];

    stationaryWizards: [Wizard, Tile][];
    movingWizards: [Wizard, MovementAction][];

    constructor(scene: Phaser.Scene, hexGrid: HexagonGrid, worldModel: WorldModel, wizardSettings: WizardSetings) {

        this.scene = scene;
        this.randomGenerator = new Phaser.Math.RandomDataGenerator([wizardSettings.seed]);

        this.hexGrid = hexGrid;
        this.worldModel = worldModel;

        this.guildName = this.randomGenerator.pick(guildNames);
        this.guildTowerTile = this.worldModel.getRandomTile(undefined, [StructureType.Wizard_Tower]);

        this.wizards = [];

        this.stationaryWizards = [];
        this.movingWizards = [];

        for (let i = 0; i < wizardSettings.numberOfWizaards.fire; i++) {
            this.wizards.push(new Wizard(this, this.getRandomWizardName(ElementalPower.Fire), WizardDatas.fire));
        }

        for (let i = 0; i < wizardSettings.numberOfWizaards.water; i++) {
            this.wizards.push(new Wizard(this, this.getRandomWizardName(ElementalPower.Water), WizardDatas.water));
        }

        for (let i = 0; i < wizardSettings.numberOfWizaards.earth; i++) {
            this.wizards.push(new Wizard(this, this.getRandomWizardName(ElementalPower.Earth), WizardDatas.earth));
        }

        for (let i = 0; i < wizardSettings.numberOfWizaards.air; i++) {
            this.wizards.push(new Wizard(this, this.getRandomWizardName(ElementalPower.Air), WizardDatas.air));
        }

        this.wizards = this.randomGenerator.shuffle(this.wizards);
    }

    public preload(): void {

        Object.entries(WizardDatas).forEach(([elementalPower, wizardData]) => {
            this.scene.load.image(elementalPower + "_wizard", wizardData.path);
        });
    }

    public create(): void {

        for (let i = 0; i < this.wizards.length; i++) {

            this.wizards[i].spawnWizard();

            this.stationaryWizards.push([this.wizards[i], this.guildTowerTile]);

            //this.wizards[i].setIdle();
        }
    }

    public update(): void {

        this.getOccupiedTiles().forEach(tile => {

            this.getWizardsOnTile(tile).forEach((wizard, index) => {

                let slotPosition = this.hexGrid.getUnitSlotPixelPosition(tile.coordinates, index);

                let wizardImage = wizard.getImage();

                wizardImage.x = slotPosition.x + this.hexGrid.getContainer().x;
                wizardImage.y = slotPosition.y + this.hexGrid.getContainer().y;

                wizardImage.depth = wizardImage.y;
            })
        });


    }

    public getRandomWizardName(powerType: ElementalPower): string {

        switch (powerType) {
            case ElementalPower.Fire:
                return this.randomGenerator.pick(fireWizardNames);

            case ElementalPower.Water:
                return this.randomGenerator.pick(waterWizardNames);

            case ElementalPower.Earth:
                return this.randomGenerator.pick(earthWizardNames);

            case ElementalPower.Air:
                return this.randomGenerator.pick(airWizardNames);
        }

        return "Master Nonameus";
    }

    public getOccupiedTiles(): Tile[] {

        return this.stationaryWizards.map(([_, tile]) => tile);
    }

    public getWizardsOnTile(tileToCheck: Tile): Wizard[] {

        if (this.stationaryWizards.some(([_, tile]) => tile == tileToCheck) == false)
            return [];

        let wizardPairsForTile: [Wizard, Tile][] = this.stationaryWizards.filter(([_, tile]) => tile == tileToCheck);

        return wizardPairsForTile.map(([wizard, _]) => wizard);
    }

    public sendWizardToTile(wizard: Wizard, tile: Tile): void {




    }

}