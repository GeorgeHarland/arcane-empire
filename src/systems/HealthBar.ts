import { findAndMap } from '../helpers/utils';

const BAR_OFFSET = 10;
const BAR_HEIGHT = 15;
const BAR_WIDTHS: { width: number; maxHealthThreshold: number }[] = [
  { width: 100, maxHealthThreshold: 100 },
];
const MAX_BAR_WIDTH = 500;

export class HealthBar {
  private maxHealth: number;
  private health: number;
  private rectangleWidth: number;

  private healthRect: Phaser.GameObjects.Rectangle | undefined;

  constructor(maxHealth: number, health: number = maxHealth) {
    this.maxHealth = health;
    this.health = health;
    this.rectangleWidth =
      findAndMap(BAR_WIDTHS, ({ width, maxHealthThreshold }) =>
        this.maxHealth <= maxHealthThreshold ? width : null
      ) ?? MAX_BAR_WIDTH;
  }

  spawn(
    container: Phaser.GameObjects.Container,
    parentImage: Phaser.GameObjects.Image
  ): void {
    const barCenter = parentImage.getTopCenter();

    this.healthRect = new Phaser.GameObjects.Rectangle(
      container.scene,
      barCenter.x - this.rectangleWidth / 2,
      barCenter.y - BAR_HEIGHT - BAR_OFFSET,
      this.rectangleWidth * (this.health / this.maxHealth),
      BAR_HEIGHT,
      0x00ff00
    );

    container.add([
      new Phaser.GameObjects.Rectangle(
        container.scene,
        barCenter.x - this.rectangleWidth / 2,
        barCenter.y - BAR_HEIGHT - BAR_OFFSET,
        this.rectangleWidth,
        BAR_HEIGHT,
        0xff0000
      ),
      this.healthRect,
    ]);
  }

  /**
   * Increases/decreases (when the offset is negative) the current health.
   * @param offset
   */
  applyOffset(offset: number) {
    this.health = Phaser.Math.Clamp(this.health + offset, 0, this.maxHealth);
    if (this.healthRect != null) {
      this.healthRect.displayWidth =
        this.rectangleWidth * (this.health / this.maxHealth);
    }
  }

  get isAlive() {
    return this.health > 0;
  }
}
