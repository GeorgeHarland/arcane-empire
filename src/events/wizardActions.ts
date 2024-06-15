import { Tile } from '../systems/world_generation/Tile';
import { Wizard, WizardDispatchData } from '../types';
import { eventEmitter } from './EventEmitter';

export const handleDispatchWizard = (
  targetWizard: Wizard,
  targetTile: Tile
) => {
  let wizardDispatchData: WizardDispatchData = {
    wizard: targetWizard,
    tile: targetTile,
  };

  eventEmitter.emit('dispatch-wizard', wizardDispatchData);
};
