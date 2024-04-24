import { RegionOutline } from "../regions/RegionOutline";
import { StructureDatas } from "../world_generation/StructureRecords";
import { TerrainDatas } from "../world_generation/TerrainTileRecords";
import { Tile, WorldModel } from "../world_generation/WorldModel";
import { EmpiresSystem } from "./EmpireSystem";



export class Empire {

    empireSystem: EmpiresSystem;

    empireName: string;
    captialName: string;
    rulerName: string;

    capitalTile: Tile;
    territoryTiles: Tile[];

    territoyOutline: RegionOutline;

    constructor(empireSystem: EmpiresSystem, captialName: string, empireName: string, rulerName: string, capitalTile: Tile, colour: number) {

        this.empireSystem = empireSystem;

        this.capitalTile = capitalTile;

        this.territoryTiles = [capitalTile];

        empireSystem.worldModel.getNeighbouringTiles(capitalTile).forEach(adjTile => {
            this.territoryTiles.push(adjTile);
        });

        this.empireName = empireName;
        this.captialName = captialName;
        this.rulerName = rulerName;

        this.territoyOutline = new RegionOutline(this.empireSystem.scene, this.empireSystem.hexGrid, [], colour, 3.5, false)

        capitalTile.terrainData = TerrainDatas.Grass;
        capitalTile.structureData = StructureDatas.Castle;
    }

    public addTileToTerritories(newTile: Tile): void {

        this.territoryTiles.push(newTile);
    }

    public redrawTerritoryOutline() {

        this.territoyOutline.setHexes(this.territoryTiles.map(tile => tile.coordinates));
    }

    public getBorderTiles(worldModel: WorldModel): Tile[] {

        let borderTiles: Tile[] = []

        for (let i = 0; i < this.territoryTiles.length; i++) {
            if (worldModel.getNeighbouringTiles(this.territoryTiles[i]).some(neighbouringTile => this.isTileInTerritory(neighbouringTile) == false)) {
                borderTiles.push(this.territoryTiles[i])
            }
        }

        return borderTiles;
    }

    public getExpandableTiles(worldModel: WorldModel): Tile[] {

        let borderTiles: Tile[] = this.getBorderTiles(worldModel);
        let expandableTiles: Set<Tile> = new Set();

        borderTiles.forEach((borderTile: Tile) => {

            let neighbourTiles: Tile[] = worldModel.getNeighbouringTiles(borderTile);

            neighbourTiles.forEach((neighbourTile: Tile) => {

                if (this.isTileInTerritory(neighbourTile) == false &&
                    expandableTiles.has(neighbourTile) == false &&
                    this.empireSystem.getOwningEmpire(neighbourTile) === undefined) {

                    expandableTiles.add(neighbourTile);
                }
            });
        });

        let expandableTilesShuffled = Phaser.Math.RND.shuffle([...expandableTiles]);
        let expandableTilesSorted = expandableTilesShuffled.sort((a, b) => this.capitalTile.coordinates.distance(a.coordinates) - this.capitalTile.coordinates.distance(b.coordinates));

        return [...expandableTilesSorted];
    }

    public isTileInTerritory(tileToCheck: Tile): boolean {
        return this.territoryTiles.some(territoryTile => territoryTile == tileToCheck);
    }

}