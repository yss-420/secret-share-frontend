export const createTelegramDeepLink = (character: string, scenario?: string): string => {
  const botUsername = 'YourSecretShareBot'; // Replace with your actual bot username
  let startParam = `char_${character.toLowerCase()}`;
  
  if (scenario) {
    startParam += `_scenario_${scenario.toLowerCase().replace(/\s+/g, '_')}`;
  }
  
  return `https://t.me/${botUsername}?start=${startParam}`;
};

export const openTelegramChat = (character: string, scenario?: string): void => {
  const deepLink = createTelegramDeepLink(character, scenario);
  window.open(deepLink, '_blank');
};