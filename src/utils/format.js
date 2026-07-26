export const formatRupiah = (num) => 'Rp' + Number(num || 0).toLocaleString('id-ID');

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateLong = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });