import { eventImages } from '../app-utils/image-maps';
import { eventEmitter } from '../events/EventEmitter';
import { Tile } from '../systems/world_generation/Tile';
import { WizardCollection, Wizard, WizardDispatchData } from '../types';
import { WizardProfile } from './WizardProfile';

export const TilesTab: React.FC<{
  currentTile: Tile | null;
  wizards: WizardCollection;
}> = (props) => {
  const { currentTile, wizards } = props;

  const handleDispatchWizard = (targetWizard: Wizard, targetTile: Tile) => {
    let wizardDispatchData: WizardDispatchData = {
      wizard: targetWizard,
      tile: targetTile,
    };

    eventEmitter.emit('dispatch-wizard', wizardDispatchData);
  };

  if (currentTile === null)
    return <p className="text-white">No tile selected</p>;

  return (
    <div className="flex flex-col max-h-[90vh] h-full overflow-auto">
      <h2 className="text-2xl text-purple-400 pb-2">
        {`(${currentTile.coordinates.x}, ${currentTile.coordinates.y}) ${currentTile.terrainData.name}`}
      </h2>
      <p className="text-white">
        {currentTile.terrainData.is_walkable ? 'Walkable' : 'Not walkable'}
      </p>
      <p className="text-white pt-2">
        Structure:{' '}
        {currentTile.structureData ? currentTile.structureData.name : 'None'}
      </p>
      <div className="text-white py-2">
        Event:{' '}
        {currentTile.currentEvent
          ? currentTile.currentEvent.worldEventSettings.type
          : 'None'}
        {currentTile.currentEvent ? (
          <img
            src={eventImages[currentTile.currentEvent.worldEventSettings.type]}
            width={'100%'}
            className={'py-2'}
          />
        ) : null}
      </div>
      <p className="text-white">Wizards here: </p>
      <p className="text-white">(none)</p>
      <p className="text-white pt-2">Send a wizard here: </p>
      {wizards.air.map((wizard) => (
        <WizardProfile
          key={wizard.name}
          wizard={wizard}
          clickedCallback={() => {
            handleDispatchWizard(wizard, currentTile);
          }}
        />
      ))}
      {wizards.earth.map((wizard) => (
        <WizardProfile
          key={wizard.name}
          wizard={wizard}
          clickedCallback={() => {
            handleDispatchWizard(wizard, currentTile);
          }}
        />
      ))}
      {wizards.fire.map((wizard) => (
        <WizardProfile
          key={wizard.name}
          wizard={wizard}
          clickedCallback={() => {
            handleDispatchWizard(wizard, currentTile);
          }}
        />
      ))}
      {wizards.water.map((wizard) => (
        <WizardProfile
          key={wizard.name}
          wizard={wizard}
          clickedCallback={() => {
            handleDispatchWizard(wizard, currentTile);
          }}
        />
      ))}
    </div>
  );
};
