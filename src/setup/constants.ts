import { EmpireSettings } from "../systems/empires/EmpireSystem";
import { GridSize } from "../systems/hex_grid/HexagonGrid";
import { GenerationSettings } from "../systems/world_generation/WorldModel";

// Temp till we get a game setup menu
export const defaultGridSize: GridSize = {
    width: 40,
    height: 30
}

export const defaultGenerationSettings: GenerationSettings = {
    seed: "default",
    fortsCount: 8,
    cavesCount: 4,
    farmsCount: 14,
    villagesCount: 14,
    wizardTowersCount: 1
}

export const defaultEmpireSettings: EmpireSettings = {
    seed: "default",
    numberOfEmpires: 6,
    minStartSize: 10,
    maxStartSize: 22
}

export const empireNames: string[] = [
    "Nova Empire",
    "Eldor Kingdom",
    "Arcadian Dominion",
    "Sylvan Dynasty",
    "Aetheria Empire",
    "Solstice Kingdom",
    "Aquaterra Dominion",
    "Frostland Dynasty",
    "Emberia Empire",
    "Mythorian Kingdom",
    "Ironhold Dominion",
    "Shadowrealm Dynasty",
    "Verdantia Empire",
    "Stormguard Kingdom",
    "Crystalia Dominion",
    "Phoenix Dynasty",
    "Dragonspire Empire",
    "Aurora Kingdom",
    "Lunaris Dominion",
    "Titan's Dynasty",
    "Starhaven Empire",
    "Dreamland Kingdom",
    "Sunfire Dominion",
    "Silvercrest Dynasty",
    "Everglen Empire",
    "Mistwood Kingdom",
    "Echovalley Dominion",
    "Wyvernguard Dynasty",
    "Moonshadow Empire",
    "Astral Kingdom",
    "Valiant Dominion",
    "Frostforge Dynasty",
    "Emberhold Empire",
    "Celestial Kingdom",
    "Ironwood Dominion",
    "Stormhelm Dynasty",
    "Phoenixfire Empire",
    "Dragonreach Kingdom",
    "Arboria Dominion",
    "Solaris Dynasty",
    "Moonstone Empire",
    "Verdant Dominion",
    "Nightfall Dynasty",
    "Crystalis Empire",
    "Aurora Kingdom",
    "Titan's Dominion",
    "Starfall Dynasty",
    "Dreamgate Empire",
    "Suncrest Kingdom",
    "Silverwood Dominion"
];

export const rulerNames: string[] = [
    "Emperor Aurelius I",
    "Queen Elara Stormborn",
    "High King Roderic IV",
    "Empress Lysandra the Wise",
    "King Thalion the Brave",
    "Emperor Cedric the Magnificent",
    "Queen Isolde the Enchantress",
    "King Aldric Ironheart",
    "Empress Seraphina the Eternal",
    "Queen Lyanna Moonshadow",
    "Emperor Valerian Stormforge",
    "High Queen Aeliana the Resolute",
    "Emperor Lucius Nightfall",
    "Queen Isadora Silverwing",
    "King Leopold Sunfire",
    "Empress Celestia Starborn",
    "Queen Elowen Frostblade",
    "Emperor Orion Dragonbane",
    "High King Gareth the Just",
    "Empress Elysia Evergreen",
    "King Oberon Moonlight",
    "Queen Althea Whisperwind",
    "Emperor Titus Ironclad",
    "Queen Marcella Sunburst",
    "High King Thorin Frostheart",
    "Empress Ravenna Shadowweaver",
    "King Leonidas Firestorm",
    "Queen Selene Moonglow",
    "Emperor Magnus Stormcaller",
    "Queen Elara Dawnbreaker",
    "High King Cyrus Emberforge",
    "Empress Aurora Skylark",
    "King Tristan Winterfell",
    "Queen Elara Silvermist",
    "Emperor Rhaegar Dragonborn",
    "Queen Isolde Frostfall",
    "High Queen Ariana Sunshard",
    "Emperor Draven Darkthorn",
    "Queen Lyra Stormwatcher",
    "King Alaric Stormrider",
    "Empress Valeria Frostwind",
    "High King Eldric Ironsoul",
    "Queen Morgana Nightshade",
    "Emperor Cedric Skyhammer",
    "Queen Elara Swiftwind",
    "High Queen Seraphina Shadowdancer",
    "Emperor Marcus Bloodmoon",
    "Queen Isadora Starfire"
];
export const castleNames: string[] = [
    "Imperial Citadel",
    "Stormkeep Fortress",
    "Eldoria Palace",
    "Dragonspire Keep",
    "Celestial Stronghold",
    "Frostwatch Castle",
    "Emberhold Citadel",
    "Aurora Palace",
    "Silvercrest Keep",
    "Sylvan Bastion",
    "Aetheria Fortress",
    "Titan's Keep",
    "Sunfire Citadel",
    "Verdantia Palace",
    "Phoenix Keep",
    "Lunaris Citadel",
    "Ironhold Fortress",
    "Dreamgate Castle",
    "Shadowrealm Keep",
    "Crystalis Citadel",
    "Starhaven Palace",
    "Wyvernguard Keep",
    "Everglen Citadel",
    "Moonshadow Fortress",
    "Stormguard Keep",
    "Silverwood Palace",
    "Valiant Citadel",
    "Phoenixfire Keep",
    "Dragonreach Fortress",
    "Emberia Palace",
    "Arboria Keep",
    "Solaris Citadel",
    "Moonstone Palace",
    "Echovalley Fortress",
    "Ironwood Keep",
    "Astral Citadel",
    "Nightfall Palace",
    "Crystalia Keep",
    "Aquaterra Fortress",
    "Titan's Citadel",
    "Suncrest Palace",
    "Verdant Dominion",
    "Moonlit Citadel",
    "Starfall Palace",
    "Dreamland Keep",
    "Silverglade Citadel",
    "Everbloom Palace",
    "Wyvernwatch Keep",
    "Stormhelm Fortress",
    "Celestial Citadel"
];

export const empireColours = [
    0xe305f7, // Magenta
    0xfae102, // Yellow
    0x00e5fa, // Cyan
    0xfa6d02, // Orange
    0x43fa00, // Green
    0xfa0f02, // Red
]

