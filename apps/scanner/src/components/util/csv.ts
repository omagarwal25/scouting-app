export function downloadCSVData(data: any[][], headers: any[], name: string) {
  const str = [headers, ...data].map((e) => e.join(',')).join('\r\n');

  const blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${name}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
