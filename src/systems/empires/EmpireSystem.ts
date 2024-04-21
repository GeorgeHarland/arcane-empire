import { castleNames, empireColours, empireNames, rulerNames } from "../../setup/constants";
import { HexagonGrid } from "../hex_grid/HexagonGrid";
import { TerrainType } from "../world_generation/TerrainTileRecords";
import { Tile, WorldModel } from "../world_generation/WorldModel";
import { Empire } from "./Empire";

export interface EmpireSettings {
    seed: string;
    numberOfEmpires: number;
    minStartSize: number;
    maxStartSize: number;
    minSeparationDistance: number;
}

export class EmpiresSystem {

    scene: Phaser.Scene;
    randomGenerator: Phaser.Math.RandomDataGenerator;

    hexGrid: HexagonGrid;
    worldModel: WorldModel;

    empires: Empire[];

    constructor(scene: Phaser.Scene, hexGrid: HexagonGrid, worldModel: WorldModel, empireSettings: EmpireSettings) {

        this.scene = scene;
        this.randomGenerator = new Phaser.Math.RandomDataGenerator([empireSettings.seed]);

        this.hexGrid = hexGrid;
        this.worldModel = worldModel;

        this.empires = [];

        for (let i = 0; i < empireSettings.numberOfEmpires; i++) {

            let captialTile: Tile = worldModel.getRandomTile([TerrainType.Grass, TerrainType.Forest, TerrainType.Mountain]);

            while (this.empires.some(empire => empire.capitalTile.coordinates.distance(captialTile.coordinates) <= empireSettings.minSeparationDistance)) {
                captialTile = worldModel.getRandomTile([TerrainType.Grass, TerrainType.Forest, TerrainType.Mountain]);
            }

            this.empires[i] = new Empire(this,
                empireNames[this.randomGenerator.between(0, empireNames.length)],
                castleNames[this.randomGenerator.between(0, castleNames.length)],
                rulerNames[this.randomGenerator.between(0, rulerNames.length)],
                captialTile, empireColours[i]);
        }

        let empireSizes: number[] = [];

        for (let i = 0; i < this.empires.length; i++) {
            empireSizes[i] = this.randomGenerator.between(empireSettings.minStartSize, empireSettings.maxStartSize);
        }

        let territoryGenerationComplete: boolean = true;

        do {
            territoryGenerationComplete = true;

            for (let i = 0; i < this.empires.length; i++) {

                if (this.empires[i].territoryTiles.length == empireSizes[i])
                    continue;

                let newTerrirotyTile: Tile = this.empires[i].getExpandableTiles(worldModel)[0];

                this.empires[i].addTileToTerritories(newTerrirotyTile);

                territoryGenerationComplete = false;
            }
        } while (territoryGenerationComplete == false);

    }

    public drawEmpires(): void {

        console.log("preload");

        this.empires.forEach((empire: Empire) => {

            console.log(empire);

            empire.redrawTerritoryOutline();
        });
    }

    public getOwningEmpire(tileToCheck: Tile): Empire | undefined {

        for (let i = 0; i < this.empires.length; i++) {
            if (this.empires[i].territoryTiles.some(empireTile => empireTile == tileToCheck)) {
                return this.empires[i];
            }
        }

        return undefined;
    }


}