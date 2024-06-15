import { ElementType, Tower, WizardCollection, WizardCounts } from '../types';

import fire_wizard_src from '../assets/wizards/wizard_red.png';
import water_wizard_src from '../assets/wizards/wizard_blue.png';
import earth_wizard_src from '../assets/wizards/wizard_brown.png';
import air_wizard_src from '../assets/wizards/wizard_white.png';

export const TowerTab: React.FC<{
  wizards: WizardCollection;
  tower: Tower;
  playerGold: number;
  buy: (element: ElementType) => void;
}> = (props) => {
  const { wizards, tower, playerGold, buy } = props;

  return (
    <div className="flex flex-col p-2 max-h-[90vh] overflow-auto">
      <h2 className="text-2xl text-red-500 pb-2">Tower</h2>
      {['fire', 'water', 'earth', 'air'].map((element) => (
        <div className="py-2">
          <WizardShopPanel
            elementType={element}
            playerGold={playerGold}
            wizardTypeCount={wizards[element as keyof WizardCollection].length}
            wizardTypeCapacity={
              tower.wizardCapacities[element as keyof WizardCounts]
            }
            wizardCost={
              tower.baseWizardCost +
              tower.perExtraWizardCost *
                (wizards[element as keyof WizardCollection].length - 1)
            }
            buy={buy}
          />
        </div>
      ))}
    </div>
  );
};

const WizardShopPanel: React.FC<{
  elementType: string;
  playerGold: number;
  wizardTypeCount: number;
  wizardTypeCapacity: number;
  wizardCost: number;
  buy: (element: ElementType) => void;
}> = (props) => {
  const {
    elementType,
    playerGold,
    wizardTypeCount,
    wizardTypeCapacity,
    wizardCost,
    buy,
  } = props;

  let bgColor;
  let btnColor;
  let btnHoverColor;
  let wizardImgSrc;

  switch (elementType) {
    case 'fire':
      bgColor = 'bg-red-400';
      btnColor = 'bg-red-600';
      btnHoverColor = 'hover:bg-red-900';
      wizardImgSrc = fire_wizard_src;
      break;
    case 'water':
      bgColor = 'bg-blue-400';
      btnColor = 'bg-blue-600';
      btnHoverColor = 'hover:bg-blue-900';
      wizardImgSrc = water_wizard_src;
      break;
    case 'earth':
      bgColor = 'bg-amber-400';
      btnColor = 'bg-amber-600';
      btnHoverColor = 'hover:bg-amber-900';
      wizardImgSrc = earth_wizard_src;
      break;
    case 'air':
      bgColor = 'bg-slate-400';
      btnColor = 'bg-gray-600';
      btnHoverColor = 'hover:bg-gray-900';
      wizardImgSrc = air_wizard_src;
      break;
    default:
      bgColor = 'bg-gray-400';
      btnColor = 'bg-gray-700';
      btnHoverColor = 'hover:bg-gray-900';
      wizardImgSrc = fire_wizard_src;
  }

  return (
    <div
      className={`${bgColor} w-full h-48 rounded-lg p-4 flex flex-row justify-between`}
    >
      <div className="w-1/3 h-full">
        <img
          src={`${wizardImgSrc}`}
          alt={`${elementType} wizard`}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <p className="text-white">Capacity:</p>
          <p className="text-white">
            {wizardTypeCount} of {wizardTypeCapacity}
          </p>
        </div>
        <button
          className={`${btnColor} text-white px-3 py-4 rounded-md shadow-md ${btnHoverColor} hover:text-gray disabled:bg-[#333333ff] `}
          disabled={
            wizardTypeCount >= wizardTypeCapacity || playerGold < wizardCost
          }
          onClick={() => {
            buy(elementType as ElementType);
          }}
        >
          <p>Buy {elementType} Wizard:</p>
          <p>{wizardCost} Gold</p>
        </button>
      </div>
    </div>
  );
};
