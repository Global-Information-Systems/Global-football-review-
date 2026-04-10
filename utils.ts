import { NATIONS } from './constants';

export const getTeamLogoUrl = (teamName: string): string => {
  // Check if it's a national team
  const nation = NATIONS.find(n => 
    n.name.toLowerCase().includes(teamName.toLowerCase()) || 
    teamName.toLowerCase().includes(n.id.toLowerCase())
  );

  if (nation) {
    // GB-ENG is a special case for flagcdn
    const code = nation.countryCode === 'GB-ENG' ? 'gb-eng' : nation.countryCode.toLowerCase();
    return `https://flagcdn.com/w160/${code}.png`;
  }

  // Fallback for club teams: use clearbit logo API or ui-avatars
  // Clearbit is often blocked or returns 404, so ui-avatars is safer but less "logo-like".
  // Let's try to use a generic avatar with the team's initials.
  // Strip everything except alphanumeric characters and spaces to avoid URI malformed errors with emojis/surrogates
  const cleanName = teamName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const initials = (cleanName || 'FC').split(/\s+/).filter(Boolean).map(n => [...n][0]).join('').substring(0, 2).toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials || 'FC')}&background=random&color=fff&size=128&bold=true`;
};
