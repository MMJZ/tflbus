import { StopType, type StopPoint } from '../../model';

export interface StopNameData {
	firstLine: string;
	secondLine?: string;
	smallerLine?: string;
}

export function getStopNameLine(name: string): StopNameData {
	{
		const [first, second, ...rest] = name.split('/');
		if (rest.length > 0) {
			alert('oh no!');

			return { firstLine: 'fucked it lads' };
		}

		if (second !== undefined) {
			return {
				firstLine: first.trim(),
				smallerLine: second.trim(),
			};
		}
	}
	{
		const [first, second, ...rest] = formLines(name.split(' '), 20);
		if (rest.length === 0) {
			return {
				firstLine: first,
				secondLine: second,
			};
		}
	}
	{
		const mapped = name.split(' ').map((t) => allowedContractions.get(t) ?? t);
		const [first, second, ...rest] = formLines(mapped, 20);
		if (rest.length === 0) {
			return {
				firstLine: first,
				secondLine: second,
			};
		}
	}

	alert(`failed name on ${name}`);
	throw new Error('argh');
}

export interface StopTowardsData {
	firstLine?: string;
	secondLine?: string;
	largerLine?: string;
}

export function getStopTowardsLine(
	name: string | undefined,
): StopTowardsData | undefined {
	if (name === undefined) {
		return undefined;
	}

	if (name.length < 8) {
		return {
			largerLine: `Towards ${name}`,
		};
	}
	if (name.length <= 19) {
		return {
			firstLine: 'Towards',
			largerLine: name,
		};
	}
	{
		const [first, second, ...rest] = formLines(
			['Towards', ...name.split(' ')],
			27,
		);
		if (rest.length === 0) {
			return {
				firstLine: first,
				secondLine: second,
			};
		}
	}
	{
		const mapped = ['Towards', ...name.split(' ')].map(
			(t) => allowedContractions.get(t) ?? t,
		);
		const [first, second, ...rest] = formLines(mapped, 27);
		if (rest.length === 0) {
			return {
				firstLine: first,
				secondLine: second,
			};
		}
	}
	{
		const mapped = name.split(' ').map((t) => allowedContractions.get(t) ?? t);
		const [first, second, ...rest] = formLines(mapped, 27);
		if (rest.length === 0) {
			return {
				firstLine: first,
				secondLine: second,
			};
		}
	}

	alert('still buggered on towards' + name);
	throw new Error('argh');
}

function formLines(tokens: string[], limit: number): string[] {
	const ret = [tokens[0]];
	let i = 0;
	for (const token of tokens.slice(1)) {
		if (ret[i].length + token.length + 1 <= limit) {
			ret[i] += ` ${token}`;
		} else {
			i += 1;
			ret.push(token);
		}
	}

	return ret;
}

const allowedContractions = new Map(
	Object.entries({
		Approach: 'App',
		and: '&', // not on the list, but in use anyway
		Avenue: 'Ave',
		Bridge: 'Bdg',
		Broadway: 'Bdy',
		Central: 'Cent',
		Church: 'Ch',
		Circus: 'Cir',
		Close: 'Cl',
		Common: 'Com',
		Corner: 'Cnr',
		Court: 'Ct',
		Crescent: 'Cres',
		Cross: 'X',
		Dock: 'Dk',
		Docks: 'Dks',
		Drive: 'Dr',
		East: 'E',
		Estate: 'Est',
		Farm: 'Fm',
		Garage: 'Gar',
		Garden: 'Gdn',
		Gardens: 'Gdns',
		Great: 'Gt',
		Greater: 'Gtr',
		Green: 'Grn',
		Grove: 'Gve',
		Heath: 'Hth',
		Highway: 'Hwy',
		Hospital: 'Hosp',
		Industrial: 'Ind',
		Junction: 'Junc',
		Lane: 'Ln',
		Little: 'Lt',
		Lower: 'Lwr',
		Market: 'Mkt',
		Mount: 'Mt',
		North: 'N',
		Palace: 'Pal',
		Parade: 'Pde',
		Park: 'Pk',
		Place: 'Pl',
		'Public House': 'Ph',
		Railway: 'Rly',
		Road: 'Rd',
		Saint: 'St',
		School: 'Sch',
		South: 'S',
		Square: 'Sq',
		Station: 'Stn',
		Street: 'St',
		Terrace: 'Tce',
		Tower: 'Twr',
		Town: 'Tn',
		Tunnel: 'Tnl',
		Upper: 'Upp',
		Viaduct: 'Vdct',
		Village: 'Vge',
		Walk: 'Wk',
		West: 'W',
	}),
);

interface CallingBusData {
	number: string;
	isNightBus: boolean;
	message?: string;
}

export function getStopCallingBusData(stopPoint: StopPoint): CallingBusData[] {
	const data = stopPoint.lines.map((l) => {
		const isNightBus = l.id.startsWith('n');
		return {
			number: l.name,
			isNightBus,
			message: isNightBus ? 'Night Bus' : undefined,
		};
	});

	data.sort((a, b) => compareBusNumbers(a.number, b.number));

	return data;
}

function compareBusNumbers(a: string, b: string): number {
	const aMatch = a.match(/([A-Z]*)([0-9]+)([A-Z]*)/);
	const bMatch = b.match(/([A-Z]*)([0-9]+)([A-Z]*)/);

	if (aMatch === null || bMatch === null) {
		alert('oh no');
		throw new Error('asd');
	}

	const [, aI, aNs, aS] = aMatch;
	const [, bI, bNs, bS] = bMatch;

	if (aI !== bI) {
		if ((aI === 'N') !== (bI === 'N')) {
			return aI === 'N' ? 1 : -1;
		}
		if (aI === '') return -1;
		if (bI === '') return 1;
		return aI.localeCompare(bI);
	}

	const aN = Number(aNs);
	const bN = Number(bNs);

	if (aN === bN) return aS.localeCompare(bS);

	return aN - bN;
}

export type StopLetterSize = 'single' | 'singleW' | 'double' | 'triple';

export interface StopLetterData {
	stopLetter: string;
	stopLetterSize: StopLetterSize;
}

export function getStopLetterAndSize(
	stopLetter: string,
): StopLetterData | undefined {
	if (stopLetter === undefined || stopLetter.startsWith('-')) {
		return undefined;
	}

	const containsW = stopLetter.includes('W');

	switch (stopLetter.length) {
		case 1:
			return { stopLetter, stopLetterSize: containsW ? 'singleW' : 'single' };
		case 2:
			return {
				stopLetter,
				stopLetterSize:
					containsW && stopLetter.match(/^[A-Z]*$/) !== null
						? 'triple'
						: 'double',
			};
		case 3:
			return { stopLetter, stopLetterSize: 'triple' };
		default:
			alert(`failed stop letter ${stopLetter}`);
			throw new Error('fuck');
	}
}

export function getStopTypeName(stopType: StopType) {
	switch (stopType) {
		case 'NaptanBusCoachStation':
			return 'Bus Station';
		case 'NaptanMetroEntrance':
		case 'NaptanMetroAccessArea':
			return 'Metro Entrance';
		case 'NaptanMetroStation':
			return 'Metro Station';
		case 'NaptanOnstreetBusCoachStopCluster':
			return 'Bus Stop Cluster';
		case 'NaptanOnstreetBusCoachStopPair':
			return 'Bus Stop Pair';
		case 'NaptanPublicBusCoachTram':
			return 'Bus Stop';
		case 'NaptanRailStation':
			return 'Rail Station';
		case 'TransportInterchange':
			return 'Transport Hub';
		case 'NaptanMetroPlatform':
			return 'Metro Platform';
		default:
			console.log('failed on ', stopType);
			return stopType;
	}
}
