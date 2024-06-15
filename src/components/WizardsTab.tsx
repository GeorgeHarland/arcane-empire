import { WizardCollection } from '../types';
import { WizardGroup } from './WizardGroup';

export const WizardsTab: React.FC<{ wizards: WizardCollection }> = (props) => {
  const { wizards } = props;

  return (
    <div className="flex flex-col p-2 max-h-[90vh] overflow-auto">
      <h2 className="text-2xl text-blue-400 pb-2">Wizards</h2>
      <div className="text-cyan-300 py-2">
        <h3 className="text-xl">Air</h3>
        <p className="text-sm">Air Wizards ignore terrain penalties.</p>
        <WizardGroup wizardRow={wizards.air} keybinds={['1', '2', '3']} />
      </div>
      <div className="text-emerald-400 py-2">
        <h3 className="text-xl">Earth</h3>
        <p className="text-sm">Earth wizards are more hardy.</p>
        <WizardGroup wizardRow={wizards.earth} keybinds={['q', 'w', 'e']} />
      </div>
      <div className="text-orange-500 py-2">
        <h3 className="text-xl">Fire</h3>
        <p className="text-sm">Fire wizards complete tasks faster.</p>
        <WizardGroup wizardRow={wizards.fire} keybinds={['a', 's', 'd']} />
      </div>
      <div className="text-blue-400 py-2">
        <h3 className="text-xl">Water</h3>
        <p className="text-sm">Water wizards earn reputation faster.</p>
        <WizardGroup wizardRow={wizards.water} keybinds={['z', 'x', 'c']} />
      </div>
    </div>
  );
};
