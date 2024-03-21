export interface QueryResult {
	matches: Array<{
		id: string;
		name: string;
	}>;
}

export interface SearchResult {
	name: string;
	id: string;
}

export type StopType =
	| 'NaptanOnstreetBusCoachStopCluster'
	| 'NaptanOnstreetBusCoachStopPair'
	| 'NaptanPublicBusCoachTram'
	| 'TransportInterchange'
	| 'NaptanMetroStation'
	| 'NaptanMetroAccessArea'
	| 'NaptanBusCoachStation'
	| 'NaptanMetroEntrance'
	| 'NaptanMetroPlatform'
	| 'NaptanRailEntrance'
	| 'NaptanRailAccessArea'
	| 'NaptanRailStation';

export interface AdditionalProperties {
	key: string;
	value: string;
}

export interface StopPoint {
	naptanId: string;
	stopLetter: string;
	indicator: string;
	modes: string[];
	commonName: string;
	lat: number;
	lon: number;
	smsCode: string;
	additionalProperties: AdditionalProperties[];
	lines: Array<{
		name: string;
		id: string;
	}>;
	children: StopPoint[];
	stopType: StopType;
}
