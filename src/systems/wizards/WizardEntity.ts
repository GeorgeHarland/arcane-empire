import { Wizard } from '../../types';
import { HealthBar } from '../HealthBar';
import { WizardManager } from './WizardManager';
import { WizardGraphicData } from './WizardRecords';

export class WizardEntity {
  wizardManager: WizardManager;

  wizardData: Wizard;
  healthBar: HealthBar;

  wizardGraphicData: WizardGraphicData;

  container: Phaser.GameObjects.Container | undefined;
  primaryImage: Phaser.GameObjects.Image | undefined;

  constructor(
    wizardManager: WizardManager,
    wizardData: Wizard,
    wizardGraphicData: WizardGraphicData
  ) {
    this.wizardManager = wizardManager;
    this.wizardData = wizardData;
    this.wizardGraphicData = wizardGraphicData;

    this.healthBar = new HealthBar(this.wizardData.maxHealth);
  }

  public spawnWizard(): void {
    this.container = this.wizardManager.scene.add.container(0, 0);

    this.primaryImage = this.wizardManager.scene.add.image(
      0,
      0,
      this.wizardGraphicData.power + '_wizard'
    );
    this.primaryImage.setScale(
      this.wizardGraphicData.scale * this.wizardManager.hexGrid.hexScale
    );
    this.container.add(this.primaryImage);
    this.healthBar.spawn(this.container, this.primaryImage);
  }

  public getContainer(): Phaser.GameObjects.Container {
    if (this.container === undefined)
      throw new Error(
        "Attempting to access wizard image before it's been created"
      );

    return this.container;
  }

  public setIdle(): void {
    this.wizardManager.scene.time.addEvent({
      callback: this.flipSpriteTimerEvent,
      callbackScope: this,
      delay: this.wizardManager.randomGenerator.between(2500, 4000),
      loop: true,
    });
  }

  public flipSpriteTimerEvent(): void {
    this.primaryImage?.toggleFlipX();
  }

  public applyDamage(amount: number): void {
    this.healthBar.applyOffset(-amount);
  }
}
