// A stable, unique identifier for a team, derived from its six species.
//
// The same identifier must be computable from two different sources that have to
// agree: the species revealed in a replay's team-preview (`|poke|` lines) and
// the species in a Showdown teambuilder set. So species names are normalised to
// Showdown-style ids and a few battle-only formes are collapsed to their base
// (e.g. a replay shows "Zamazenta-Crowned" while the paste says "Zamazenta").
// The result is order-independent so lead choices don't change a team's id.

export function toId(name: string): string {
	return (name ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Collapse battle-form / naming differences so preview species and paste species
// map to the same id.
function baseSpecies(name: string): string {
	const id = toId(name);
	if (id.startsWith('palafin')) return 'palafin';
	if (id.startsWith('terapagos')) return 'terapagos';
	if (id.startsWith('zamazenta')) return 'zamazenta';
	if (id.startsWith('zacian')) return 'zacian';
	if (id.startsWith('eiscue')) return 'eiscue';
	if (id.startsWith('mimikyu')) return 'mimikyu';
	if (id.startsWith('minior')) return 'minior';
	// Strip Mega / Gmax / Tera suffixes that only appear mid-battle.
	return id
		.replace(/mega[xy]?$/, '')
		.replace(/gmax$/, '')
		.replace(/tera$/, '');
}

// Order-independent identifier for a set of (up to six) species.
export function teamIdentifier(species: string[]): string {
	const ids = species.map(baseSpecies).filter(Boolean).sort();
	if (ids.length === 0) return '';
	const str = ids.join(',');
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
	}
	return `t${hash.toString(36)}`;
}
