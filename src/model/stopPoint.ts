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
	| 'NaptainRailEntrance'
	| 'NaptanRailAccessArea'
	| 'NaptanRailStation';

export interface AdditionalProperties {
	key: string;
	value: string;
}

export interface StopPointBase {
	naptanId: string;
	stopLetter: string;
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
	children: StopPointBase[];
	stopType: StopType;
}

// export interface BusStation extends StopPointBase {
// 	stopType: 'NaptanBusCoachStation';
// 	// children: BusStop[];
// }
// export interface BusStopCluster extends StopPointBase {
// 	stopType: 'NaptanOnstreetBusCoachStopCluster';
// 	// children: BusStop[];
// }
// export interface BusStopPair extends StopPointBase {
// 	stopType: 'NaptanOnstreetBusCoachStopPair';
// 	// children: BusStop[];
// }
// export interface BusStop extends StopPointBase {
// 	stopType: 'NaptanPublicBusCoachTram';
// 	// children: StopPoint[];
// }
// export interface RailStation extends StopPointBase {
// 	stopType: 'NaptanRailStation';
// }
// export interface TransportInterchange extends StopPointBase {
// 	stopType: 'TransportInterchange';
// }

// export interface GeneralStopPoint extends StopPointBase {
// 	// stopType: 'SomeOtherNaptanWotsit';
// 	// children: StopPoint[];
// }

// export type StopPoint =
// 	| BusStation
// 	| BusStopCluster
// 	| BusStopPair
// 	| BusStop
// 	| GeneralStopPoint;

export type StopPoint = StopPointBase;

