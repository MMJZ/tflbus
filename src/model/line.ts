export interface LineRoute {
	lineName: string;
	lineId: string;
	direction: 'inbound' | 'outbound';
	stopPointSequences: StopPointSequence[];
}

export interface StopPointSequence {
	branchId: number;
	nextBranchIds: number[];
	prevBranchIds: number[];
	stopPoint: LineSequenceStopPoint[];
}

export interface LineSequenceStopPoint {
	name: string;
	id: string;
	stopLetter: string;
	towards: string;
	lines: { name: string }[];
	topMostParentId: string;
	parentId: string;
}

export interface LineData {
	inboundRoute: LineRoute;
	outboundRoute: LineRoute;
}

export interface EnrichedLineData {
	lineName: string;
	routeRows: RouteRow[];
	hasHiddenBranches: boolean;
	// missingStops: Array<[LineSequenceStopPoint | undefined, LineSequenceStopPoint | undefined]>;
}

export interface SingleStopRouteRow<T> {
	kind: T;
	stopLetter: string;
	name: string;
	id: string;
	parentId: string | undefined;
}

export type InboundRouteRow = SingleStopRouteRow<'inbound'>;
export type OutboundRouteRow = SingleStopRouteRow<'outbound'>;
export type SharedReverseRouteRow = SingleStopRouteRow<'reverse'>;

export interface SharedRouteRow {
	kind: 'shared';
	inboundId: string;
	outboundId: string;
	parentId: string | undefined;
	inboundName: string;
	outboundName: string;
	inboundStopLetter: string;
	outboundStopLetter: string;
}

export type RouteRow = InboundRouteRow | OutboundRouteRow | SharedRouteRow;
