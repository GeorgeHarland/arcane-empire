import { useEffect, useRef, useState } from 'react';
import { Empire, WorldEvent } from '../types';

import icon_tornado_event_src from '../assets/ui/event_icons/icon_tornado.png';
import icon_fire_event_src from '../assets/ui/event_icons/icon_fire.png';
import icon_earthquake_event_src from '../assets/ui/event_icons/icon_earthquake.png';
import { getSeededPortraitForName } from '../setup/rulerPortraits';
import { sendMessageToKingdom } from '../services';
import { twMerge } from 'tailwind-merge';

export const EmpiresTab: React.FC<{
  empires: Empire[];
  worldEvents: WorldEvent[];
}> = (props) => {
  const [empireInDialogue, setEmpireInDialogue] = useState<Empire | null>(null);

  if (empireInDialogue !== null) {
    return (
      <EmpireDialogue
        empire={empireInDialogue}
        closeDialogue={() => setEmpireInDialogue(null)}
      />
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-start justify-start gap-y-1 p-2 max-h-[90vh] overflow-auto">
      <h2 className="text-2xl text-green-500 pb-2">Empires</h2>
      {props.empires.map((empire) => (
        <EmpireStatus
          empire={empire}
          openDialogue={() => setEmpireInDialogue(empire)}
        />
      ))}
      <h2 className="text-2xl text-green-500 pb-2">Arcane Anomalies</h2>
      {props.worldEvents.map((worldEvent) => (
        <WorldEventStatus worldEvent={worldEvent} />
      ))}
    </div>
  );
};

type EmpireStatusProps = {
  empire: Empire;
  openDialogue: () => void;
};

export const EmpireStatus: React.FC<EmpireStatusProps> = (props) => {
  const { empire, openDialogue } = props;

  const apiEnabled = import.meta.env.VITE_API_ENABLED === 'true';

  let empireIconSource = getSeededPortraitForName(empire.rulerName);

  return (
    <div
      className={`w-full h-48 bg-slate-400 border-gray-800 rounded-lg border-2 flex flex-col`}
    >
      <div className={'flex flex-row h-2/3'}>
        <div className="h-full w-1/3 items-center p-3">
          <img
            src={empireIconSource}
            alt={empire.rulerName}
            className={'h-full w-full object-contain'}
          />
        </div>
        <div className="h-full w-2/3 py-2 text-center">
          <h2 className="text-lg font-semibold">{empire.rulerName}</h2>
          <h4 className="text-lg font-semibold">Of The</h4>
          <h2 className="text-lg font-semibold">{empire.empireName}</h2>
          <p className="text-sm text-gray-600">Capital: {empire.capitalName}</p>
        </div>
      </div>
      <div className={'flex flex-row h-1/3 justify-start px-1 py-2'}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mx-2 py-2 px-6 rounded">
          View Capital
        </button>
        <button
          className={twMerge(
            'text-white font-bold mx-2 py-2 px-6 rounded',
            apiEnabled ? 'bg-emerald-600 hover:bg-emerald-800' : 'bg-gray-500'
          )}
          onClick={() => openDialogue()}
          disabled={!apiEnabled}
        >
          {apiEnabled ? 'Open Dialogue' : 'Chat Disabled'}
        </button>
      </div>
    </div>
  );
};

export const WorldEventStatus: React.FC<{ worldEvent: WorldEvent }> = (
  props
) => {
  const { worldEvent } = props;

  let eventIconSrc = '';

  switch (worldEvent.type) {
    case 'tornado':
      eventIconSrc = icon_tornado_event_src;
      break;
    case 'fire':
      eventIconSrc = icon_fire_event_src;
      break;
    case 'earthquake':
      eventIconSrc = icon_earthquake_event_src;
      break;
  }

  return (
    <div
      className={`w-full h-18 ${worldEvent.mission === undefined ? ' bg-slate-400' : 'bg-amber-400'} border-2 ${worldEvent.mission === undefined ? 'border-gray-800' : 'border-amber-800'} rounded-lg px-4 py-2 flex flex-row items-center justify-between`}
    >
      <div className="flex items-center">
        <img
          src={eventIconSrc}
          alt={worldEvent.type}
          className="mr-2 object-contain"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">{worldEvent.name}</h3>
        <p className="text-sm text-gray-600">
          {worldEvent.mission === undefined
            ? ''
            : worldEvent.mission.empireName}
        </p>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go To
      </button>
    </div>
  );
};

type EmpireDialogueProps = {
  empire: Empire;
  closeDialogue: () => void;
};

const EmpireDialogue: React.FC<EmpireDialogueProps> = (props) => {
  const { empire, closeDialogue } = props;
  const [inputValue, setInputValue] = useState('');
  const [messageHistory, setMessageHistory] = useState(empire.messageHistory);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messageHistory]);

  const submitMessage = async (inputValue: string) => {
    empire.messageHistory.push({
      message: inputValue,
      sender: 'user',
      timestamp: Date.now(),
    });
    setMessageHistory([...empire.messageHistory]);

    setInputValue('');

    const response = await sendMessageToKingdom(empire, inputValue);

    if (response === 'error') {
      empire.messageHistory.push({
        message: 'The crow never returned. (server error)',
        sender: 'system',
        timestamp: Date.now(),
      });
      setMessageHistory([...empire.messageHistory]);
      return;
    }

    if (response) {
      empire.messageHistory.push({
        message: response.message.content,
        sender: 'empire',
        timestamp: Date.now(),
      });
      setMessageHistory([...empire.messageHistory]);
    }
  };

  const getMessageFormat = (sender: string) => {
    switch (sender) {
      case 'user':
        return 'self-end bg-slate-200 text-gray-700';
      case 'empire':
        return 'self-start bg-indigo-200 text-gray-700';
      case 'system':
        return 'self-center bg-white text-red-500';
      default:
        return 'self-start bg-indigo-200 text-gray-700';
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-start justify-start gap-y-1 p-2">
      <h2 className="text-2xl text-green-500 pb-2">{empire.rulerName}</h2>
      <div className="flex flex-col w-full h-full max-h-[75vh] bg-slate-400 border-gray-800 rounded-lg border-2 p-2 gap-y-2 justify-end">
        <div className="flex flex-col overflow-auto gap-y-2">
          {empire.messageHistory.map((message, index) => (
            <div
              key={index}
              className={`w-[80%] px-1 rounded-md  ${getMessageFormat(message.sender)}`}
            >
              <p className="text-sm text-pretty">{message.message}</p>
            </div>
          ))}
          <div ref={messageEndRef} className="-mt-2"></div>
        </div>
        <input
          className="w-full bg-gray-200 p-2 rounded"
          type="text"
          onKeyPress={(e) =>
            e.key === 'Enter' ? submitMessage(inputValue) : undefined
          }
          value={inputValue}
          onChange={(e) => setInputValue((e.target as HTMLInputElement).value)}
        />
        <div className="flex flex-col gap-y-2">
          <button
            className="bg-emerald-600 hover:bg-emerald-800 text-white font-bold py-2 px-6 rounded"
            onClick={() => submitMessage(inputValue)}
          >
            Send Message
          </button>
          <button
            className="bg-emerald-600 hover:bg-emerald-800 text-white font-bold py-2 px-6 rounded"
            onClick={() => closeDialogue()}
          >
            Close Dialogue
          </button>
        </div>
      </div>
    </div>
  );
};
