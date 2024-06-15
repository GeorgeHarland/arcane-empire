import { eventImages } from '../app-utils/image-maps';
import { Tile } from '../systems/world_generation/Tile';
import { WizardCollection } from '../types';
import { WizardGroup } from './WizardGroup';

export const TilesTab: React.FC<{
  currentTile: Tile | null;
  wizards: WizardCollection;
}> = (props) => {
  const { currentTile, wizards } = props;

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

      <p className="text-white pt-2">Send a wizard here: </p>
      <p className="text-cyan-300 text-lg pt-2">Air</p>
      <WizardGroup
        wizardRow={wizards.air}
        dispatchToTile={currentTile}
        keybinds={['1', '2', '3']}
      />
      <p className="text-emerald-400 text-lg pt-2">Earth</p>
      <WizardGroup
        wizardRow={wizards.earth}
        dispatchToTile={currentTile}
        keybinds={['q', 'w', 'e']}
      />
      <p className="text-orange-500 text-lg pt-2">Fire</p>
      <WizardGroup
        wizardRow={wizards.fire}
        dispatchToTile={currentTile}
        keybinds={['a', 's', 'd']}
      />
      <p className="text-blue-400 text-lg pt-2">Water</p>
      <WizardGroup
        wizardRow={wizards.water}
        dispatchToTile={currentTile}
        keybinds={['z', 'x', 'c']}
      />
    </div>
  );
};
