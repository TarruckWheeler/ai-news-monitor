// Data export utilities
// Developer: Tarruck Wheeler - Stanford University

export const exportToCSV = (data, filename = 'ai-risk-news-export') => {
  const headers = ['Title', 'Source', 'Severity', 'Date', 'Tags'];
  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      `"${item.title}"`,
      item.source,
      item.severity,
      new Date(item.timestamp).toISOString(),
      `"${item.tags.join('; ')}"`
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data, filename = 'ai-risk-news-export') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
