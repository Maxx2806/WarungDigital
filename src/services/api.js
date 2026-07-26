const DUMMY_PRODUCTS = [
  { id: 'p1', nama: 'Indomie Goreng', harga: 3500, stok: 42, kategori: 'Mie Instan', deskripsi: 'Mie instan goreng favorit sejuta umat, siap saji 3 menit.', foto: 'https://www.indomie.co.id/Content/Product/Category/indomie-goreng.jpg' },
  { id: 'p2', nama: 'Aqua Botol 600ml', harga: 4000, stok: 60, kategori: 'Minuman', deskripsi: 'Air mineral kemasan botol 600ml.', foto: 'https://www.sehataqua.co.id/sps/product-2.webp' },
  { id: 'p3', nama: 'Teh Botol Sosro', harga: 5000, stok: 35, kategori: 'Minuman', deskripsi: 'Teh melati dalam kemasan botol kaca 450ml.', foto: 'https://sinarsosro.id/files/images/Banner%20Produk%20TBS-01.jpg' },
  { id: 'p4', nama: 'Kopi Kapal Api Sachet', harga: 1500, stok: 80, kategori: 'Minuman', deskripsi: 'Kopi bubuk instan sachet, cocok untuk stok warung.', foto: 'https://indogroceries.com/wp-content/uploads/2020/06/Special-Mix-Kapal-Api.jpg' },
  { id: 'p5', nama: 'Beras Premium 5kg', harga: 65000, stok: 15, kategori: 'Sembako', deskripsi: 'Beras putih pulen kemasan 5kg.', foto: 'https://www.pastisania.com/storage/app/media/Product%20Images/beras-premium-sania-20-kg.webp' },
  { id: 'p6', nama: 'Minyak Goreng 1L', harga: 18000, stok: 25, kategori: 'Sembako', deskripsi: 'Minyak goreng kemasan botol 1 liter.', foto: 'https://img.lazcdn.com/g/p/b5d45a490dfce149a18a40f7e9df2c4c.jpg_720x720q80.jpg' },
  { id: 'p7', nama: 'Telur Ayam 1kg', harga: 28000, stok: 20, kategori: 'Sembako', deskripsi: 'Telur ayam segar kualitas terbaik, per kilogram.', foto: 'https://pasarsegar.co.id/wp-content/uploads/2021/02/name-305-1.jpg' },
  { id: 'p8', nama: 'Sabun Mandi Batang', harga: 4500, stok: 50, kategori: 'Kebutuhan Harian', deskripsi: 'Sabun mandi batang wangi segar.', foto: 'https://assets.unileversolutions.com/v1/142232587.png' },
];

export const fetchInitialProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_PRODUCTS), 800);
  });
};