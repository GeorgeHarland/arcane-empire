import { GameComponent } from './components/GameComponent';
import './styles/global.css';
import Tab from './components/Tab';
import Tabs from './components/Tabs';
import Badge from './components/Badge';
import { useEffect, useState } from 'preact/compat';
import { ElementType, GameData, Tower, WizardCollection } from './types';
import { eventEmitter } from './events/EventEmitter';
import { Tile } from './systems/world_generation/Tile';
import { WizardsTab } from './components/WizardsTab';
import { EmpiresTab } from './components/EmpiresTab';
import { TowerTab } from './components/TowerTab';
import { TilesTab } from './components/TilesTab';

export function App() {
  const [gameState, setGameState] = useState<GameData>(null);
  const [selectedTab, setSelectedTab] = useState<string>('first');
  const [currentTile, setCurrentTile] = useState<Tile | null>(null);

  const appEvent = eventEmitter.subscribe(
    'update-app-data',
    (gameState: GameData) => {
      setGameState(gameState);
    }
  );

  const tileEvent = eventEmitter.subscribe('tile-clicked', (tile: Tile) =>
    handleTileClicked(tile)
  );

  useEffect(() => {
    const unsubscribe = () => {
      appEvent();
      tileEvent();
    };
    return () => unsubscribe();
  }, []);

  const buyWizard = (elementType: ElementType): void => {
    eventEmitter.emit('buy-wizard', elementType);
  };
  const handleTileClicked = (tile: Tile) => {
    (
      document.querySelector('[aria-hidden="true"]') as HTMLButtonElement | null
    )?.click();
    setCurrentTile(tile);
  };

  const emptyWizardsData: WizardCollection = {
    air: [],
    earth: [],
    fire: [],
    water: [],
  };

  const emptyTowerData: Tower = {
    baseWizardCost: 0,
    perExtraWizardCost: 0,
    wizardCapacities: {
      fire: 0,
      water: 0,
      earth: 0,
      air: 0,
    },
  };

  return (
    <div className="h-screen max-h-screen bg-gray-800">
      <div className="flex h-[5%] w-4/5 ml-auto bg-gray-600 py-2 px-6 justify-between text-white items-center rounded-lg">
        <div className="flex gap-4">
          <Badge
            className="text-yellow-300"
            text={`Gold: ${gameState?.playerGold ?? 0}`}
          />
          <Badge
            className="text-cyan-200"
            text={`Score: ${gameState?.reputation ?? 0}`}
          />
        </div>
        <div className="flex gap-4">
          <Badge color="blue" text="Full Screen" onClick={console.log} />
          <Badge color="red" text="Mute" onClick={console.log} />
        </div>
      </div>
      <div className="flex flex-wrap h-[95%] flex-col items-stretch">
        <Tabs
          className="w-1/5 h-full"
          selected={selectedTab}
          setSelected={setSelectedTab}
        >
          <Tab
            id="first"
            className="bg-gray-600 h-full"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-blue-600 bg-blue-700 border-4 ' : ''}bg-blue-500 w-1/3 hover:bg-blue-700 text-white font-bold rounded-t-md min-h-[40px]`}
                onClick={onSelect}
              >
                Wizards
              </button>
            )}
          >
            <WizardsTab wizards={gameState?.wizards ?? emptyWizardsData} />
          </Tab>
          <Tab
            id="second"
            className="bg-gray-600 h-full"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-red-600 bg-red-700 border-4 ' : ''}bg-red-500 w-1/3 hover:bg-red-700 text-white font-bold rounded-t-md min-h-[40px]`}
                onClick={onSelect}
              >
                Tower
              </button>
            )}
          >
            <TowerTab
              wizards={gameState?.wizards ?? emptyWizardsData}
              tower={gameState?.tower ?? emptyTowerData}
              playerGold={gameState?.playerGold ?? 0}
              buy={buyWizard}
            />
          </Tab>
          <Tab
            id="third"
            className="bg-gray-600 h-full flex flex-col items-end justify-end gap-y-2 p-2"
            button={(selected, onSelect) => (
              <button
                className={`${selected ? 'border-green-600 bg-green-700 border-4 ' : ''}bg-green-500 w-1/3 hover:bg-green-700 text-white font-bold rounded-t-md min-h-[40px]`}
                onClick={onSelect}
              >
                Empires
              </button>
            )}
          >
            <EmpiresTab
              empires={gameState?.empires ?? []}
              worldEvents={gameState?.events ?? []}
            />
          </Tab>
          <Tab
            id="fourth"
            className="bg-gray-600 h-full flex flex-col items-start justify-end gap-y-2 p-2"
            button={(_, onSelect) => {
              return (
                <button
                  style={{ display: 'none' }}
                  onClick={onSelect}
                  aria-hidden="true"
                ></button>
              );
            }}
          >
            <TilesTab
              currentTile={currentTile}
              wizards={gameState?.wizards ?? emptyWizardsData}
            />
          </Tab>
        </Tabs>
        <GameComponent className="w-4/5 h-full overflow-y-hidden" />
      </div>
    </div>
  );
}
