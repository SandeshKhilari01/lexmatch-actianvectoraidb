/**
 * Simple word-level diff algorithm for DiffModal.
 * Returns an array of objects: { type: 'added' | 'removed' | 'neutral', value: string }
 */
export const wordDiff = (oldStr, newStr) => {
  const oldWords = oldStr.split(/\s+/);
  const newWords = newStr.split(/\s+/);
  
  // This is a very basic diff for demo purposes.
  // In a production app, a library like 'diff' would be better.
  const diff = [];
  
  const maxLength = Math.max(oldWords.length, newWords.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < oldWords.length && i < newWords.length) {
      if (oldWords[i] === newWords[i]) {
        diff.push({ type: 'neutral', value: oldWords[i] });
      } else {
        diff.push({ type: 'removed', value: oldWords[i] });
        diff.push({ type: 'added', value: newWords[i] });
      }
    } else if (i < oldWords.length) {
      diff.push({ type: 'removed', value: oldWords[i] });
    } else if (i < newWords.length) {
      diff.push({ type: 'added', value: newWords[i] });
    }
  }
  
  return diff;
};
