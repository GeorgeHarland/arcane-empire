import { handleDispatchWizard } from '../events/wizardActions';
import { Tile } from '../systems/world_generation/Tile';
import { Wizard } from '../types';
import { WizardProfile } from './WizardProfile';
import { useEventListener } from 'usehooks-ts';

type WizardGroupProps = {
  wizardRow: Wizard[];
  keybinds?: string[];
  dispatchToTile?: Tile;
};

export const WizardGroup: React.FC<WizardGroupProps> = (props) => {
  const wizards = props.wizardRow;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!props.keybinds) return;
    const keyIndex = props.keybinds.indexOf(event.key);
    if (keyIndex !== -1) {
      const wizard = wizards[keyIndex];
      if (wizard && props.dispatchToTile) {
        handleDispatchWizard(wizard, props.dispatchToTile);
      }
    }
  };

  useEventListener('keydown', handleKeyDown);

  return (
    <div className="flex flex-wrap items-center justify-start mb-4">
      {wizards.map((wizard, index) => (
        <div key={wizard.name} className="relative">
          <WizardProfile
            wizard={wizard}
            clickedCallback={
              props.dispatchToTile
                ? () => {
                    handleDispatchWizard(wizard, props.dispatchToTile!);
                  }
                : () => {}
            }
          />
          {props.keybinds ? (
            <p className="absolute right-0 bottom-0 text-white">
              {props.keybinds[index]}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
};
