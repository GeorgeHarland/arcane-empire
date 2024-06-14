export const hexagonScalingConstants = {
  baseHexagonSpriteWidth: 32,
  horizontallyDisplayedTileCount: 20,
};

export interface GridSize {
  width: number;
  height: number;
}

export class HexagonGrid {
  scene: Phaser.Scene;

  gridSize: GridSize;

  hexScale: number = 1;
  scaledHexWidth: number = 1;
  scaledHexHeight: number = 1;

  pointerDown: boolean = false;
  isDragging: boolean = false;
  dragStartX: number = 0;
  dragStartY: number = 0;

  draggableContainer: Phaser.GameObjects.Container | undefined;

  constructor(scene: Phaser.Scene, gridSize: GridSize) {
    this.scene = scene;
    this.gridSize = gridSize;
  }

  public preload(): void {
    this.hexScale =
      this.scene.sys.canvas.width /
      (hexagonScalingConstants.horizontallyDisplayedTileCount *
        hexagonScalingConstants.baseHexagonSpriteWidth);

    this.scaledHexWidth =
      hexagonScalingConstants.baseHexagonSpriteWidth * this.hexScale;
    this.scaledHexHeight = this.scaledHexWidth * 1.1547; // Magic number is the ratio between hexagon width and height

    this.draggableContainer = this.scene.add.container();

    this.draggableContainer.setInteractive(
      new Phaser.Geom.Rectangle(
        0,
        0,
        this.getPixelWidth(),
        this.getPixelHeight()
      ),
      Phaser.Geom.Rectangle.Contains
    );

    this.draggableContainer.on('drag', this.onDragMap, this);
  }

  public initDragListeners() {
    this.scene.input.on(
      'dragstart',
      (gameObject: Phaser.GameObjects.GameObject) => {
        if (gameObject === this.draggableContainer) {
          this.isDragging = true;
        }
      }
    );

    this.scene.input.on(
      'dragend',
      (gameObject: Phaser.GameObjects.GameObject) => {
        if (gameObject === this.draggableContainer) {
          this.isDragging = false;
        }
      }
    );

    this.addTrackpadScrolling();
  }

  public onDragMap(dragX: number, dragY: number) {
    if (this.draggableContainer === undefined) return;

    this.draggableContainer.x = Phaser.Math.Clamp(
      dragX,
      -this.getPixelWidth() + this.scene.sys.canvas.width,
      0
    );

    this.draggableContainer.y = Phaser.Math.Clamp(
      dragY,
      -this.getPixelHeight() + this.scene.sys.canvas.height,
      0
    );
  }

  public dragMap(dx: number, dy: number) {
    if (this.draggableContainer === undefined) return;

    const newX = this.draggableContainer.x + dx;
    const newY = this.draggableContainer.y + dy;

    this.draggableContainer.x = Phaser.Math.Clamp(
      newX,
      -this.getPixelWidth() + this.scene.sys.canvas.width,
      0
    );

    this.draggableContainer.y = Phaser.Math.Clamp(
      newY,
      -this.getPixelHeight() + this.scene.sys.canvas.height,
      0
    );
  }

  private addTrackpadScrolling() {
    this.scene.game.canvas.addEventListener(
      'wheel',
      (event) => {
        if (this.draggableContainer) {
          let newX = this.draggableContainer.x - event.deltaX;
          let newY = this.draggableContainer.y - event.deltaY;

          this.draggableContainer.x = Phaser.Math.Clamp(
            newX,
            -this.getPixelWidth() + this.scene.sys.canvas.width,
            0
          );
          this.draggableContainer.y = Phaser.Math.Clamp(
            newY,
            -this.getPixelHeight() + this.scene.sys.canvas.height,
            0
          );
        }
        event.preventDefault();
      },
      { passive: false }
    );
  }

  public convertGridHexToPixelHex(
    hex: Phaser.Math.Vector2
  ): Phaser.Math.Vector2 {
    let offsetX = hex.y % 2 == 1 ? this.scaledHexWidth / 2 : 0;

    let tilePositionX: number = this.scaledHexWidth * hex.x + offsetX;
    let tilePositionY: number = this.scaledHexHeight * hex.y * 0.75;

    return new Phaser.Math.Vector2(tilePositionX, tilePositionY);
  }

  public getPixelHexCorner(
    gridHex: Phaser.Math.Vector2,
    cornerIndex: number
  ): Phaser.Math.Vector2 {
    let angle_deg: number = 60 * cornerIndex - 30;
    let angle_rad: number = (Math.PI / 180) * angle_deg;
    let cornerRadius: number = this.scaledHexHeight / 2;
    let pixelHex: Phaser.Math.Vector2 = this.convertGridHexToPixelHex(gridHex);

    return new Phaser.Math.Vector2(
      pixelHex.x + cornerRadius * Math.cos(angle_rad),
      pixelHex.y + cornerRadius * Math.sin(angle_rad)
    );
  }

  // The two o'clock vertex is returned as the first in the list
  public getPixelHexCorners(
    gridHex: Phaser.Math.Vector2
  ): Phaser.Math.Vector2[] {
    let corners: Phaser.Math.Vector2[] = [];

    for (let i = 0; i < 6; i++) {
      corners.push(this.getPixelHexCorner(gridHex, i));
    }

    return corners;
  }

  public getUnitSlotPixelPosition(
    gridHex: Phaser.Math.Vector2,
    slotIndex: number
  ): Phaser.Math.Vector2 {
    let hexPixelPosition: Phaser.Math.Vector2 =
      this.convertGridHexToPixelHex(gridHex);
    let hexPixelCornerPosition: Phaser.Math.Vector2 = this.getPixelHexCorner(
      gridHex,
      slotIndex
    );

    let cornerDirection = hexPixelCornerPosition
      .subtract(hexPixelPosition)
      .scale(0.5);
    return hexPixelPosition.add(cornerDirection);
  }

  public getNeighbouringHexes(
    hex: Phaser.Math.Vector2,
    removeOutOfBounds: boolean = true
  ): Phaser.Math.Vector2[] {
    let adjacentHexes: Phaser.Math.Vector2[] = [];

    // This is just dirty I know but it works and maths hurts my brain
    if (hex.y % 2 == 0) {
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x, hex.y - 1));
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x + 1, hex.y));
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x, hex.y + 1));
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x - 1, hex.y + 1));
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x - 1, hex.y));
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x - 1, hex.y - 1));
    } else {
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x + 1, hex.y - 1));
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x + 1, hex.y));
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x + 1, hex.y + 1));
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x, hex.y + 1));
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x - 1, hex.y));
      adjacentHexes.push(new Phaser.Math.Vector2(hex.x, hex.y - 1));
    }

    if (removeOutOfBounds) {
      adjacentHexes = adjacentHexes.filter((hex) => {
        return (
          hex.x >= 0 &&
          hex.y >= 0 &&
          hex.x < this.gridSize.width &&
          hex.y < this.gridSize.height
        );
      });
    }

    return adjacentHexes;
  }

  public getPixelWidth(): number {
    return (
      this.scaledHexWidth * (this.gridSize.width - 1) + this.scaledHexWidth / 2
    );
  }

  public getPixelHeight(): number {
    return (
      this.scaledHexHeight * this.gridSize.height * 0.75 -
      this.scaledHexHeight / 2
    );
  }

  public getContainer(): Phaser.GameObjects.Container {
    if (this.draggableContainer === undefined)
      throw 'draggableContainer is undefined';

    return this.draggableContainer;
  }
}
