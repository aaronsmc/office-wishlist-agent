import React from 'react';
// Utility for parsing natural language availability inputs
type AvailabilityParseResult = {
  matched: boolean;
  days: string[];
  slots: string[];
  timeRanges: Array<{
    day: string;
    start: string;
    end: string;
  }>;
  mode: 'add' | 'remove' | 'only';
  modeExplicit: boolean;
  message?: string;
};
export function parseAvailabilityFromText(text: string): AvailabilityParseResult {
  const lower = text.toLowerCase();
  // Detect intent mode
  let mode: 'add' | 'remove' | 'only' = 'add';
  let modeExplicit = false;
  let message = '';
  if (/\bonly\b/.test(lower)) {
    mode = 'only';
    modeExplicit = true;
  }
  if (/(can'?t|cannot|cant|no longer|anymore)\s+work/.test(lower) || /(remove|clear|not available|unavailable|off|not work)\b/.test(lower) || /\bexcept\b/.test(lower)) {
    mode = 'remove';
    modeExplicit = true;
  }
  const dayMap: Record<string, string[]> = {
    weekday: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    weekend: ['saturday', 'sunday'],
    weekends: ['saturday', 'sunday'],
    everyday: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    daily: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  };
  const dayTokens: Array<[RegExp, string]> = [[/\bmonday(s)?\b/, 'monday'], [/\btuesday(s)?\b/, 'tuesday'], [/\bwednesday(s)?\b/, 'wednesday'], [/\bthursday(s)?\b/, 'thursday'], [/\bfriday(s)?\b/, 'friday'], [/\bsaturday(s)?\b/, 'saturday'], [/\bsunday(s)?\b/, 'sunday'], [/\bmon\b/, 'monday'], [/\btue\b/, 'tuesday'], [/\bwed\b/, 'wednesday'], [/\bthu\b/, 'thursday'], [/\bfri\b/, 'friday'], [/\bsat\b/, 'saturday'], [/\bsun\b/, 'sunday'], [/\bweekday(s)?\b/, 'weekday'], [/\bweekend(s)?\b/, 'weekend'], [/\bevery ?day\b/, 'everyday'], [/\bdaily\b/, 'daily']];
  // Find days mentioned in the text
  const foundDays = new Set<string>();
  for (const [rx, key] of dayTokens) {
    if (rx.test(lower)) {
      const expand = dayMap[key as keyof typeof dayMap];
      if (expand) expand.forEach(d => foundDays.add(d));else foundDays.add(key);
    }
  }
  // Extract specific time ranges from the text
  const timeRanges: Array<{
    day: string;
    start: string;
    end: string;
  }> = [];
  // Handle explicit day ranges like "mon - friday" or "tue to thu"
  const dayNamesOrdered = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayAliases: Record<string, string> = {
    mon: 'monday',
    tue: 'tuesday',
    tues: 'tuesday',
    wed: 'wednesday',
    thu: 'thursday',
    thur: 'thursday',
    thurs: 'thursday',
    fri: 'friday',
    sat: 'saturday',
    sun: 'sunday'
  };
  const dayNamePattern = '(mon(day)?|tue(s|sday)?|wed(nesday)?|thu(rs|rsday|rsdays|rsd)?|fri(day)?|sat(urday)?|sun(day)?)';
  // Improved day range regex to better handle ranges like "Monday - Wednesday"
  const dayRangeRegex = new RegExp(`${dayNamePattern}\\s*(?:-|to|–|—)\\s*${dayNamePattern}`, 'gi');
  let rangeMatch;
  while ((rangeMatch = dayRangeRegex.exec(lower)) !== null) {
    const startRaw = rangeMatch[1];
    const endRaw = rangeMatch[7];
    const norm = (d: string | undefined) => {
      if (!d) return undefined;
      const key = d.slice(0, 3).toLowerCase() as keyof typeof dayAliases;
      return dayAliases[key] || (dayNamesOrdered.includes(d.toLowerCase()) ? d.toLowerCase() : undefined);
    };
    const start = norm(startRaw);
    const end = norm(endRaw);
    if (start && end) {
      const sIdx = dayNamesOrdered.indexOf(start);
      const eIdx = dayNamesOrdered.indexOf(end);
      if (sIdx !== -1 && eIdx !== -1) {
        if (sIdx <= eIdx) {
          // Forward range (e.g., Monday to Wednesday)
          for (let i = sIdx; i <= eIdx; i++) {
            foundDays.add(dayNamesOrdered[i]);
          }
        } else {
          // Wrap-around range (e.g., Saturday to Tuesday)
          for (let i = sIdx; i < dayNamesOrdered.length; i++) {
            foundDays.add(dayNamesOrdered[i]);
          }
          for (let i = 0; i <= eIdx; i++) {
            foundDays.add(dayNamesOrdered[i]);
          }
        }
      }
    }
  }
  // Find time ranges in the text
  const timeRegex = /(\d{1,2})(?::(\d{2}))?\s*(am|pm|a|p)?\s*(?:-|to|–|—)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm|a|p)?/gi;
  // First, check for a general time range that applies to all mentioned days
  let generalTimeRange: {
    start: string;
    end: string;
  } | null = null;
  const timeMatch = lower.match(timeRegex);
  if (timeMatch) {
    // Extract the time range
    const timeRangeText = timeMatch[0];
    const timeRangeRegex = /(\d{1,2})(?::(\d{2}))?\s*(am|pm|a|p)?\s*(?:-|to|–|—)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm|a|p)?/i;
    const timeRangeParts = timeRangeText.match(timeRangeRegex);
    if (timeRangeParts) {
      const startHour = parseInt(timeRangeParts[1], 10);
      const startMinute = timeRangeParts[2] ? parseInt(timeRangeParts[2], 10) : 0;
      const startMeridiem = (timeRangeParts[3] || '').toLowerCase();
      const endHour = parseInt(timeRangeParts[4], 10);
      const endMinute = timeRangeParts[5] ? parseInt(timeRangeParts[5], 10) : 0;
      const endMeridiem = (timeRangeParts[6] || '').toLowerCase();
      // Normalize hours to 24-hour format
      let normalizedStartHour = startHour;
      if (startMeridiem.startsWith('p') && startHour < 12) normalizedStartHour += 12;
      if (startMeridiem.startsWith('a') && startHour === 12) normalizedStartHour = 0;
      let normalizedEndHour = endHour;
      if (endMeridiem.startsWith('p') && endHour < 12) normalizedEndHour += 12;
      if (endMeridiem.startsWith('a') && endHour === 12) normalizedEndHour = 0;
      // If no meridiem specified, make reasonable assumptions
      if (!startMeridiem && !endMeridiem) {
        // If both times are under 12, assume they're both AM
        if (startHour < 12 && endHour < 12 && startHour < endHour) {
          // Both AM
        }
        // If start > end, assume start is AM and end is PM
        else if (startHour < 12 && endHour < 12 && startHour > endHour) {
          normalizedEndHour += 12;
        }
        // If start is under 12 and end is 12 or higher, assume start is AM and end is PM
        else if (startHour < 12 && endHour >= 12) {
          // Already correct
        }
        // If both are 12 or higher, they're both PM
        else if (startHour >= 12 && endHour >= 12) {
          // Already correct
        }
      }
      // Format times as HH:MM
      const start = `${normalizedStartHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
      const end = `${normalizedEndHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      generalTimeRange = {
        start,
        end
      };
    }
  }
  // Extract days with specific time ranges
  const dayTimeRegex = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)s?\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm|a|p)?\s*(?:-|to|–|—)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm|a|p)?/gi;
  // Track which days already have specific time ranges
  const daysWithSpecificRanges = new Map<string, Array<{
    start: string;
    end: string;
  }>>();
  let dayTimeMatch;
  while ((dayTimeMatch = dayTimeRegex.exec(lower)) !== null) {
    const dayName = dayTimeMatch[1].toLowerCase();
    const normalizedDay = dayTokens.find(([rx, _]) => rx.test(dayName))?.[1] || dayName;
    const day = normalizedDay.startsWith('mon') ? 'monday' : normalizedDay.startsWith('tue') ? 'tuesday' : normalizedDay.startsWith('wed') ? 'wednesday' : normalizedDay.startsWith('thu') ? 'thursday' : normalizedDay.startsWith('fri') ? 'friday' : normalizedDay.startsWith('sat') ? 'saturday' : normalizedDay.startsWith('sun') ? 'sunday' : normalizedDay;
    const startHour = parseInt(dayTimeMatch[2], 10);
    const startMinute = dayTimeMatch[3] ? parseInt(dayTimeMatch[3], 10) : 0;
    const startMeridiem = (dayTimeMatch[4] || '').toLowerCase();
    const endHour = parseInt(dayTimeMatch[5], 10);
    const endMinute = dayTimeMatch[6] ? parseInt(dayTimeMatch[6], 10) : 0;
    const endMeridiem = (dayTimeMatch[7] || '').toLowerCase();
    // Normalize hours to 24-hour format
    let normalizedStartHour = startHour;
    if (startMeridiem.startsWith('p') && startHour < 12) normalizedStartHour += 12;
    if (startMeridiem.startsWith('a') && startHour === 12) normalizedStartHour = 0;
    let normalizedEndHour = endHour;
    if (endMeridiem.startsWith('p') && endHour < 12) normalizedEndHour += 12;
    if (endMeridiem.startsWith('a') && endHour === 12) normalizedEndHour = 0;
    // If no meridiem specified, make reasonable assumptions
    if (!startMeridiem && !endMeridiem) {
      // If both times are under 12, assume they're both AM
      if (startHour < 12 && endHour < 12 && startHour < endHour) {
        // Both AM
      }
      // If start > end, assume start is AM and end is PM
      else if (startHour < 12 && endHour < 12 && startHour > endHour) {
        normalizedEndHour += 12;
      }
      // If start is under 12 and end is 12 or higher, assume start is AM and end is PM
      else if (startHour < 12 && endHour >= 12) {
        // Already correct
      }
      // If both are 12 or higher, they're both PM
      else if (startHour >= 12 && endHour >= 12) {
        // Already correct
      }
    }
    // Format times as HH:MM
    const start = `${normalizedStartHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    const end = `${normalizedEndHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    // Add to the map of days with specific time ranges
    if (!daysWithSpecificRanges.has(day)) {
      daysWithSpecificRanges.set(day, []);
    }
    daysWithSpecificRanges.get(day)!.push({
      start,
      end
    });
  }
  // Process multiple time ranges for the same day to find the most inclusive range
  daysWithSpecificRanges.forEach((ranges, day) => {
    if (ranges.length > 1) {
      // Sort ranges by start time
      ranges.sort((a, b) => a.start.localeCompare(b.start));
      // Find the earliest start time and the latest end time
      let earliestStart = ranges[0].start;
      let latestEnd = ranges[0].end;
      for (let i = 1; i < ranges.length; i++) {
        if (ranges[i].start < earliestStart) {
          earliestStart = ranges[i].start;
        }
        if (ranges[i].end > latestEnd) {
          latestEnd = ranges[i].end;
        }
      }
      // Add the consolidated range
      timeRanges.push({
        day,
        start: earliestStart,
        end: latestEnd
      });
    } else if (ranges.length === 1) {
      // Just add the single range
      timeRanges.push({
        day,
        start: ranges[0].start,
        end: ranges[0].end
      });
    }
  });
  // Handle case: "I can work Monday and Tuesday 9-5"
  // If we have a general time range and days without specific time ranges,
  // apply the general time range to those days
  if (generalTimeRange && foundDays.size > 0) {
    for (const day of foundDays) {
      // Skip days that already have specific time ranges
      if (!daysWithSpecificRanges.has(day)) {
        timeRanges.push({
          day,
          start: generalTimeRange.start,
          end: generalTimeRange.end
        });
      }
    }
  }
  // Time slots detection for days without specific time ranges
  const slots: string[] = [];
  // Check for general time mentions
  if (/\b(morning|am)\b/.test(lower)) slots.push('morning');
  if (/\b(afternoon|mid|midday|noon)\b/.test(lower)) slots.push('afternoon');
  if (/\b(evening|night|pm)\b/.test(lower)) slots.push('evening');
  // For days without specific time ranges, default to working hours if not removing
  if (foundDays.size > 0 && slots.length === 0 && timeRanges.length === 0 && mode !== 'remove') {
    slots.push('morning', 'afternoon');
  }
  // Create a custom confirmation message based on the action
  const daysList = Array.from(foundDays).map(d => d[0].toUpperCase() + d.slice(1)).join(', ');
  if (mode === 'remove' && foundDays.size > 0) {
    if (slots.length > 0) {
      const timesList = slots.map(s => s === 'morning' ? 'morning' : s === 'afternoon' ? 'afternoon' : 'evening').join(', ');
      message = `Updated your availability to remove ${timesList} on ${daysList}`;
    } else {
      message = `Updated your availability to remove ${daysList}`;
    }
  } else if (mode === 'add' && (foundDays.size > 0 || timeRanges.length > 0)) {
    if (timeRanges.length > 0) {
      // Group time ranges by common start/end times for cleaner display
      const groupedRanges = new Map<string, string[]>();
      for (const range of timeRanges) {
        const key = `${range.start}-${range.end}`;
        if (!groupedRanges.has(key)) {
          groupedRanges.set(key, []);
        }
        groupedRanges.get(key)!.push(range.day);
      }
      const rangeDescriptions = Array.from(groupedRanges.entries()).map(([timeKey, days]) => {
        const [start, end] = timeKey.split('-');
        const formattedDays = days.map(d => d[0].toUpperCase() + d.slice(1)).join(', ');
        return `${formattedDays} (${formatTimeForDisplay(start)}-${formatTimeForDisplay(end)})`;
      });
      message = `Updated your availability to add ${rangeDescriptions.join('; ')}`;
    } else {
      message = `Updated your availability to add ${daysList}`;
    }
  } else if (mode === 'only' && foundDays.size > 0) {
    message = `Updated your availability to only include ${daysList}`;
  }
  // When we extract specific time ranges, we should prioritize these over general slots
  if (timeRanges.length > 0) {
    // If we have specific time ranges, don't use the general slots
    return {
      matched: true,
      days: Array.from(foundDays),
      slots: [],
      timeRanges,
      mode,
      modeExplicit,
      message
    };
  }
  return {
    matched: foundDays.size > 0 && slots.length > 0 || foundDays.size > 0 && mode === 'remove' || timeRanges.length > 0,
    days: Array.from(foundDays),
    slots: Array.from(new Set(slots)),
    timeRanges,
    mode,
    modeExplicit,
    message
  };
}
// Helper function to format time for display
function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''} ${period}`;
}
// Convert time ranges to AM/MID/PM slots
export function timeRangesToSlots(start: string, end: string): string[] {
  // Instead of converting to predefined slots, just return the raw time range
  return [`${start}-${end}`];
}