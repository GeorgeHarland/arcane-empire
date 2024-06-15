import { handleDispatchWizard } from '../events/wizardActions';
import { Tile } from '../systems/world_generation/Tile';
import { Wizard } from '../types';
import { WizardProfile } from './WizardProfile';

type WizardGroupProps = {
  wizardRow: Wizard[];
  dispatchToTile?: Tile;
};

export const WizardGroup: React.FC<WizardGroupProps> = (props) => {
  const idleWizards = props.wizardRow.filter(
    (wizard) => wizard.status === 'idle'
  );
  const awayWizards = props.wizardRow.filter(
    (wizard) => wizard.status === 'away'
  );

  return (
    <div className="flex flex-wrap items-center justify-start mb-4">
      {idleWizards.map((wizard) => (
        <WizardProfile
          key={wizard.name}
          wizard={wizard}
          clickedCallback={
            props.dispatchToTile
              ? () => {
                  handleDispatchWizard(wizard, props.dispatchToTile!);
                }
              : () => {}
          }
        />
      ))}
      {awayWizards.map((wizard) => (
        <WizardProfile
          key={wizard.name}
          wizard={wizard}
          clickedCallback={
            props.dispatchToTile
              ? () => {
                  handleDispatchWizard(wizard, props.dispatchToTile!);
                }
              : () => {}
          }
        />
      ))}
    </div>
  );
};
